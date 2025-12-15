import { NextRequest } from 'next/server'
import { loginSchema } from '@/lib/validators/schemas'
import { getFirestoreDB } from '@/lib/db/firebase'
import { comparePassword } from '@/lib/auth/bcrypt'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'
import { getRequestContext } from '@/lib/middleware/auth'
import { FieldValue } from 'firebase-admin/firestore'
import type { ErrorWithCode } from '@/lib/types'
import {
  isIPBlocked,
  recordLoginAttempt,
  applyLoginDelay,
  getFailedAttempts,
  getClientIP,
  sanitizeInput,
} from '@/lib/utils/security'

/**
 * Initialize default admin if no users exist
 */
async function initializeDefaultAdmin(): Promise<void> {
  try {
    const db = getFirestoreDB()
    const usersSnapshot = await db.collection('users').limit(1).get()
    
    if (usersSnapshot.empty) {
      const defaultUsername = process.env['DEFAULT_ADMIN_USERNAME']
      const defaultPassword = process.env['DEFAULT_ADMIN_PASSWORD']
      const defaultName = process.env['DEFAULT_ADMIN_NAME']
      
      if (!defaultUsername || !defaultPassword) {
        console.error('❌ DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD must be set in environment variables')
        return
      }
      
      const hashedPassword = await hashPassword(defaultPassword)
      
      await db.collection('users').add({
        username: defaultUsername,
        name: defaultName || defaultUsername,
        password: hashedPassword,
        role: 'admin',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
      
      console.log('✅ Default admin user created!')
      if (process.env['NODE_ENV'] === 'development') {
        console.log('⚠️  Please change the default password after first login!')
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error initializing default admin:', errorMessage)
    // Don't throw - allow login to continue even if initialization fails
  }
}

/**
 * POST /api/auth/login
 * User login endpoint
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const context = getRequestContext(request)
  const clientIP = getClientIP(request)

  try {
    // Security: Check if IP is blocked
    const isBlocked = await isIPBlocked(clientIP)
    if (isBlocked) {
      await logger.warn('Blocked IP attempted login', {
        ipAddress: clientIP,
        ...(context.userAgent && { userAgent: context.userAgent }),
      })
      return errorResponse('تم حظر عنوان IP الخاص بك مؤقتاً بسبب محاولات تسجيل دخول فاشلة متعددة. يرجى المحاولة لاحقاً.', 403)
    }
    // Check if JWT secrets are configured
    if (!process.env['JWT_SECRET'] || !process.env['JWT_REFRESH_SECRET']) {
      console.error('❌ JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables')
      return errorResponse('خطأ في إعدادات النظام. يرجى التحقق من متغيرات البيئة.', 500)
    }

    // Initialize default admin if needed (don't fail if this fails)
    // Skip initialization if Firebase is not configured to avoid errors
    const hasFirebaseConfig = !!(
      process.env['FIREBASE_PROJECT_ID'] &&
      process.env['FIREBASE_CLIENT_EMAIL'] &&
      process.env['FIREBASE_PRIVATE_KEY']
    )
    
    if (hasFirebaseConfig) {
      try {
        await initializeDefaultAdmin()
      } catch (initError) {
        console.warn('Warning: Could not initialize default admin:', initError)
        // Continue with login attempt
      }
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues.map(issue => issue.message)
      )
    }

    const { username, password } = validationResult.data
    const trimmedUsername = sanitizeInput(username)
    
    // Security: Apply delay based on failed attempts (exponential backoff)
    await applyLoginDelay(clientIP, trimmedUsername)
    
    // Security: Check failed attempts before processing
    const failedAttempts = await getFailedAttempts(clientIP, trimmedUsername)
    if (failedAttempts >= 5) {
      await recordLoginAttempt(clientIP, trimmedUsername, false)
      return errorResponse('تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة لاحقاً.', 429)
    }

    // Get user by username from Firestore
    let db
    try {
      db = getFirestoreDB()
    } catch (firebaseError) {
      const errorMessage = firebaseError instanceof Error ? firebaseError.message : String(firebaseError)
      console.error('Firebase initialization error:', errorMessage)
      
      // Check if it's a configuration error
      if (errorMessage.includes('FIREBASE_PROJECT_ID') || errorMessage.includes('FIREBASE_CLIENT_EMAIL') || errorMessage.includes('FIREBASE_PRIVATE_KEY')) {
        return errorResponse('خطأ في إعدادات Firebase. يرجى التحقق من متغيرات البيئة على Vercel: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY', 500)
      }

      // Check for authentication errors
      if (errorMessage.includes('UNAUTHENTICATED') || errorMessage.includes('invalid authentication')) {
        return errorResponse('خطأ في مصادقة Firebase. يرجى التحقق من صحة FIREBASE_PROJECT_ID و FIREBASE_CLIENT_EMAIL و FIREBASE_PRIVATE_KEY في Vercel', 500)
      }
      
      return errorResponse('خطأ في الاتصال بقاعدة البيانات. يرجى التحقق من إعدادات Firebase.', 500)
    }

    let usersSnapshot
    try {
      usersSnapshot = await db.collection('users')
        .where('username', '==', trimmedUsername)
        .limit(1)
        .get()
    } catch (queryError) {
      const errorMessage = queryError instanceof Error ? queryError.message : String(queryError)
      console.error('Firestore query error:', errorMessage)
      
      // Check for authentication errors
      if (errorMessage.includes('UNAUTHENTICATED') || errorMessage.includes('invalid authentication')) {
        return errorResponse('خطأ في مصادقة Firebase. يرجى التحقق من صحة متغيرات البيئة في Vercel. تأكد من أن FIREBASE_PRIVATE_KEY يحتوي على المفتاح الكامل مع \\n للأسطر الجديدة.', 500)
      }
      
      return errorResponse('خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى.', 500)
    }
    
    if (usersSnapshot.empty || usersSnapshot.docs.length === 0) {
      // Security: Record failed attempt
      await recordLoginAttempt(clientIP, trimmedUsername, false)
      
      try {
        await logger.warn('Login attempt with invalid username', {
          username: trimmedUsername,
          ipAddress: clientIP,
        })
      } catch (logError) {
        console.warn('Failed to log warning:', logError)
      }
      
      // Security: Add delay to prevent brute force
      const delay = await getFailedAttempts(clientIP, trimmedUsername) * 500
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
    }

    const userDoc = usersSnapshot.docs[0]
    if (!userDoc) {
      // Security: Record failed attempt
      await recordLoginAttempt(clientIP, trimmedUsername, false)
      
      try {
        await logger.warn('Login attempt - user document not found', {
          username: trimmedUsername,
          ipAddress: clientIP,
        })
      } catch (logError) {
        console.warn('Failed to log warning:', logError)
      }
      
      return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
    }

    const userData = userDoc.data()
    const userId = userDoc.id

    // Verify password
    const isPasswordValid = await comparePassword(password, userData['password'] as string)
    
    if (!isPasswordValid) {
      // Security: Record failed attempt
      await recordLoginAttempt(clientIP, trimmedUsername, false)
      
      try {
        await logger.warn('Login attempt with invalid password', {
          userId,
          ipAddress: clientIP,
        })
      } catch (logError) {
        console.warn('Failed to log warning:', logError)
      }
      
      // Security: Add delay to prevent brute force
      const delay = await getFailedAttempts(clientIP, trimmedUsername) * 500
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
    }

    // Security: Record successful login attempt
    await recordLoginAttempt(clientIP, trimmedUsername, true)

    // Generate tokens
    const accessToken = generateAccessToken({
      userId,
      email: (userData['email'] as string) || trimmedUsername,
      role: (userData['role'] as 'admin' | 'editor' | 'viewer') || 'viewer',
    })

    const refreshToken = generateRefreshToken({
      userId,
      email: (userData['email'] as string) || trimmedUsername,
      role: (userData['role'] as 'admin' | 'editor' | 'viewer') || 'viewer',
    })

    // Update last login (don't fail if this fails)
    try {
      await db.collection('users').doc(userId).update({
        lastLogin: FieldValue.serverTimestamp(),
      })
    } catch (updateError) {
      console.warn('Failed to update last login:', updateError)
      // Continue - this is not critical
    }

    // Create response
    const response = successResponse(
      {
        user: {
          id: userId,
          email: (userData['email'] as string) || null,
          name: (userData['name'] as string) || trimmedUsername,
          role: (userData['role'] as 'admin' | 'editor' | 'viewer') || 'viewer',
        },
      },
      {
        logRequest: true,
        logContext: {
          method: 'POST',
          path: '/api/auth/login',
          ipAddress: context.ipAddress,
          ...(context.userAgent && { userAgent: context.userAgent }),
          userId,
          startTime,
        },
      }
    )

    // Set secure cookies
    const isProduction = process.env['NODE_ENV'] === 'production' || process.env['VERCEL'] === '1'
    
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    }
    
    response.cookies.set('admin-token', accessToken, cookieOptions)
    response.cookies.set('admin-refresh-token', refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    try {
      await logger.info('User logged in successfully', {
        userId,
        username: trimmedUsername,
        ipAddress: clientIP,
        ...(context.userAgent && { userAgent: context.userAgent }),
      })
    } catch (logError) {
      console.warn('Failed to log info:', logError)
      // Don't fail login if logging fails
    }

    return response
  } catch (error) {
    // Log detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    const err = error as ErrorWithCode
    const errorCode = err.code
    console.error('Login error details:', {
      message: errorMessage,
      code: errorCode,
      stack: errorStack,
      ipAddress: context.ipAddress,
      hasJwtSecret: !!process.env['JWT_SECRET'],
      hasJwtRefreshSecret: !!process.env['JWT_REFRESH_SECRET'],
    })
    
    try {
      await logger.error('Login error', error instanceof Error ? error : new Error(errorMessage), {
        method: 'POST',
        path: '/api/auth/login',
        ipAddress: context.ipAddress,
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
      // Continue with error response even if logging fails
    }
    
    // Return more specific error message if it's a known error
    if (errorMessage.includes('JWT_SECRET') || errorMessage.includes('JWT_REFRESH_SECRET')) {
      return errorResponse('خطأ في إعدادات النظام. يرجى التحقق من متغيرات البيئة.', 500)
    }
    
    // Check for Firebase connection errors
    if (
      errorMessage.includes('Firebase') ||
      errorMessage.includes('Firestore') ||
      errorMessage.includes('Connection') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ETIMEDOUT')
    ) {
      return errorResponse('خطأ في الاتصال بقاعدة البيانات. يرجى التحقق من إعدادات Firebase.', 500)
    }
    
    return errorResponse('حدث خطأ أثناء تسجيل الدخول', 500, {
      logRequest: true,
      logContext: {
        method: 'POST',
        path: '/api/auth/login',
        ipAddress: context.ipAddress,
        startTime,
      },
    })
  }
}

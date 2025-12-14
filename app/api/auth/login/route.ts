import { NextRequest } from 'next/server'
import { loginSchema } from '@/lib/validators/schemas'
import { getFirestoreDB, getFirebaseAuth } from '@/lib/db/firebase'
import { comparePassword, hashPassword } from '@/lib/auth/bcrypt'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { getRequestContext } from '@/lib/middleware/auth'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Initialize default admin if no users exist
 */
async function initializeDefaultAdmin(): Promise<void> {
  try {
    const db = getFirestoreDB()
    
    // Check if any users exist in Firestore
    const usersSnapshot = await db.collection('users').limit(1).get()
    
    if (usersSnapshot.empty) {
      const defaultUsername = process.env['DEFAULT_ADMIN_USERNAME']
      const defaultPassword = process.env['DEFAULT_ADMIN_PASSWORD']
      const defaultName = process.env['DEFAULT_ADMIN_NAME']
      const defaultEmail = process.env['DEFAULT_ADMIN_EMAIL'] || `${defaultUsername}@cyber-tmsah.site`
      
      if (!defaultUsername || !defaultPassword) {
        console.error('❌ DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD must be set in environment variables')
        return
      }
      
      const hashedPassword = await hashPassword(defaultPassword)
      
      // Check if user already exists
      const existingUserSnapshot = await db.collection('users')
        .where('username', '==', defaultUsername)
        .limit(1)
        .get()
      
      if (!existingUserSnapshot.empty) {
        console.log('ℹ️  Admin user already exists, skipping creation')
        return
      }
      
      // Create user in Firebase Auth
      try {
        const auth = getFirebaseAuth()
        const userRecord = await auth.createUser({
          email: defaultEmail,
          displayName: defaultName || defaultUsername,
          emailVerified: false,
        })
        
        // Set custom claims for admin role
        await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' })
        
        // Create user document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
          username: defaultUsername,
          name: defaultName || defaultUsername,
          email: defaultEmail,
          password: hashedPassword, // Store hashed password for custom auth
          role: 'admin',
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        })
        
        console.log('✅ Default admin user created in Firebase!')
        if (process.env['NODE_ENV'] === 'development') {
          console.log('📝 Username:', defaultUsername)
          console.log('📧 Email:', defaultEmail)
          console.log('🆔 UID:', userRecord.uid)
        }
      } catch (authError) {
        console.error('Error creating Firebase Auth user:', authError)
        // If Firebase Auth fails, still create in Firestore for custom auth
        const tempId = `temp_${Date.now()}`
        await db.collection('users').doc(tempId).set({
          username: defaultUsername,
          name: defaultName || defaultUsername,
          email: defaultEmail,
          password: hashedPassword,
          role: 'admin',
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        })
        console.log('✅ Default admin user created in Firestore (Auth creation failed)')
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error initializing default admin:', {
      message: errorMessage,
    })
    // Don't throw - allow login to proceed
  }
}

/**
 * POST /api/auth/login
 * User login endpoint
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const context = getRequestContext(request)

  try {
    // Check if JWT secrets are configured
    if (!process.env['JWT_SECRET'] || !process.env['JWT_REFRESH_SECRET']) {
      console.error('❌ JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables')
      return errorResponse('خطأ في إعدادات النظام. يرجى التحقق من متغيرات البيئة.', 500)
    }

    // Initialize default admin if needed
    await initializeDefaultAdmin()

    const body = await request.json()
    
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues.map(issue => issue.message)
      )
    }

    const { username, password } = validationResult.data
    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    // Debug logging
    console.log('🔍 Login attempt:', {
      username: trimmedUsername,
      usernameLength: trimmedUsername.length,
      passwordLength: trimmedPassword.length,
    })

    const db = getFirestoreDB()
    
    // Get user by username from Firestore
    const usersSnapshot = await db.collection('users')
      .where('username', '==', trimmedUsername)
      .limit(1)
      .get()
    
    if (usersSnapshot.empty) {
      await logger.warn('Login attempt with invalid username', {
        username: trimmedUsername,
        ipAddress: context.ipAddress,
      })
      return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
    }

    const userDoc = usersSnapshot.docs[0]
    if (!userDoc) {
      return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
    }
    const userData = userDoc.data()
    const userId = userDoc.id

    // Verify password
    const isPasswordValid = await comparePassword(trimmedPassword, userData['password'])
    
    console.log('🔐 Password verification:', {
      isValid: isPasswordValid,
      userId,
    })
    
    if (!isPasswordValid) {
      await logger.warn('Login attempt with invalid password', {
        userId,
        ipAddress: context.ipAddress,
      })
      return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
    }

    // Get or create Firebase Auth user
    let firebaseUid = userId
    try {
      const auth = getFirebaseAuth()
      
      // Try to get existing user by email
      try {
        if (userData['email']) {
          const userRecord = await auth.getUserByEmail(userData['email'])
          firebaseUid = userRecord.uid
          
          // Update custom claims if needed
          await auth.setCustomUserClaims(firebaseUid, { 
            role: userData['role'] || 'viewer' 
          })
        }
      } catch {
        // User doesn't exist in Auth, create it
        if (userData['email']) {
          const userRecord = await auth.createUser({
            email: userData['email'] as string,
            displayName: (userData['name'] || userData['username']) as string,
            emailVerified: false,
          })
          firebaseUid = userRecord.uid
          
          // Set custom claims
          await auth.setCustomUserClaims(firebaseUid, { 
            role: userData['role'] || 'viewer' 
          })
          
          // Update Firestore doc with Firebase UID if different
          if (userId !== firebaseUid) {
            await db.collection('users').doc(firebaseUid).set(userData, { merge: true })
          }
        }
      }
    } catch (authError) {
      console.warn('Firebase Auth operation failed, continuing with Firestore UID:', authError)
    }

    // Update last login
    await db.collection('users').doc(firebaseUid).update({
      lastLogin: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: firebaseUid,
      email: userData['email'] || '',
      role: userData['role'] || 'viewer',
    })

    const refreshToken = generateRefreshToken({
      userId: firebaseUid,
      email: userData['email'] || '',
      role: userData['role'] || 'viewer',
    })

    // Create response
    const response = successResponse(
      {
        user: {
          id: firebaseUid,
          email: userData['email'] || '',
          name: userData['name'] || userData['username'],
          role: userData['role'] || 'viewer',
        },
      },
      {
        logRequest: true,
        logContext: {
          method: 'POST',
          path: '/api/auth/login',
          ipAddress: context.ipAddress,
          ...(context.userAgent && { userAgent: context.userAgent }),
          userId: firebaseUid,
          startTime,
        },
      }
    )

    // Set secure cookies
    const isProduction = process.env['NODE_ENV'] === 'production' || process.env['VERCEL'] === '1'
    response.cookies.set('admin-token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    response.cookies.set('admin-refresh-token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    await logger.info('User logged in successfully', {
      userId: firebaseUid,
      username: userData['username'],
      ipAddress: context.ipAddress,
    })

    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Login error details:', {
      message: errorMessage,
      stack: errorStack,
      ipAddress: context.ipAddress,
    })
    
    await logger.error('Login error', error instanceof Error ? error : new Error(errorMessage), {
      method: 'POST',
      path: '/api/auth/login',
      ipAddress: context.ipAddress,
    })
    
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

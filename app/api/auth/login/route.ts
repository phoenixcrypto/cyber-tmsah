import { NextRequest } from 'next/server'
import { loginSchema } from '@/lib/validators/schemas'
import { prisma } from '@/lib/db/prisma'
import { comparePassword } from '@/lib/auth/bcrypt'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'
import { getRequestContext } from '@/lib/middleware/auth'
import type { ErrorWithCode } from '@/lib/types'

/**
 * Initialize default admin if no users exist
 */
async function initializeDefaultAdmin(): Promise<void> {
  try {
    // Check if DATABASE_URL is set
    if (!process.env['DATABASE_URL']) {
      const error = new Error('DATABASE_URL is not set in environment variables')
      console.error('❌ DATABASE_URL is not set in environment variables')
      throw error
    }
    
    // Check if DATABASE_URL has sslmode
    const dbUrl = process.env['DATABASE_URL']
    if (!dbUrl.includes('sslmode')) {
      console.warn('⚠️ DATABASE_URL does not contain sslmode parameter. Supabase requires SSL connection.')
    }
    
    const userCount = await prisma.user.count()
    
    if (userCount === 0) {
      const defaultUsername = process.env['DEFAULT_ADMIN_USERNAME']
      const defaultPassword = process.env['DEFAULT_ADMIN_PASSWORD']
      const defaultName = process.env['DEFAULT_ADMIN_NAME']
      
      if (!defaultUsername || !defaultPassword) {
        console.error('❌ DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD must be set in environment variables')
        return
      }
      
      const hashedPassword = await hashPassword(defaultPassword)
      
      // Check if user already exists before creating
      const existingUser = await prisma.user.findUnique({
        where: { username: defaultUsername },
      })
      
      if (existingUser) {
        console.log('ℹ️  Admin user already exists, skipping creation')
        return
      }
      
      await prisma.user.create({
        data: {
          username: defaultUsername,
          name: defaultName || defaultUsername,
          password: hashedPassword,
          role: 'admin',
        },
      })
      
      console.log('✅ Default admin user created!')
      if (process.env['NODE_ENV'] === 'development') {
        console.log('📝 Username:', defaultUsername)
        console.log('🔑 Password hash:', hashedPassword.substring(0, 30) + '...')
      }
      if (process.env['NODE_ENV'] === 'development') {
        console.log('⚠️  Please change the default password after first login!')
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const err = error as ErrorWithCode
    const errorCode = err.code
    console.error('Error initializing default admin:', {
      message: errorMessage,
      code: errorCode,
      hasDatabaseUrl: !!process.env['DATABASE_URL'],
      databaseUrlPreview: process.env['DATABASE_URL']?.substring(0, 50) + '...',
    })
    // Re-throw to be caught by the main error handler
    throw error
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

    // Debug logging (always log for troubleshooting)
    console.log('🔍 Login attempt:', {
      username: trimmedUsername,
      usernameLength: trimmedUsername.length,
      passwordLength: trimmedPassword.length,
      passwordPreview: trimmedPassword.length > 6 
        ? trimmedPassword.substring(0, 3) + '...' + trimmedPassword.substring(trimmedPassword.length - 3)
        : '***',
      hasDatabaseUrl: !!process.env['DATABASE_URL'],
      hasDefaultUsername: !!process.env['DEFAULT_ADMIN_USERNAME'],
      defaultUsername: process.env['DEFAULT_ADMIN_USERNAME'],
    })

    // Get user by username (exact match)
    let user = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    })
    
    if (!user) {
      // Check if user exists with different case or spaces
      const allUsers = await prisma.user.findMany({
        select: { username: true, role: true },
      })
      
      console.log('❌ User not found:', {
        searchedUsername: trimmedUsername,
        availableUsers: allUsers.map(u => ({ username: u.username, role: u.role })),
        totalUsers: allUsers.length,
      })
      
      // If no users exist, try to initialize admin again
      if (allUsers.length === 0) {
        console.log('⚠️  No users found. Attempting to initialize default admin...')
        try {
          await initializeDefaultAdmin()
          // Try again after initialization
          user = await prisma.user.findUnique({
            where: { username: trimmedUsername },
          })
          if (!user) {
            await logger.warn('Login attempt with invalid username after initialization', {
              username: trimmedUsername,
              ipAddress: context.ipAddress,
            })
            return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة. تأكد من أن DEFAULT_ADMIN_USERNAME صحيح في Vercel environment variables.', 401)
          }
        } catch (initError) {
          console.error('❌ Failed to initialize admin:', initError)
          await logger.warn('Login attempt with invalid username', {
            username: trimmedUsername,
            ipAddress: context.ipAddress,
          })
          return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
        }
      } else {
        await logger.warn('Login attempt with invalid username', {
          username: trimmedUsername,
          ipAddress: context.ipAddress,
        })
        return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
      }
    }

    // Debug logging (always log for troubleshooting)
    console.log('✅ User found:', {
      userId: user.id,
      username: user.username,
      passwordHashLength: user.password.length,
      passwordHashPreview: user.password.substring(0, 20) + '...',
    })

    // Verify password
    const isPasswordValid = await comparePassword(trimmedPassword, user.password)
    
    console.log('🔐 Password verification:', {
      isValid: isPasswordValid,
      inputPasswordLength: trimmedPassword.length,
      inputPasswordPreview: trimmedPassword.length > 6 
        ? trimmedPassword.substring(0, 3) + '...' + trimmedPassword.substring(trimmedPassword.length - 3)
        : '***',
    })
    
    if (!isPasswordValid) {
      await logger.warn('Login attempt with invalid password', {
        userId: user.id,
        ipAddress: context.ipAddress,
      })
      return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || user.username,
      role: user.role,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email || user.username,
      role: user.role,
    })

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Create response
    const response = successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      {
        logRequest: true,
        logContext: {
          method: 'POST',
          path: '/api/auth/login',
          ipAddress: context.ipAddress,
          ...(context.userAgent && { userAgent: context.userAgent }),
          userId: user.id,
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

    await logger.info('User logged in successfully', {
      userId: user.id,
      username: user.username,
      ipAddress: context.ipAddress,
    })

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
      hasDatabaseUrl: !!process.env['DATABASE_URL'],
      databaseUrlLength: process.env['DATABASE_URL']?.length || 0,
      databaseUrlPreview: process.env['DATABASE_URL']?.substring(0, 50) + '...',
      hasJwtSecret: !!process.env['JWT_SECRET'],
      hasJwtRefreshSecret: !!process.env['JWT_REFRESH_SECRET'],
    })
    
    await logger.error('Login error', error instanceof Error ? error : new Error(errorMessage), {
      method: 'POST',
      path: '/api/auth/login',
      ipAddress: context.ipAddress,
    })
    
    // Return more specific error message if it's a known error
    if (errorMessage.includes('JWT_SECRET') || errorMessage.includes('JWT_REFRESH_SECRET')) {
      return errorResponse('خطأ في إعدادات النظام. يرجى التحقق من متغيرات البيئة.', 500)
    }
    
    // Check for database connection errors
    if (
      errorMessage.includes('Prisma') ||
      errorMessage.includes('database') ||
      errorMessage.includes('P1001') ||
      errorMessage.includes('Can\'t reach database') ||
      errorMessage.includes('Connection') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ETIMEDOUT')
    ) {
      // Check if DATABASE_URL is missing
      if (!process.env['DATABASE_URL']) {
        console.error('❌ DATABASE_URL is not set in environment variables')
        return errorResponse('خطأ في إعدادات قاعدة البيانات: DATABASE_URL غير موجود. يرجى التحقق من متغيرات البيئة على Vercel.', 500)
      }
      
      return errorResponse('خطأ في الاتصال بقاعدة البيانات. يرجى التحقق من إعدادات DATABASE_URL على Vercel والتأكد من إضافة ?sslmode=require للاتصال بـ Supabase.', 500)
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

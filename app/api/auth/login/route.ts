import { NextRequest } from 'next/server'
import { loginSchema } from '@/lib/validators/schemas'
import { prisma } from '@/lib/db/prisma'
import { comparePassword } from '@/lib/auth/bcrypt'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'
import { getRequestContext } from '@/lib/middleware/auth'

/**
 * Initialize default admin if no users exist
 */
async function initializeDefaultAdmin(): Promise<void> {
  try {
    const userCount = await prisma.user.count()
    
    if (userCount === 0) {
      const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD
      const defaultName = process.env.DEFAULT_ADMIN_NAME
      
      if (!defaultUsername || !defaultPassword) {
        console.error('❌ DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD must be set in environment variables')
        return
      }
      
      const hashedPassword = await hashPassword(defaultPassword)
      
      await prisma.user.create({
        data: {
          username: defaultUsername,
          name: defaultName || defaultUsername,
          password: hashedPassword,
          role: 'admin',
        },
      })
      
      console.log('✅ Default admin user created!')
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  Please change the default password after first login!')
      }
    }
  } catch (error) {
    console.error('Error initializing default admin:', error)
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

    // Get user by username
    const user = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    })
    
    if (!user) {
      await logger.warn('Login attempt with invalid username', {
        username: trimmedUsername,
        ipAddress: context.ipAddress,
      })
      return errorResponse('اسم المستخدم أو كلمة المرور غير صحيحة', 401)
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    
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
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    
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
    await logger.error('Login error', error as Error, {
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

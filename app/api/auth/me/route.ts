import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getAuthUser } from '@/lib/middleware/auth'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'

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
    }
  } catch (error) {
    console.error('Error initializing default admin:', error)
  }
}

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize default admin if needed (only runs once)
    try {
      await initializeDefaultAdmin()
    } catch (initError) {
      console.error('Error initializing default admin:', initError)
    }

    const user = await getAuthUser(request)

    if (!user) {
      return unauthorizedResponse('Unauthorized')
    }

    // Get full user data
    const fullUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        lastLogin: true,
        createdAt: true,
      },
    })

    if (!fullUser) {
      return unauthorizedResponse('User not found')
    }

    return successResponse({
      user: {
        id: fullUser.id,
        email: fullUser.email,
        name: fullUser.name,
        role: fullUser.role,
        lastLogin: fullUser.lastLogin,
      },
    })
  } catch (error) {
    await logger.error('Get user error', error as Error, {
      method: 'GET',
      path: '/api/auth/me',
    })
    return errorResponse('حدث خطأ أثناء جلب بيانات المستخدم', 500)
  }
}

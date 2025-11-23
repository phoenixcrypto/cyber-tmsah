import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin, getRequestContext } from '@/lib/middleware/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'
import { z } from 'zod'

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
  role: z.enum(['admin', 'editor', 'viewer']),
})

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
export async function GET(request: NextRequest) {
  const context = getRequestContext(request)

  try {
    const user = await requireAdmin(request)

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse({ users })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Get users error', error as Error, {
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء جلب المستخدمين', 500)
  }
}

/**
 * POST /api/admin/users
 * Create new user (admin only)
 */
export async function POST(request: NextRequest) {
  const context = getRequestContext(request)

  try {
    const user = await requireAdmin(request)
    const body = await request.json()

    const validationResult = createUserSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues.map(issue => issue.message)
      )
    }

    const { username, email, name, password, role } = validationResult.data

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return errorResponse('اسم المستخدم موجود بالفعل', 400)
    }

    // Check if email exists (if provided)
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (existingEmail) {
        return errorResponse('البريد الإلكتروني موجود بالفعل', 400)
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email: email || null,
        name,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    await logger.info('User created', {
      userId: newUser.id,
      createdBy: user.userId,
      ipAddress: context.ipAddress,
    })

    return successResponse({ user: newUser }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create user error', error as Error, {
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء إنشاء المستخدم', 500)
  }
}



import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin, getRequestContext } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'
import { z } from 'zod'

const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional().nullable(),
  name: z.string().min(2).max(100).optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
})

/**
 * PUT /api/admin/users/[id]
 * Update user (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = getRequestContext(request)

  try {
    const admin = await requireAdmin(request)
    const body = await request.json()

    const validationResult = updateUserSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues.map(issue => issue.message)
      )
    }

    const data = validationResult.data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return notFoundResponse('المستخدم غير موجود')
    }

    // Check if username exists (excluding current user)
    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: data.username },
      })
      if (usernameExists) {
        return errorResponse('اسم المستخدم موجود بالفعل', 400)
      }
    }

    // Check if email exists (excluding current user)
    if (data.email !== undefined && data.email !== existingUser.email) {
      if (data.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: data.email },
        })
        if (emailExists) {
          return errorResponse('البريد الإلكتروني موجود بالفعل', 400)
        }
      }
    }

    // Prepare update data
    const updateData: {
      username?: string
      email?: string | null
      name?: string
      password?: string
      role?: 'admin' | 'editor' | 'viewer'
    } = {}

    if (data.username) updateData.username = data.username
    if (data.email !== undefined) updateData.email = data.email
    if (data.name) updateData.name = data.name
    if (data.role) updateData.role = data.role
    if (data.password) {
      updateData.password = await hashPassword(data.password)
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    })

    await logger.info('User updated', {
      userId: params.id,
      updatedBy: admin.userId,
      ipAddress: context.ipAddress,
    })

    return successResponse({ user: updatedUser })
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update user error', error as Error, {
      userId: params.id,
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء تحديث المستخدم', 500)
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete user (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = getRequestContext(request)

  try {
    const admin = await requireAdmin(request)

    // Prevent deleting yourself
    if (params.id === admin.userId) {
      return errorResponse('لا يمكنك حذف نفسك', 400)
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return notFoundResponse('المستخدم غير موجود')
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.id },
    })

    await logger.info('User deleted', {
      userId: params.id,
      deletedBy: admin.userId,
      ipAddress: context.ipAddress,
    })

    return successResponse({ message: 'تم الحذف بنجاح' })
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete user error', error as Error, {
      userId: params.id,
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء حذف المستخدم', 500)
  }
}

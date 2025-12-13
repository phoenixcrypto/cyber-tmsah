import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin, getRequestContext } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'
import { z } from 'zod'
import type { UserUpdateInput, ErrorWithCode } from '@/lib/types'

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
    const updateData: UserUpdateInput = {}

    if (data.username) {
      // Check if username exists (excluding current user)
      const existing = await prisma.user.findUnique({
        where: { username: data.username },
      })
      if (existing && existing.id !== params.id) {
        return errorResponse('اسم المستخدم موجود بالفعل', 400)
      }
      updateData.username = data.username
    }

    if (data.email !== undefined) {
      if (data.email) {
        // Check if email exists (excluding current user)
        const existing = await prisma.user.findUnique({
          where: { email: data.email },
        })
        if (existing && existing.id !== params.id) {
          return errorResponse('البريد الإلكتروني موجود بالفعل', 400)
        }
      }
      updateData.email = data.email
    }

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
    const err = error as ErrorWithCode
    if (err.code === 'P2025') {
      return notFoundResponse('المستخدم غير موجود')
    }

    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update user error', err as Error, {
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
    const err = error as ErrorWithCode
    if (err.code === 'P2025') {
      return notFoundResponse('المستخدم غير موجود')
    }

    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete user error', err as Error, {
      userId: params.id,
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء حذف المستخدم', 500)
  }
}



import { NextRequest } from 'next/server'
import { getFirestoreDB, getFirebaseAuth } from '@/lib/db/firebase'
import { requireAdmin, getRequestContext } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

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
    const db = getFirestoreDB()
    const userDoc = await db.collection('users').doc(params.id).get()

    if (!userDoc.exists) {
      return notFoundResponse('المستخدم غير موجود')
    }

    const updateData: any = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (data.username) {
      // Check if username exists (excluding current user)
      const usernameSnapshot = await db.collection('users')
        .where('username', '==', data.username)
        .limit(1)
        .get()

      const existingUsernameDoc = usernameSnapshot.docs.find(doc => doc.id !== params.id)
      if (existingUsernameDoc) {
        return errorResponse('اسم المستخدم موجود بالفعل', 400)
      }
      updateData.username = data.username
    }

    if (data.email !== undefined) {
      if (data.email) {
        // Check if email exists (excluding current user)
        const emailSnapshot = await db.collection('users')
          .where('email', '==', data.email)
          .limit(1)
          .get()

        const existingEmailDoc = emailSnapshot.docs.find(doc => doc.id !== params.id)
        if (existingEmailDoc) {
          return errorResponse('البريد الإلكتروني موجود بالفعل', 400)
        }
      }
      updateData.email = data.email
    }

    if (data.name) updateData.name = data.name
    if (data.role) {
      updateData.role = data.role
      // Update Firebase Auth custom claims
      try {
        const auth = getFirebaseAuth()
        await auth.setCustomUserClaims(params.id, { role: data.role })
      } catch (authError) {
        console.warn('Failed to update Firebase Auth claims:', authError)
      }
    }
    if (data.password) {
      updateData.password = await hashPassword(data.password)
    }

    await db.collection('users').doc(params.id).update(updateData)

    const updatedDoc = await db.collection('users').doc(params.id).get()
    const updatedData = updatedDoc.data()!

    await logger.info('User updated', {
      userId: params.id,
      updatedBy: admin.userId,
      ipAddress: context.ipAddress,
    })

    return successResponse({
      user: {
        id: updatedDoc.id,
        username: updatedData.username,
        email: updatedData.email || null,
        name: updatedData.name,
        role: updatedData.role,
        updatedAt: updatedData.updatedAt?.toDate?.() || updatedData.updatedAt || null,
      },
    })
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

    const db = getFirestoreDB()
    const userDoc = await db.collection('users').doc(params.id).get()

    if (!userDoc.exists) {
      return notFoundResponse('المستخدم غير موجود')
    }

    // Delete from Firebase Auth if exists
    try {
      const auth = getFirebaseAuth()
      await auth.deleteUser(params.id)
    } catch (authError) {
      // User might not exist in Auth, continue with Firestore deletion
      console.warn('Firebase Auth user deletion failed, continuing:', authError)
    }

    // Delete from Firestore
    await db.collection('users').doc(params.id).delete()

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

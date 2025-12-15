import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'
import { getAuthUser } from '@/lib/middleware/auth'
import bcrypt from 'bcryptjs'
import type { ErrorWithCode } from '@/lib/types'

/**
 * PUT /api/admin/profile
 * Update user profile (name, email, password)
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return errorResponse('غير مصرح', 401)
    }

    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    const db = getFirestoreDB()
    const userDoc = await db.collection('users').doc(user.userId).get()
    
    if (!userDoc.exists) {
      return errorResponse('المستخدم غير موجود', 404)
    }

    const userData = userDoc.data()
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    // Update name
    if (name && name !== userData?.['name']) {
      updateData['name'] = name
    }

    // Update email
    if (email && email !== userData?.['email']) {
      // Check if email already exists
      const emailCheck = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get()
      
      if (!emailCheck.empty && emailCheck.docs[0] && emailCheck.docs[0].id !== user.userId) {
        return errorResponse('البريد الإلكتروني مستخدم بالفعل', 400)
      }
      
      updateData['email'] = email
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse('كلمة المرور الحالية مطلوبة', 400)
      }

      // Verify current password
      const currentPasswordHash = userData?.['password'] as string
      const isPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash)
      
      if (!isPasswordValid) {
        return errorResponse('كلمة المرور الحالية غير صحيحة', 400)
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      updateData['password'] = hashedPassword
    }

    // Update user document
    await db.collection('users').doc(user.userId).update(updateData)

    // Fetch updated user
    const updatedDoc = await db.collection('users').doc(user.userId).get()
    const updatedData = updatedDoc.data()

    return successResponse({
      user: {
        id: updatedDoc.id,
        name: updatedData?.['name'],
        email: updatedData?.['email'],
        username: updatedData?.['username'],
        role: updatedData?.['role'],
      }
    })
  } catch (error) {
    const err = error as ErrorWithCode
    await logger.error('Update profile error', err as Error)
    return errorResponse('حدث خطأ أثناء تحديث الملف الشخصي', 500)
  }
}


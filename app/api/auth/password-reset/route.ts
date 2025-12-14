import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { hashPassword, validatePasswordStrength } from '@/lib/auth/bcrypt'
import { z } from 'zod'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { getRequestContext } from '@/lib/middleware/auth'
import crypto from 'crypto'
import { FieldValue } from 'firebase-admin/firestore'

const requestResetSchema = z.object({
  email: z.string().email(),
})

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
})

/**
 * POST /api/auth/password-reset/request
 * Request password reset
 */
export async function POST(request: NextRequest) {
  const context = getRequestContext(request)

  try {
    const body = await request.json()
    const url = new URL(request.url)

    // Check if this is a reset request or actual reset
    if (url.pathname.endsWith('/request')) {
      // Request password reset
      const validationResult = requestResetSchema.safeParse(body)
      if (!validationResult.success) {
        return validationErrorResponse(
          validationResult.error.issues.map(issue => issue.message)
        )
      }

      const { email } = validationResult.data
      const db = getFirestoreDB()

      // Find user by email
      const usersSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get()

      // Don't reveal if user exists (security best practice)
      if (usersSnapshot.empty) {
        // Still return success to prevent email enumeration
        return successResponse({ message: 'If the email exists, a reset link has been sent.' })
      }

      const userDoc = usersSnapshot.docs[0]
      if (!userDoc) {
        return successResponse({ message: 'If the email exists, a reset link has been sent.' })
      }
      const userId = userDoc.id

      // Generate reset token
      const token = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour expiry

      await db.collection('passwordResetTokens').doc().set({
        userId,
        token,
        expiresAt,
        used: false,
        createdAt: FieldValue.serverTimestamp(),
      })

      // TODO: Send email with reset link
      // For now, log the token (remove in production)
      if (process.env['NODE_ENV'] === 'development') {
        console.log(`Password reset token for ${email}: ${token}`)
      }

      await logger.info('Password reset requested', {
        userId,
        email,
        ipAddress: context.ipAddress,
      })

      return successResponse({ message: 'If the email exists, a reset link has been sent.' })
    } else {
      // Reset password with token
      const validationResult = resetPasswordSchema.safeParse(body)
      if (!validationResult.success) {
        return validationErrorResponse(
          validationResult.error.issues.map(issue => issue.message)
        )
      }

      const { token, newPassword } = validationResult.data

      // Validate password strength
      const passwordValidation = validatePasswordStrength(newPassword)
      if (!passwordValidation.valid) {
        return validationErrorResponse(passwordValidation.errors)
      }

      const db = getFirestoreDB()

      // Find valid reset token
      const tokensSnapshot = await db.collection('passwordResetTokens')
        .where('token', '==', token)
        .limit(1)
        .get()

      if (tokensSnapshot.empty) {
        return errorResponse('Invalid or expired reset token', 400)
      }

      const resetTokenDoc = tokensSnapshot.docs[0]
      const resetTokenData = resetTokenDoc.data()

      // Check if token is used or expired
      if (resetTokenData.used || (resetTokenData.expiresAt?.toDate?.() || new Date(resetTokenData.expiresAt)) < new Date()) {
        return errorResponse('Invalid or expired reset token', 400)
      }

      const userId = resetTokenData.userId

      // Get user
      const userDoc = await db.collection('users').doc(userId).get()
      if (!userDoc.exists) {
        return errorResponse('User not found', 404)
      }

      // Update password
      const hashedPassword = await hashPassword(newPassword)
      await db.collection('users').doc(userId).update({
        password: hashedPassword,
        updatedAt: FieldValue.serverTimestamp(),
      })

      // Mark token as used
      await db.collection('passwordResetTokens').doc(resetTokenDoc.id).update({
        used: true,
      })

      await logger.info('Password reset successful', {
        userId,
        ipAddress: context.ipAddress,
      })

      return successResponse({ message: 'Password reset successfully' })
    }
  } catch (error) {
    await logger.error('Password reset error', error as Error, {
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء إعادة تعيين كلمة المرور', 500)
  }
}

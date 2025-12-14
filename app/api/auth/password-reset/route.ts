import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { hashPassword, validatePasswordStrength } from '@/lib/auth/bcrypt'
import { z } from 'zod'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { getRequestContext } from '@/lib/middleware/auth'
import { FieldValue } from 'firebase-admin/firestore'
import crypto from 'crypto'

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

      // Find user by email (users might have email field or username field)
      const usersByEmail = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get()

      const usersByUsername = await db.collection('users')
        .where('username', '==', email)
        .limit(1)
        .get()

      let userDoc = usersByEmail.empty ? (usersByUsername.empty ? null : usersByUsername.docs[0]) : usersByEmail.docs[0]

      // Don't reveal if user exists (security best practice)
      if (!userDoc) {
        // Still return success to prevent email enumeration
        return successResponse({ message: 'If the email exists, a reset link has been sent.' })
      }

      // Generate reset token
      const token = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour expiry

      await db.collection('passwordResetTokens').add({
        userId: userDoc.id,
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

      const userData = userDoc.data()
      await logger.info('Password reset requested', {
        userId: userDoc.id,
        email: (userData?.['email'] as string) || email,
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
      const resetTokensSnapshot = await db.collection('passwordResetTokens')
        .where('token', '==', token)
        .limit(1)
        .get()

      if (resetTokensSnapshot.empty || resetTokensSnapshot.docs.length === 0) {
        return errorResponse('Invalid or expired reset token', 400)
      }

      const resetTokenDoc = resetTokensSnapshot.docs[0]
      if (!resetTokenDoc) {
        return errorResponse('Invalid or expired reset token', 400)
      }

      const resetTokenData = resetTokenDoc.data()
      const userId = resetTokenData['userId'] as string
      const expiresAt = (resetTokenData['expiresAt'] as { toDate: () => Date })?.toDate() || new Date(resetTokenData['expiresAt'] as string)
      const used = resetTokenData['used'] as boolean

      if (used || expiresAt < new Date()) {
        return errorResponse('Invalid or expired reset token', 400)
      }

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
        updatedAt: FieldValue.serverTimestamp(),
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

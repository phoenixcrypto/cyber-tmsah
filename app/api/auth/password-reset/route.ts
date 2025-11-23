import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { hashPassword, comparePassword, validatePasswordStrength } from '@/lib/auth/bcrypt'
import { z } from 'zod'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { getRequestContext } from '@/lib/middleware/auth'
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

      const user = await prisma.user.findUnique({
        where: { email },
      })

      // Don't reveal if user exists (security best practice)
      if (!user) {
        // Still return success to prevent email enumeration
        return successResponse({ message: 'If the email exists, a reset link has been sent.' })
      }

      // Generate reset token
      const token = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour expiry

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      })

      // TODO: Send email with reset link
      // For now, log the token (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log(`Password reset token for ${email}: ${token}`)
      }

      await logger.info('Password reset requested', {
        userId: user.id,
        email: user.email,
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

      // Find valid reset token
      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
      })

      if (!resetToken) {
        return errorResponse('Invalid or expired reset token', 400)
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: resetToken.userId },
      })

      if (!user) {
        return errorResponse('User not found', 404)
      }

      if (resetToken.used || resetToken.expiresAt < new Date()) {
        return errorResponse('Invalid or expired reset token', 400)
      }

      // Update password
      const hashedPassword = await hashPassword(newPassword)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      })

      // Mark token as used
      await prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      })

      await logger.info('Password reset successful', {
        userId: user.id,
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


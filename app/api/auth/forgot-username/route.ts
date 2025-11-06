import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/security/rateLimit'
import { sendEmail } from '@/lib/notifications/email'
import { z } from 'zod'

export const runtime = 'nodejs'
export const maxDuration = 60

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - prevent abuse
    const rateLimitResult = rateLimit(request, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 3, // 3 requests per 15 minutes
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate input
    const validationResult = emailSchema.safeParse(body)
    if (!validationResult.success) {
      const message = validationResult.error.issues?.[0]?.message || 'Invalid input'
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    const supabase = createAdminClient()

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('username, email, full_name, is_active')
      .eq('email', email.toLowerCase())
      .single()

    // Always return success to prevent email enumeration
    // But only send email if user exists and is active
    if (!userError && user && user.is_active) {
      // Send username via email
      const emailSent = await sendEmail({
        to: user.email,
        subject: 'Your Username - Cyber TMSAH Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0b0f14; color: #e6f1ff;">
            <h2 style="color: #00ffa2; margin-bottom: 20px;">Username Recovery</h2>
            <p style="color: #e6f1ff; line-height: 1.6;">
              Hello ${user.full_name},
            </p>
            <p style="color: #e6f1ff; line-height: 1.6;">
              You requested to retrieve your username. Here it is:
            </p>
            <div style="background-color: #0f1620; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #1f2a36;">
              <p style="color: #00ffa2; font-size: 18px; font-weight: bold; margin: 0;">
                Username: ${user.username}
              </p>
            </div>
            <p style="color: #e6f1ff; line-height: 1.6;">
              If you didn't request this, please ignore this email.
            </p>
            <p style="color: #e6f1ff; line-height: 1.6; margin-top: 30px;">
              Best regards,<br>
              Cyber TMSAH Platform
            </p>
          </div>
        `,
      })

      if (!emailSent) {
        console.error('Failed to send username recovery email')
        // Still return success to prevent email enumeration
      }
    }

    // Always return success (security: prevent email enumeration)
    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, we\'ve sent your username.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot username error:', error)
    // Always return success to prevent information leakage
    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, we\'ve sent your username.',
      },
      { status: 200 }
    )
  }
}


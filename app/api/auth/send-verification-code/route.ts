import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/notifications/email'
import { rateLimit } from '@/lib/security/rateLimit'
import { generateVerificationCode, storeVerificationCode } from '@/lib/security/verification'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 3, // 3 attempts per minute
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)) } }
      )
    }

    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Check if email already registered
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered. Please use a different email or sign in.' },
        { status: 409 }
      )
    }

    // Generate and store verification code
    const code = generateVerificationCode()
    storeVerificationCode(email.toLowerCase().trim(), code, 10)

    // Send email with verification code
    try {
      await sendEmail({
        to: email.toLowerCase().trim(),
        subject: 'Cyber TMSAH - Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0e27; color: #e0e0e0;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00ff88; font-size: 28px; margin: 0;">Cyber TMSAH</h1>
              <p style="color: #888; margin-top: 10px;">Academic Platform</p>
            </div>
            
            <div style="background: #1a1f3a; padding: 30px; border-radius: 10px; border: 1px solid #00ff88;">
              <h2 style="color: #00ff88; font-size: 24px; margin-top: 0;">Verification Code</h2>
              <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                Thank you for registering with Cyber TMSAH. Please use the following verification code to complete your registration:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; padding: 20px 40px; background: #0a0e27; border: 2px solid #00ff88; border-radius: 10px;">
                  <div style="font-size: 36px; font-weight: bold; color: #00ff88; letter-spacing: 8px; font-family: monospace;">
                    ${code}
                  </div>
                </div>
              </div>
              
              <p style="color: #888; font-size: 14px; margin-top: 20px;">
                This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #1a1f3a;">
              <p style="color: #666; font-size: 12px;">
                © 2025-2026 Cyber TMSAH. All rights reserved.
              </p>
            </div>
          </div>
        `,
      })

      console.log(`[Verification Code] Sent to ${email.toLowerCase().trim()}`)
    } catch (emailError) {
      console.error('[Verification Code] Email send error:', emailError)
      // Don't fail the request if email fails, but log it
      // In production, you might want to handle this differently
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Verification code sent to your email. Please check your inbox.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Send verification code error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

// Verify code endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    const { verifyCode } = await import('@/lib/security/verification')
    const result = verifyCode(email, code)

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error || 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Code is valid - mark as verified
    return NextResponse.json(
      {
        success: true,
        message: 'Verification code verified successfully',
        verified: true,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}


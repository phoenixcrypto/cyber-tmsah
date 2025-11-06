import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { z } from 'zod'

export const runtime = 'nodejs'

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

/**
 * Check if email exists in database (for admin/debugging purposes)
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(accessToken)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
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
      .select('username, email, full_name, is_active, created_at')
      .eq('email', email.toLowerCase())
      .single()

    // Check Gmail configuration
    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_APP_PASSWORD
    const hasGmailConfig = !!(gmailUser && gmailPassword)

    return NextResponse.json(
      {
        success: true,
        email: email.toLowerCase(),
        userExists: !!user && !userError,
        user: user ? {
          username: user.username,
          fullName: user.full_name,
          isActive: user.is_active,
          createdAt: user.created_at,
        } : null,
        gmailConfigured: hasGmailConfig,
        error: userError?.message || null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Check email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


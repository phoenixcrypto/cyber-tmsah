import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, generateAccessToken } from '@/lib/security/jwt'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/security/rateLimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 refresh requests per minute
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found. Please log in again.' },
        { status: 401 }
      )
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token. Please log in again.' },
        { status: 401 }
      )
    }

    // Check if refresh token is actually a refresh token
    try {
      const tokenParts = refreshToken.split('.')
      if (tokenParts.length < 2 || !tokenParts[1]) {
        return NextResponse.json(
          { error: 'Invalid refresh token format. Please log in again.' },
          { status: 401 }
        )
      }
      const decoded = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
      if (decoded.type !== 'refresh') {
        return NextResponse.json(
          { error: 'Invalid token type. Please log in again.' },
          { status: 401 }
        )
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid refresh token format. Please log in again.' },
        { status: 401 }
      )
    }

    // Verify user still exists and is active
    const supabase = createAdminClient()
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, full_name, role, section_number, group_name, is_active')
      .eq('id', payload.userId)
      .eq('is_active', true)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found or inactive. Please log in again.' },
        { status: 401 }
      )
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
      role: user.role as 'student' | 'admin',
      sectionNumber: user.section_number || undefined,
      groupName: user.group_name || undefined,
    })

    // Return new access token
    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    })

    // Update access_token cookie
    response.cookies.set('access_token', newAccessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}


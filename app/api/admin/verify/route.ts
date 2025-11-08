import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/security/jwt'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/security/rateLimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/verify
 * Verify if current user has admin access
 * This endpoint performs full server-side verification
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30, // 30 requests per minute
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)) } }
      )
    }

    // Get access token from cookie or header
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { isAdmin: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(accessToken)
    if (!payload) {
      console.error('Token verification failed - invalid token')
      return NextResponse.json(
        { isAdmin: false, error: 'Invalid or expired token. Please log in again.' },
        { status: 401 }
      )
    }

    if (payload.role !== 'admin') {
      console.error('Token verification failed - not admin role:', payload.role)
      return NextResponse.json(
        { isAdmin: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Verify admin is active in database
    const supabase = createAdminClient()
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, role, is_active')
      .eq('id', payload.userId)
      .eq('role', 'admin')
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Database error checking admin:', error)
      return NextResponse.json(
        { isAdmin: false, error: 'Error verifying admin account' },
        { status: 500 }
      )
    }

    if (!user) {
      console.error('Admin not found or inactive:', payload.userId)
      return NextResponse.json(
        { isAdmin: false, error: 'Admin account not found or inactive. Please contact support.' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      isAdmin: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Admin verification error:', error)
    return NextResponse.json(
      { isAdmin: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


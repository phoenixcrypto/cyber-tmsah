import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/user/activity
 * Update user's last activity timestamp
 * Called automatically by client to track online status
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
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Update last_login (used as last_activity) in database
    const supabase = createAdminClient()
    const now = new Date().toISOString()
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login: now })
      .eq('id', payload.userId)

    if (updateError) {
      console.error('[User Activity] Error updating last_login:', updateError)
      return NextResponse.json(
        { error: 'Failed to update activity', details: updateError.message },
        { status: 500 }
      )
    }

    console.log('[User Activity] Updated last_login for user:', payload.userId, 'at', now)

    return NextResponse.json({
      success: true,
      updated_at: now,
    })
  } catch (error) {
    console.error('[User Activity] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


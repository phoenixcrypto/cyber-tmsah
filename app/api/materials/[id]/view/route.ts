import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { timeSpent, deviceType } = body
    const articleId = params.id

    // Get IP address (for duplicate detection)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

    const supabase = createAdminClient()

    // Check if view already exists
    const { data: existingView } = await supabase
      .from('article_views')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', payload.userId)
      .eq('ip_hash', ipHash)
      .single()

    if (!existingView) {
      // Insert view record
      const { error: viewError } = await supabase
        .from('article_views')
        .insert({
          article_id: articleId,
          user_id: payload.userId,
          time_spent: timeSpent || 0,
          device_type: deviceType || 'unknown',
          ip_hash: ipHash,
        })

      if (viewError) {
        console.error('View tracking error:', viewError)
        // Don't fail the request if tracking fails
      }
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


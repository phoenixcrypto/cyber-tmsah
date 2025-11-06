import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { sendArticleNotification, sendTaskNotification } from '@/lib/notifications/email'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    const { type, id, sendNow } = body // type: 'article' | 'task', id: article/task id, sendNow: boolean

    const supabase = createAdminClient()

    // Get content
    const table = type === 'article' ? 'articles' : 'tasks'
    const { data: content, error: contentError } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (contentError || !content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Get recipients based on target sections/groups
    let recipients: string[] = []

    if (content.is_general) {
      // Get all users
      const { data: allUsers } = await supabase
        .from('users')
        .select('email')
        .eq('is_active', true)

      recipients = (allUsers || []).map(u => u.email).filter(Boolean)
    } else {
      // Get users in target sections/groups
      const { data: targetUsers } = await supabase
        .from('users')
        .select('email')
        .eq('is_active', true)
        .in('section_number', content.target_sections || [])
        .in('group_name', content.target_groups || [])

      recipients = (targetUsers || []).map(u => u.email).filter(Boolean)
    }

    // Filter by notification settings
    // TODO: Filter by notification_settings
    // const { data: notificationSettings } = await supabase
    //   .from('notification_settings')
    //   .select('user_id, email_notifications')
    //   .in('user_id', recipients.map((_, i) => i.toString())) // This is simplified - should get actual user IDs

    // For now, send to all recipients

    // Send notifications
    if (sendNow) {
      const success = type === 'article'
        ? await sendArticleNotification(content, recipients)
        : await sendTaskNotification(content, recipients)

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to send notifications' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      recipientsCount: recipients.length,
    })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


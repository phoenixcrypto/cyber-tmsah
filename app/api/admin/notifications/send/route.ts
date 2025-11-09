import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { sendArticleNotification, sendTaskNotification } from '@/lib/notifications/email'
import { logger } from '@/lib/utils/logger'

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

    // Verify admin is active in database
    const supabase = createAdminClient()
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id, role, is_active')
      .eq('id', payload.userId)
      .eq('role', 'admin')
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser) {
      return NextResponse.json(
        { error: 'Admin account not found or inactive' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { type, id, sendNow } = body // type: 'article' | 'task', id: article/task id, sendNow: boolean

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
    // Get user IDs from recipients emails
    const { data: usersData } = await supabase
      .from('users')
      .select('id, email')
      .in('email', recipients)
      .eq('is_active', true)

    const userIds = (usersData || []).map(u => u.id)
    
    // Get notification settings for these users
    const { data: notificationSettings } = await supabase
      .from('notification_settings')
      .select('user_id, email_notifications')
      .in('user_id', userIds)

    // Create a map of user_id -> email_notifications
    const settingsByUserId = new Map<string, boolean>()
    
    // Map user emails to IDs
    const emailToUserId = new Map<string, string>()
    usersData?.forEach(u => {
      emailToUserId.set(u.email, u.id)
    })

    // Map notification settings
    notificationSettings?.forEach(setting => {
      settingsByUserId.set(setting.user_id, setting.email_notifications ?? true)
    })

    // Filter recipients based on notification settings
    // Default to true if no setting exists (opt-in by default)
    recipients = recipients.filter(email => {
      const userId = emailToUserId.get(email)
      if (!userId) return false
      const emailEnabled = settingsByUserId.get(userId) ?? true // Default to enabled
      return emailEnabled
    })

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
    logger.error('Notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { sendTaskReminder } from '@/lib/notifications/email'

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

    // Get tasks due in 3 days
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    const threeDaysFromNowISO = threeDaysFromNow.toISOString()

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('reminder_sent', false)
      .not('published_at', 'is', null)
      .lte('due_date', threeDaysFromNowISO)

    if (tasksError || !tasks) {
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    }

    let sentCount = 0

    // Send reminders for each task
    for (const task of tasks) {
      // Get recipients
      let recipients: string[] = []

      if (task.is_general) {
        const { data: allUsers } = await supabase
          .from('users')
          .select('email')
          .eq('is_active', true)

        recipients = (allUsers || []).map(u => u.email).filter(Boolean)
      } else {
        const { data: targetUsers } = await supabase
          .from('users')
          .select('email')
          .eq('is_active', true)
          .in('section_number', task.target_sections || [])
          .in('group_name', task.target_groups || [])

        recipients = (targetUsers || []).map(u => u.email).filter(Boolean)
      }

      // Send reminder
      const success = await sendTaskReminder(task, recipients)

      if (success) {
        // Mark reminder as sent
        await supabase
          .from('tasks')
          .update({ reminder_sent: true })
          .eq('id', task.id)

        sentCount++
      }
    }

    return NextResponse.json({
      success: true,
      tasksProcessed: tasks.length,
      remindersSent: sentCount,
    })
  } catch (error) {
    console.error('Reminder error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


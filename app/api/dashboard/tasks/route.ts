import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    const supabase = createAdminClient()

    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('section_number, group_name')
      .eq('id', payload.userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get all published tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .not('published_at', 'is', null)
      .order('due_date', { ascending: true })

    if (tasksError) {
      console.error('Tasks error:', tasksError)
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    }

    // Filter tasks by section/group
    const filteredTasks = (tasks || []).filter(task => {
      if (task.is_general) return true
      
      const matchesSection = !task.target_sections || 
        task.target_sections.length === 0 ||
        task.target_sections.includes(user.section_number)
      
      const matchesGroup = !task.target_groups || 
        task.target_groups.length === 0 ||
        task.target_groups.includes(user.group_name)
      
      return matchesSection && matchesGroup
    })

    // Get user's submissions
    const { data: submissions } = await supabase
      .from('task_submissions')
      .select('task_id')
      .eq('user_id', payload.userId)

    const submittedTaskIds = new Set((submissions || []).map(s => s.task_id))

    // Add submission status to tasks
    const tasksWithStatus = filteredTasks.map(task => ({
      ...task,
      submitted: submittedTaskIds.has(task.id),
    }))

    return NextResponse.json({
      success: true,
      tasks: tasksWithStatus,
    })
  } catch (error) {
    console.error('Tasks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


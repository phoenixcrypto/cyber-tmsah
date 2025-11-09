import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 60 // Cache for 60 seconds

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

    // Get user info, tasks, and submissions in parallel for better performance
    const [userResult, tasksResult, submissionsResult] = await Promise.all([
      supabase
        .from('users')
        .select('section_number, group_name')
        .eq('id', payload.userId)
        .single(),
      supabase
        .from('tasks')
        .select('id, title, description, due_date, is_general, target_sections, target_groups, published_at, created_at, updated_at, author_id, points')
        .not('published_at', 'is', null)
        .order('due_date', { ascending: true }),
      supabase
        .from('task_submissions')
        .select('task_id')
        .eq('user_id', payload.userId),
    ])

    const user = userResult.data
    if (userResult.error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (tasksResult.error) {
      console.error('Tasks error:', tasksResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    }

    const tasks = tasksResult.data || []
    const submissions = submissionsResult.data || []
    const submittedTaskIds = new Set((submissions || []).map((s: any) => s.task_id))

    // Filter tasks by section/group efficiently
    const userSection = user?.section_number
    const userGroup = user?.group_name
    
    const tasksWithStatus = (tasks || [])
      .filter((task: any) => {
        if (!task) return false
        if (task.is_general) return true
        
        // Handle target_sections - can be array or null
        const targetSections = Array.isArray(task.target_sections) ? task.target_sections : []
        const matchesSection = targetSections.length === 0 || (userSection && targetSections.includes(userSection))
        
        // Handle target_groups - can be array or null
        const targetGroups = Array.isArray(task.target_groups) ? task.target_groups : []
        const matchesGroup = targetGroups.length === 0 || (userGroup && targetGroups.includes(userGroup))
        
        return matchesSection && matchesGroup
      })
      .map((task: any) => ({
        ...task,
        submitted: submittedTaskIds.has(task.id),
      }))

    return NextResponse.json({
      success: true,
      tasks: tasksWithStatus,
    })
  } catch (error: any) {
    console.error('[Dashboard Tasks] Error:', error)
    console.error('[Dashboard Tasks] Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}


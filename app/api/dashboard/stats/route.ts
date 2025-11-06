import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    const { data: user } = await supabase
      .from('users')
      .select('section_number, group_name')
      .eq('id', payload.userId)
      .single()

    // Get all published tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, is_general, target_sections, target_groups')
      .not('published_at', 'is', null)

    const filteredTasks = (tasks || []).filter(task => {
      if (task.is_general) return true
      const matchesSection = !task.target_sections || task.target_sections.length === 0 || task.target_sections.includes(user?.section_number)
      const matchesGroup = !task.target_groups || task.target_groups.length === 0 || task.target_groups.includes(user?.group_name)
      return matchesSection && matchesGroup
    })

    // Get all published materials
    const { data: articles } = await supabase
      .from('articles')
      .select('id, is_general, target_sections, target_groups')
      .not('published_at', 'is', null)

    const filteredArticles = (articles || []).filter(article => {
      if (article.is_general) return true
      const matchesSection = !article.target_sections || article.target_sections.length === 0 || article.target_sections.includes(user?.section_number)
      const matchesGroup = !article.target_groups || article.target_groups.length === 0 || article.target_groups.includes(user?.group_name)
      return matchesSection && matchesGroup
    })

    return NextResponse.json({
      success: true,
      stats: {
        tasks: filteredTasks.length,
        materials: filteredArticles.length,
      },
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


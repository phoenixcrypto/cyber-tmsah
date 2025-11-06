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

    // Get all published articles/materials
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })

    if (articlesError) {
      console.error('Articles error:', articlesError)
      return NextResponse.json(
        { error: 'Failed to fetch materials' },
        { status: 500 }
      )
    }

    // Filter articles by section/group
    const filteredArticles = (articles || []).filter(article => {
      if (article.is_general) return true
      
      const matchesSection = !article.target_sections || 
        article.target_sections.length === 0 ||
        article.target_sections.includes(user.section_number)
      
      const matchesGroup = !article.target_groups || 
        article.target_groups.length === 0 ||
        article.target_groups.includes(user.group_name)
      
      return matchesSection && matchesGroup
    })

    // Get view counts
    const { data: views } = await supabase
      .from('article_views')
      .select('article_id')
      .eq('user_id', payload.userId)

    const viewedArticleIds = new Set((views || []).map(v => v.article_id))

    // Add viewed status to articles
    const articlesWithStatus = filteredArticles.map(article => ({
      ...article,
      viewed: viewedArticleIds.has(article.id),
    }))

    return NextResponse.json({
      success: true,
      materials: articlesWithStatus,
    })
  } catch (error) {
    console.error('Materials error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


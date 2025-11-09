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

    // Get user info, articles, and views in parallel
    const [userResult, articlesResult, viewsResult] = await Promise.all([
      supabase
        .from('users')
        .select('section_number, group_name')
        .eq('id', payload.userId)
        .single(),
      supabase
        .from('articles')
        .select('id, title, content, subject_id, is_general, target_sections, target_groups, published_at, created_at, updated_at, author_id, view_count')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false }),
      supabase
        .from('article_views')
        .select('article_id')
        .eq('user_id', payload.userId),
    ])

    const user = userResult.data
    if (userResult.error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (articlesResult.error) {
      console.error('Articles error:', articlesResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch materials' },
        { status: 500 }
      )
    }

    const articles = articlesResult.data || []
    const views = viewsResult.data || []
    const viewedArticleIds = new Set(views.map(v => v.article_id))

    // Filter articles by section/group efficiently
    const userSection = user.section_number
    const userGroup = user.group_name
    
    const articlesWithStatus = articles
      .filter(article => {
        if (article.is_general) return true
        const matchesSection = !article.target_sections || article.target_sections.length === 0 || article.target_sections.includes(userSection)
        const matchesGroup = !article.target_groups || article.target_groups.length === 0 || article.target_groups.includes(userGroup)
        return matchesSection && matchesGroup
      })
      .map(article => ({
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


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
    const viewedArticleIds = new Set((views || []).map((v: any) => {
      try {
        return v?.article_id
      } catch {
        return null
      }
    }).filter(Boolean))

    // Filter articles by section/group efficiently
    const userSection = user?.section_number
    const userGroup = user?.group_name
    
    const articlesWithStatus = (articles || [])
      .filter((article: any) => {
        try {
          if (!article || typeof article !== 'object') return false
          if (article.is_general === true) return true
          
          // Handle target_sections - can be array, null, or undefined
          let targetSections: number[] = []
          if (article.target_sections) {
            if (Array.isArray(article.target_sections)) {
              targetSections = article.target_sections.filter((s: any) => typeof s === 'number')
            }
          }
          const matchesSection = targetSections.length === 0 || (userSection && targetSections.includes(userSection))
          
          // Handle target_groups - can be array, null, or undefined
          let targetGroups: string[] = []
          if (article.target_groups) {
            if (Array.isArray(article.target_groups)) {
              targetGroups = article.target_groups.filter((g: any) => typeof g === 'string')
            }
          }
          const matchesGroup = targetGroups.length === 0 || (userGroup && targetGroups.includes(userGroup))
          
          return matchesSection && matchesGroup
        } catch (err) {
          console.error('[Dashboard Materials] Error filtering article:', article?.id, err)
          return false
        }
      })
      .map((article: any) => {
        try {
          return {
            ...article,
            viewed: viewedArticleIds.has(article.id),
          }
        } catch (err) {
          console.error('[Dashboard Materials] Error mapping article:', article?.id, err)
          return {
            ...article,
            viewed: false,
          }
        }
      })

    return NextResponse.json({
      success: true,
      materials: articlesWithStatus,
    })
  } catch (error: any) {
    console.error('[Dashboard Materials] Error:', error)
    console.error('[Dashboard Materials] Error details:', {
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


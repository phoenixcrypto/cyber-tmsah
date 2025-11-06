import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'

export const runtime = 'nodejs'

export async function GET(
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

    const supabase = createAdminClient()

    // Get user info
    const { data: user } = await supabase
      .from('users')
      .select('section_number, group_name')
      .eq('id', payload.userId)
      .single()

    // Get article ID from route params
    const articleId = params.id

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    // Get article from Supabase
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .not('published_at', 'is', null)
      .single()

    if (articleError || !article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this article
    if (!article.is_general) {
      const matchesSection = !article.target_sections || 
        article.target_sections.length === 0 ||
        article.target_sections.includes(user?.section_number)
      
      const matchesGroup = !article.target_groups || 
        article.target_groups.length === 0 ||
        article.target_groups.includes(user?.group_name)
      
      if (!matchesSection || !matchesGroup) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      article,
    })
  } catch (error) {
    console.error('Article fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


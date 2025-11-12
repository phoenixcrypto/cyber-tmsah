import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/materials
 * Get all published materials/articles (Public - No authentication required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')
    const status = searchParams.get('status') || 'published'

    const supabase = createAdminClient()

    // Build query
    let query = supabase
      .from('articles')
      .select('id, title, content, subject_id, is_general, target_sections, target_groups, published_at, created_at, updated_at, author_id, view_count, excerpt, tags, type, status')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })

    // Filter by subject if provided
    if (subjectId) {
      query = query.eq('subject_id', subjectId)
    }

    // Filter by status
    if (status === 'published') {
      query = query.eq('status', 'published')
    }

    const { data: articles, error } = await query

    if (error) {
      console.error('[Materials API] Error fetching articles:', error)
      return NextResponse.json(
        { error: 'Failed to fetch materials' },
        { status: 500 }
      )
    }

    // Return articles array
    return NextResponse.json(articles || [])
  } catch (error) {
    console.error('[Materials API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/materials
 * Upload a new material/article (Simple API key authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // Simple API key check (from environment variable)
    const apiKey = request.headers.get('x-api-key')
    const expectedApiKey = process.env.MATERIALS_UPLOAD_API_KEY || 'default-api-key-change-in-production'

    if (!apiKey || apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, subjectId, excerpt, tags, type, isGeneral, targetSections, targetGroups } = body

    if (!title || !content || !subjectId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, subjectId' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Insert article
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        subject_id: subjectId,
        excerpt: excerpt || '',
        tags: tags || [],
        type: type || 'lecture',
        is_general: isGeneral || false,
        target_sections: targetSections || [],
        target_groups: targetGroups || [],
        status: 'published',
        published_at: new Date().toISOString(),
        view_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('[Materials API] Error creating article:', error)
      return NextResponse.json(
        { error: 'Failed to create material' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      article,
    })
  } catch (error) {
    console.error('[Materials API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


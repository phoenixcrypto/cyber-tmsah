import { NextRequest, NextResponse } from 'next/server'
import { getArticles, transformStrapiArticle } from '@/lib/api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * Strapi-only API route for fetching articles
 * This route specifically connects to Strapi CMS
 * Fallback to local database is handled in the main /api/articles route
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')
    const status = searchParams.get('status') || 'published'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    // Fetch from Strapi
    const params: any = { status, populate: '*' }
    if (subjectId) params.subjectId = subjectId
    if (limit) params.limit = limit
    const strapiData = await getArticles(params)
    
    if (!strapiData || !strapiData.data) {
      return NextResponse.json({ 
        message: 'No data from Strapi',
        data: [],
        usingStrapi: false
      })
    }

    // Transform Strapi articles to app format
    const articles = strapiData.data.map(transformStrapiArticle)

    return NextResponse.json({
      data: articles,
      meta: strapiData.meta,
      usingStrapi: true
    })
  } catch (error) {
    console.error('Error fetching articles from Strapi:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch articles from Strapi',
      usingStrapi: false
    }, { status: 500 })
  }
}


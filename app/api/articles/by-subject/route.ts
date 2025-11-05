import { NextRequest, NextResponse } from 'next/server'
import { getArticles, transformStrapiArticle, isStrapiConfigured } from '@/lib/api'

// Revalidate every 30 minutes
export const revalidate = 1800
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const subjectId = searchParams.get('subjectId')
  const status = searchParams.get('status') || 'published'

  try {
    // Check if Strapi is configured
    if (!isStrapiConfigured()) {
      return NextResponse.json(
        { error: 'Strapi is not configured. Please set NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN in your .env.local file.' },
        { status: 503 }
      )
    }

    // Fetch from Strapi ONLY
    const strapiData = await getArticles(
      subjectId
        ? { subjectId, status, populate: '*' }
        : { status, populate: '*' }
    )
    
    // If no data or empty array, return empty array
    if (!strapiData || !strapiData.data || !Array.isArray(strapiData.data) || strapiData.data.length === 0) {
      return NextResponse.json([])
    }

    // Transform Strapi articles to app format
    const articles = strapiData.data
      .filter((article: any) => article && article.attributes) // Filter out invalid articles
      .map(transformStrapiArticle)
      .filter((article: any) => article) // Filter out any null/undefined transformations
    
    // If no valid articles after transformation, return empty array
    if (articles.length === 0) {
      return NextResponse.json([])
    }
    
    // Sort by published date (newest first)
    articles.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return dateB - dateA
    })

    // Return with cache headers
    return NextResponse.json(articles, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Error fetching articles from Strapi:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch articles from Strapi' },
      { status: 500 }
    )
  }
}


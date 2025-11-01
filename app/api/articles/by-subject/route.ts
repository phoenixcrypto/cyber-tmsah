import { NextRequest, NextResponse } from 'next/server'
import { articleDatabase } from '@/lib/articleDatabase'
import { getArticles, transformStrapiArticle } from '@/lib/api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const subjectId = searchParams.get('subjectId')
  const status = searchParams.get('status') || 'published'

  try {
    // Try to fetch from Strapi first
    const strapiData = await getArticles(subjectId ? { subjectId, status, populate: '*' } : { status, populate: '*' })
    
    if (strapiData && strapiData.data) {
      // Transform Strapi articles to app format
      const articles = strapiData.data.map(transformStrapiArticle)
      return NextResponse.json(articles)
    }

    // Fallback to local database if Strapi is not available
    let articles = articleDatabase.getAll()

    // Filter by subject if provided
    if (subjectId) {
      articles = articles.filter(article => article.subjectId === subjectId)
    }

    // Filter by status
    articles = articles.filter(article => article.status === status)

    // Sort by published date (newest first)
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    
    // Final fallback: return empty array instead of error
    return NextResponse.json([])
  }
}


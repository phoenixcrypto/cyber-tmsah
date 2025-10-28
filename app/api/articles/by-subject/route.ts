import { NextRequest, NextResponse } from 'next/server'
import { articleDatabase } from '@/lib/articleDatabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const subjectId = searchParams.get('subjectId')
  const status = searchParams.get('status') || 'published'

  try {
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
    return NextResponse.json({ message: 'Failed to fetch articles' }, { status: 500 })
  }
}

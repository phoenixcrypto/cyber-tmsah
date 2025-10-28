import { NextRequest, NextResponse } from 'next/server'
import { articleDatabase } from '@/lib/articleDatabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const subject = searchParams.get('subject')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    let articles = articleDatabase.getAll()

    // Apply filters
    if (search) {
      articles = articleDatabase.search(search)
    }

    if (subject && subject !== 'all') {
      articles = articles.filter(article => article.subjectId === subject)
    }

    if (status && status !== 'all') {
      articles = articles.filter(article => article.status === status)
    }

    if (type && type !== 'all') {
      articles = articles.filter(article => article.type === type)
    }

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const articleData = await request.json()
    const newArticle = articleDatabase.add(articleData)
    return NextResponse.json(newArticle)
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const updatedArticle = articleDatabase.update(id, updates)
    
    if (!updatedArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    
    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }
    
    const deleted = articleDatabase.delete(id)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}

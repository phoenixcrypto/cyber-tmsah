import { NextRequest, NextResponse } from 'next/server'
import { getArticles, createArticle, updateArticle, deleteArticle, transformStrapiArticle, isStrapiConfigured } from '@/lib/api'
import { requireAuth } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Simple rate limiting (in-memory, for production use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // requests
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT) {
    return false
  }
  
  record.count++
  return true
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? (forwarded.split(',')[0] || 'unknown') : (request.headers.get('x-real-ip') || 'unknown')
  return ip
}

export async function GET(request: NextRequest) {
  try {
    // Check if Strapi is configured
    if (!isStrapiConfigured()) {
      return NextResponse.json(
        { error: 'Strapi is not configured. Please set NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN in your .env.local file.' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const subject = searchParams.get('subject')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Build filters for Strapi
    const params: any = {
      populate: '*'
    }

    if (subject && subject !== 'all') {
      params.subjectId = subject
    }

    if (status && status !== 'all') {
      params.status = status
    }

    // Fetch from Strapi
    const strapiData = await getArticles(params)

    if (!strapiData || !strapiData.data) {
      return NextResponse.json([])
    }

    // Transform articles
    let articles = strapiData.data.map(transformStrapiArticle)

    // Apply client-side filters (if Strapi doesn't support them)
    if (type && type !== 'all') {
      articles = articles.filter(article => article.type === type)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.description.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles from Strapi:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch articles from Strapi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!requireAuth(request)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check rate limiting
    const clientId = getClientIdentifier(request)
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Check if Strapi is configured
    if (!isStrapiConfigured()) {
      return NextResponse.json(
        { error: 'Strapi is not configured. Please set NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN in your .env.local file.' },
        { status: 503 }
      )
    }

    const articleData = await request.json()
    
    // Create article in Strapi
    const newArticle = await createArticle(articleData)
    
    // Transform to app format
    const transformed = transformStrapiArticle(newArticle)
    
    return NextResponse.json(transformed, { status: 201 })
  } catch (error) {
    console.error('Error creating article in Strapi:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create article in Strapi' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    if (!requireAuth(request)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check rate limiting
    const clientId = getClientIdentifier(request)
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Check if Strapi is configured
    if (!isStrapiConfigured()) {
      return NextResponse.json(
        { error: 'Strapi is not configured. Please set NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN in your .env.local file.' },
        { status: 503 }
      )
    }

    const { id, ...updates } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }
    
    // Update article in Strapi
    const updatedArticle = await updateArticle(id, updates)
    
    // Transform to app format
    const transformed = transformStrapiArticle(updatedArticle)
    
    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Error updating article in Strapi:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update article in Strapi' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    if (!requireAuth(request)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check rate limiting
    const clientId = getClientIdentifier(request)
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Check if Strapi is configured
    if (!isStrapiConfigured()) {
      return NextResponse.json(
        { error: 'Strapi is not configured. Please set NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN in your .env.local file.' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }
    
    // Delete article from Strapi
    await deleteArticle(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article from Strapi:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete article from Strapi' },
      { status: 500 }
    )
  }
}

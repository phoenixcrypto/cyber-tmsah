import { NextResponse } from 'next/server'
import { getPublishedNewsArticles } from '@/lib/db/news'

// Public API - Get published news
export async function GET() {
  try {
    const articles = getPublishedNewsArticles(5) // Latest 5
    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Get news error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 })
  }
}


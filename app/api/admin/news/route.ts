import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { getAllNewsArticles, getPublishedNewsArticles, addNewsArticle, updateNewsArticle, deleteNewsArticle } from '@/lib/db/news'

// GET - Get all news articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') === 'true'

    const articles = published ? getPublishedNewsArticles() : getAllNewsArticles()
    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Get news error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب البيانات' }, { status: 500 })
  }
}

// POST - Add new news article
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload || (payload.role !== 'admin' && payload.role !== 'editor')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, titleEn, subjectId, subjectTitle, subjectTitleEn, url, status } = body

    if (!title || !titleEn || !subjectId || !url) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const newArticle = addNewsArticle({
      title,
      titleEn,
      subjectId,
      subjectTitle: subjectTitle || '',
      subjectTitleEn: subjectTitleEn || '',
      url,
      publishedAt: new Date().toISOString(),
      status: status || 'draft',
    })

    return NextResponse.json({ article: newArticle }, { status: 201 })
  } catch (error) {
    console.error('Add news error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة الخبر' }, { status: 500 })
  }
}

// PUT - Update news article
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload || (payload.role !== 'admin' && payload.role !== 'editor')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID مطلوب' }, { status: 400 })
    }

    const updated = updateNewsArticle(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'الخبر غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ article: updated })
  } catch (error) {
    console.error('Update news error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء التحديث' }, { status: 500 })
  }
}

// DELETE - Delete news article
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID مطلوب' }, { status: 400 })
    }

    const deleted = deleteNewsArticle(id)
    if (!deleted) {
      return NextResponse.json({ error: 'الخبر غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete news error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء الحذف' }, { status: 500 })
  }
}


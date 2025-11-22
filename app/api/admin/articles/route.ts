import { NextRequest, NextResponse } from 'next/server'
import { articleSchema } from '@/lib/validators/schemas'
import {
  getAllArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle,
  getArticlesByMaterialId,
  type Article,
} from '@/lib/db/articles'

/**
 * GET /api/admin/articles
 * Get all articles (with optional materialId filter)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('materialId')

    if (materialId) {
      const articles = getArticlesByMaterialId(materialId)
      return NextResponse.json({ success: true, articles })
    }

    const articles = getAllArticles()
    return NextResponse.json({ success: true, articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المقالات' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/articles
 * Create new article
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = articleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const articleData = validationResult.data

    // If status is published, set publishedAt
    const articleToAdd: Omit<Article, 'id' | 'createdAt' | 'updatedAt'> = {
      materialId: articleData.materialId,
      title: articleData.title,
      titleEn: articleData.titleEn,
      content: articleData.content,
      contentEn: articleData.contentEn,
      author: articleData.author,
      status: articleData.status,
      views: articleData.views || 0,
      ...(articleData.excerpt && { excerpt: articleData.excerpt }),
      ...(articleData.excerptEn && { excerptEn: articleData.excerptEn }),
      ...(articleData.status === 'published' && !articleData.publishedAt 
        ? { publishedAt: new Date().toISOString() }
        : articleData.publishedAt ? { publishedAt: articleData.publishedAt } : {}),
      ...(articleData.tags && articleData.tags.length > 0 && { tags: articleData.tags }),
    }

    const newArticle = addArticle(articleToAdd)

    return NextResponse.json({
      success: true,
      article: newArticle,
    })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المقال' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/articles
 * Update article
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    // Validate updates
    const validationResult = articleSchema.partial().safeParse(updates)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    // If status is being changed to published, set publishedAt
    if (updates.status === 'published') {
      const article = getArticleById(id)
      if (article && !article.publishedAt) {
        updates.publishedAt = new Date().toISOString()
      }
    }

    const updatedArticle = updateArticle(id, updates)

    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      article: updatedArticle,
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المقال' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/articles
 * Delete article
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    const deleted = deleteArticle(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المقال' },
      { status: 500 }
    )
  }
}


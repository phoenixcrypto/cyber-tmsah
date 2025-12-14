import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { parseTags, stringifyTags } from '@/lib/utils/json-helpers'

/**
 * GET /api/articles
 * Get all articles (published only for public, all for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { getAuthUser } = await import('@/lib/middleware/auth')
    const user = await getAuthUser(request)

    // If admin, return all. Otherwise, only published
    const where = user?.role === 'admin' ? {} : { status: 'published' as const }

    const articles = await prisma.article.findMany({
      ...(Object.keys(where).length > 0 && { where }),
      orderBy: { updatedAt: 'desc' },
      include: {
        material: {
          select: { title: true, titleEn: true },
        },
      },
    })

    // Transform tags from JSON to array
    const transformedArticles = articles.map(article => ({
      ...article,
      tags: parseTags(article.tags),
    }))

    return successResponse({ articles: transformedArticles })
  } catch (error) {
    await logger.error('Get articles error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * POST /api/articles
 * Create new article (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
    const user = await requireEditor(request)

    const body = await request.json()
    const {
      materialId,
      title,
      titleEn,
      content,
      contentEn,
      excerpt,
      excerptEn,
      author,
      status,
      publishedAt,
      tags,
    } = body

    if (!materialId || !title || !content || !author) {
      return errorResponse('المادة، العنوان، المحتوى، والمؤلف مطلوبون', 400)
    }

    // Verify material exists
    const material = await prisma.material.findUnique({
      where: { id: materialId },
    })

    if (!material) {
      return errorResponse('المادة المحددة غير موجودة', 404)
    }

    // Get user name from database if author is not provided
    let authorName = author
    if (!authorName) {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { name: true },
      })
      authorName = fullUser?.name || user.email
    }

    const article = await prisma.article.create({
      data: {
        materialId,
        title,
        titleEn: titleEn || title,
        content,
        contentEn: contentEn || content,
        excerpt: excerpt || null,
        excerptEn: excerptEn || excerpt || null,
        author: authorName,
        status: status === 'published' ? 'published' : 'draft',
        publishedAt: status === 'published' && publishedAt ? new Date(publishedAt) : status === 'published' ? new Date() : null,
        tags: stringifyTags(tags || []),
      },
    })

    // Update material's articlesCount
    await prisma.material.update({
      where: { id: materialId },
      data: {
        articlesCount: {
          increment: 1,
        },
        lastUpdated: new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
    })

    return successResponse({ article: { ...article, tags: parseTags(article.tags) } }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create article error', error as Error)
    return errorResponse('حدث خطأ أثناء إنشاء المقال', 500)
  }
}


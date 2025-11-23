import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { getRequestContext } from '@/lib/middleware/auth'

/**
 * GET /api/news
 * Get all news articles (published only for public, all for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { getAuthUser } = await import('@/lib/middleware/auth')
    const user = await getAuthUser(request)

    // If admin, return all. Otherwise, only published
    const where = user?.role === 'admin' ? {} : { status: 'published' }

    const news = await prisma.newsArticle.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    })

    return successResponse({ news })
  } catch (error) {
    await logger.error('Get news error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * POST /api/news
 * Create new news article (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireEditor, getRequestContext } = await import('@/lib/middleware/auth')
    const context = getRequestContext(request)
    const user = await requireEditor(request)

    const body = await request.json()
    const {
      title,
      titleEn,
      subjectId,
      subjectTitle,
      subjectTitleEn,
      url,
      status,
      publishedAt,
    } = body

    if (!title || !subjectId || !subjectTitle || !url) {
      return errorResponse('جميع الحقول المطلوبة غير مكتملة', 400)
    }

    const news = await prisma.newsArticle.create({
      data: {
        title,
        titleEn: titleEn || title,
        subjectId,
        subjectTitle,
        subjectTitleEn: subjectTitleEn || subjectTitle,
        url,
        status: status === 'published' ? 'published' : 'draft',
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    })

    return successResponse({ news }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create news error', error as Error)
    return errorResponse('حدث خطأ أثناء إنشاء الخبر', 500)
  }
}

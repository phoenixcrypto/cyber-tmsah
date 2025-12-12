import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/news/[id]
 * Get single news article by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    })

    if (!news) {
      return notFoundResponse('الخبر غير موجود')
    }

    return successResponse({ news })
  } catch (error) {
    await logger.error('Get news error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/news/[id]
 * Update news article (admin/editor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

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

    // Check if news exists
    const existingNews = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    })

    if (!existingNews) {
      return notFoundResponse('الخبر غير موجود')
    }

    const news = await prisma.newsArticle.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(titleEn !== undefined && { titleEn }),
        ...(subjectId && { subjectId }),
        ...(subjectTitle && { subjectTitle }),
        ...(subjectTitleEn !== undefined && { subjectTitleEn }),
        ...(url && { url }),
        ...(status && { status: status === 'published' ? 'published' : 'draft' }),
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
    })

    return successResponse({ news })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update news error', error as Error)
    return errorResponse('حدث خطأ أثناء تحديث الخبر', 500)
  }
}

/**
 * DELETE /api/news/[id]
 * Delete news article (admin/editor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    // Check if news exists
    const existingNews = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    })

    if (!existingNews) {
      return notFoundResponse('الخبر غير موجود')
    }

    await prisma.newsArticle.delete({
      where: { id: params.id },
    })

    return successResponse({ message: 'تم حذف الخبر بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete news error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف الخبر', 500)
  }
}


import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { parseTags, stringifyTags } from '@/lib/utils/json-helpers'

/**
 * GET /api/articles/[id]
 * Get single article by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        material: {
          select: { id: true, title: true, titleEn: true },
        },
      },
    })

    if (!article) {
      return notFoundResponse('المقال غير موجود')
    }

    return successResponse({ article: { ...article, tags: parseTags(article.tags) } })
  } catch (error) {
    await logger.error('Get article error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/articles/[id]
 * Update article (admin/editor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

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

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id },
    })

    if (!existingArticle) {
      return notFoundResponse('المقال غير موجود')
    }

    // If materialId is being changed, verify new material exists
    if (materialId && materialId !== existingArticle.materialId) {
      const material = await prisma.material.findUnique({
        where: { id: materialId },
      })

      if (!material) {
        return errorResponse('المادة المحددة غير موجودة', 404)
      }

      // Update old material's count
      await prisma.material.update({
        where: { id: existingArticle.materialId },
        data: {
          articlesCount: {
            decrement: 1,
          },
        },
      })

      // Update new material's count
      await prisma.material.update({
        where: { id: materialId },
        data: {
          articlesCount: {
            increment: 1,
          },
        },
      })
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...(materialId && { materialId }),
        ...(title && { title }),
        ...(titleEn !== undefined && { titleEn }),
        ...(content && { content }),
        ...(contentEn !== undefined && { contentEn }),
        ...(excerpt !== undefined && { excerpt }),
        ...(excerptEn !== undefined && { excerptEn }),
        ...(author && { author }),
        ...(status && { status: status === 'published' ? 'published' : 'draft' }),
        ...(status === 'published' && publishedAt && { publishedAt: new Date(publishedAt) }),
        ...(status === 'published' && !existingArticle.publishedAt && !publishedAt && { publishedAt: new Date() }),
        ...(tags !== undefined && { tags: stringifyTags(tags) }),
      },
    })

    return successResponse({ article: { ...article, tags: parseTags(article.tags) } })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update article error', error as Error)
    return errorResponse('حدث خطأ أثناء تحديث المقال', 500)
  }
}

/**
 * DELETE /api/articles/[id]
 * Delete article (admin/editor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id },
    })

    if (!existingArticle) {
      return notFoundResponse('المقال غير موجود')
    }

    // Delete article
    await prisma.article.delete({
      where: { id: params.id },
    })

    // Update material's articlesCount
    await prisma.material.update({
      where: { id: existingArticle.materialId },
      data: {
        articlesCount: {
          decrement: 1,
        },
      },
    })

    return successResponse({ message: 'تم حذف المقال بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete article error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف المقال', 500)
  }
}


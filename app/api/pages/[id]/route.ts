import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/pages/[id]
 * Get single page by ID or slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to find by ID first, then by slug
    const page = await prisma.page.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id },
        ],
      },
    })

    if (!page) {
      return notFoundResponse('الصفحة غير موجودة')
    }

    return successResponse({ page })
  } catch (error) {
    await logger.error('Get page error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/pages/[id]
 * Update page (admin/editor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const body = await request.json()
    const {
      slug,
      title,
      titleEn,
      content,
      contentEn,
      metaDescription,
      metaDescriptionEn,
      status,
      order,
    } = body

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id: params.id },
    })

    if (!existingPage) {
      return notFoundResponse('الصفحة غير موجودة')
    }

    // If slug is being changed, check if new slug is available
    if (slug && slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug },
      })

      if (slugExists) {
        return errorResponse('الرابط مستخدم بالفعل', 400)
      }
    }

    const page = await prisma.page.update({
      where: { id: params.id },
      data: {
        ...(slug && { slug }),
        ...(title && { title }),
        ...(titleEn !== undefined && { titleEn }),
        ...(content && { content }),
        ...(contentEn !== undefined && { contentEn }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(metaDescriptionEn !== undefined && { metaDescriptionEn }),
        ...(status && { status: status === 'published' ? 'published' : 'draft' }),
        ...(order !== undefined && { order }),
      },
    })

    return successResponse({ page })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update page error', error as Error)
    return errorResponse('حدث خطأ أثناء تحديث الصفحة', 500)
  }
}

/**
 * DELETE /api/pages/[id]
 * Delete page (admin/editor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id: params.id },
    })

    if (!existingPage) {
      return notFoundResponse('الصفحة غير موجودة')
    }

    await prisma.page.delete({
      where: { id: params.id },
    })

    return successResponse({ message: 'تم حذف الصفحة بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete page error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف الصفحة', 500)
  }
}


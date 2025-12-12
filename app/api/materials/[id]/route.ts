import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/materials/[id]
 * Get single material by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    })

    if (!material) {
      return notFoundResponse('المادة غير موجودة')
    }

    return successResponse({ material })
  } catch (error) {
    await logger.error('Get material error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/materials/[id]
 * Update material (admin/editor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const body = await request.json()
    const { title, titleEn, description, descriptionEn, icon, color } = body

    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id: params.id },
    })

    if (!existingMaterial) {
      return notFoundResponse('المادة غير موجودة')
    }

    const material = await prisma.material.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(titleEn !== undefined && { titleEn }),
        ...(description && { description }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(icon && { icon }),
        ...(color && { color }),
        lastUpdated: new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
    })

    return successResponse({ material })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update material error', error as Error)
    return errorResponse('حدث خطأ أثناء تحديث المادة', 500)
  }
}

/**
 * DELETE /api/materials/[id]
 * Delete material (admin/editor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    })

    if (!existingMaterial) {
      return notFoundResponse('المادة غير موجودة')
    }

    // Check if material has articles
    if (existingMaterial._count.articles > 0) {
      return errorResponse('لا يمكن حذف المادة لأنها تحتوي على مقالات', 400)
    }

    await prisma.material.delete({
      where: { id: params.id },
    })

    return successResponse({ message: 'تم حذف المادة بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete material error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف المادة', 500)
  }
}


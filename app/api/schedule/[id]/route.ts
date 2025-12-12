import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/schedule/[id]
 * Get single schedule item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.scheduleItem.findUnique({
      where: { id: params.id },
    })

    if (!item) {
      return notFoundResponse('عنصر الجدول غير موجود')
    }

    return successResponse({ item })
  } catch (error) {
    await logger.error('Get schedule item error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * DELETE /api/schedule/[id]
 * Delete schedule item (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    // Check if item exists
    const existingItem = await prisma.scheduleItem.findUnique({
      where: { id: params.id },
    })

    if (!existingItem) {
      return notFoundResponse('عنصر الجدول غير موجود')
    }

    await prisma.scheduleItem.delete({
      where: { id: params.id },
    })

    return successResponse({ message: 'تم حذف عنصر الجدول بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete schedule item error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف عنصر الجدول', 500)
  }
}


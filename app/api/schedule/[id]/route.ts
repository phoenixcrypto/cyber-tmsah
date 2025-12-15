import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { requireAdmin } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/schedule/[id]
 * Get single schedule item by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirestoreDB()
    const itemDoc = await db.collection('scheduleItems').doc(params['id']).get()

    if (!itemDoc.exists) {
      return notFoundResponse('عنصر الجدول غير موجود')
    }

    const itemData = itemDoc.data()
    const item = {
      id: itemDoc.id,
      ...itemData,
      // Transform group value for compatibility
      group: itemData?.['group'] === 'Group1' ? 'Group 1' : 'Group 2',
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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireAdmin(request)

    // Handle both Promise and direct params
    const resolvedParams = params instanceof Promise ? await params : params
    const itemId = resolvedParams['id']

    // Validate item ID
    if (!itemId || typeof itemId !== 'string' || itemId.trim() === '') {
      return errorResponse('معرف العنصر غير صالح', 400)
    }

    const db = getFirestoreDB()

    // Check if item exists
    const itemDoc = await db.collection('scheduleItems').doc(itemId).get()
    if (!itemDoc.exists) {
      return notFoundResponse('عنصر الجدول غير موجود')
    }

    // Delete item
    await db.collection('scheduleItems').doc(itemId).delete()

    return successResponse({ message: 'تم حذف عنصر الجدول بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete schedule item error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف عنصر الجدول', 500)
  }
}

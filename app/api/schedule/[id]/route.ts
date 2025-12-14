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
    const itemDoc = await db.collection('scheduleItems').doc(params.id).get()

    if (!itemDoc.exists) {
      return notFoundResponse('عنصر الجدول غير موجود')
    }

    const data = itemDoc.data()!
    return successResponse({
      item: {
        id: itemDoc.id,
        ...data,
        group: data.group === 'Group1' ? 'Group 1' : 'Group 2',
      },
    })
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

    const db = getFirestoreDB()
    const itemDoc = await db.collection('scheduleItems').doc(params.id).get()

    if (!itemDoc.exists) {
      return notFoundResponse('عنصر الجدول غير موجود')
    }

    await db.collection('scheduleItems').doc(params.id).delete()

    return successResponse({ message: 'تم حذف عنصر الجدول بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete schedule item error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف عنصر الجدول', 500)
  }
}

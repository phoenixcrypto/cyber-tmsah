import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { getRequestContext } from '@/lib/middleware/auth'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'
import type { ErrorWithCode } from '@/lib/types'

/**
 * GET /api/schedule
 * Get schedule items, optionally filtered by group
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const context = getRequestContext(request)

  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')

    const db = getFirestoreDB()
    let query: any = db.collection('scheduleItems')

    if (group === 'Group 1' || group === 'Group 2') {
      const groupValue = group === 'Group 1' ? 'Group1' : 'Group2'
      query = query.where('group', '==', groupValue)
    }

    const itemsSnapshot = await query
      .orderBy('day', 'asc')
      .orderBy('time', 'asc')
      .get()

    // Transform enum values back to original format for compatibility
    const transformedItems = itemsSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        group: data['group'] === 'Group1' ? 'Group 1' : 'Group 2',
      }
    })

    return successResponse(
      { items: transformedItems },
      {
        logRequest: true,
        logContext: {
          method: 'GET',
          path: '/api/schedule',
          ipAddress: context.ipAddress,
          ...(context.userAgent && { userAgent: context.userAgent }),
          startTime,
        },
      }
    )
  } catch (error) {
    await logger.error('Get schedule error', error as Error, {
      method: 'GET',
      path: '/api/schedule',
      ipAddress: context.ipAddress,
    })
    return errorResponse(
      'حدث خطأ أثناء جلب البيانات',
      500,
      {
        logRequest: true,
        logContext: {
          method: 'GET',
          path: '/api/schedule',
          ipAddress: context.ipAddress,
          ...(context.userAgent && { userAgent: context.userAgent }),
          startTime,
        },
      }
    )
  }
}

/**
 * POST /api/schedule
 * Create new schedule item (admin only)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const context = getRequestContext(request)

  try {
    const { requireAdmin } = await import('@/lib/middleware/auth')
    const user = await requireAdmin(request)

    const body = await request.json()
    const { title, time, location, instructor, type, group, sectionNumber, day } = body

    // Validate required fields
    if (!title || !time || !location || !instructor || !type || !group || !day) {
      return errorResponse('جميع الحقول مطلوبة', 400, {
        logRequest: true,
        logContext: {
          method: 'POST',
          path: '/api/schedule',
          ipAddress: context.ipAddress,
          ...(context.userAgent && { userAgent: context.userAgent }),
          userId: user.userId,
          startTime,
        },
      })
    }

    const groupValue = group === 'Group 1' ? 'Group1' : 'Group2'
    const typeValue = type === 'lab' ? 'lab' : 'lecture'

    const db = getFirestoreDB()
    const itemRef = db.collection('scheduleItems').doc()
    const itemData = {
      title,
      time,
      location,
      instructor,
      type: typeValue,
      group: groupValue,
      sectionNumber: sectionNumber || null,
      day,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    await itemRef.set(itemData)

    return successResponse(
      { item: { id: itemRef.id, ...itemData, group, type } },
      {
        status: 201,
        logRequest: true,
        logContext: {
          method: 'POST',
          path: '/api/schedule',
          ipAddress: context.ipAddress,
          ...(context.userAgent && { userAgent: context.userAgent }),
          userId: user.userId,
          startTime,
        },
      }
    )
  } catch (error) {
    const err = error as ErrorWithCode
    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401, {
        logRequest: true,
        logContext: {
          method: 'POST',
          path: '/api/schedule',
          ipAddress: context.ipAddress,
          startTime,
        },
      })
    }

    await logger.error('Create schedule error', err as Error, {
      method: 'POST',
      path: '/api/schedule',
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء إنشاء العنصر', 500, {
      logRequest: true,
      logContext: {
        method: 'POST',
        path: '/api/schedule',
        ipAddress: context.ipAddress,
        startTime,
      },
    })
  }
}

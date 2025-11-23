import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { getRequestContext } from '@/lib/middleware/auth'
import { logger } from '@/lib/utils/logger'

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

    let items

    if (group === 'Group 1' || group === 'Group 2') {
      const groupEnum = group === 'Group 1' ? 'Group1' : 'Group2'
      items = await prisma.scheduleItem.findMany({
        where: { group: groupEnum },
        orderBy: [
          { day: 'asc' },
          { time: 'asc' },
        ],
      })
    } else {
      items = await prisma.scheduleItem.findMany({
        orderBy: [
          { day: 'asc' },
          { time: 'asc' },
        ],
      })
    }

    // Transform enum values back to original format for compatibility
    const transformedItems = items.map(item => ({
      ...item,
      group: item.group === 'Group1' ? 'Group 1' : 'Group 2',
      type: item.type,
      day: item.day,
    }))

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

    const groupEnum = group === 'Group 1' ? 'Group1' : 'Group2'
    const typeEnum = type === 'lab' ? 'lab' : 'lecture'

    const item = await prisma.scheduleItem.create({
      data: {
        title,
        time,
        location,
        instructor,
        type: typeEnum,
        group: groupEnum,
        sectionNumber: sectionNumber || null,
        day,
      },
    })

    return successResponse(
      { item: { ...item, group, type } },
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
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
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

    await logger.error('Create schedule error', error as Error, {
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

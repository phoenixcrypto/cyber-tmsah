import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin, getRequestContext } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { z } from 'zod'

const updateScheduleSchema = z.object({
  title: z.string().min(1).optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  instructor: z.string().optional(),
  type: z.enum(['lecture', 'lab']).optional(),
  group: z.enum(['Group 1', 'Group 2']).optional(),
  sectionNumber: z.number().nullable().optional(),
  day: z.enum(['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).optional(),
})

/**
 * PUT /api/admin/schedule/[id]
 * Update schedule item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = getRequestContext(request)

  try {
    const user = await requireAdmin(request)
    const body = await request.json()

    const validationResult = updateScheduleSchema.safeParse(body)
    if (!validationResult.success) {
      return errorResponse('بيانات غير صحيحة', 400)
    }

    const data = validationResult.data
    const updateData: any = {}

    if (data.title) updateData.title = data.title
    if (data.time) updateData.time = data.time
    if (data.location) updateData.location = data.location
    if (data.instructor) updateData.instructor = data.instructor
    if (data.type) updateData.type = data.type === 'lab' ? 'lab' : 'lecture'
    if (data.group) updateData.group = data.group === 'Group 1' ? 'Group1' : 'Group2'
    if (data.sectionNumber !== undefined) updateData.sectionNumber = data.sectionNumber
    if (data.day) updateData.day = data.day

    const item = await prisma.scheduleItem.update({
      where: { id: params.id },
      data: updateData,
    })

    await logger.info('Schedule item updated', {
      itemId: params.id,
      userId: user.userId,
      ipAddress: context.ipAddress,
    })

    return successResponse({
      item: { ...item, group: item.group === 'Group1' ? 'Group 1' : 'Group 2' },
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return notFoundResponse('العنصر غير موجود')
    }

    await logger.error('Update schedule error', error as Error, {
      itemId: params.id,
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء التحديث', 500)
  }
}

/**
 * DELETE /api/admin/schedule/[id]
 * Delete schedule item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const context = getRequestContext(request)

  try {
    const user = await requireAdmin(request)

    await prisma.scheduleItem.delete({
      where: { id: params.id },
    })

    await logger.info('Schedule item deleted', {
      itemId: params.id,
      userId: user.userId,
      ipAddress: context.ipAddress,
    })

    return successResponse({ message: 'تم الحذف بنجاح' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return notFoundResponse('العنصر غير موجود')
    }

    await logger.error('Delete schedule error', error as Error, {
      itemId: params.id,
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء الحذف', 500)
  }
}


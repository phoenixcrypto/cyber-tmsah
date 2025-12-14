import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/downloads/[id]
 * Get single download by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const download = await prisma.downloadSoftware.findUnique({
      where: { id: params.id },
    })

    if (!download) {
      return notFoundResponse('البرنامج غير موجود')
    }

    return successResponse({ download })
  } catch (error) {
    await logger.error('Get download error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/downloads/[id]
 * Update download (admin/editor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const body = await request.json()
    const { name, nameEn, description, descriptionEn, icon, videoUrl, downloadUrl, category } = body

    // Check if download exists
    const existingDownload = await prisma.downloadSoftware.findUnique({
      where: { id: params.id },
    })

    if (!existingDownload) {
      return notFoundResponse('البرنامج غير موجود')
    }

    const download = await prisma.downloadSoftware.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(nameEn !== undefined && { nameEn }),
        ...(description && { description }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(icon && { icon }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(downloadUrl !== undefined && { downloadUrl }),
        ...(category !== undefined && { category }),
      },
    })

    return successResponse({ download })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update download error', error as Error)
    return errorResponse('حدث خطأ أثناء تحديث البرنامج', 500)
  }
}

/**
 * DELETE /api/downloads/[id]
 * Delete download (admin/editor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    // Check if download exists
    const existingDownload = await prisma.downloadSoftware.findUnique({
      where: { id: params.id },
    })

    if (!existingDownload) {
      return notFoundResponse('البرنامج غير موجود')
    }

    await prisma.downloadSoftware.delete({
      where: { id: params.id },
    })

    return successResponse({ message: 'تم حذف البرنامج بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete download error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف البرنامج', 500)
  }
}


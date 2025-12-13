import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import type { ErrorWithCode } from '@/lib/types'

/**
 * GET /api/downloads
 * Get all downloadable software
 */
export async function GET() {
  try {
    const downloads = await prisma.downloadSoftware.findMany({
      orderBy: { name: 'asc' },
    })

    return successResponse({ downloads })
  } catch (error) {
    await logger.error('Get downloads error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * POST /api/downloads
 * Create new download (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
    await requireEditor(request)

    const body = await request.json()
    const { name, nameEn, description, descriptionEn, icon, videoUrl, downloadUrl, category } = body

    if (!name || !description) {
      return errorResponse('الاسم والوصف مطلوبان', 400)
    }

    const download = await prisma.downloadSoftware.create({
      data: {
        name,
        nameEn: nameEn || name,
        description,
        descriptionEn: descriptionEn || description,
        icon: icon || 'Download',
        videoUrl: videoUrl || null,
        downloadUrl: downloadUrl || null,
        category: category || null,
      },
    })

    return successResponse({ download }, { status: 201 })
  } catch (error) {
    const err = error as ErrorWithCode
    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create download error', err as Error)
    return errorResponse('حدث خطأ أثناء إنشاء التحميل', 500)
  }
}

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import type { ErrorWithCode } from '@/lib/types'

/**
 * GET /api/materials
 * Get all materials
 */
export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { title: 'asc' },
      include: {
        articles: {
          where: { status: 'published' },
          select: { id: true },
        },
      },
    })

    // Transform to include articlesCount
    const transformedMaterials = materials.map(material => ({
      ...material,
      articlesCount: material.articles.length,
    }))

    return successResponse({ materials: transformedMaterials })
  } catch (error) {
    await logger.error('Get materials error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * POST /api/materials
 * Create new material (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
    await requireEditor(request)

    const body = await request.json()
    const { title, titleEn, description, descriptionEn, icon, color } = body

    if (!title || !description) {
      return errorResponse('العنوان والوصف مطلوبان', 400)
    }

    const material = await prisma.material.create({
      data: {
        title,
        titleEn: titleEn || title,
        description,
        descriptionEn: descriptionEn || description,
        icon: icon || 'BookOpen',
        color: color || 'from-blue-500 to-blue-600',
        articlesCount: 0,
        lastUpdated: new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
    })

    return successResponse({ material }, { status: 201 })
  } catch (error) {
    const err = error as ErrorWithCode
    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create material error', err as Error)
    return errorResponse('حدث خطأ أثناء إنشاء المادة', 500)
  }
}

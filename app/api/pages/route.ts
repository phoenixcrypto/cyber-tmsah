import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/pages
 * Get all pages (published only for public, all for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { getAuthUser } = await import('@/lib/middleware/auth')
    const user = await getAuthUser(request)

    // If admin, return all. Otherwise, only published
    const where = user?.role === 'admin' ? {} : { status: 'published' as const }

    const pages = await prisma.page.findMany({
      ...(Object.keys(where).length > 0 && { where }),
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return successResponse({ pages })
  } catch (error) {
    await logger.error('Get pages error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * POST /api/pages
 * Create new page (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
    await requireEditor(request)

    const body = await request.json()
    const {
      slug,
      title,
      titleEn,
      content,
      contentEn,
      metaDescription,
      metaDescriptionEn,
      status,
      order,
    } = body

    if (!slug || !title || !content) {
      return errorResponse('الرابط، العنوان، والمحتوى مطلوبون', 400)
    }

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug },
    })

    if (existingPage) {
      return errorResponse('الرابط مستخدم بالفعل', 400)
    }

    const page = await prisma.page.create({
      data: {
        slug,
        title,
        titleEn: titleEn || title,
        content,
        contentEn: contentEn || content,
        metaDescription: metaDescription || null,
        metaDescriptionEn: metaDescriptionEn || metaDescription || null,
        status: status === 'published' ? 'published' : 'draft',
        order: order || 0,
      },
    })

    return successResponse({ page }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create page error', error as Error)
    return errorResponse('حدث خطأ أثناء إنشاء الصفحة', 500)
  }
}


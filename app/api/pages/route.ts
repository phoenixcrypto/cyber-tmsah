import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * GET /api/pages
 * Get all pages (published only for public, all for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { getAuthUser } = await import('@/lib/middleware/auth')
    const user = await getAuthUser(request)

    const db = getFirestoreDB()
    let query: any = db.collection('pages')

    // If not admin, filter by published status
    if (user?.role !== 'admin') {
      query = query.where('status', '==', 'published')
    }

    const pagesSnapshot = await query
      .orderBy('order', 'asc')
      .orderBy('createdAt', 'desc')
      .get()

    const pages = pagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

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

    const db = getFirestoreDB()

    // Check if slug already exists
    const existingPageSnapshot = await db.collection('pages')
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (!existingPageSnapshot.empty) {
      return errorResponse('الرابط مستخدم بالفعل', 400)
    }

    const pageRef = db.collection('pages').doc()
    const pageData = {
      slug,
      title,
      titleEn: titleEn || title,
      content,
      contentEn: contentEn || content,
      metaDescription: metaDescription || null,
      metaDescriptionEn: metaDescriptionEn || metaDescription || null,
      status: status === 'published' ? 'published' : 'draft',
      order: order || 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    await pageRef.set(pageData)

    const page = {
      id: pageRef.id,
      ...pageData,
    }

    return successResponse({ page }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create page error', error as Error)
    return errorResponse('حدث خطأ أثناء إنشاء الصفحة', 500)
  }
}

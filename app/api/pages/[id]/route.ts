import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * GET /api/pages/[id]
 * Get single page by ID or slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirestoreDB()
    
    // Try to find by ID first
    const pageDoc = await db.collection('pages').doc(params.id).get()
    
    if (pageDoc.exists) {
      return successResponse({
        page: {
          id: pageDoc.id,
          ...pageDoc.data(),
        },
      })
    }

    // Try to find by slug
    const slugSnapshot = await db.collection('pages')
      .where('slug', '==', params.id)
      .limit(1)
      .get()

    if (slugSnapshot.empty) {
      return notFoundResponse('الصفحة غير موجودة')
    }

    const pageDoc2 = slugSnapshot.docs[0]
    return successResponse({
      page: {
        id: pageDoc2.id,
        ...pageDoc2.data(),
      },
    })
  } catch (error) {
    await logger.error('Get page error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/pages/[id]
 * Update page (admin/editor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const db = getFirestoreDB()
    const pageDoc = await db.collection('pages').doc(params.id).get()

    if (!pageDoc.exists) {
      return notFoundResponse('الصفحة غير موجودة')
    }

    const existingData = pageDoc.data()!

    // If slug is being changed, check if new slug is available
    if (slug && slug !== existingData.slug) {
      const slugSnapshot = await db.collection('pages')
        .where('slug', '==', slug)
        .limit(1)
        .get()

      if (!slugSnapshot.empty) {
        return errorResponse('الرابط مستخدم بالفعل', 400)
      }
    }

    const updateData: any = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (slug) updateData.slug = slug
    if (title) updateData.title = title
    if (titleEn !== undefined) updateData.titleEn = titleEn
    if (content) updateData.content = content
    if (contentEn !== undefined) updateData.contentEn = contentEn
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription
    if (metaDescriptionEn !== undefined) updateData.metaDescriptionEn = metaDescriptionEn
    if (status) updateData.status = status === 'published' ? 'published' : 'draft'
    if (order !== undefined) updateData.order = order

    await db.collection('pages').doc(params.id).update(updateData)

    const updatedDoc = await db.collection('pages').doc(params.id).get()

    return successResponse({
      page: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update page error', error as Error)
    return errorResponse('حدث خطأ أثناء تحديث الصفحة', 500)
  }
}

/**
 * DELETE /api/pages/[id]
 * Delete page (admin/editor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const db = getFirestoreDB()
    const pageDoc = await db.collection('pages').doc(params.id).get()

    if (!pageDoc.exists) {
      return notFoundResponse('الصفحة غير موجودة')
    }

    await db.collection('pages').doc(params.id).delete()

    return successResponse({ message: 'تم حذف الصفحة بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete page error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف الصفحة', 500)
  }
}

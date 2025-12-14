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
    const pageId = params['id']

    // Try to find by ID first
    let pageDoc = await db.collection('pages').doc(pageId).get()

    // If not found by ID, try to find by slug
    if (!pageDoc.exists) {
      const pagesBySlug = await db.collection('pages')
        .where('slug', '==', pageId)
        .limit(1)
        .get()

      if (!pagesBySlug.empty && pagesBySlug.docs.length > 0) {
        const slugDoc = pagesBySlug.docs[0]
        if (slugDoc) {
          // Create a new document reference for consistency
          pageDoc = await db.collection('pages').doc(slugDoc.id).get()
        }
      }
    }

    if (!pageDoc.exists) {
      return notFoundResponse('الصفحة غير موجودة')
    }

    const page = {
      id: pageDoc.id,
      ...pageDoc.data(),
    }

    return successResponse({ page })
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

    // Check if page exists
    const pageDoc = await db.collection('pages').doc(params['id']).get()
    if (!pageDoc.exists) {
      return notFoundResponse('الصفحة غير موجودة')
    }

    const existingPage = pageDoc.data()

    // If slug is being changed, check if new slug is available
    if (slug && slug !== existingPage?.['slug']) {
      const slugExistsSnapshot = await db.collection('pages')
        .where('slug', '==', slug)
        .limit(1)
        .get()

      if (!slugExistsSnapshot.empty) {
        return errorResponse('الرابط مستخدم بالفعل', 400)
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (slug) updateData['slug'] = slug
    if (title) updateData['title'] = title
    if (titleEn !== undefined) updateData['titleEn'] = titleEn
    if (content) updateData['content'] = content
    if (contentEn !== undefined) updateData['contentEn'] = contentEn
    if (metaDescription !== undefined) updateData['metaDescription'] = metaDescription
    if (metaDescriptionEn !== undefined) updateData['metaDescriptionEn'] = metaDescriptionEn
    if (status) updateData['status'] = status === 'published' ? 'published' : 'draft'
    if (order !== undefined) updateData['order'] = order

    await db.collection('pages').doc(params['id']).update(updateData)

    // Get updated page
    const updatedPageDoc = await db.collection('pages').doc(params['id']).get()
    const page = {
      id: updatedPageDoc.id,
      ...updatedPageDoc.data(),
    }

    return successResponse({ page })
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

    // Check if page exists
    const pageDoc = await db.collection('pages').doc(params['id']).get()
    if (!pageDoc.exists) {
      return notFoundResponse('الصفحة غير موجودة')
    }

    // Delete page
    await db.collection('pages').doc(params['id']).delete()

    return successResponse({ message: 'تم حذف الصفحة بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete page error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف الصفحة', 500)
  }
}

import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * GET /api/news/[id]
 * Get single news article by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirestoreDB()
    const newsDoc = await db.collection('news').doc(params['id']).get()

    if (!newsDoc.exists) {
      return notFoundResponse('الخبر غير موجود')
    }

    const news = {
      id: newsDoc.id,
      ...newsDoc.data(),
    }

    return successResponse({ news })
  } catch (error) {
    await logger.error('Get news error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/news/[id]
 * Update news article (admin/editor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const body = await request.json()
    const {
      title,
      titleEn,
      subjectId,
      subjectTitle,
      subjectTitleEn,
      url,
      status,
      publishedAt,
    } = body

    const db = getFirestoreDB()

    // Check if news exists
    const newsDoc = await db.collection('news').doc(params['id']).get()
    if (!newsDoc.exists) {
      return notFoundResponse('الخبر غير موجود')
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (title) updateData['title'] = title
    if (titleEn !== undefined) updateData['titleEn'] = titleEn
    if (subjectId) updateData['subjectId'] = subjectId
    if (subjectTitle) updateData['subjectTitle'] = subjectTitle
    if (subjectTitleEn !== undefined) updateData['subjectTitleEn'] = subjectTitleEn
    if (url) updateData['url'] = url
    if (status) updateData['status'] = status === 'published' ? 'published' : 'draft'
    if (publishedAt) updateData['publishedAt'] = new Date(publishedAt)

    await db.collection('news').doc(params['id']).update(updateData)

    // Get updated news
    const updatedNewsDoc = await db.collection('news').doc(params['id']).get()
    const news = {
      id: updatedNewsDoc.id,
      ...updatedNewsDoc.data(),
    }

    return successResponse({ news })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update news error', error as Error)
    return errorResponse('حدث خطأ أثناء تحديث الخبر', 500)
  }
}

/**
 * DELETE /api/news/[id]
 * Delete news article (admin/editor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const db = getFirestoreDB()

    // Check if news exists
    const newsDoc = await db.collection('news').doc(params['id']).get()
    if (!newsDoc.exists) {
      return notFoundResponse('الخبر غير موجود')
    }

    // Delete news
    await db.collection('news').doc(params['id']).delete()

    return successResponse({ message: 'تم حذف الخبر بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete news error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف الخبر', 500)
  }
}

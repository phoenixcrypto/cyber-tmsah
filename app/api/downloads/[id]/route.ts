import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * GET /api/downloads/[id]
 * Get single download by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirestoreDB()
    const downloadDoc = await db.collection('downloads').doc(params.id).get()

    if (!downloadDoc.exists) {
      return notFoundResponse('البرنامج غير موجود')
    }

    return successResponse({
      download: {
        id: downloadDoc.id,
        ...downloadDoc.data(),
      },
    })
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

    const db = getFirestoreDB()
    const downloadDoc = await db.collection('downloads').doc(params.id).get()

    if (!downloadDoc.exists) {
      return notFoundResponse('البرنامج غير موجود')
    }

    const updateData: any = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (name) updateData.name = name
    if (nameEn !== undefined) updateData.nameEn = nameEn
    if (description) updateData.description = description
    if (descriptionEn !== undefined) updateData.descriptionEn = descriptionEn
    if (icon) updateData.icon = icon
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl
    if (downloadUrl !== undefined) updateData.downloadUrl = downloadUrl
    if (category !== undefined) updateData.category = category

    await db.collection('downloads').doc(params.id).update(updateData)

    const updatedDoc = await db.collection('downloads').doc(params.id).get()

    return successResponse({
      download: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    })
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

    const db = getFirestoreDB()
    const downloadDoc = await db.collection('downloads').doc(params.id).get()

    if (!downloadDoc.exists) {
      return notFoundResponse('البرنامج غير موجود')
    }

    await db.collection('downloads').doc(params.id).delete()

    return successResponse({ message: 'تم حذف البرنامج بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete download error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف البرنامج', 500)
  }
}

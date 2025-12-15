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
    const downloadDoc = await db.collection('downloads').doc(params['id']).get()

    if (!downloadDoc.exists) {
      return notFoundResponse('البرنامج غير موجود')
    }

    const download = {
      id: downloadDoc.id,
      ...downloadDoc.data(),
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

    const db = getFirestoreDB()

    // Check if download exists
    const downloadDoc = await db.collection('downloads').doc(params['id']).get()
    if (!downloadDoc.exists) {
      return notFoundResponse('البرنامج غير موجود')
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (name) updateData['name'] = name
    if (nameEn !== undefined) updateData['nameEn'] = nameEn
    if (description) updateData['description'] = description
    if (descriptionEn !== undefined) updateData['descriptionEn'] = descriptionEn
    if (icon) updateData['icon'] = icon
    if (videoUrl !== undefined) updateData['videoUrl'] = videoUrl
    if (downloadUrl !== undefined) updateData['downloadUrl'] = downloadUrl
    if (category !== undefined) updateData['category'] = category

    await db.collection('downloads').doc(params['id']).update(updateData)

    // Get updated download
    const updatedDownloadDoc = await db.collection('downloads').doc(params['id']).get()
    const download = {
      id: updatedDownloadDoc.id,
      ...updatedDownloadDoc.data(),
    }

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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireEditor(request)

    // Handle both Promise and direct params
    const resolvedParams = params instanceof Promise ? await params : params
    const downloadId = resolvedParams['id']

    // Validate download ID
    if (!downloadId || typeof downloadId !== 'string' || downloadId.trim() === '') {
      return errorResponse('معرف البرنامج غير صالح', 400)
    }

    const db = getFirestoreDB()

    // Check if download exists
    const downloadDoc = await db.collection('downloads').doc(downloadId).get()
    if (!downloadDoc.exists) {
      return notFoundResponse('البرنامج غير موجود')
    }

    // Delete download
    await db.collection('downloads').doc(downloadId).delete()

    return successResponse({ message: 'تم حذف البرنامج بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete download error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف البرنامج', 500)
  }
}

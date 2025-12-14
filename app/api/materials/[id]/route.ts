import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * GET /api/materials/[id]
 * Get single material by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirestoreDB()
    const materialDoc = await db.collection('materials').doc(params['id']).get()

    if (!materialDoc.exists) {
      return notFoundResponse('المادة غير موجودة')
    }

    // Get articles count
    const articlesSnapshot = await db.collection('articles')
      .where('materialId', '==', params['id'])
      .get()

    const materialData = materialDoc.data()
    const material = {
      id: materialDoc.id,
      ...materialData,
      articlesCount: articlesSnapshot.size,
    }

    return successResponse({ material })
  } catch (error) {
    await logger.error('Get material error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/materials/[id]
 * Update material (admin/editor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const body = await request.json()
    const { title, titleEn, description, descriptionEn, icon, color } = body

    const db = getFirestoreDB()

    // Check if material exists
    const materialDoc = await db.collection('materials').doc(params['id']).get()
    if (!materialDoc.exists) {
      return notFoundResponse('المادة غير موجودة')
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      lastUpdated: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (title) updateData['title'] = title
    if (titleEn !== undefined) updateData['titleEn'] = titleEn
    if (description) updateData['description'] = description
    if (descriptionEn !== undefined) updateData['descriptionEn'] = descriptionEn
    if (icon) updateData['icon'] = icon
    if (color) updateData['color'] = color

    await db.collection('materials').doc(params['id']).update(updateData)

    // Get updated material
    const updatedMaterialDoc = await db.collection('materials').doc(params['id']).get()
    const materialData = updatedMaterialDoc.data()

    // Get articles count
    const articlesSnapshot = await db.collection('articles')
      .where('materialId', '==', params['id'])
      .get()

    const material = {
      id: updatedMaterialDoc.id,
      ...materialData,
      articlesCount: articlesSnapshot.size,
    }

    return successResponse({ material })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update material error', error as Error)
    return errorResponse('حدث خطأ أثناء تحديث المادة', 500)
  }
}

/**
 * DELETE /api/materials/[id]
 * Delete material (admin/editor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const db = getFirestoreDB()

    // Check if material exists
    const materialDoc = await db.collection('materials').doc(params['id']).get()
    if (!materialDoc.exists) {
      return notFoundResponse('المادة غير موجودة')
    }

    // Check if material has articles
    const articlesSnapshot = await db.collection('articles')
      .where('materialId', '==', params['id'])
      .limit(1)
      .get()

    if (!articlesSnapshot.empty) {
      return errorResponse('لا يمكن حذف المادة لأنها تحتوي على مقالات', 400)
    }

    // Delete material
    await db.collection('materials').doc(params['id']).delete()

    return successResponse({ message: 'تم حذف المادة بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete material error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف المادة', 500)
  }
}

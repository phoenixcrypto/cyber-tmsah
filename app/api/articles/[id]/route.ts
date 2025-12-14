import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { requireEditor } from '@/lib/middleware/auth'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { parseTags, stringifyTags } from '@/lib/utils/json-helpers'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * GET /api/articles/[id]
 * Get single article by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirestoreDB()
    const articleDoc = await db.collection('articles').doc(params.id).get()

    if (!articleDoc.exists) {
      return notFoundResponse('المقال غير موجود')
    }

    const data = articleDoc.data()!
    const materialId = data['materialId']

    // Get material data
    let material = null
    if (materialId) {
      const materialDoc = await db.collection('materials').doc(materialId).get()
      if (materialDoc.exists) {
        const materialData = materialDoc.data()!
        material = {
          id: materialId,
          title: materialData['title'],
          titleEn: materialData['titleEn'],
        }
      }
    }

    return successResponse({
      article: {
        id: articleDoc.id,
        ...data,
        material,
        tags: parseTags(data['tags'] || '[]'),
      },
    })
  } catch (error) {
    await logger.error('Get article error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/articles/[id]
 * Update article (admin/editor only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const body = await request.json()
    const {
      materialId,
      title,
      titleEn,
      content,
      contentEn,
      excerpt,
      excerptEn,
      author,
      status,
      publishedAt,
      tags,
    } = body

    const db = getFirestoreDB()
    const articleDoc = await db.collection('articles').doc(params.id).get()

    if (!articleDoc.exists) {
      return notFoundResponse('المقال غير موجود')
    }

    const existingData = articleDoc.data()!
    const updateData: any = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    // If materialId is being changed, verify new material exists
    if (materialId && materialId !== existingData['materialId']) {
      const materialDoc = await db.collection('materials').doc(materialId).get()
      if (!materialDoc.exists) {
        return errorResponse('المادة المحددة غير موجودة', 404)
      }

      // Update old material's count
      const oldArticlesSnapshot = await db.collection('articles')
        .where('materialId', '==', existingData['materialId'])
        .where('status', '==', 'published')
        .get()
      await db.collection('materials').doc(existingData['materialId']).update({
        articlesCount: oldArticlesSnapshot.size,
      })

      // Update new material's count
      const newArticlesSnapshot = await db.collection('articles')
        .where('materialId', '==', materialId)
        .where('status', '==', 'published')
        .get()
      await db.collection('materials').doc(materialId).update({
        articlesCount: newArticlesSnapshot.size + (status === 'published' ? 1 : 0),
      })

      updateData.materialId = materialId
    }

    if (title) updateData.title = title
    if (titleEn !== undefined) updateData.titleEn = titleEn
    if (content) updateData.content = content
    if (contentEn !== undefined) updateData.contentEn = contentEn
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (excerptEn !== undefined) updateData.excerptEn = excerptEn
    if (author) updateData.author = author
    if (status) updateData.status = status === 'published' ? 'published' : 'draft'
    if (status === 'published' && publishedAt) {
      updateData.publishedAt = new Date(publishedAt)
    } else if (status === 'published' && !existingData['publishedAt'] && !publishedAt) {
      updateData.publishedAt = new Date()
    }
    if (tags !== undefined) updateData.tags = stringifyTags(tags)

    await db.collection('articles').doc(params.id).update(updateData)

    const updatedDoc = await db.collection('articles').doc(params.id).get()
    const updatedData = updatedDoc.data()!

    return successResponse({
      article: {
        id: updatedDoc.id,
        ...updatedData,
        tags: parseTags(updatedData['tags'] || '[]'),
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update article error', error as Error)
    return errorResponse('حدث خطأ أثناء تحديث المقال', 500)
  }
}

/**
 * DELETE /api/articles/[id]
 * Delete article (admin/editor only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireEditor(request)

    const db = getFirestoreDB()
    const articleDoc = await db.collection('articles').doc(params.id).get()

    if (!articleDoc.exists) {
      return notFoundResponse('المقال غير موجود')
    }

    const data = articleDoc.data()!

    // Delete article
    await db.collection('articles').doc(params.id).delete()

    // Update material's articlesCount
    const articlesSnapshot = await db.collection('articles')
      .where('materialId', '==', data['materialId'])
      .where('status', '==', 'published')
      .get()

    await db.collection('materials').doc(data['materialId']).update({
      articlesCount: articlesSnapshot.size,
      updatedAt: FieldValue.serverTimestamp(),
    })

    return successResponse({ message: 'تم حذف المقال بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete article error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف المقال', 500)
  }
}

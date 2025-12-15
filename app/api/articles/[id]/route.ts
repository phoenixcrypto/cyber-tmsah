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
    const articleDoc = await db.collection('articles').doc(params['id']).get()

    if (!articleDoc.exists) {
      return notFoundResponse('المقال غير موجود')
    }

    const articleData = articleDoc.data()
    const materialId = articleData?.['materialId'] as string

    // Get material info
    let material = null
    if (materialId) {
      const materialDoc = await db.collection('materials').doc(materialId).get()
      if (materialDoc.exists) {
        const materialData = materialDoc.data()
        material = {
          id: materialDoc.id,
          title: materialData?.['title'],
          titleEn: materialData?.['titleEn'],
        }
      }
    }

    const article = {
      id: articleDoc.id,
      ...articleData,
      tags: parseTags(articleData?.['tags']),
      material,
    }

    return successResponse({ article })
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

    // Check if article exists
    const articleDoc = await db.collection('articles').doc(params['id']).get()
    if (!articleDoc.exists) {
      return notFoundResponse('المقال غير موجود')
    }

    const existingArticle = articleDoc.data()
    const existingMaterialId = existingArticle?.['materialId'] as string

    // If materialId is being changed, verify new material exists
    if (materialId && materialId !== existingMaterialId) {
      const newMaterialDoc = await db.collection('materials').doc(materialId).get()
      if (!newMaterialDoc.exists) {
        return errorResponse('المادة المحددة غير موجودة', 404)
      }

      // Update old material's count
      if (existingMaterialId) {
        const oldMaterialDoc = await db.collection('materials').doc(existingMaterialId).get()
        if (oldMaterialDoc.exists) {
          const oldMaterialData = oldMaterialDoc.data()
          const oldCount = (oldMaterialData?.['articlesCount'] as number) || 0
          await db.collection('materials').doc(existingMaterialId).update({
            articlesCount: Math.max(0, oldCount - 1),
            updatedAt: FieldValue.serverTimestamp(),
          })
        }
      }

      // Update new material's count
      const newMaterialData = newMaterialDoc.data()
      const newCount = (newMaterialData?.['articlesCount'] as number) || 0
      await db.collection('materials').doc(materialId).update({
        articlesCount: newCount + 1,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (materialId) updateData['materialId'] = materialId
    if (title) updateData['title'] = title
    if (titleEn !== undefined) updateData['titleEn'] = titleEn
    if (content) updateData['content'] = content
    if (contentEn !== undefined) updateData['contentEn'] = contentEn
    if (excerpt !== undefined) updateData['excerpt'] = excerpt
    if (excerptEn !== undefined) updateData['excerptEn'] = excerptEn
    if (author) updateData['author'] = author
    if (status) updateData['status'] = status === 'published' ? 'published' : 'draft'
    if (status === 'published' && publishedAt) updateData['publishedAt'] = new Date(publishedAt)
    if (status === 'published' && !existingArticle?.['publishedAt'] && !publishedAt) {
      updateData['publishedAt'] = new Date()
    }
    if (tags !== undefined) updateData['tags'] = stringifyTags(tags)

    await db.collection('articles').doc(params['id']).update(updateData)

    // Get updated article
    const updatedArticleDoc = await db.collection('articles').doc(params['id']).get()
    const updatedArticleData = updatedArticleDoc.data()

    const article = {
      id: updatedArticleDoc.id,
      ...updatedArticleData,
      tags: parseTags(updatedArticleData?.['tags']),
    }

    return successResponse({ article })
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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await requireEditor(request)

    // Handle both Promise and direct params
    const resolvedParams = params instanceof Promise ? await params : params
    const articleId = resolvedParams['id']

    // Validate article ID
    if (!articleId || typeof articleId !== 'string' || articleId.trim() === '') {
      return errorResponse('معرف المقال غير صالح', 400)
    }

    const db = getFirestoreDB()

    // Check if article exists
    const articleDoc = await db.collection('articles').doc(articleId).get()
    if (!articleDoc.exists) {
      return notFoundResponse('المقال غير موجود')
    }

    const articleData = articleDoc.data()
    const materialId = articleData?.['materialId'] as string

    // Delete article
    await db.collection('articles').doc(articleId).delete()

    // Update material's articlesCount
    if (materialId) {
      const materialDoc = await db.collection('materials').doc(materialId).get()
      if (materialDoc.exists) {
        const materialData = materialDoc.data()
        const currentCount = (materialData?.['articlesCount'] as number) || 0
        await db.collection('materials').doc(materialId).update({
          articlesCount: Math.max(0, currentCount - 1),
          updatedAt: FieldValue.serverTimestamp(),
        })
      }
    }

    return successResponse({ message: 'تم حذف المقال بنجاح' })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Delete article error', error as Error)
    return errorResponse('حدث خطأ أثناء حذف المقال', 500)
  }
}

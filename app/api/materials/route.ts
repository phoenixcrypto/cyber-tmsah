import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'
import type { ErrorWithCode } from '@/lib/types'

/**
 * GET /api/materials
 * Get all materials
 */
export async function GET() {
  try {
    const db = getFirestoreDB()
    const materialsSnapshot = await db.collection('materials')
      .orderBy('title', 'asc')
      .get()

    const materials = await Promise.all(
      materialsSnapshot.docs.map(async (doc) => {
        const data = doc.data()
        const materialId = doc.id

        // Get published articles count
        const articlesSnapshot = await db.collection('articles')
          .where('materialId', '==', materialId)
          .where('status', '==', 'published')
          .get()

        return {
          id: materialId,
          ...data,
          articlesCount: articlesSnapshot.size,
        }
      })
    )

    return successResponse({ materials })
  } catch (error) {
    await logger.error('Get materials error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * POST /api/materials
 * Create new material (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
    await requireEditor(request)

    const body = await request.json()
    const { title, titleEn, description, descriptionEn, icon, color } = body

    if (!title || !description) {
      return errorResponse('العنوان والوصف مطلوبان', 400)
    }

    const db = getFirestoreDB()
    const materialRef = db.collection('materials').doc()

    const materialData = {
      title,
      titleEn: titleEn || title,
      description,
      descriptionEn: descriptionEn || description,
      icon: icon || 'BookOpen',
      color: color || 'from-blue-500 to-blue-600',
      articlesCount: 0,
      lastUpdated: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    await materialRef.set(materialData)

    const material = {
      id: materialRef.id,
      ...materialData,
    }

    return successResponse({ material }, { status: 201 })
  } catch (error) {
    const err = error as ErrorWithCode
    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create material error', err as Error)
    return errorResponse('حدث خطأ أثناء إنشاء المادة', 500)
  }
}

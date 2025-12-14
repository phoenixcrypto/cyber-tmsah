import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'
import type { ErrorWithCode } from '@/lib/types'

/**
 * GET /api/news
 * Get all news articles (published only for public, all for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { getAuthUser } = await import('@/lib/middleware/auth')
    const user = await getAuthUser(request)

    const db = getFirestoreDB()
    let query: any = db.collection('news').orderBy('publishedAt', 'desc')

    // If not admin, filter by published status
    if (user?.role !== 'admin') {
      query = query.where('status', '==', 'published')
    }

    const newsSnapshot = await query.get()

    const news = newsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return successResponse({ news })
  } catch (error) {
    await logger.error('Get news error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * POST /api/news
 * Create new news article (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
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

    if (!title || !subjectId || !subjectTitle || !url) {
      return errorResponse('جميع الحقول المطلوبة غير مكتملة', 400)
    }

    const db = getFirestoreDB()
    const newsRef = db.collection('news').doc()
    const newsData = {
      title,
      titleEn: titleEn || title,
      subjectId,
      subjectTitle,
      subjectTitleEn: subjectTitleEn || subjectTitle,
      url,
      status: status === 'published' ? 'published' : 'draft',
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    await newsRef.set(newsData)

    const news = {
      id: newsRef.id,
      ...newsData,
    }

    return successResponse({ news }, { status: 201 })
  } catch (error) {
    const err = error as ErrorWithCode
    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create news error', err as Error)
    return errorResponse('حدث خطأ أثناء إنشاء الخبر', 500)
  }
}

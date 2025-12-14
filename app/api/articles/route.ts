import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { parseTags, stringifyTags } from '@/lib/utils/json-helpers'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * GET /api/articles
 * Get all articles (published only for public, all for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { getAuthUser } = await import('@/lib/middleware/auth')
    const user = await getAuthUser(request)

    const db = getFirestoreDB()
    let query: any = db.collection('articles').orderBy('updatedAt', 'desc')

    // If not admin, filter by published status
    if (user?.role !== 'admin') {
      query = query.where('status', '==', 'published')
    }

    const articlesSnapshot = await query.get()

    // Get materials for articles
    const materialsMap = new Map()
    const materialIds = new Set<string>()
    
    articlesSnapshot.docs.forEach((doc: { data: () => Record<string, unknown> }) => {
      const data = doc.data()
      const materialId = data['materialId'] as string
      if (materialId) {
        materialIds.add(materialId)
      }
    })

    // Fetch materials
    if (materialIds.size > 0) {
      const materialsSnapshot = await db.collection('materials')
        .where('__name__', 'in', Array.from(materialIds))
        .get()
      
      materialsSnapshot.docs.forEach((doc: { id: string; data: () => Record<string, unknown> }) => {
        materialsMap.set(doc.id, {
          id: doc.id,
          title: doc.data()['title'],
          titleEn: doc.data()['titleEn'],
        })
      })
    }

    // Transform articles with material info
    const articles = articlesSnapshot.docs.map((doc: { id: string; data: () => Record<string, unknown> }) => {
      const data = doc.data()
      const materialId = data['materialId'] as string
      const material = materialId ? materialsMap.get(materialId) : null

      return {
        id: doc.id,
        ...data,
        tags: parseTags(data['tags']),
        material: material || null,
      }
    })

    return successResponse({ articles })
  } catch (error) {
    await logger.error('Get articles error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * POST /api/articles
 * Create new article (admin/editor only)
 */
export async function POST(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
    const user = await requireEditor(request)

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

    if (!materialId || !title || !content || !author) {
      return errorResponse('المادة، العنوان، المحتوى، والمؤلف مطلوبون', 400)
    }

    const db = getFirestoreDB()

    // Verify material exists
    const materialDoc = await db.collection('materials').doc(materialId).get()
    if (!materialDoc.exists) {
      return errorResponse('المادة المحددة غير موجودة', 404)
    }

    // Get user name from Firestore if author is not provided
    let authorName = author
    if (!authorName) {
      const userDoc = await db.collection('users').doc(user.userId).get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        authorName = (userData?.['name'] as string) || user.email
      } else {
        authorName = user.email
      }
    }

    // Create article
    const articleRef = db.collection('articles').doc()
    const articleData = {
      materialId,
      title,
      titleEn: titleEn || title,
      content,
      contentEn: contentEn || content,
      excerpt: excerpt || null,
      excerptEn: excerptEn || excerpt || null,
      author: authorName,
      status: status === 'published' ? 'published' : 'draft',
      publishedAt: status === 'published' && publishedAt ? new Date(publishedAt) : status === 'published' ? new Date() : null,
      tags: stringifyTags(tags || []),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    await articleRef.set(articleData)

    // Update material's articlesCount
    const materialData = materialDoc.data()
    const currentCount = (materialData?.['articlesCount'] as number) || 0
    await db.collection('materials').doc(materialId).update({
      articlesCount: currentCount + 1,
      lastUpdated: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const article = {
      id: articleRef.id,
      ...articleData,
      tags: parseTags(articleData.tags),
    }

    return successResponse({ article }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message.includes('Forbidden'))) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Create article error', error as Error)
    return errorResponse('حدث خطأ أثناء إنشاء المقال', 500)
  }
}

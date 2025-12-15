import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'
import type { ErrorWithCode } from '@/lib/types'

/**
 * GET /api/pages/legal?type=privacy|terms
 * Get legal page content (privacy or terms)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'privacy'

    if (type !== 'privacy' && type !== 'terms') {
      return errorResponse('نوع الصفحة غير صحيح', 400)
    }

    const db = getFirestoreDB()
    const legalDoc = await db.collection('sitePages').doc(type).get()
    
    if (!legalDoc.exists) {
      return successResponse({
        page: {
          id: type,
          title: type === 'privacy' ? 'سياسة الخصوصية' : 'اتفاقية الاستخدام',
          description: '',
          sections: [],
        }
      })
    }

    const data = legalDoc.data()
    return successResponse({ page: { id: type, ...data } })
  } catch (error) {
    await logger.error('Get legal page error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/pages/legal?type=privacy|terms
 * Update legal page content (admin/editor only)
 */
export async function PUT(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
    await requireEditor(request)

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'privacy'

    if (type !== 'privacy' && type !== 'terms') {
      return errorResponse('نوع الصفحة غير صحيح', 400)
    }

    const body = await request.json()
    const { title, description, sections } = body

    const db = getFirestoreDB()
    const legalRef = db.collection('sitePages').doc(type)
    
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (title) updateData['title'] = title
    if (description) updateData['description'] = description
    if (sections) updateData['sections'] = sections

    await legalRef.set(updateData, { merge: true })

    const updatedDoc = await legalRef.get()
    return successResponse({ page: { id: type, ...updatedDoc.data() } })
  } catch (error) {
    const err = error as ErrorWithCode
    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update legal page error', err as Error)
    return errorResponse('حدث خطأ أثناء تحديث البيانات', 500)
  }
}


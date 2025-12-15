import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'
import type { ErrorWithCode } from '@/lib/types'

/**
 * GET /api/pages/about
 * Get about page content including cards
 */
export async function GET() {
  try {
    const db = getFirestoreDB()
    const aboutDoc = await db.collection('sitePages').doc('about').get()
    
    if (!aboutDoc.exists) {
      // Return default structure
      return successResponse({
        page: {
          id: 'about',
          title: 'من نحن',
          description: 'تعرف على منصة سايبر تمساح',
          cards: [],
          sections: [],
        }
      })
    }

    const data = aboutDoc.data()
    return successResponse({ page: { id: 'about', ...data } })
  } catch (error) {
    await logger.error('Get about page error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/pages/about
 * Update about page content (admin/editor only)
 */
export async function PUT(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
    await requireEditor(request)

    const body = await request.json()
    const { title, description, cards, sections } = body

    const db = getFirestoreDB()
    const aboutRef = db.collection('sitePages').doc('about')
    
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (title) updateData['title'] = title
    if (description) updateData['description'] = description
    if (cards) updateData['cards'] = cards
    if (sections) updateData['sections'] = sections

    await aboutRef.set(updateData, { merge: true })

    const updatedDoc = await aboutRef.get()
    return successResponse({ page: { id: 'about', ...updatedDoc.data() } })
  } catch (error) {
    const err = error as ErrorWithCode
    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update about page error', err as Error)
    return errorResponse('حدث خطأ أثناء تحديث البيانات', 500)
  }
}


import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { FieldValue } from 'firebase-admin/firestore'
import type { ErrorWithCode } from '@/lib/types'

/**
 * GET /api/pages/contact
 * Get contact page content
 */
export async function GET() {
  try {
    const db = getFirestoreDB()
    const contactDoc = await db.collection('sitePages').doc('contact').get()
    
    if (!contactDoc.exists) {
      return successResponse({
        page: {
          id: 'contact',
          title: 'اتصل بنا',
          description: 'نحن هنا لمساعدتك',
          contactMethods: [],
          formSettings: {},
        }
      })
    }

    const data = contactDoc.data()
    return successResponse({ page: { id: 'contact', ...data } })
  } catch (error) {
    await logger.error('Get contact page error', error as Error)
    return errorResponse('حدث خطأ أثناء جلب البيانات', 500)
  }
}

/**
 * PUT /api/pages/contact
 * Update contact page content (admin/editor only)
 */
export async function PUT(request: NextRequest) {
  try {
    const { requireEditor } = await import('@/lib/middleware/auth')
    await requireEditor(request)

    const body = await request.json()
    const { title, description, contactMethods, formSettings } = body

    const db = getFirestoreDB()
    const contactRef = db.collection('sitePages').doc('contact')
    
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (title) updateData['title'] = title
    if (description) updateData['description'] = description
    if (contactMethods) updateData['contactMethods'] = contactMethods
    if (formSettings) updateData['formSettings'] = formSettings

    await contactRef.set(updateData, { merge: true })

    const updatedDoc = await contactRef.get()
    return successResponse({ page: { id: 'contact', ...updatedDoc.data() } })
  } catch (error) {
    const err = error as ErrorWithCode
    if (err.message === 'Unauthorized' || err.message.includes('Forbidden')) {
      return errorResponse('غير مصرح', 401)
    }

    await logger.error('Update contact page error', err as Error)
    return errorResponse('حدث خطأ أثناء تحديث البيانات', 500)
  }
}


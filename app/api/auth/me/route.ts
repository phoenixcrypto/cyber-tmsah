import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { getAuthUser } from '@/lib/middleware/auth'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return unauthorizedResponse('Unauthorized')
    }

    // Get full user data from Firestore
    const db = getFirestoreDB()
    const userDoc = await db.collection('users').doc(user.userId).get()

    if (!userDoc.exists) {
      return unauthorizedResponse('User not found')
    }

    const userData = userDoc.data()
    const lastLogin = userData?.['lastLogin'] as { toDate?: () => Date } | Date | null

    return successResponse({
      user: {
        id: user.userId,
        email: userData?.['email'] || user.email,
        name: userData?.['name'] || userData?.['username'] || '',
        role: userData?.['role'] || user.role,
        lastLogin: lastLogin && typeof lastLogin === 'object' && 'toDate' in lastLogin ? lastLogin.toDate?.() : lastLogin || null,
      },
    })
  } catch (error) {
    await logger.error('Get user error', error as Error, {
      method: 'GET',
      path: '/api/auth/me',
    })
    return errorResponse('حدث خطأ أثناء جلب بيانات المستخدم', 500)
  }
}

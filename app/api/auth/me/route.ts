import { NextRequest } from 'next/server'
import { getFirestoreDB } from '@/lib/db/firebase'
import { getAuthUser } from '@/lib/middleware/auth'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Initialize default admin if no users exist
 */
async function initializeDefaultAdmin(): Promise<void> {
  try {
    const db = getFirestoreDB()
    const usersSnapshot = await db.collection('users').limit(1).get()
    
    if (usersSnapshot.empty) {
      const defaultUsername = process.env['DEFAULT_ADMIN_USERNAME']
      const defaultPassword = process.env['DEFAULT_ADMIN_PASSWORD']
      const defaultName = process.env['DEFAULT_ADMIN_NAME']
      
      if (!defaultUsername || !defaultPassword) {
        console.error('❌ DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD must be set in environment variables')
        return
      }
      
      const hashedPassword = await hashPassword(defaultPassword)
      
      await db.collection('users').add({
        username: defaultUsername,
        name: defaultName || defaultUsername,
        password: hashedPassword,
        role: 'admin',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
      
      console.log('✅ Default admin user created!')
    }
  } catch (error) {
    console.error('Error initializing default admin:', error)
  }
}

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize default admin if needed (only runs once)
    try {
      await initializeDefaultAdmin()
    } catch (initError) {
      console.error('Error initializing default admin:', initError)
    }

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

    return successResponse({
      user: {
        id: userDoc.id,
        email: (userData?.['email'] as string) || user.email,
        name: (userData?.['name'] as string) || user.email,
        role: (userData?.['role'] as 'admin' | 'editor' | 'viewer') || user.role,
        lastLogin: userData?.['lastLogin'] || null,
        createdAt: userData?.['createdAt'] || null,
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

/**
 * Authentication middleware utilities
 * Updated for Firebase Auth
 */

import { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { getFirebaseAuth, getFirestoreDB } from '@/lib/db/firebase'

export interface AuthUser {
  userId: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  name?: string
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return null
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return null
    }

    // Get user from Firebase Auth
    try {
      const auth = getFirebaseAuth()
      const userRecord = await auth.getUser(payload.userId)
      
      // Get user role from Firestore users collection or custom claims
      const db = getFirestoreDB()
      const userDoc = await db.collection('users').doc(payload.userId).get()
      
      let role: 'admin' | 'editor' | 'viewer' = 'viewer'
      let name: string | undefined
      if (userDoc.exists) {
        const userData = userDoc.data()
        role = (userData?.['role'] as 'admin' | 'editor' | 'viewer') || 'viewer'
        name = userData?.['name'] as string | undefined
      } else {
        // Try to get from custom claims
        role = (userRecord.customClaims?.['role'] as 'admin' | 'editor' | 'viewer') || 'viewer'
        name = userRecord.displayName || undefined
      }

      return {
        userId: userRecord.uid,
        email: userRecord.email || payload.email || '',
        role,
        ...(name && { name }),
      }
    } catch (firebaseError) {
      console.error('Firebase Auth error:', firebaseError)
      return null
    }
  } catch (error) {
    return null
  }
}

/**
 * Require authentication middleware
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(request)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

/**
 * Require admin role middleware
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await requireAuth(request)
  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }
  return user
}

/**
 * Require admin or editor role middleware
 */
export async function requireEditor(request: NextRequest): Promise<AuthUser> {
  const user = await requireAuth(request)
  if (user.role !== 'admin' && user.role !== 'editor') {
    throw new Error('Forbidden: Editor access required')
  }
  return user
}

/**
 * Get request context for logging
 */
export function getRequestContext(request: NextRequest): {
  ipAddress: string
  userAgent: string | null
} {
  const ipAddress =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  const userAgent = request.headers.get('user-agent')

  return { ipAddress, userAgent }
}

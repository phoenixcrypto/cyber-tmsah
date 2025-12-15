/**
 * Authentication middleware utilities
 * Updated for Firebase Auth
 */

import { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { getFirestoreDB } from '@/lib/db/firebase'

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

    // Get user from Firestore (users are stored in Firestore, not Firebase Auth)
    try {
      const db = getFirestoreDB()
      const userDoc = await db.collection('users').doc(payload.userId).get()
      
      if (!userDoc.exists) {
        // User not found in Firestore
        return null
      }

      const userData = userDoc.data()
      const role = (userData?.['role'] as 'admin' | 'editor' | 'viewer') || 'viewer'
      const name = userData?.['name'] as string | undefined
      const email = (userData?.['email'] as string) || payload.email || ''
      const username = (userData?.['username'] as string) || ''

      return {
        userId: userDoc.id,
        email: email || username || payload.email || '',
        role,
        ...(name && { name }),
      }
    } catch (firebaseError) {
      console.error('Firestore error:', firebaseError)
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

/**
 * Authentication middleware utilities
 */

import { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { prisma } from '@/lib/db/prisma'

export interface AuthUser {
  userId: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
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

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true },
    })

    if (!user) {
      return null
    }

    return {
      userId: user.id,
      email: user.email || payload.email,
      role: user.role,
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


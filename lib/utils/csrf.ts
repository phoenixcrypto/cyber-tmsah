/**
 * CSRF Protection utilities
 */

import { NextRequest } from 'next/server'
import { randomBytes, createHmac } from 'crypto'

const CSRF_SECRET = process.env['CSRF_SECRET'] || 'change-me-in-production'
const CSRF_TOKEN_HEADER = 'X-CSRF-Token'
const CSRF_COOKIE_NAME = 'csrf-token'

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Create signed CSRF token
 */
export function signCsrfToken(token: string): string {
  const hmac = createHmac('sha256', CSRF_SECRET)
  hmac.update(token)
  return `${token}.${hmac.digest('hex')}`
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(signedToken: string): boolean {
  const [token, signature] = signedToken.split('.')
  if (!token || !signature) {
    return false
  }

  const expectedSignature = createHmac('sha256', CSRF_SECRET)
    .update(token)
    .digest('hex')

  return signature === expectedSignature
}

/**
 * Get CSRF token from request
 */
export function getCsrfTokenFromRequest(request: NextRequest): string | null {
  // Try header first
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER)
  if (headerToken) {
    return headerToken
  }

  // Try cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value
  if (cookieToken) {
    return cookieToken
  }

  // Try body (for form submissions)
  // Note: NextRequest body is a ReadableStream, not directly accessible
  // CSRF tokens should be sent via headers or cookies in Next.js
  // This is kept for potential future use with form data parsing

  return null
}

/**
 * Validate CSRF token from request
 */
export function validateCsrfToken(request: NextRequest): boolean {
  // Skip CSRF for GET, HEAD, OPTIONS
  const method = request.method
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true
  }

  const token = getCsrfTokenFromRequest(request)
  if (!token) {
    return false
  }

  return verifyCsrfToken(token)
}

/**
 * Cookie options type for type safety
 */
export interface CsrfCookieOptions {
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  path: string
  maxAge: number
}

/**
 * Set CSRF token in response cookie
 * Returns cookie configuration with type-safe options
 */
export function setCsrfCookie(token: string): {
  name: string
  value: string
  options: CsrfCookieOptions
} {
  return {
    name: CSRF_COOKIE_NAME,
    value: signCsrfToken(token),
    options: {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production' || process.env['VERCEL'] === '1',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    },
  }
}


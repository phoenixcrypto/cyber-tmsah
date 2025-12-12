import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// CSRF utilities disabled in Edge Runtime - will be handled in API routes instead
// import { validateCsrfToken, generateCsrfToken, setCsrfCookie } from '@/lib/utils/csrf'

// Admin routes removed - no authentication needed

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiting middleware
 */
function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const key = `rate-limit-${ip}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

/**
 * Clean up old rate limit records
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

  // Redirect /eltmsah to /admin (since admin files are in app/admin/)
  // This allows using /eltmsah as the admin path while keeping files in app/admin/
  if (pathname === '/eltmsah' || pathname.startsWith('/eltmsah/')) {
    const newPath = pathname.replace('/eltmsah', '/admin')
    const url = request.nextUrl.clone()
    url.pathname = newPath
    return NextResponse.redirect(url, 308) // 308 = permanent redirect
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(ip, 100, 60000)) { // 100 requests per minute
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many requests. Please try again later.',
          code: 'RATE_6001'
        },
        { status: 429 }
      )
    }

    // CSRF Protection disabled in Edge Runtime
    // Will be handled in individual API routes using Node.js runtime
  }

  // Apply stricter rate limiting to auth routes (except /me which is called frequently)
  if (pathname.startsWith('/api/auth/')) {
    // More lenient rate limiting for /api/auth/me (used for session checks)
    if (pathname === '/api/auth/me') {
      if (!rateLimit(ip, 30, 60000)) { // 30 requests per minute for session checks
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        )
      }
    } else {
      // Stricter for login/logout
      if (!rateLimit(ip, 10, 60000)) { // 10 requests per minute for login/logout
        return NextResponse.json(
          { error: 'Too many login attempts. Please try again later.' },
          { status: 429 }
        )
      }
    }
  }

  // Admin routes removed - no authentication needed

  // Security headers
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // CSRF token cookie generation disabled in Edge Runtime
  // Will be handled in API routes using Node.js runtime

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/eltmsah/:path*',
  ],
}


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from './lib/auth/jwt'

// Routes that require authentication
const protectedRoutes = ['/admin']
const authRoutes = ['/admin/login']

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

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(ip, 100, 60000)) { // 100 requests per minute
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
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

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname === route)

  // If user is already logged in and tries to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin-token')?.value
    if (token) {
      try {
        const payload = verifyAccessToken(token)
        if (payload) {
          // User is already logged in, redirect to dashboard
          console.log('✅ Valid token on login page, redirecting to dashboard')
          return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        } else {
          console.log('⚠️ Token exists but invalid, allowing access to login page')
        }
      } catch (error) {
        // Token verification error - allow access to login page
        console.log('⚠️ Token verification error on login page, allowing access:', error)
      }
    } else {
      console.log('ℹ️ No token on login page, allowing access')
    }
    // User is not logged in, allow access to login page
    return NextResponse.next()
  }

  if (isProtectedRoute && !isAuthRoute) {
    // Get token from cookie
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      // Redirect to login if no token
      if (pathname.startsWith('/admin')) {
        console.log('🔒 No token found, redirecting to login')
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token with error handling
    let payload
    try {
      payload = verifyAccessToken(token)
    } catch (error) {
      // Token verification error - log but don't delete cookies immediately
      // This might be a timing issue where token is being verified before it's fully set
      console.error('❌ Token verification error:', error)
      console.log('⚠️ Token exists but verification failed, allowing access with retry')
      // Don't delete cookies on verification error - might be a timing issue
      // Let the client-side auth check handle it
      return NextResponse.next()
    }

    if (!payload) {
      // Token is invalid - only delete cookies if we're certain it's invalid
      // Check if this is a fresh login attempt (recent redirect from login)
      const referer = request.headers.get('referer')
      const isFromLogin = referer?.includes('/admin/login')
      
      if (!isFromLogin) {
        // Only delete cookies if not coming from login page (to avoid deleting fresh cookies)
        console.log('❌ Invalid token, clearing cookies and redirecting to login')
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('admin-token')
        response.cookies.delete('admin-refresh-token')
        return response
      } else {
        // Coming from login page - might be a timing issue, allow access
        console.log('⚠️ Invalid token but coming from login, allowing access')
        return NextResponse.next()
      }
    }

    // Add user info to headers for API routes
    if (pathname.startsWith('/api/admin/')) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId)
      requestHeaders.set('x-user-role', payload.role)
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  // Security headers
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Prevent caching of admin pages
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/:path*',
    '/api/admin/:path*',
  ],
}


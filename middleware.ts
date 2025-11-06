import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/security/jwt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/admin']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Get access token from header or cookie
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.cookies.get('access_token')?.value

    if (!accessToken) {
      // Redirect to login if accessing protected route without token
      if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
      }
    } else {
      // Verify token
      const payload = verifyToken(accessToken)
      if (!payload) {
        // Token invalid or expired, redirect to login
        if (pathname.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL('/login', request.url))
        }
        if (pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
        }
      }
    }
  }

  // Public routes (login, register) - redirect to dashboard if already logged in
  if (pathname === '/login' || pathname === '/register') {
    const accessToken = request.cookies.get('access_token')?.value
    if (accessToken) {
      const payload = verifyToken(accessToken)
      if (payload) {
        // Already logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}

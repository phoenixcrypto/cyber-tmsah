import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/admin']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Middleware runs on Edge – avoid jwt verification here.
    // Only check presence of the token; full verification happens in API routes.
    const hasToken = Boolean(
      request.headers.get('authorization')?.startsWith('Bearer ') ||
      request.cookies.get('access_token')?.value
    )

    if (!hasToken) {
      // Redirect to login if accessing protected route without token
      if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
      }
    }
  }

  // Public routes (login, register) - redirect based on user role if already logged in
  if (pathname === '/login' || pathname === '/register') {
    const accessToken = 
      request.headers.get('authorization')?.startsWith('Bearer ')
        ? request.headers.get('authorization')!.substring(7)
        : request.cookies.get('access_token')?.value
    
    if (accessToken) {
      try {
        // Decode JWT to get user role (no signature verification needed for role check)
        const parts = accessToken.split('.')
        if (parts.length === 3 && parts[1]) {
          // Base64URL decode
          const base64Url = parts[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
          
          // Decode base64 to string (Edge Runtime compatible)
          const jsonPayload = atob(padded)
          const payload = JSON.parse(jsonPayload)
          const userRole = payload.role || 'student'
          
          // Redirect admin to /admin, student to /dashboard
          const targetRoute = userRole === 'admin' ? '/admin' : '/dashboard'
          return NextResponse.redirect(new URL(targetRoute, request.url))
        }
      } catch (error) {
        // If token is invalid, let the request proceed (user will see login page)
        // Silently fail - user will see login page
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

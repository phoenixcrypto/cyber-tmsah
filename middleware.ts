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

  // Public routes (login, register) - redirect to dashboard if already logged in
  if (pathname === '/login' || pathname === '/register') {
    // If any token exists, redirect to dashboard (verification is done server-side when needed)
    const hasToken = Boolean(
      request.headers.get('authorization')?.startsWith('Bearer ') ||
      request.cookies.get('access_token')?.value
    )
    if (hasToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
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

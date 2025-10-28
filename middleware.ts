import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Block access to admin routes without proper authentication
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // You can add more sophisticated authentication here
    // For now, we'll rely on the client-side password protection
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
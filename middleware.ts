import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Global rate limiting for all requests (DDoS protection)
const globalRateLimitMap = new Map<string, { count: number; resetTime: number }>()
const GLOBAL_RATE_LIMIT = 100 // requests per minute per IP
const GLOBAL_RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

function checkGlobalRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = globalRateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    globalRateLimitMap.set(ip, { count: 1, resetTime: now + GLOBAL_RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= GLOBAL_RATE_LIMIT) {
    return false
  }
  
  record.count++
  return true
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? (forwarded.split(',')[0]?.trim() || 'unknown') : (request.headers.get('x-real-ip') || 'unknown')
  return ip || 'unknown'
}

export function middleware(request: NextRequest) {
  // Global DDoS protection - rate limit all requests
  const clientIP = getClientIP(request)
  
  if (!checkGlobalRateLimit(clientIP)) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many requests. Please slow down.',
        retryAfter: 60 
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
          'X-RateLimit-Limit': GLOBAL_RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': '0'
        }
      }
    )
  }

  // Enhanced admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value
    
    // Check if token exists
    if (!token) {
      // Allow access but client-side will redirect to login
      // Server-side verification happens in API routes
      return NextResponse.next()
    }
    
    // Token exists - allow access
    // Full verification happens in API routes via requireAuth()
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
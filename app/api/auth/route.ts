import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Enhanced rate limiting for authentication - very strict to prevent brute force
const authRateLimitMap = new Map<string, { count: number; resetTime: number; blocked: boolean }>()
const AUTH_RATE_LIMIT = 5 // Only 5 login attempts
const AUTH_RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const BLOCK_DURATION = 30 * 60 * 1000 // Block for 30 minutes after too many attempts

function checkAuthRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = authRateLimitMap.get(identifier)
  
  if (!record) {
    authRateLimitMap.set(identifier, { count: 1, resetTime: now + AUTH_RATE_LIMIT_WINDOW, blocked: false })
    return { allowed: true, remaining: AUTH_RATE_LIMIT - 1, resetTime: now + AUTH_RATE_LIMIT_WINDOW }
  }
  
  // Check if still blocked
  if (record.blocked && now < record.resetTime) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  // Reset if window expired
  if (now > record.resetTime) {
    authRateLimitMap.set(identifier, { count: 1, resetTime: now + AUTH_RATE_LIMIT_WINDOW, blocked: false })
    return { allowed: true, remaining: AUTH_RATE_LIMIT - 1, resetTime: now + AUTH_RATE_LIMIT_WINDOW }
  }
  
  // Check if limit exceeded
  if (record.count >= AUTH_RATE_LIMIT) {
    record.blocked = true
    record.resetTime = now + BLOCK_DURATION
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  record.count++
  const remaining = AUTH_RATE_LIMIT - record.count
  return { allowed: true, remaining, resetTime: record.resetTime }
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? (forwarded.split(',')[0] || 'unknown') : (request.headers.get('x-real-ip') || 'unknown')
  return ip
}

// Get admin password from environment variable
// REQUIRED: Must be set in .env.local
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_PASSWORD) {
  console.error('CRITICAL: ADMIN_PASSWORD is not set in environment variables!')
}

export async function POST(request: NextRequest) {
  try {
    // Enhanced rate limiting for login attempts
    const clientId = getClientIdentifier(request)
    const rateLimit = checkAuthRateLimit(clientId)
    
    if (!rateLimit.allowed) {
      const remainingMinutes = Math.ceil((rateLimit.resetTime - Date.now()) / 1000 / 60)
      return NextResponse.json(
        { 
          error: `Too many login attempts. Please try again in ${remainingMinutes} minutes.`,
          remainingTime: remainingMinutes * 60
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': AUTH_RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
    }
    
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }
    
    // Check if password is configured
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    // Add artificial delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simple password check (in production, use bcrypt with hashed password)
    // TODO: Implement bcrypt hashing for production
    if (password === ADMIN_PASSWORD) {
      // Generate a simple session token (in production, use JWT)
      const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64')
      
      // Set token in response header (client will store it)
      const response = NextResponse.json({ 
        success: true,
        token 
      })
      
      // Set secure cookie with enhanced security
      response.cookies.set('admin-token', token, {
        httpOnly: true, // Prevent XSS attacks - cookies not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      })
      
      return response
    } else {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Check if token exists and is valid
  const token = request.cookies.get('admin-token')?.value
  
  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
  
  // In production, verify token signature
  // For now, just check if token exists
  return NextResponse.json({ authenticated: true })
}

export async function DELETE() {
  // Clear authentication cookie
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin-token')
  return response
}


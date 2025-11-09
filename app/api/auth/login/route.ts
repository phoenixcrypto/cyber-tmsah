import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyPassword } from '@/lib/security/password'
import { loginSchema } from '@/lib/security/validation'
import { rateLimit, checkAccountLockout, recordFailedAttempt, clearFailedAttempts } from '@/lib/security/rateLimit'
import { generateAccessToken, generateRefreshToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5, // 5 attempts per minute
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)) } }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      const message = validationResult.error.issues?.[0]?.message || 'Invalid input'
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    const { username, password } = validationResult.data
    const trimmedUsername = username.trim().toLowerCase()

    // Check account lockout
    const lockoutCheck = checkAccountLockout(trimmedUsername)
    if (lockoutCheck.locked) {
      const remainingTime = Math.ceil((lockoutCheck.lockUntil! - Date.now()) / 1000 / 60)
      return NextResponse.json(
        { 
          error: `Account temporarily locked due to too many failed attempts. Please try again in ${remainingTime} minutes.` 
        },
        { status: 423 }
      )
    }

    const supabase = createAdminClient()

    // Try to find user by username, email, or full name in parallel for better performance
    const [usernameResult, emailResult, nameResult] = await Promise.allSettled([
      supabase
        .from('users')
        .select('id, username, email, password_hash, full_name, role, is_active, section_number, group_name, university_email, created_at, last_login')
        .eq('username', trimmedUsername)
        .single(),
      supabase
        .from('users')
        .select('id, username, email, password_hash, full_name, role, is_active, section_number, group_name, university_email, created_at, last_login')
        .eq('email', trimmedUsername)
        .single(),
      supabase
        .from('users')
        .select('id, username, email, password_hash, full_name, role, is_active, section_number, group_name, university_email, created_at, last_login')
        .ilike('full_name', trimmedUsername)
        .single(),
    ])

    // Find first successful result
    let user = null
    let userError = null

    if (usernameResult.status === 'fulfilled' && usernameResult.value.data && !usernameResult.value.error) {
      user = usernameResult.value.data
    } else if (emailResult.status === 'fulfilled' && emailResult.value.data && !emailResult.value.error) {
      user = emailResult.value.data
    } else if (nameResult.status === 'fulfilled' && nameResult.value.data && !nameResult.value.error) {
      user = nameResult.value.data
    } else {
      // All failed - get first error
      if (usernameResult.status === 'fulfilled' && usernameResult.value.error) {
        userError = usernameResult.value.error
      } else if (emailResult.status === 'fulfilled' && emailResult.value.error) {
        userError = emailResult.value.error
      } else if (nameResult.status === 'fulfilled' && nameResult.value.error) {
        userError = nameResult.value.error
      }
    }

    if (userError || !user) {
      recordFailedAttempt(trimmedUsername)
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact administrator.' },
        { status: 403 }
      )
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.password_hash)
    
    if (!passwordValid) {
      recordFailedAttempt(trimmedUsername)
      console.log('[Login] Password invalid, recording failed attempt')
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 401 }
      )
    }

    // Clear failed attempts
    clearFailedAttempts(trimmedUsername)

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
      role: user.role as 'student' | 'admin',
      sectionNumber: user.section_number || undefined,
      groupName: user.group_name || undefined,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username,
      role: user.role as 'student' | 'admin',
      sectionNumber: user.section_number || undefined,
      groupName: user.group_name || undefined,
    })

    // Return success response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          sectionNumber: user.section_number,
          groupName: user.group_name,
          role: user.role,
        },
        accessToken,
      },
      { status: 200 }
    )

    // Set refresh token in HTTP-only cookie
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Also set access_token in cookie for server-side access
    // This is read by server-side code (requireAdmin, etc.)
    response.cookies.set('access_token', accessToken, {
      httpOnly: false, // Allow client-side access for dashboard
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed to 'lax' for better cross-site compatibility
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}


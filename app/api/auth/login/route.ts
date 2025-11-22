import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validators/schemas'
import { getUserByUsername, updateLastLogin, getAllUsers, initializeDefaultAdmin } from '@/lib/db/users'
import { comparePassword } from '@/lib/auth/bcrypt'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  try {
    // Initialize default admin if needed
    await initializeDefaultAdmin()

    const body = await request.json()
    
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const { username, password } = validationResult.data

    // Trim username to remove any extra spaces
    const trimmedUsername = username.trim()

    console.log('🔍 Looking for user with username:', trimmedUsername)
    
    // Get user by username
    const user = getUserByUsername(trimmedUsername)
    
    if (!user) {
      console.log('❌ User not found:', trimmedUsername)
      // Log all users for debugging
      const allUsers = getAllUsers()
      console.log('📋 All users in database:', allUsers.map((u) => ({ id: u.id, username: u.username, name: u.name })))
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    console.log('✅ User found:', { id: user.id, username: user.username, name: user.name })

    // Verify password
    console.log('🔐 Verifying password...')
    const isPasswordValid = await comparePassword(password, user.password)
    console.log('🔐 Password valid:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('❌ Password verification failed')
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || user.username,
      role: user.role,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email || user.username,
      role: user.role,
    })

    // Update last login
    updateLastLogin(user.id)

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    // Set secure cookies
    // Use 'lax' instead of 'strict' for better compatibility
    // 'strict' can prevent cookies from being sent in some navigation scenarios
    // In production (Vercel), always use secure cookies
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    
    // Get domain from request URL
    const url = new URL(request.url)
    const hostname = url.hostname
    
    // Cookie options - ensure they work in both development and production
    // Important: Don't set domain explicitly for cookies to work on all subdomains
    const cookieOptions: {
      httpOnly: boolean
      secure: boolean
      sameSite: 'lax' | 'strict' | 'none'
      maxAge: number
      path: string
    } = {
      httpOnly: true,
      secure: isProduction, // Secure in production (Vercel uses HTTPS), allow HTTP in development
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    }
    
    // Set cookies with explicit options
    // Using response.cookies.set() which should work correctly
    response.cookies.set('admin-token', accessToken, cookieOptions)
    response.cookies.set('admin-refresh-token', refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Log for debugging - always log to help diagnose issues
    console.log('✅ Login successful, cookies set for user:', user.username)
    console.log('🔐 Cookie configuration:', {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
      hostname: hostname,
      isProduction: isProduction,
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
    })
    console.log('🍪 Cookies set in response:', {
      'admin-token': accessToken ? 'SET' : 'NOT SET',
      'admin-refresh-token': refreshToken ? 'SET' : 'NOT SET',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validators/schemas'
import { getUserByEmail, updateLastLogin } from '@/lib/db/users'
import { comparePassword } from '@/lib/auth/bcrypt'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt'
import { initializeDefaultAdmin } from '@/lib/db/users'

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

    const { email, password } = validationResult.data

    // Get user
    const user = getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
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
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Always secure (Vercel uses HTTPS)
      sameSite: 'lax' as const, // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    }
    
    response.cookies.set('admin-token', accessToken, cookieOptions)
    response.cookies.set('admin-refresh-token', refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
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


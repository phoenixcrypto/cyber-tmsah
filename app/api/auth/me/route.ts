import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { getUserById, initializeDefaultAdmin } from '@/lib/db/users'

export async function GET(request: NextRequest) {
  try {
    // Initialize default admin if needed (only runs once)
    try {
      await initializeDefaultAdmin()
    } catch (initError) {
      console.error('Error initializing default admin:', initError)
      // Continue even if initialization fails - might be a file system issue
    }

    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let payload
    try {
      payload = verifyAccessToken(token)
    } catch (error) {
      console.error('Token verification error:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    let user
    try {
      user = getUserById(payload.userId)
    } catch (error) {
      console.error('Get user by ID error:', error)
      console.error('Error details:', {
        userId: payload.userId,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      })
      return NextResponse.json({ error: 'User lookup failed' }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    console.error('Error details:', {
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات المستخدم' },
      { status: 500 }
    )
  }
}


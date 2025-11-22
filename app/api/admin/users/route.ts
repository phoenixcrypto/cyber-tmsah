import { NextRequest, NextResponse } from 'next/server'
import { createUserSchema } from '@/lib/validators/schemas'
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  type User,
} from '@/lib/db/users'

/**
 * GET /api/admin/users
 * Get all users
 */
export async function GET(_request: NextRequest) {
  try {
    const users = getAllUsers()
    // Don't return password hashes
    const safeUsers = users.map(({ password, ...user }) => user)
    return NextResponse.json({ success: true, users: safeUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المستخدمين' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/users
 * Create new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createUserSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    const userData = validationResult.data

    // Check if email already exists (if provided)
    if (userData.email) {
      const email = userData.email.toLowerCase()
      const existingUser = getAllUsers().find((u) => u.email?.toLowerCase() === email)
      if (existingUser) {
        return NextResponse.json(
          { error: 'البريد الإلكتروني مستخدم بالفعل' },
          { status: 400 }
        )
      }
    }

    // Create user with username (use email as username if username not provided)
    let username: string
    if (userData.username) {
      username = userData.username
    } else if (userData.email) {
      username = userData.email.split('@')[0] || userData.email
    } else {
      username = `user-${Date.now()}`
    }
    
    const userToCreate: Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'> & { password: string } = {
      username,
      name: userData.name,
      password: userData.password,
      role: userData.role,
    }
    
    if (userData.email) {
      userToCreate.email = userData.email
    }
    
    const newUser = await createUser(userToCreate)

    // Don't return password
    const { password, ...safeUser } = newUser

    return NextResponse.json({
      success: true,
      user: safeUser,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المستخدم' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/users
 * Update user
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, password, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    // If password is being updated, handle it separately
    if (password) {
      const updatedUser = await updateUserPassword(id, password)
      if (!updatedUser) {
        return NextResponse.json(
          { error: 'المستخدم غير موجود' },
          { status: 404 }
        )
      }
      const { password: _, ...safeUser } = updatedUser
      return NextResponse.json({
        success: true,
        user: safeUser,
      })
    }

    // Update other fields
    const updatedUser = updateUser(id, updates)

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    const { password: _, ...safeUser } = updatedUser

    return NextResponse.json({
      success: true,
      user: safeUser,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المستخدم' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users
 * Delete user
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    // Prevent deleting yourself
    // This check should be done based on the logged-in user's ID from the token
    // For now, we'll allow deletion but log a warning

    const deleted = deleteUser(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المستخدم' },
      { status: 500 }
    )
  }
}


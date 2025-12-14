import { NextRequest } from 'next/server'
import { getFirestoreDB, getFirebaseAuth } from '@/lib/db/firebase'
import { requireAdmin, getRequestContext } from '@/lib/middleware/auth'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'
import { hashPassword } from '@/lib/auth/bcrypt'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
  role: z.enum(['admin', 'editor', 'viewer']),
})

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
export async function GET(request: NextRequest) {
  const context = getRequestContext(request)

  try {
    await requireAdmin(request)

    const db = getFirestoreDB()
    const usersSnapshot = await db.collection('users')
      .orderBy('createdAt', 'desc')
      .get()

    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        username: data['username'],
        email: data['email'] || null,
        name: data['name'],
        role: data['role'],
        lastLogin: data['lastLogin']?.toDate?.() || data['lastLogin'] || null,
        createdAt: data['createdAt']?.toDate?.() || data['createdAt'] || null,
        updatedAt: data['updatedAt']?.toDate?.() || data['updatedAt'] || null,
      }
    })

    return successResponse({ users })
  } catch (error) {
    await logger.error('Get users error', error as Error, {
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء جلب المستخدمين', 500)
  }
}

/**
 * POST /api/admin/users
 * Create new user (admin only)
 */
export async function POST(request: NextRequest) {
  const context = getRequestContext(request)

  try {
    const user = await requireAdmin(request)
    const body = await request.json()

    const validationResult = createUserSchema.safeParse(body)
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues.map(issue => issue.message)
      )
    }

    const { username, email, name, password, role } = validationResult.data

    const db = getFirestoreDB()

    // Check if username exists
    const usernameSnapshot = await db.collection('users')
      .where('username', '==', username)
      .limit(1)
      .get()

    if (!usernameSnapshot.empty) {
      return errorResponse('اسم المستخدم موجود بالفعل', 400)
    }

    // Check if email exists (if provided)
    if (email) {
      const emailSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get()

      if (!emailSnapshot.empty) {
        return errorResponse('البريد الإلكتروني موجود بالفعل', 400)
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user in Firebase Auth (if email provided)
    let firebaseUid: string | undefined
    if (email) {
      try {
        const auth = getFirebaseAuth()
        const userRecord = await auth.createUser({
          email,
          displayName: name,
          emailVerified: false,
        })
        firebaseUid = userRecord.uid
        await auth.setCustomUserClaims(firebaseUid, { role })
      } catch (authError) {
        console.warn('Firebase Auth creation failed, continuing with Firestore only:', authError)
      }
    }

    // Create user document in Firestore
    const userRef = firebaseUid 
      ? db.collection('users').doc(firebaseUid)
      : db.collection('users').doc()
    const userData = {
      username,
      email: email || null,
      name,
      password: hashedPassword,
      role,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    await userRef.set(userData)

    const newUser = {
      id: userRef.id,
      username,
      email: email || null,
      name,
      role,
      createdAt: new Date(),
    }

    await logger.info('User created', {
      userId: userRef.id,
      createdBy: user.userId,
      ipAddress: context.ipAddress,
    })

    return successResponse({ user: newUser }, { status: 201 })
  } catch (error) {
    await logger.error('Create user error', error as Error, {
      ipAddress: context.ipAddress,
    })
    return errorResponse('حدث خطأ أثناء إنشاء المستخدم', 500)
  }
}

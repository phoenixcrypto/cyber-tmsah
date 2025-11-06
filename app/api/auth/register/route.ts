import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashPassword, validatePasswordStrength } from '@/lib/security/password'
import { registrationSchema, validateSectionGroupMatch } from '@/lib/security/validation'
import { rateLimit, recordFailedAttempt, clearFailedAttempts } from '@/lib/security/rateLimit'
import { generateAccessToken, generateRefreshToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5, // 5 attempts per minute
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)) } }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = registrationSchema.safeParse(body)
    if (!validationResult.success) {
      const message = validationResult.error.issues?.[0]?.message || 'Invalid input'
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    const { username, email, password, fullName, sectionNumber, groupName, universityEmail } = validationResult.data

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(', ') },
        { status: 400 }
      )
    }

    // Validate section and group match
    const sectionGroupValidation = validateSectionGroupMatch(sectionNumber, groupName)
    if (!sectionGroupValidation.valid) {
      return NextResponse.json(
        { error: sectionGroupValidation.error },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Check if student exists in verification list
    const { data: verificationData, error: verificationError } = await supabase
      .from('verification_list')
      .select('*')
      .eq('full_name', fullName.trim())
      .eq('section_number', sectionNumber)
      .eq('group_name', groupName)
      .eq('is_registered', false)
      .single()

    if (verificationError || !verificationData) {
      recordFailedAttempt(`${username}_${email}`)
      return NextResponse.json(
        { 
          error: 'Registration failed. Your information does not match our records. Please verify your full name, section number, and group.' 
        },
        { status: 403 }
      )
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists. Please choose a different username.' },
        { status: 409 }
      )
    }

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered. Please use a different email.' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        username,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName.trim(),
        section_number: sectionNumber,
        group_name: groupName,
        university_email: universityEmail || null,
        role: 'student',
        is_active: true,
      })
      .select()
      .single()

    if (userError || !newUser) {
      console.error('Error creating user:', userError)
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      )
    }

    // Update verification list
    await supabase
      .from('verification_list')
      .update({
        is_registered: true,
        registered_at: new Date().toISOString(),
        registered_by: newUser.id,
      })
      .eq('id', verificationData.id)

    // Clear failed attempts
    clearFailedAttempts(`${username}_${email}`)

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role as 'student' | 'admin',
      sectionNumber: newUser.section_number || undefined,
      groupName: newUser.group_name || undefined,
    })

    const refreshToken = generateRefreshToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role as 'student' | 'admin',
      sectionNumber: newUser.section_number || undefined,
      groupName: newUser.group_name || undefined,
    })

    // Return success response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.full_name,
          sectionNumber: newUser.section_number,
          groupName: newUser.group_name,
          role: newUser.role,
        },
        accessToken,
      },
      { status: 201 }
    )

    // Set refresh token in HTTP-only cookie
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}


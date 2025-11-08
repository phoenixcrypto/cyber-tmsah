import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { rateLimit } from '@/lib/security/rateLimit'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Validation schema for student update
const updateStudentSchema = z.object({
  id: z.string().uuid('Invalid student ID'),
  full_name: z.string().min(1, 'Full name is required').optional(),
  section_number: z.number().int().min(1).max(15).optional(),
  group_name: z.enum(['Group 1', 'Group 2']).optional(),
  student_id: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable(),
})

/**
 * PUT /api/admin/verification/update
 * Update a student in verification_list (Admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20, // 20 requests per minute
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)) } }
      )
    }

    // Check authentication
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyToken(accessToken)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Verify admin is active in database
    const supabase = createAdminClient()
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id, role, is_active')
      .eq('id', payload.userId)
      .eq('role', 'admin')
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser) {
      return NextResponse.json(
        { error: 'Admin account not found or inactive' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = updateStudentSchema.safeParse(body)
    if (!validationResult.success) {
      const message = validationResult.error.issues?.[0]?.message || 'Invalid input'
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    const { id, ...updateData } = validationResult.data

    // Remove undefined values
    const cleanUpdateData: Record<string, any> = {}
    if (updateData.full_name !== undefined) cleanUpdateData.full_name = updateData.full_name.trim()
    if (updateData.section_number !== undefined) cleanUpdateData.section_number = updateData.section_number
    if (updateData.group_name !== undefined) cleanUpdateData.group_name = updateData.group_name
    if (updateData.student_id !== undefined) cleanUpdateData.student_id = updateData.student_id || null
    if (updateData.email !== undefined) cleanUpdateData.email = updateData.email?.toLowerCase().trim() || null

    if (Object.keys(cleanUpdateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Supabase client already created above

    // Check if student exists
    const { data: existingStudent, error: fetchError } = await supabase
      .from('verification_list')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Update student
    const { data: updatedStudent, error: updateError } = await supabase
      .from('verification_list')
      .update({
        ...cleanUpdateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating student:', updateError)
      return NextResponse.json(
        { error: 'Failed to update student' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      student: updatedStudent,
    })
  } catch (error) {
    console.error('Update student error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


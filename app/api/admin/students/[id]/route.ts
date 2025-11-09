import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { logger } from '@/lib/utils/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * DELETE /api/admin/students/[id]
 * Delete a student account and reset their registration status
 * Admin only
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const studentId = params.id

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Get student info before deletion
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('id, email, full_name, section_number, group_name')
      .eq('id', studentId)
      .eq('role', 'student')
      .single()

    if (studentError || !student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Find the student in verification_list by email or full_name
    // First try to find by email (if available)
    let verificationRecord = null
    
    if (student.email) {
      // Try to find by matching full_name in verification_list
      const { data: verificationMatches } = await supabase
        .from('verification_list')
        .select('id, full_name, is_registered, registered_by')
        .ilike('full_name', `%${student.full_name}%`)
        .eq('section_number', student.section_number)
        .eq('group_name', student.group_name)
        .eq('is_registered', true)
        .eq('registered_by', studentId)

      if (verificationMatches && verificationMatches.length > 0) {
        // Find exact match
        verificationRecord = verificationMatches.find(v => 
          v.registered_by === studentId
        ) || verificationMatches[0]
      }
    }

    // If not found by registered_by, try to find by name and section/group
    if (!verificationRecord && student.full_name) {
      const { data: nameMatches } = await supabase
        .from('verification_list')
        .select('id, full_name, is_registered, registered_by')
        .ilike('full_name', student.full_name.trim())
        .eq('section_number', student.section_number)
        .eq('group_name', student.group_name)
        .eq('is_registered', true)
        .limit(1)
        .single()

      if (nameMatches) {
        verificationRecord = nameMatches
      }
    }

    // Delete the student from users table
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', studentId)
      .eq('role', 'student')

    if (deleteError) {
      logger.error('[Delete Student] Error deleting user:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete student account' },
        { status: 500 }
      )
    }

    // Reset registration status in verification_list if found
    if (verificationRecord) {
      const { error: updateError } = await supabase
        .from('verification_list')
        .update({
          is_registered: false,
          registered_by: null,
          registered_at: null,
        })
        .eq('id', verificationRecord.id)

      if (updateError) {
        logger.error('[Delete Student] Error updating verification_list:', updateError)
        // Don't fail the request, just log the error
        // The user is already deleted from users table
      } else {
        logger.debug('[Delete Student] Reset verification_list for:', verificationRecord.id)
      }
    }

    logger.debug('[Delete Student] Successfully deleted student:', {
      studentId,
      studentName: student.full_name,
      verificationReset: !!verificationRecord,
    })

    return NextResponse.json({
      success: true,
      message: 'Student account deleted successfully. Registration status has been reset.',
    })
  } catch (error) {
    logger.error('[Delete Student] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


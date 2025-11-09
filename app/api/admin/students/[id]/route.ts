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
  { params }: { params: Promise<{ id: string }> | { id: string } }
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

    // Handle params (can be Promise in Next.js 14+)
    const resolvedParams = params instanceof Promise ? await params : params
    const studentId = resolvedParams.id

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

    // Find the student in verification_list by registered_by (most reliable)
    let verificationRecord = null
    
    // First, try to find by registered_by (direct link)
    const { data: verificationByRegisteredBy } = await supabase
      .from('verification_list')
      .select('id, full_name, is_registered, registered_by')
      .eq('registered_by', studentId)
      .eq('is_registered', true)
      .limit(1)
      .maybeSingle()

    if (verificationByRegisteredBy) {
      verificationRecord = verificationByRegisteredBy
    } else if (student.full_name) {
      // If not found by registered_by, try to find by name and section/group (exact match)
      const { data: nameMatches } = await supabase
        .from('verification_list')
        .select('id, full_name, is_registered, registered_by')
        .ilike('full_name', student.full_name.trim())
        .eq('section_number', student.section_number)
        .eq('group_name', student.group_name)
        .eq('is_registered', true)
        .limit(1)
        .maybeSingle()

      if (nameMatches) {
        verificationRecord = nameMatches
      }
    }

    // Delete the student from users table
    // First, verify the student exists before deletion
    const { data: studentToDelete, error: verifyError } = await supabase
      .from('users')
      .select('id, username, full_name, email')
      .eq('id', studentId)
      .eq('role', 'student')
      .single()

    if (verifyError || !studentToDelete) {
      logger.error('[Delete Student] Student not found before deletion:', {
        studentId,
        error: verifyError?.message,
      })
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    logger.debug('[Delete Student] About to delete student:', {
      id: studentToDelete.id,
      username: studentToDelete.username,
      full_name: studentToDelete.full_name,
    })

    // Delete the student from users table
    const { error: deleteError, count: deleteCount } = await supabase
      .from('users')
      .delete()
      .eq('id', studentId)
      .eq('role', 'student')
      .select()

    if (deleteError) {
      logger.error('[Delete Student] Error deleting user:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete student account' },
        { status: 500 }
      )
    }

    // Verify deletion was successful
    const { data: verifyDeleted } = await supabase
      .from('users')
      .select('id')
      .eq('id', studentId)
      .single()

    if (verifyDeleted) {
      logger.error('[Delete Student] WARNING: Student still exists after deletion!', {
        studentId,
        studentName: studentToDelete.full_name,
      })
    } else {
      logger.debug('[Delete Student] Successfully verified deletion:', {
        studentId,
        studentName: studentToDelete.full_name,
        deleteCount,
      })
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


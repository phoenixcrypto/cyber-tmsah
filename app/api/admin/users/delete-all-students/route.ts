import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { logger } from '@/lib/utils/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * DELETE /api/admin/users/delete-all-students
 * Delete all student accounts from users table (Admin only)
 * WARNING: This is a destructive operation!
 */
export async function DELETE(request: NextRequest) {
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

    // Get all student IDs before deletion
    const { data: students, error: fetchError } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('role', 'student')

    if (fetchError) {
      logger.error('[Delete All Students] Error fetching students:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch students' },
        { status: 500 }
      )
    }

    const studentIds = (students || []).map(s => s.id)
    const studentCount = studentIds.length

    if (studentCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'No students to delete',
        deletedCount: 0,
      })
    }

    // Delete all students
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('role', 'student')

    if (deleteError) {
      logger.error('[Delete All Students] Error deleting students:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete students' },
        { status: 500 }
      )
    }

    // Reset ALL registration statuses in verification_list (all 703 students)
    // This ensures all students are unregistered, not just those that were registered
    // We update ALL records in verification_list to ensure all 703 students become unregistered
    const { error: resetError } = await supabase
      .from('verification_list')
      .update({
        is_registered: false,
        registered_by: null,
        registered_at: null,
      })
      // No .eq() filter - this updates ALL records in verification_list
      // This ensures all 703 students become unregistered

    if (resetError) {
      logger.error('[Delete All Students] Error resetting registration statuses:', resetError)
      // Don't fail the request, just log the error
    }

    logger.debug('[Delete All Students] Successfully deleted all students', {
      count: studentCount,
      studentIds: studentIds.slice(0, 5), // Log first 5 IDs
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${studentCount} student account(s)`,
      deletedCount: studentCount,
    })
  } catch (error) {
    logger.error('[Delete All Students] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


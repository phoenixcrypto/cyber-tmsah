import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { logger } from '@/lib/utils/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/students/[id]/unregister
 * Unregister a student - set is_registered to false in verification_list
 * and optionally delete their account from users table
 * Admin only
 */
export async function POST(
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
    const verificationId = resolvedParams.id

    if (!verificationId) {
      return NextResponse.json(
        { error: 'Verification ID is required' },
        { status: 400 }
      )
    }

    // Get verification record
    const { data: verificationRecord, error: verificationError } = await supabase
      .from('verification_list')
      .select('id, full_name, section_number, group_name, is_registered, registered_by')
      .eq('id', verificationId)
      .single()

    if (verificationError || !verificationRecord) {
      logger.error('[Unregister Student] Verification record not found:', {
        verificationId,
        error: verificationError?.message,
      })
      return NextResponse.json(
        { error: 'Student record not found in verification list' },
        { status: 404 }
      )
    }

    if (!verificationRecord.is_registered) {
      return NextResponse.json(
        { error: 'Student is already unregistered' },
        { status: 400 }
      )
    }

    const userId = verificationRecord.registered_by

    // Step 1: Update verification_list - set is_registered to false
    const { error: updateError } = await supabase
      .from('verification_list')
      .update({
        is_registered: false,
        registered_at: null,
        registered_by: null,
      })
      .eq('id', verificationId)

    if (updateError) {
      logger.error('[Unregister Student] Error updating verification_list:', updateError)
      return NextResponse.json(
        { error: 'Failed to unregister student' },
        { status: 500 }
      )
    }

    // Step 2: Delete user account if exists
    if (userId) {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
        .eq('role', 'student')

      if (deleteError) {
        logger.error('[Unregister Student] Error deleting user account:', deleteError)
        // Don't fail the request - verification_list is already updated
        // Just log the error
      } else {
        logger.debug('[Unregister Student] User account deleted successfully:', {
          userId,
          verificationId,
        })
      }
    }

    logger.debug('[Unregister Student] Successfully unregistered student:', {
      verificationId,
      full_name: verificationRecord.full_name,
      userId,
    })

    return NextResponse.json({
      success: true,
      message: 'Student unregistered successfully',
      data: {
        verification_id: verificationId,
        full_name: verificationRecord.full_name,
      },
    })
  } catch (error) {
    logger.error('[Unregister Student] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


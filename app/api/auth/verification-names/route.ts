import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/auth/verification-names
 * Get all student names from verification_list for dropdown selection
 * Public endpoint (no auth required for registration)
 */
export async function GET() {
  try {
    const supabase = createAdminClient()
    
    // Get all names from verification_list (only non-registered ones)
    const { data: names, error } = await supabase
      .from('verification_list')
      .select('id, full_name, section_number, group_name, is_registered')
      .order('full_name', { ascending: true })

    if (error) {
      logger.error('[Verification Names] Error fetching names:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch names',
          details: error.message 
        },
        { status: 500 }
      )
    }

    // Format the response
    const formattedNames = (names || []).map((item) => ({
      id: item.id,
      fullName: item.full_name,
      sectionNumber: item.section_number,
      groupName: item.group_name,
      isRegistered: item.is_registered,
    }))

    logger.debug('[Verification Names] Fetched names:', {
      total: formattedNames.length,
      registered: formattedNames.filter(n => n.isRegistered).length,
      available: formattedNames.filter(n => !n.isRegistered).length,
    })

    return NextResponse.json({
      success: true,
      names: formattedNames,
      total: formattedNames.length,
    })
  } catch (error) {
    logger.error('[Verification Names] Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}


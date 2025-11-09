import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, sectionNumber, groupName } = body

    if (!fullName || !sectionNumber || !groupName) {
      return NextResponse.json(
        { error: 'Full name, section number, and group are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const trimmedName = fullName.trim()

    // First, check if name exists at all (case-insensitive, partial match)
    // Use partial match first to find similar names, then check for exact match
    const { data: nameMatches, error: nameError } = await supabase
      .from('verification_list')
      .select('id, full_name, section_number, group_name, is_registered')
      .ilike('full_name', `%${trimmedName}%`)
      .limit(10)

    if (nameError) {
      logger.error('[Verify] Error checking name:', nameError)
      return NextResponse.json(
        { 
          valid: false,
          error: 'Error verifying your information. Please try again.' 
        },
        { status: 500 }
      )
    }

    // Check for exact match (case-insensitive)
    const exactMatch = nameMatches?.find(m => 
      m.full_name.toLowerCase().trim() === trimmedName.toLowerCase()
    )

    if (!exactMatch) {
      // Name not found - provide suggestions
      const suggestions = nameMatches?.slice(0, 5).map(m => ({
        fullName: m.full_name,
        sectionNumber: m.section_number,
        groupName: m.group_name,
      })) || []
      
      let errorMessage = 'Your name was not found in our records.'
      let message = 'Please verify your full name as it appears in the official list.'
      
      if (suggestions.length > 0) {
        errorMessage = 'Your name was not found exactly. Did you mean one of these names?'
        message = `Found ${suggestions.length} similar name(s). Please check if your name matches one of them:`
      }
      
      return NextResponse.json(
        { 
          valid: false,
          error: errorMessage,
          suggestions: suggestions.length > 0 ? suggestions.map(s => s.fullName) : undefined,
          suggestionDetails: suggestions.length > 0 ? suggestions : undefined,
          message: message,
        },
        { status: 200 }
      )
    }

    // Check if already registered
    if (exactMatch.is_registered) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'This student is already registered. Please log in instead.' 
        },
        { status: 200 }
      )
    }

    // Now verify section and group match
    // Use exact match for final verification (case-insensitive)
    // First try with exact name match
    let { data: verificationData, error: verificationError } = await supabase
      .from('verification_list')
      .select('*')
      .ilike('full_name', trimmedName) // Exact match for final verification
      .eq('section_number', sectionNumber)
      .eq('group_name', groupName)
      .eq('is_registered', false)
      .single()

    // If not found, try with trimmed name comparison (handle extra spaces)
    if (verificationError || !verificationData) {
      // Try to find by matching trimmed names
      const { data: allMatches } = await supabase
        .from('verification_list')
        .select('*')
        .ilike('full_name', `%${trimmedName}%`)
        .eq('section_number', sectionNumber)
        .eq('group_name', groupName)
        .eq('is_registered', false)

      // Find exact match by comparing trimmed names
      if (allMatches && allMatches.length > 0) {
        const trimmedMatch = allMatches.find(m => 
          m.full_name.trim().toLowerCase() === trimmedName.toLowerCase()
        )
        if (trimmedMatch) {
          verificationData = trimmedMatch
          verificationError = null
        }
      }
    }

    if (verificationError || !verificationData) {
      // Name exists but section/group don't match
      logger.debug('[Verify] Section/group mismatch:', {
        name: trimmedName,
        providedSection: sectionNumber,
        providedGroup: groupName,
        foundSection: exactMatch?.section_number,
        foundGroup: exactMatch?.group_name,
      })
      
      // Ensure exactMatch exists before accessing its properties
      if (!exactMatch) {
        return NextResponse.json(
          { 
            valid: false,
            error: 'Your name was not found in our records. Please verify your information.',
          },
          { status: 200 }
        )
      }
      
      return NextResponse.json(
        { 
          valid: false,
          error: `Your name was found, but the section number (${sectionNumber}) or group (${groupName}) does not match our records. Please verify your section and group.`,
          foundName: exactMatch.full_name,
          foundSection: exactMatch.section_number,
          foundGroup: exactMatch.group_name,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        valid: true,
        message: 'Verification successful. You can proceed with registration.',
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Verify] Verification error:', error)
    return NextResponse.json(
      { 
        valid: false,
        error: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    )
  }
}


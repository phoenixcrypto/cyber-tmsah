import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

    // First, check if name exists at all (case-insensitive)
    const { data: nameMatches, error: nameError } = await supabase
      .from('verification_list')
      .select('id, full_name, section_number, group_name, is_registered')
      .ilike('full_name', trimmedName)
      .limit(5)

    if (nameError) {
      console.error('Error checking name:', nameError)
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
      const suggestions = nameMatches?.slice(0, 3).map(m => m.full_name) || []
      return NextResponse.json(
        { 
          valid: false,
          error: 'Your name was not found in our records.',
          suggestions: suggestions.length > 0 ? suggestions : undefined,
          message: suggestions.length > 0 
            ? 'Did you mean one of these names?'
            : 'Please verify your full name as it appears in the official list.'
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
    const { data: verificationData, error: verificationError } = await supabase
      .from('verification_list')
      .select('*')
      .ilike('full_name', trimmedName)
      .eq('section_number', sectionNumber)
      .eq('group_name', groupName)
      .eq('is_registered', false)
      .single()

    if (verificationError || !verificationData) {
      // Name exists but section/group don't match
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
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/security/rateLimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/auth/check-name
 * Check if a student name exists in verification_list
 * Used during registration to verify name before proceeding
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { fullName } = body

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return NextResponse.json(
        { exists: false, error: 'Full name is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const trimmedName = fullName.trim()

    // Search for name in verification_list (case-insensitive, partial match)
    // This helps users find their name even with slight variations
    let matches = null
    let error = null

    try {
      const result = await supabase
        .from('verification_list')
        .select('id, full_name, section_number, group_name, is_registered')
        .ilike('full_name', `%${trimmedName}%`)
        .order('full_name', { ascending: true })
        .limit(10)

      matches = result.data
      error = result.error
    } catch (err) {
      console.error('Database query error:', err)
      return NextResponse.json(
        { exists: false, error: 'Database error. Please try again later.' },
        { status: 500 }
      )
    }

    if (error) {
      console.error('Error checking name:', error)
      return NextResponse.json(
        { exists: false, error: 'Error checking name. Please try again.' },
        { status: 500 }
      )
    }

    // Check for exact match first
    const exactMatch = matches?.find(m => 
      m.full_name.toLowerCase().trim() === trimmedName.toLowerCase()
    )

    if (exactMatch) {
      return NextResponse.json({
        exists: true,
        exactMatch: true,
        isRegistered: exactMatch.is_registered,
        student: {
          fullName: exactMatch.full_name,
          sectionNumber: exactMatch.section_number,
          groupName: exactMatch.group_name,
        },
        suggestions: matches?.slice(0, 5) || [],
      })
    }

    // If no exact match, return suggestions
    if (matches && matches.length > 0) {
      return NextResponse.json({
        exists: false,
        exactMatch: false,
        suggestions: matches.slice(0, 5).map(m => ({
          fullName: m.full_name,
          sectionNumber: m.section_number,
          groupName: m.group_name,
        })),
        message: 'Name not found exactly. Please check the suggestions below or verify your spelling.',
      })
    }

    return NextResponse.json({
      exists: false,
      exactMatch: false,
      suggestions: [],
      message: 'Name not found in our records. Please verify your full name as it appears in the official list.',
    })
  } catch (error) {
    console.error('Check name error:', error)
    return NextResponse.json(
      { exists: false, error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}


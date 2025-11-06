import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'

export const dynamic = 'force-dynamic'

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

    // Check if student exists in verification list and is not registered
    const { data: verificationData, error: verificationError } = await supabase
      .from('verification_list')
      .select('*')
      .eq('full_name', fullName.trim())
      .eq('section_number', sectionNumber)
      .eq('group_name', groupName)
      .eq('is_registered', false)
      .single()

    if (verificationError || !verificationData) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Your information does not match our records. Please verify your full name, section number, and group.' 
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


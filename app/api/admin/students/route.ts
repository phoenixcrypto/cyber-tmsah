import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { rateLimit } from '@/lib/security/rateLimit'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30, // 30 requests per minute
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
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

    const supabase = createAdminClient()

    // Get all students (role = 'student')
    const { data: students, error: studentsError } = await supabase
      .from('users')
      .select('id, username, email, full_name, section_number, group_name, is_active, created_at, last_login')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    if (studentsError) {
      console.error('Error fetching students:', studentsError)
      return NextResponse.json(
        { error: 'Failed to fetch students' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      students: students || [],
    })
  } catch (error) {
    console.error('Students fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


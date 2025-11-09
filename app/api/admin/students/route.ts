import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { rateLimit } from '@/lib/security/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    // Get all students (role = 'student') with ALL data including password_hash
    const { data: students, error: studentsError } = await supabase
      .from('users')
      .select('id, username, email, password_hash, full_name, section_number, group_name, university_email, role, is_active, created_at, updated_at, last_login')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    if (studentsError) {
      console.error('[Admin Students API] Error fetching students:', studentsError)
      return NextResponse.json(
        { error: 'Failed to fetch students' },
        { status: 500 }
      )
    }

    console.log('[Admin Students API] Fetched students:', students?.length || 0)
    console.log('[Admin Students API] Sample student:', students?.[0])

    // Get statistics
    const totalCount = students?.length || 0
    const activeCount = students?.filter(s => s.is_active).length || 0
    const inactiveCount = totalCount - activeCount

    // Count by section
    const sectionCounts: Record<number, number> = {}
    students?.forEach(s => {
      if (s.section_number) {
        sectionCounts[s.section_number] = (sectionCounts[s.section_number] || 0) + 1
      }
    })

    // Count by group
    const groupCounts: Record<string, number> = {}
    students?.forEach(s => {
      if (s.group_name) {
        groupCounts[s.group_name] = (groupCounts[s.group_name] || 0) + 1
      }
    })

    return NextResponse.json({
      success: true,
      students: students || [],
      statistics: {
        total: totalCount,
        active: activeCount,
        inactive: inactiveCount,
        bySection: sectionCounts,
        byGroup: groupCounts,
      },
    })
  } catch (error) {
    console.error('Students fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


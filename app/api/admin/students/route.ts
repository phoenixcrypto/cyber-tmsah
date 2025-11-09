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

    // First, let's check all users to debug
    const { data: allUsers } = await supabase
      .from('users')
      .select('id, username, email, role, is_active, full_name')
      .limit(10)
    
    console.log('[Admin Students API] All users (first 10):', allUsers?.length || 0)
    if (allUsers && allUsers.length > 0) {
      console.log('[Admin Students API] Sample users:', allUsers.map(u => ({
        id: u.id,
        username: u.username,
        role: u.role,
        is_active: u.is_active,
        full_name: u.full_name
      })))
    }

    // Get all students (role = 'student') with ALL data including password_hash
    // Using service role key bypasses RLS, so we can fetch all students
    const { data: students, error: studentsError } = await supabase
      .from('users')
      .select('id, username, email, password_hash, full_name, section_number, group_name, university_email, role, is_active, created_at, updated_at, last_login')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    if (studentsError) {
      console.error('[Admin Students API] Error fetching students:', studentsError)
      console.error('[Admin Students API] Error details:', JSON.stringify(studentsError, null, 2))
      return NextResponse.json(
        { 
          error: 'Failed to fetch students',
          details: studentsError.message || 'Unknown error'
        },
        { status: 500 }
      )
    }

    console.log('[Admin Students API] Fetched students:', students?.length || 0)
    console.log('[Admin Students API] Sample student:', students?.[0])
    
    // Debug: Check if students array is empty
    if (!students || students.length === 0) {
      console.warn('[Admin Students API] No students found with role="student"')
      
      // Check what roles exist
      const { data: rolesCheck } = await supabase
        .from('users')
        .select('role')
      
      if (rolesCheck) {
        const roleCounts: Record<string, number> = {}
        rolesCheck.forEach(u => {
          roleCounts[u.role] = (roleCounts[u.role] || 0) + 1
        })
        console.log('[Admin Students API] Users by role:', roleCounts)
      }
      
      // Check if there are users with different role values
      const { data: allUsersCheck, error: allUsersError } = await supabase
        .from('users')
        .select('id, username, email, role, is_active, full_name')
        .limit(10)
      
      console.log('[Admin Students API] All users (for debugging):', allUsersCheck?.length || 0)
      if (allUsersError) {
        console.error('[Admin Students API] Error fetching all users:', allUsersError)
      } else if (allUsersCheck && allUsersCheck.length > 0) {
        console.log('[Admin Students API] Sample users with their roles:')
        allUsersCheck.forEach(u => {
          console.log(`  - ${u.username} (${u.email}): role="${u.role}", is_active=${u.is_active}`)
        })
      }
    }

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


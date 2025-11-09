import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { rateLimit } from '@/lib/security/rateLimit'
import { logger } from '@/lib/utils/logger'

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
    if (!payload) {
      // Log more details for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin Students API] Token verification failed:', {
          hasToken: !!accessToken,
          tokenLength: accessToken?.length || 0,
          tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : 'none',
        })
      }
      return NextResponse.json(
        { error: 'Invalid or expired token. Please log in again.' },
        { status: 401 }
      )
    }

    if (payload.role !== 'admin') {
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
      // Log more details for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin Students API] Admin verification failed:', {
          userId: payload.userId,
          adminError: adminError?.message || 'No error',
          adminUser: adminUser ? 'Found' : 'Not found',
        })
      }
      return NextResponse.json(
        { 
          error: 'Admin account not found or inactive',
          code: 403,
        },
        { status: 403 }
      )
    }

    // First, check all users to debug
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, username, email, role, is_active')
      .limit(100)

    // Also check verification_list for registered students
    const { data: registeredStudents } = await supabase
      .from('verification_list')
      .select('id, full_name, is_registered, registered_by, registered_at')
      .eq('is_registered', true)
      .limit(10)

    logger.debug('[Admin Students API] All users check:', {
      totalUsers: allUsers?.length || 0,
      hasError: !!allUsersError,
      error: allUsersError?.message || null,
      usersByRole: allUsers?.reduce((acc: any, u: any) => {
        acc[u.role] = (acc[u.role] || 0) + 1
        return acc
      }, {}) || {},
      sampleUsers: allUsers?.slice(0, 5).map((u: any) => ({
        id: u.id,
        username: u.username,
        role: u.role,
        is_active: u.is_active,
      })) || [],
      registeredInVerificationList: registeredStudents?.length || 0,
      registeredSample: registeredStudents?.slice(0, 3).map((r: any) => ({
        id: r.id,
        full_name: r.full_name,
        registered_by: r.registered_by,
        registered_at: r.registered_at,
      })) || [],
    })

    // Get all students (role = 'student') with required data only
    // Using service role key bypasses RLS, so we can fetch all students
    // Select only needed columns for better performance
    let studentsRaw = null
    let studentsError = null

    // Get expected student count from the debug check
    const expectedStudentCount = allUsers?.reduce((acc: number, u: any) => {
      if (u.role === 'student') acc++
      return acc
    }, 0) || 0

    // Check if there are registered students in verification_list
    const hasRegisteredStudents = (registeredStudents?.length || 0) > 0

    // Always use fallback if we know there are students but query might fail
    // OR if there are registered students in verification_list
    const shouldUseFallback = hasRegisteredStudents || expectedStudentCount > 0

    if (shouldUseFallback) {
      logger.debug('[Admin Students API] Using fallback mechanism (direct fetch + manual filter)')
      
      // Fetch all users without role filter, then filter manually
      // This is more reliable than .eq('role', 'student') which seems to have issues
      const { data: allUsersData, error: allUsersError } = await supabase
        .from('users')
        .select('id, username, email, password_hash, full_name, section_number, group_name, university_email, role, is_active, created_at, updated_at, last_login')
        .order('created_at', { ascending: false })

      if (allUsersError) {
        studentsError = allUsersError
        logger.error('[Admin Students API] Error fetching all users:', allUsersError)
      } else {
        // Filter manually for students - check role case-insensitively
        studentsRaw = (allUsersData || []).filter((u: any) => {
          const role = (u.role || '').toString().toLowerCase().trim()
          return role === 'student'
        })
        logger.debug('[Admin Students API] Fallback: Filtered students manually:', {
          totalUsers: allUsersData?.length || 0,
          studentsCount: studentsRaw?.length || 0,
          expectedCount: expectedStudentCount,
          hasRegisteredStudents,
          allRoles: [...new Set((allUsersData || []).map((u: any) => u.role))],
          sampleStudents: studentsRaw?.slice(0, 3).map((s: any) => ({
            id: s.id,
            username: s.username,
            role: s.role,
          })) || [],
        })
      }
    } else {
      // Try to fetch students with role filter (only if no registered students)
      const { data: studentsWithRole, error: errorWithRole } = await supabase
        .from('users')
        .select('id, username, email, password_hash, full_name, section_number, group_name, university_email, role, is_active, created_at, updated_at, last_login')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      if (errorWithRole) {
        logger.error('[Admin Students API] Error fetching students with role filter:', errorWithRole)
        studentsError = errorWithRole
      } else {
        studentsRaw = studentsWithRole
        logger.debug('[Admin Students API] Query worked correctly, returned', studentsRaw?.length || 0, 'students')
      }
    }

    // Log for debugging
    if (studentsError) {
      logger.error('[Admin Students API] Error fetching students:', studentsError?.message || 'Unknown error')
    } else {
      logger.debug('[Admin Students API] Fetched students:', {
        count: studentsRaw?.length || 0,
        firstStudent: studentsRaw && studentsRaw.length > 0 ? {
          id: studentsRaw[0]?.id,
          username: studentsRaw[0]?.username,
          full_name: studentsRaw[0]?.full_name,
          role: studentsRaw[0]?.role,
        } : null,
      })
    }

    if (studentsError) {
      logger.error('[Admin Students API] Error fetching students:', studentsError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch students',
          details: studentsError.message || 'Unknown error'
        },
        { status: 500 }
      )
    }

    // Map the results to match expected format (already in correct format from select)
    // Also validate that each student actually exists and has valid data
    const students = (studentsRaw || [])
      .filter((s: any) => {
        // Ensure student has required fields and is actually a student
        if (!s || !s.id || !s.username || !s.email) {
          logger.debug('[Admin Students API] Filtering out invalid student:', s?.id || 'no-id')
          return false
        }
        const role = (s.role || '').toString().toLowerCase().trim()
        if (role !== 'student') {
          logger.debug('[Admin Students API] Filtering out non-student:', { id: s.id, role: s.role })
          return false
        }
        return true
      })
      .map((s: any) => ({
        id: s.id,
        username: s.username,
        email: s.email,
        password_hash: s.password_hash || '',
        full_name: s.full_name,
        section_number: s.section_number,
        group_name: s.group_name,
        university_email: s.university_email,
        role: s.role,
        is_active: s.is_active,
        created_at: s.created_at,
        updated_at: s.updated_at,
        last_login: s.last_login,
      }))

    // Calculate statistics efficiently in single pass
    const bySection: Record<number, number> = {}
    const byGroup: Record<string, number> = {}
    
    // Time-based statistics
    const now = Date.now()
    const last24Hours = now - (24 * 60 * 60 * 1000)
    const last7Days = now - (7 * 24 * 60 * 60 * 1000)
    const last30Days = now - (30 * 24 * 60 * 60 * 1000)
    
    let loggedInLast24Hours = 0
    let loggedInLast7Days = 0
    let newInLast30Days = 0

    // Single pass for all statistics
    for (const s of students) {
      if (s && typeof s === 'object') {
        // Section and group distribution
        if (s.section_number && typeof s.section_number === 'number') {
          bySection[s.section_number] = (bySection[s.section_number] || 0) + 1
        }
        
        if (s.group_name && typeof s.group_name === 'string') {
          byGroup[s.group_name] = (byGroup[s.group_name] || 0) + 1
        }
        
        // Last login statistics
        if (s.last_login) {
          const lastLoginTime = new Date(s.last_login).getTime()
          if (lastLoginTime >= last24Hours) {
            loggedInLast24Hours++
          }
          if (lastLoginTime >= last7Days) {
            loggedInLast7Days++
          }
        }
        
        // New students in last 30 days
        if (s.created_at) {
          const createdTime = new Date(s.created_at).getTime()
          if (createdTime >= last30Days) {
            newInLast30Days++
          }
        }
      }
    }

    const stats = {
      total: students.length,
      loggedInLast24Hours,
      loggedInLast7Days,
      newInLast30Days,
      bySection,
      byGroup,
    }

    // Log response before sending
    logger.debug('[Admin Students API] Returning response:', {
      studentsCount: students.length,
      statistics: stats,
    })

    return NextResponse.json({
      success: true,
      students: students || [],
      statistics: stats,
    })
  } catch (error) {
    console.error('Students fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


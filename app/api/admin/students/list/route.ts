import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { rateLimit } from '@/lib/security/rateLimit'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/students/list
 * Get all REGISTERED students from verification_list (source of truth)
 * Join with users table to get account details
 * Admin only
 */
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const group = searchParams.get('group')
    const search = searchParams.get('search')

    // SOURCE OF TRUTH: Fetch from verification_list where is_registered = true
    logger.debug('[Admin Students List API] Fetching registered students from verification_list (source of truth)')
    
    let query = supabase
      .from('verification_list')
      .select('id, full_name, section_number, group_name, student_id, email, is_registered, registered_at, registered_by, created_at, updated_at')
      .eq('is_registered', true)
      .order('registered_at', { ascending: false })

    // Apply filters
    if (section) {
      const sectionNum = parseInt(section, 10)
      if (!isNaN(sectionNum)) {
        query = query.eq('section_number', sectionNum)
      }
    }

    if (group) {
      query = query.eq('group_name', group)
    }

    if (search) {
      query = query.ilike('full_name', `%${search}%`)
    }

    const { data: registeredStudents, error: verificationError } = await query

    if (verificationError) {
      logger.error('[Admin Students List API] Error fetching from verification_list:', verificationError)
      return NextResponse.json(
        { error: 'Failed to fetch students' },
        { status: 500 }
      )
    }

    // Get user account details for registered students
    const userIds = (registeredStudents || [])
      .map((v: any) => v.registered_by)
      .filter((id: any) => id) // Remove null/undefined

    let usersData: any[] = []
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, username, email, password_hash, university_email, role, is_active, created_at, updated_at, last_login')
        .in('id', userIds)
        .eq('role', 'student')

      if (usersError) {
        logger.error('[Admin Students List API] Error fetching users:', usersError)
      } else {
        usersData = users || []
      }
    }

    // Create a map for quick lookup
    const usersMap = new Map(usersData.map((u: any) => [u.id, u]))

    // Map verification_list data with user account data
    const students = (registeredStudents || [])
      .map((v: any) => {
        const user = usersMap.get(v.registered_by)
        // Only include if user account exists
        if (!user || !user.id) {
          return null
        }
        
        return {
          // Primary ID from users table
          id: user.id,
          // Verification list ID
          verification_id: v.id,
          // Account details from users
          username: user.username,
          email: user.email,
          password_hash: user.password_hash || '',
          university_email: user.university_email || null,
          role: user.role || 'student',
          is_active: user.is_active ?? true,
          created_at: user.created_at || v.created_at,
          updated_at: user.updated_at || v.updated_at,
          last_login: user.last_login || null,
          // Student info from verification_list (source of truth)
          full_name: v.full_name,
          section_number: v.section_number,
          group_name: v.group_name,
          registered_at: v.registered_at,
          registered_by: v.registered_by,
        }
      })
      .filter((s: any) => s !== null) // Remove null entries

    // Calculate statistics
    const now = Date.now()
    const last24Hours = now - (24 * 60 * 60 * 1000)
    const last7Days = now - (7 * 24 * 60 * 60 * 1000)
    const last30Days = now - (30 * 24 * 60 * 60 * 1000)

    const bySection: Record<number, number> = {}
    const byGroup: Record<string, number> = {}
    let loggedInLast24Hours = 0
    let loggedInLast7Days = 0
    let newInLast30Days = 0

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
        if (s.registered_at) {
          const registeredTime = new Date(s.registered_at).getTime()
          if (registeredTime >= last30Days) {
            newInLast30Days++
          }
        }
      }
    }

    const statistics = {
      total: students.length,
      loggedInLast24Hours,
      loggedInLast7Days,
      newInLast30Days,
      bySection,
      byGroup,
    }

    // Add cache control headers
    const headers = new Headers()
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    headers.set('Pragma', 'no-cache')
    headers.set('Expires', '0')
    headers.set('Surrogate-Control', 'no-store')

    return NextResponse.json({
      success: true,
      students,
      statistics,
      count: students.length,
    }, { headers })
  } catch (error) {
    logger.error('[Admin Students List API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


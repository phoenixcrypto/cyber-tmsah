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

    // NEW APPROACH: Fetch from verification_list as the source of truth
    // Get all registered students from verification_list and join with users for account details
    logger.debug('[Admin Students API] Fetching registered students from verification_list (source of truth)')
    
    // First, get all registered students from verification_list
    const { data: registeredStudents, error: verificationError } = await supabase
      .from('verification_list')
      .select('id, full_name, section_number, group_name, is_registered, registered_at, registered_by, created_at, updated_at')
      .eq('is_registered', true)
      .order('registered_at', { ascending: false })

    if (verificationError) {
      logger.error('[Admin Students API] Error fetching from verification_list:', verificationError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch students',
          details: verificationError.message || 'Unknown error'
        },
        { status: 500 }
      )
    }

    // Then, get user account details for each registered student
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
        logger.error('[Admin Students API] Error fetching users:', usersError)
      } else {
        usersData = users || []
      }
    }

    // Create a map for quick lookup
    const usersMap = new Map(usersData.map((u: any) => [u.id, u]))

    logger.debug('[Admin Students API] Fetched registered students:', {
      count: registeredStudents?.length || 0,
      usersCount: usersData.length,
      sample: registeredStudents?.slice(0, 3).map((s: any) => ({
        id: s.id,
        full_name: s.full_name,
        registered_by: s.registered_by,
        hasUser: usersMap.has(s.registered_by),
      })) || [],
    })

    // Map verification_list data with user account data
    // verification_list is the source of truth - only show registered students
    const students = (registeredStudents || [])
      .map((v: any) => {
        const user = usersMap.get(v.registered_by)
        // Only include if user account exists
        if (!user || !user.id) {
          logger.debug('[Admin Students API] Skipping student without user account:', {
            verification_id: v.id,
            full_name: v.full_name,
            registered_by: v.registered_by,
          })
          return null
        }
        
        return {
          // Primary ID from users table (for compatibility)
          id: user.id,
          // Verification list ID (for unregister functionality)
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

    // Final validation: Log if we still have the problematic student
    const zeyadInResults = students.find((s: any) => 
      s?.full_name?.includes('زياد محمد') || 
      s?.username === 'zeyadmohamed' ||
      s?.email?.includes('zeyadeltmsah')
    )
    
    if (zeyadInResults) {
      logger.error('[Admin Students API] CRITICAL: Student still in results after verification!', {
        id: zeyadInResults.id,
        username: zeyadInResults.username,
        full_name: zeyadInResults.full_name,
      })
    }

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

    // Return response with no-cache headers to ensure fresh data
    const response = NextResponse.json({
      success: true,
      students: students || [],
      statistics: stats,
    })

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Students fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


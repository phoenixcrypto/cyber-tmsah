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
      return NextResponse.json(
        { error: 'Admin account not found or inactive' },
        { status: 403 }
      )
    }

    // Get all students (role = 'student') with required data only
    // Using service role key bypasses RLS, so we can fetch all students
    // Select only needed columns for better performance
    const { data: studentsRaw, error: studentsError } = await supabase
      .from('users')
      .select('id, username, email, password_hash, full_name, section_number, group_name, university_email, role, is_active, created_at, updated_at, last_login')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    if (studentsError) {
      console.error('[Admin Students API] Error fetching students:', studentsError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch students',
          details: studentsError.message || 'Unknown error'
        },
        { status: 500 }
      )
    }

    // Map the results to match expected format (already in correct format from select)
    const students = (studentsRaw || []).map((s: any) => ({
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
    const stats = {
      total: students.length,
      active: 0,
      inactive: 0,
      bySection: {} as Record<number, number>,
      byGroup: {} as Record<string, number>,
    }

    // Single pass for all statistics
    for (const s of students) {
      if (s.is_active) {
        stats.active++
      } else {
        stats.inactive++
      }
      
      if (s.section_number) {
        stats.bySection[s.section_number] = (stats.bySection[s.section_number] || 0) + 1
      }
      
      if (s.group_name) {
        stats.byGroup[s.group_name] = (stats.byGroup[s.group_name] || 0) + 1
      }
    }

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


import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyToken } from '@/lib/security/jwt'
import { rateLimit } from '@/lib/security/rateLimit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/verification/list
 * Get all students from verification_list (Admin only)
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
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)) } }
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
    const isRegistered = searchParams.get('is_registered')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('verification_list')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (section) {
      query = query.eq('section_number', parseInt(section))
    }

    if (group) {
      query = query.eq('group_name', group)
    }

    if (isRegistered !== null) {
      query = query.eq('is_registered', isRegistered === 'true')
    }

    if (search) {
      query = query.ilike('full_name', `%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching verification list:', error)
      return NextResponse.json(
        { error: 'Failed to fetch verification list' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      students: data || [],
      count: data?.length || 0,
    })
  } catch (error) {
    console.error('Verification list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


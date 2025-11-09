import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/security/jwt'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Verify admin access from API request
 * Returns admin user data or null if not admin
 * Use this in API routes for consistent admin verification
 */
export async function verifyAdminFromRequest(request: NextRequest): Promise<{ user: any; payload: any } | null> {
  try {
    // Get token from cookie or header
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : request.cookies.get('access_token')?.value

    if (!accessToken) {
      return null
    }

    // Verify token
    const payload = verifyToken(accessToken)
    if (!payload || payload.role !== 'admin') {
      return null
    }

    // Verify admin is active in database
    const supabase = createAdminClient()
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, role, is_active')
      .eq('id', payload.userId)
      .eq('role', 'admin')
      .eq('is_active', true)
      .single()

    if (error || !user) {
      return null
    }

    return { user, payload }
  } catch {
    return null
  }
}

/**
 * Server-side admin verification
 * Returns admin user data or redirects to login
 */
export async function requireAdmin() {
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Get token from cookie or header
  const accessToken = 
    headersList.get('authorization')?.startsWith('Bearer ')
      ? headersList.get('authorization')!.substring(7)
      : cookieStore.get('access_token')?.value

  if (!accessToken) {
    redirect('/login?redirect=/admin')
  }

  // Verify token
  const payload = verifyToken(accessToken)
  if (!payload || payload.role !== 'admin') {
    redirect('/login?redirect=/admin')
  }

  // Verify admin is active in database
  const supabase = createAdminClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, email, full_name, role, is_active')
    .eq('id', payload.userId)
    .eq('role', 'admin')
    .eq('is_active', true)
    .single()

  if (error || !user) {
    redirect('/login?redirect=/admin')
  }

  return {
    user,
    payload,
  }
}

/**
 * Check if user is admin (returns null instead of redirecting)
 * Useful for conditional rendering
 */
export async function checkAdmin(): Promise<{ user: any; payload: any } | null> {
  try {
    const cookieStore = await cookies()
    const headersList = await headers()
    
    const accessToken = 
      headersList.get('authorization')?.startsWith('Bearer ')
        ? headersList.get('authorization')!.substring(7)
        : cookieStore.get('access_token')?.value

    if (!accessToken) {
      return null
    }

    const payload = verifyToken(accessToken)
    if (!payload || payload.role !== 'admin') {
      return null
    }

    const supabase = createAdminClient()
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, role, is_active')
      .eq('id', payload.userId)
      .eq('role', 'admin')
      .eq('is_active', true)
      .single()

    if (error || !user) {
      return null
    }

    return { user, payload }
  } catch {
    return null
  }
}


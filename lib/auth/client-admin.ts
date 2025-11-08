/**
 * Client-side admin verification helper
 * Verifies admin access by calling API endpoint
 */

export interface AdminVerificationResult {
  isAdmin: boolean
  error?: string
}

/**
 * Verify if current user is admin by calling API
 * This ensures server-side verification is always performed
 */
export async function verifyAdminAccess(): Promise<AdminVerificationResult> {
  try {
    // Get access token from cookies
    const cookies = document.cookie.split(';')
    const accessTokenCookie = cookies.find(c => c.trim().startsWith('access_token='))
    const accessToken = accessTokenCookie?.split('=')[1]

    if (!accessToken) {
      return { isAdmin: false, error: 'No access token found' }
    }

    // Call API to verify admin access
    const response = await fetch('/api/admin/verify', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return { isAdmin: false, error: data.error || 'Failed to verify admin access' }
    }

    const data = await response.json()
    return { isAdmin: data.isAdmin === true, error: data.error }
  } catch (error) {
    console.error('Admin verification error:', error)
    return { isAdmin: false, error: 'Error verifying admin access' }
  }
}

/**
 * Quick check if token exists and has admin role (client-side only, not secure)
 * Use verifyAdminAccess() for secure verification
 */
export function quickCheckAdminRole(): boolean {
  try {
    const cookies = document.cookie.split(';')
    const accessTokenCookie = cookies.find(c => c.trim().startsWith('access_token='))
    const accessToken = accessTokenCookie?.split('=')[1]

    if (!accessToken) {
      return false
    }

    const payload = JSON.parse(atob(accessToken.split('.')[1] || ''))
    return payload.role === 'admin'
  } catch {
    return false
  }
}


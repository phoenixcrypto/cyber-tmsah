/**
 * Authentication utilities for Admin Panel
 */

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin-token')
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('admin-authenticated') === 'true' && !!getAuthToken()
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth')
    if (response.ok) {
      const data = await response.json()
      return data.authenticated === true
    }
    return false
  } catch (error) {
    return false
  }
}

export function requireAuth(request: Request): boolean {
  // Check for auth header or cookie
  const authHeader = request.headers.get('authorization')
  const cookieHeader = request.headers.get('cookie')
  
  if (authHeader?.startsWith('Bearer ')) {
    return true
  }
  
  if (cookieHeader?.includes('admin-token=')) {
    return true
  }
  
  return false
}


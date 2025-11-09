/**
 * Token refresh utility functions
 * Provides automatic token refresh mechanism for client-side API calls
 */

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || ''))
    if (!payload.exp) return true
    return payload.exp < Date.now() / 1000
  } catch {
    return true
  }
}

/**
 * Get access token from cookies
 */
export function getAccessToken(): string {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1] || ''
}

/**
 * Refresh access token using refresh token
 * @returns New access token or null if refresh failed
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json()
      if (refreshData.accessToken) {
        // Update cookie manually to ensure it's available immediately
        const maxAge = 60 * 60 * 24 // 24 hours
        document.cookie = `access_token=${refreshData.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`
        return refreshData.accessToken
      }
    }
    return null
  } catch (error) {
    console.error('Token refresh error:', error)
    return null
  }
}

/**
 * Get a valid access token, refreshing if necessary
 * @param redirectToLogin Callback to redirect to login if refresh fails
 * @returns Valid access token or null if authentication failed
 */
export async function getValidAccessToken(
  redirectToLogin?: () => void
): Promise<string | null> {
  let token = getAccessToken()

  // Check if token is expired or missing
  if (!token || isTokenExpired(token)) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      token = newToken
    } else {
      // Refresh failed - redirect to login
      if (redirectToLogin) {
        redirectToLogin()
      }
      return null
    }
  }

  return token
}

/**
 * Make an authenticated fetch request with automatic token refresh
 * @param url API endpoint URL
 * @param options Fetch options
 * @param redirectToLogin Callback to redirect to login if authentication fails
 * @returns Response object or null if authentication failed
 */
// Track last activity update to avoid too frequent calls
// Use sessionStorage to persist across page reloads
const ACTIVITY_UPDATE_INTERVAL = 30 * 1000 // 30 seconds
const ACTIVITY_STORAGE_KEY = 'cyber_tmsah_last_activity_update'

function getLastActivityUpdate(): number {
  if (typeof window === 'undefined') return 0
  const stored = sessionStorage.getItem(ACTIVITY_STORAGE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

function setLastActivityUpdate(timestamp: number) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(ACTIVITY_STORAGE_KEY, timestamp.toString())
}

async function updateUserActivity(token: string) {
  // Only update if enough time has passed since last update
  const now = Date.now()
  const lastUpdate = getLastActivityUpdate()
  
  if (now - lastUpdate < ACTIVITY_UPDATE_INTERVAL) {
    return
  }

  setLastActivityUpdate(now)

  // Update activity in background (don't wait for response)
  fetch('/api/user/activity', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        console.log('[Activity] User activity updated successfully')
      } else {
        console.warn('[Activity] Failed to update activity:', res.status)
      }
    })
    .catch((err) => {
      console.warn('[Activity] Error updating activity:', err)
      // Ignore errors - activity update is not critical
    })
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  redirectToLogin?: () => void
): Promise<Response | null> {
  // Get valid token (refresh if needed)
  const token = await getValidAccessToken(redirectToLogin)
  if (!token) {
    return null
  }

  // Update user activity (non-blocking)
  updateUserActivity(token)

  // Merge headers to include cache control and authorization
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Cache-Control')) {
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  }
  if (!headers.has('Pragma')) {
    headers.set('Pragma', 'no-cache')
  }
  
  // Make request with token
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: headers,
  })

  // If 401, try refreshing token once more and retry
  if (response.status === 401) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      // Update activity with new token
      updateUserActivity(newToken)
      
      // Retry with new token
      const retryHeaders = new Headers(options.headers)
      retryHeaders.set('Content-Type', 'application/json')
      retryHeaders.set('Authorization', `Bearer ${newToken}`)
      if (!retryHeaders.has('Cache-Control')) {
        retryHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      }
      if (!retryHeaders.has('Pragma')) {
        retryHeaders.set('Pragma', 'no-cache')
      }
      
      return fetch(url, {
        ...options,
        credentials: 'include',
        headers: retryHeaders,
      })
    } else {
      // Refresh failed - redirect to login
      if (redirectToLogin) {
        redirectToLogin()
      }
      return null
    }
  }

  return response
}


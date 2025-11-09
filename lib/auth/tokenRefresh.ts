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

  // Make request with token
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })

  // If 401, try refreshing token once more and retry
  if (response.status === 401) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      // Retry with new token
      return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
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


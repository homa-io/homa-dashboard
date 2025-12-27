/**
 * JWT Token Utilities
 */

interface JWTPayload {
  exp?: number
  iat?: number
  [key: string]: unknown
}

/**
 * Decode JWT token (without verification - client-side only)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as JWTPayload
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 * @param token JWT token string
 * @param bufferSeconds Optional buffer time in seconds (default: 60)
 * @returns true if token is expired or will expire within buffer time
 */
export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const payload = decodeJWT(token)

  if (!payload || !payload.exp) {
    return true
  }

  const now = Math.floor(Date.now() / 1000)
  const expirationTime = payload.exp - bufferSeconds

  return now >= expirationTime
}

/**
 * Get access token from cookies
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null

  const cookies = document.cookie.split('; ')
  const tokenCookie = cookies.find(c => c.startsWith('access_token='))
  return tokenCookie ? tokenCookie.split('=')[1] : null
}

/**
 * Check if user session is valid (has valid, non-expired token)
 */
export function isSessionValid(): boolean {
  const token = getAccessToken()

  if (!token) {
    return false
  }

  return !isTokenExpired(token)
}

/**
 * Clear all auth cookies and redirect to login
 */
export function logoutAndRedirect(redirectTo = '/login') {
  // Clear auth cookies
  if (typeof window !== 'undefined') {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // Redirect to login
    window.location.href = redirectTo
  }
}

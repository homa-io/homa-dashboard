/**
 * Cookie management utilities
 * Handles secure cookie operations for authentication tokens
 */

export interface CookieOptions {
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

/**
 * Set a cookie with the given name and value
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return

  const {
    maxAge = 60 * 60 * 24 * 180, // 180 days (6 months) default
    path = '/',
    secure = true,
    sameSite = 'lax',
  } = options

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (maxAge) {
    cookieString += `; max-age=${maxAge}`
  }

  if (path) {
    cookieString += `; path=${path}`
  }

  if (secure) {
    cookieString += '; secure'
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const nameEQ = encodeURIComponent(name) + '='
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length))
    }
  }

  return null
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') return

  document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=${path}`
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null
}

/**
 * Set authentication tokens in cookies
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
  // Set access token with 6 months expiration
  setCookie('access_token', accessToken, {
    maxAge: 60 * 60 * 24 * 180, // 6 months
    secure: true,
    sameSite: 'lax',
  })

  // Set refresh token with 6 months expiration
  setCookie('refresh_token', refreshToken, {
    maxAge: 60 * 60 * 24 * 180, // 6 months
    secure: true,
    sameSite: 'lax',
  })
}

/**
 * Get access token from cookies
 */
export function getAccessToken(): string | null {
  return getCookie('access_token')
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(): string | null {
  return getCookie('refresh_token')
}

/**
 * Clear all authentication cookies
 */
export function clearAuthTokens(): void {
  deleteCookie('access_token')
  deleteCookie('refresh_token')
}

/**
 * Check if user is authenticated (has access token)
 */
export function isAuthenticated(): boolean {
  return hasCookie('access_token')
}

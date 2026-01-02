/**
 * Authentication service layer
 * Handles all authentication-related API operations
 */

import { apiClient, type ApiResponse } from './api-client'
import { setAuthTokens, clearAuthTokens, getRefreshToken } from '@/lib/cookies'
import { safeStorage } from '@/lib/storage'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: User
}

export interface User {
  id: string
  name: string
  last_name?: string
  display_name: string
  email: string
  avatar?: string | null
  type: string
  language?: string
  created_at: string
  updated_at: string
  // Optional fields for backwards compatibility
  role?: 'admin' | 'agent' | 'manager'
  permissions?: string[]
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: 'agent' | 'manager'
}

export interface ResetPasswordRequest {
  email: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UpdateProfileRequest {
  name?: string
  avatar?: string
  language?: string
  preferences?: Partial<UserPreferences>
}

export interface RefreshTokenRequest {
  refreshToken: string
}

class AuthService {
  private readonly basePath = '/api/auth'

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<LoginResponse>(`${this.basePath}/login`, credentials)

      if (response.success && response.data.access_token) {
        // Store tokens in cookies (6 months duration)
        setAuthTokens(response.data.access_token, response.data.refresh_token)

        // Store user data in localStorage for quick access
        safeStorage.setItem('user', response.data.user)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      // Note: Backend may not have a logout endpoint, so we just clear local data
      // await apiClient.post<void>(`${this.basePath}/logout`)

      // Clear client-side data
      this.clearAuthData()
    } catch (error) {
      // Still clear local data even if logout API fails
      this.clearAuthData()
      throw error
    }
  }

  /**
   * Initiate OAuth login with a provider
   * @param provider - OAuth provider (google, microsoft)
   * @param redirectUrl - URL to redirect after OAuth success
   */
  initiateOAuthLogin(provider: 'google' | 'microsoft', redirectUrl?: string): void {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const redirect = redirectUrl || `${baseUrl}/auth/callback`
    const oauthUrl = `${this.basePath}/oauth/${provider}?redirect_url=${encodeURIComponent(redirect)}`

    // Redirect to OAuth provider
    if (typeof window !== 'undefined') {
      window.location.href = `${apiClient['baseURL']}${oauthUrl}`
    }
  }

  /**
   * Get available OAuth providers
   */
  async getOAuthProviders(): Promise<ApiResponse<{ providers: string[] }>> {
    return apiClient.get<{ providers: string[] }>(`${this.basePath}/oauth/providers`)
  }

  /**
   * Handle OAuth callback
   * Processes OAuth response from URL parameters
   */
  handleOAuthCallback(): LoginResponse | null {
    if (typeof window === 'undefined') return null

    const urlParams = new URLSearchParams(window.location.search)
    const oauth = urlParams.get('oauth')

    if (oauth === 'success') {
      const data = urlParams.get('data')
      if (data) {
        try {
          const decodedData = atob(decodeURIComponent(data))
          const oauthResponse = JSON.parse(decodedData) as LoginResponse

          // Store tokens in cookies
          setAuthTokens(oauthResponse.access_token, oauthResponse.refresh_token)

          // Store user data
          safeStorage.setItem('user', oauthResponse.user)

          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)

          return oauthResponse
        } catch (e) {
          console.error('Failed to parse OAuth response:', e)
        }
      }
    } else if (oauth === 'error') {
      const message = urlParams.get('message')
      throw new Error(decodeURIComponent(message || 'OAuth authentication failed'))
    }

    return null
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>(`${this.basePath}/register`, userData)
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.basePath}/reset-password`, data)
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.basePath}/reset-password/confirm`, {
      token,
      password: newPassword,
    })
  }

  /**
   * Change current user's password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.basePath}/change-password`, data)
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.basePath}/profile`)
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateProfileRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.patch<User>(`${this.basePath}/profile`, updates)

    // Update local user data
    if (response.success) {
      safeStorage.setItem('user', response.data)
    }

    return response
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<{ access_token: string; expires_in: number }>> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<{ access_token: string; refresh_token: string; expires_in: number }>(
      `${this.basePath}/refresh-token`,
      { refresh_token: refreshToken }
    )

    if (response.success && response.data.access_token) {
      setAuthTokens(response.data.access_token, response.data.refresh_token)
    }

    return response
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.basePath}/verify-email`, { token })
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.basePath}/verify-email/resend`)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false

    const { isAuthenticated } = require('@/lib/cookies')
    return isAuthenticated()
  }

  /**
   * Get current user from local storage
   */
  getCurrentUser(): User | null {
    return safeStorage.getItem<User>('user')
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    if (typeof window === 'undefined') return

    clearAuthTokens()
    safeStorage.removeItem('user')
  }

  /**
   * Setup automatic token refresh
   */
  setupTokenRefresh(): void {
    if (typeof window === 'undefined') return

    // Check token expiration every 5 minutes
    setInterval(async () => {
      if (this.isAuthenticated()) {
        try {
          await this.refreshToken()
        } catch (error) {
          console.warn('Token refresh failed:', error)
          // Optionally redirect to login
        }
      }
    }, 5 * 60 * 1000) // 5 minutes
  }
}

export const authService = new AuthService()
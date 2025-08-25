/**
 * Authentication service layer
 * Handles all authentication-related API operations
 */

import { apiClient, type ApiResponse } from './api-client'

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'agent' | 'manager'
  permissions: string[]
  preferences: UserPreferences
  createdAt: Date
  lastLoginAt: Date
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
  preferences?: Partial<UserPreferences>
}

export interface RefreshTokenRequest {
  refreshToken: string
}

class AuthService {
  private readonly basePath = '/auth'

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<LoginResponse>(`${this.basePath}/login`, credentials)
      
      if (response.success && response.data.token) {
        // Store token in client
        apiClient.setAuthToken(response.data.token)
        
        // Store user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user))
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken)
          }
        }
      }
      
      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(`${this.basePath}/logout`)
      
      // Clear client-side data regardless of API response
      this.clearAuthData()
      
      return response
    } catch (error) {
      // Still clear local data even if logout API fails
      this.clearAuthData()
      throw error
    }
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
    if (response.success && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    
    return response
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<{ token: string; expiresIn: number }>(
      `${this.basePath}/refresh-token`,
      { refreshToken }
    )

    if (response.success) {
      apiClient.setAuthToken(response.data.token)
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
    
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    
    return !!(token && user)
  }

  /**
   * Get current user from local storage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  /**
   * Get refresh token from local storage
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refreshToken')
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    if (typeof window === 'undefined') return
    
    apiClient.clearAuthToken()
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    sessionStorage.clear()
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
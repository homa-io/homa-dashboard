/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */

'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService, User, LoginRequest } from '@/services/auth.service'
import { isAuthenticated } from '@/lib/cookies'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  loginWithOAuth: (provider: 'google' | 'microsoft') => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  // Check for OAuth callback on mount
  useEffect(() => {
    try {
      const oauthResponse = authService.handleOAuthCallback()
      if (oauthResponse) {
        setUser(oauthResponse.user)
        setAuthenticated(true)
      }
    } catch (error) {
      console.error('OAuth callback error:', error)
    }
  }, [])

  const initializeAuth = async () => {
    try {
      if (isAuthenticated()) {
        // Get user from localStorage or fetch from API
        const storedUser = authService.getCurrentUser()
        if (storedUser) {
          setUser(storedUser)
          setAuthenticated(true)
        } else {
          // Fetch user profile from API
          await refreshUser()
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      // Clear invalid auth state
      await logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      const response = await authService.login(credentials)

      if (response.success && response.data.user) {
        setUser(response.data.user)
        setAuthenticated(true)
      } else {
        throw new Error('Login failed: No user data returned')
      }
    } catch (error) {
      setUser(null)
      setAuthenticated(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setAuthenticated(false)
      setIsLoading(false)
    }
  }

  const loginWithOAuth = (provider: 'google' | 'microsoft') => {
    authService.initiateOAuthLogin(provider)
  }

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
        setAuthenticated(true)

        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data))
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: authenticated,
    isLoading,
    login,
    logout,
    loginWithOAuth,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

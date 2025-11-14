/**
 * OAuth Callback Page
 * Handles OAuth redirects from providers (Google, Microsoft)
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'

export default function OAuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = () => {
      try {
        const response = authService.handleOAuthCallback()

        if (response) {
          // Successfully authenticated, redirect to dashboard
          router.push('/')
        } else {
          // No OAuth response, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        // Redirect to login with error
        router.push('/login?error=oauth_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg font-medium">Completing authentication...</p>
        <p className="text-white/70 text-sm mt-2">Please wait while we sign you in</p>
      </div>
    </div>
  )
}

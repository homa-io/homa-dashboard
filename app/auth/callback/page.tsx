/**
 * OAuth Callback Page
 * Handles OAuth redirects from providers (Google, Microsoft)
 */

'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { Logo } from '@/components/Logo'

// Floating background orbs
function FloatingOrbs() {
  const orbs = useMemo(() => [
    { size: 300, x: '10%', y: '20%', delay: 0, color: 'from-blue-500/20 to-purple-500/20' },
    { size: 200, x: '70%', y: '60%', delay: 2, color: 'from-emerald-500/15 to-cyan-500/15' },
    { size: 150, x: '80%', y: '10%', delay: 4, color: 'from-pink-500/15 to-rose-500/15' },
    { size: 100, x: '20%', y: '70%', delay: 1, color: 'from-amber-500/10 to-orange-500/10' },
    { size: 180, x: '50%', y: '40%', delay: 3, color: 'from-violet-500/15 to-indigo-500/15' },
  ], [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            animation: `float 6s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      {/* Floating orbs background */}
      <FloatingOrbs />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="text-center relative z-10">
        {/* Logo with glow */}
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-violet-500/50 rounded-2xl blur-xl opacity-50 animate-pulse" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
            <Logo variant="white" size="lg" className="scale-150" />
          </div>
        </div>

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />

        {/* Text */}
        <h1 className="text-white text-xl font-semibold mb-2">Completing authentication...</h1>
        <p className="text-white/50 text-sm">Please wait while we sign you in</p>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-4 inset-x-0 text-center">
        <p className="text-white/30 text-xs">© 2025 All Rights Reserved.</p>
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isSessionValid, logoutAndRedirect } from '@/utils/jwt'

/**
 * AuthGuard component - checks JWT validity and redirects to login if expired
 * Should be placed in the root layout to protect all routes
 */
export function AuthGuard() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/login') {
      return
    }

    // Check if session is valid
    if (!isSessionValid()) {
      console.warn('Session expired or invalid - redirecting to login')
      logoutAndRedirect('/login')
    }

    // Set up periodic check (every 60 seconds)
    const interval = setInterval(() => {
      if (!isSessionValid()) {
        console.warn('Session expired - redirecting to login')
        logoutAndRedirect('/login')
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [pathname, router])

  return null
}

/**
 * Activity Tracker Hook
 * Tracks user activity with heartbeat mechanism and cookie-based session persistence
 *
 * Features:
 * - Session ID stored in cookie (expires after 1 hour of inactivity)
 * - Cookie lifetime extends on each heartbeat
 * - Tab ID stored in sessionStorage (unique per tab)
 * - Heartbeat every 30 seconds
 * - Handles visibility change (pause when tab hidden)
 */

import { useEffect, useRef, useCallback } from 'react'
import { sessionsService } from '@/services/sessions.service'
import { useAuth } from '@/contexts/AuthContext'

const HEARTBEAT_INTERVAL = 30000 // 30 seconds
const COOKIE_EXPIRY_HOURS = 1 // Cookie expires after 1 hour of inactivity
const SESSION_COOKIE_NAME = 'homa_session_id'
const TAB_ID_KEY = 'homa_tab_id'

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function getDeviceInfo(): Record<string, unknown> {
  if (typeof window === 'undefined') return {}

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
  }
}

// Cookie helper functions
function setCookie(name: string, value: string, hours: number): void {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length))
    }
  }
  return null
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

function getOrCreateSessionId(): { sessionId: string; isNew: boolean } {
  if (typeof window === 'undefined') return { sessionId: '', isNew: false }

  const existingSessionId = getCookie(SESSION_COOKIE_NAME)
  if (existingSessionId) {
    // Extend cookie expiry on access
    setCookie(SESSION_COOKIE_NAME, existingSessionId, COOKIE_EXPIRY_HOURS)
    return { sessionId: existingSessionId, isNew: false }
  }

  // Create new session ID
  const newSessionId = generateUUID()
  setCookie(SESSION_COOKIE_NAME, newSessionId, COOKIE_EXPIRY_HOURS)
  return { sessionId: newSessionId, isNew: true }
}

function extendSessionCookie(): void {
  const sessionId = getCookie(SESSION_COOKIE_NAME)
  if (sessionId) {
    setCookie(SESSION_COOKIE_NAME, sessionId, COOKIE_EXPIRY_HOURS)
  }
}

function getOrCreateTabId(): string {
  if (typeof window === 'undefined') return ''

  let tabId = sessionStorage.getItem(TAB_ID_KEY)
  if (!tabId) {
    tabId = generateUUID()
    sessionStorage.setItem(TAB_ID_KEY, tabId)
  }
  return tabId
}

export function useActivityTracker() {
  const { user, isAuthenticated } = useAuth()
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const sessionIdRef = useRef<string>('')
  const tabIdRef = useRef<string>('')
  const isActiveRef = useRef<boolean>(true)
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null)
  const isSessionStartedRef = useRef<boolean>(false)

  // Clear session cookie on logout
  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      deleteCookie(SESSION_COOKIE_NAME)
      sessionStorage.removeItem(TAB_ID_KEY)
    }
    sessionIdRef.current = ''
    tabIdRef.current = ''
    isSessionStartedRef.current = false
  }, [])

  // Start session
  const startSession = useCallback(async () => {
    if (!isAuthenticated || !user) return

    try {
      const { sessionId, isNew } = getOrCreateSessionId()
      const tabId = getOrCreateTabId()
      sessionIdRef.current = sessionId
      tabIdRef.current = tabId

      await sessionsService.startSession({
        session_id: sessionId,
        tab_id: tabId,
        device_info: isNew ? getDeviceInfo() : undefined,
      })

      isSessionStartedRef.current = true
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }, [isAuthenticated, user])

  // Send heartbeat
  const sendHeartbeat = useCallback(async () => {
    if (!isAuthenticated || !isActiveRef.current || !sessionIdRef.current) return

    try {
      await sessionsService.heartbeat({
        session_id: sessionIdRef.current,
        tab_id: tabIdRef.current,
      })
      // Extend cookie on successful heartbeat
      extendSessionCookie()
    } catch (error: unknown) {
      // If session not found, restart it
      if (error && typeof error === 'object' && 'message' in error) {
        const errMessage = (error as { message: string }).message
        if (errMessage.includes('SESSION_NOT_FOUND') || errMessage.includes('session not found')) {
          // Session expired on server, create new one
          deleteCookie(SESSION_COOKIE_NAME)
          isSessionStartedRef.current = false
          await startSession()
        }
      }
      console.error('Heartbeat failed:', error)
    }
  }, [isAuthenticated, startSession])

  // End session
  const endSession = useCallback(async (reason: 'logout' | 'tab_close' | 'window_close' = 'tab_close') => {
    if (!sessionIdRef.current) return

    try {
      await sessionsService.endSession({
        session_id: sessionIdRef.current,
        tab_id: tabIdRef.current,
        reason,
      })
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }, [])

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      isActiveRef.current = false
    } else {
      isActiveRef.current = true
      // Check if cookie still exists and extend it
      const sessionId = getCookie(SESSION_COOKIE_NAME)
      if (sessionId && sessionId === sessionIdRef.current) {
        extendSessionCookie()
        sendHeartbeat()
      } else if (isAuthenticated) {
        // Cookie expired, restart session
        startSession()
      }
    }
  }, [sendHeartbeat, isAuthenticated, startSession])

  // Handle before unload - use sendBeacon for reliable delivery
  const handleBeforeUnload = useCallback(() => {
    if (sessionIdRef.current && typeof navigator.sendBeacon === 'function') {
      const data = JSON.stringify({
        session_id: sessionIdRef.current,
        tab_id: tabIdRef.current,
        reason: 'tab_close',
      })
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.getevo.dev'
      navigator.sendBeacon(`${baseUrl}/api/sessions/end`, data)
    }
  }, [])

  // Initialize tracking
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Clear interval when logged out
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
        heartbeatIntervalRef.current = null
      }
      return
    }

    // Initialize broadcast channel for cross-tab communication
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel('homa_activity')
      broadcastChannelRef.current.onmessage = (event) => {
        if (event.data.type === 'logout') {
          clearSession()
        }
      }
    }

    // Start session
    startSession()

    // Set up heartbeat interval
    heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL)

    // Set up visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Set up beforeunload listener
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close()
      }
    }
  }, [isAuthenticated, user, startSession, sendHeartbeat, handleVisibilityChange, handleBeforeUnload, clearSession])

  // Function to call on logout
  const onLogout = useCallback(async () => {
    await endSession('logout')
    clearSession()

    // Broadcast logout to other tabs
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'logout' })
    }
  }, [endSession, clearSession])

  return {
    sessionId: sessionIdRef.current,
    tabId: tabIdRef.current,
    onLogout,
    endSession,
    clearSession,
  }
}

export default useActivityTracker

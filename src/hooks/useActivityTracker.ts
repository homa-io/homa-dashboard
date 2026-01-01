/**
 * Activity Tracker Hook
 * Tracks user activity with heartbeat mechanism and multi-tab support
 *
 * Features:
 * - Session ID stored in localStorage (shared across tabs)
 * - Tab ID stored in sessionStorage (unique per tab)
 * - Heartbeat every 30 seconds
 * - Handles visibility change (pause when tab hidden)
 * - Handles beforeunload to end session on logout/close
 * - BroadcastChannel for cross-tab communication
 */

import { useEffect, useRef, useCallback } from 'react'
import { sessionsService } from '@/services/sessions.service'
import { useAuth } from '@/contexts/AuthContext'

const HEARTBEAT_INTERVAL = 30000 // 30 seconds
const SESSION_ID_KEY = 'homa_session_id'
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

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem(SESSION_ID_KEY)
  if (!sessionId) {
    sessionId = generateUUID()
    localStorage.setItem(SESSION_ID_KEY, sessionId)
  }
  return sessionId
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

  // Clear session ID on logout
  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_ID_KEY)
      sessionStorage.removeItem(TAB_ID_KEY)
    }
  }, [])

  // Start session
  const startSession = useCallback(async () => {
    if (!isAuthenticated || !user) return

    try {
      const sessionId = getOrCreateSessionId()
      const tabId = getOrCreateTabId()
      sessionIdRef.current = sessionId
      tabIdRef.current = tabId

      await sessionsService.startSession({
        session_id: sessionId,
        tab_id: tabId,
        device_info: getDeviceInfo(),
      })
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
    } catch (error: unknown) {
      // If session not found, restart it
      if (error && typeof error === 'object' && 'message' in error) {
        const errMessage = (error as { message: string }).message
        if (errMessage.includes('SESSION_NOT_FOUND') || errMessage.includes('session not found')) {
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
      // Send heartbeat when becoming visible again
      sendHeartbeat()
    }
  }, [sendHeartbeat])

  // Handle before unload
  const handleBeforeUnload = useCallback(() => {
    // Use sendBeacon for reliable delivery on page close
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

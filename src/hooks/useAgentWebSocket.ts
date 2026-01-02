/**
 * WebSocket hook for real-time updates on the conversations page
 * Connects to the backend agent WebSocket endpoint with JWT authentication
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { getAccessToken } from '@/lib/cookies'

export interface WebSocketMessage {
  type: string
  event?: string
  data?: unknown
  conversation_id?: number
  message?: unknown
}

export interface UseAgentWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
  autoReconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export interface UseAgentWebSocketReturn {
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  connect: () => void
  disconnect: () => void
  connectionError: string | null
}

export function useAgentWebSocket(
  options: UseAgentWebSocketOptions = {}
): UseAgentWebSocketReturn {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isUnmountedRef = useRef(false)

  // Use refs for callbacks to avoid reconnection when callbacks change
  const onMessageRef = useRef(onMessage)
  const onConnectRef = useRef(onConnect)
  const onDisconnectRef = useRef(onDisconnect)
  const onErrorRef = useRef(onError)

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    onConnectRef.current = onConnect
  }, [onConnect])

  useEffect(() => {
    onDisconnectRef.current = onDisconnect
  }, [onDisconnect])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const getWebSocketUrl = useCallback(() => {
    const token = getAccessToken()
    if (!token) {
      throw new Error('No authentication token available')
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.getevo.dev'
    // Convert http(s) to ws(s)
    const wsUrl = apiUrl.replace(/^http/, 'ws')
    return `${wsUrl}/ws/agent?token=${encodeURIComponent(token)}`
  }, [])

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return // Already connected
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    try {
      const url = getWebSocketUrl()
      setConnectionError(null)

      const ws = new WebSocket(url)

      ws.onopen = () => {
        if (isUnmountedRef.current) {
          ws.close()
          return
        }
        console.log('Agent WebSocket connected successfully')
        setIsConnected(true)
        setConnectionError(null)
        reconnectAttempts.current = 0
        onConnectRef.current?.()
      }

      ws.onmessage = (event) => {
        if (isUnmountedRef.current) return

        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log('Agent WebSocket message received:', message)
          setLastMessage(message)
          onMessageRef.current?.(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        if (isUnmountedRef.current) return
        console.error('WebSocket error:', error)
        setConnectionError('WebSocket connection error')
        onErrorRef.current?.(error)
      }

      ws.onclose = (event) => {
        if (isUnmountedRef.current) return

        console.log('Agent WebSocket disconnected, code:', event.code, 'reason:', event.reason)
        setIsConnected(false)
        onDisconnectRef.current?.()

        // Attempt to reconnect if enabled and not a normal closure
        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts && event.code !== 1000) {
          reconnectAttempts.current += 1
          console.log(
            `WebSocket disconnected. Reconnecting (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})...`
          )
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              connect()
            }
          }, reconnectInterval)
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setConnectionError('Max reconnection attempts reached')
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      setConnectionError(
        error instanceof Error ? error.message : 'Failed to connect'
      )
    }
  }, [getWebSocketUrl, autoReconnect, maxReconnectAttempts, reconnectInterval])

  const disconnect = useCallback(() => {
    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    // Reset reconnect attempts
    reconnectAttempts.current = maxReconnectAttempts // Prevent auto-reconnect

    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect')
      wsRef.current = null
    }
    setIsConnected(false)
  }, [maxReconnectAttempts])

  // Connect on mount if token is available
  useEffect(() => {
    isUnmountedRef.current = false
    const token = getAccessToken()
    if (token) {
      connect()
    }

    return () => {
      isUnmountedRef.current = true
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted')
        wsRef.current = null
      }
    }
  }, [connect])

  return {
    isConnected,
    lastMessage,
    connect,
    disconnect,
    connectionError,
  }
}

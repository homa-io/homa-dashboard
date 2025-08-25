/**
 * Custom hooks for API operations with built-in loading and error states
 * Provides a consistent pattern for using services in components
 */

import { useState, useCallback } from 'react'
import type { ApiError, ApiResponse } from '@/services/api-client'

export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  success: boolean
}

export interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
  showToast?: boolean
}

/**
 * Generic hook for API operations with loading and error states
 */
export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  })

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }))

    try {
      const response = await apiCall()
      
      setState({
        data: response.data,
        loading: false,
        error: null,
        success: response.success,
      })

      if (options.onSuccess) {
        options.onSuccess(response.data)
      }

      return response.data
    } catch (error) {
      const apiError = error as ApiError
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
        success: false,
      }))

      if (options.onError) {
        options.onError(apiError)
      }

      return null
    }
  }, [options])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

/**
 * Hook for API operations that return paginated data
 */
export function usePaginatedApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T[]> & {
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    } | null
  }>({
    data: null,
    loading: false,
    error: null,
    success: false,
    pagination: null,
  })

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<{ data: T[]; pagination: any }>>
  ) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }))

    try {
      const response = await apiCall()
      
      setState({
        data: response.data.data,
        loading: false,
        error: null,
        success: response.success,
        pagination: response.data.pagination,
      })

      if (options.onSuccess) {
        options.onSuccess(response.data.data)
      }

      return response.data.data
    } catch (error) {
      const apiError = error as ApiError
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
        success: false,
      }))

      if (options.onError) {
        options.onError(apiError)
      }

      return null
    }
  }, [options])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
      pagination: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

/**
 * Hook for operations that don't return data (like delete, logout)
 */
export function useApiAction(options: UseApiOptions = {}) {
  const [state, setState] = useState<{
    loading: boolean
    error: ApiError | null
    success: boolean
  }>({
    loading: false,
    error: null,
    success: false,
  })

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<any>>
  ): Promise<boolean> => {
    setState({
      loading: true,
      error: null,
      success: false,
    })

    try {
      const response = await apiCall()
      
      setState({
        loading: false,
        error: null,
        success: response.success,
      })

      if (options.onSuccess) {
        options.onSuccess(response.data)
      }

      return response.success
    } catch (error) {
      const apiError = error as ApiError
      
      setState({
        loading: false,
        error: apiError,
        success: false,
      })

      if (options.onError) {
        options.onError(apiError)
      }

      return false
    }
  }, [options])

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
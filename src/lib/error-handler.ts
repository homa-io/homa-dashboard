/**
 * Centralized error handling utilities
 * Consolidates repeated error handling patterns across components
 */

import { toast } from '@/hooks/use-toast'

export interface ErrorHandlerOptions {
  successMessage?: string
  errorMessage?: string
  showSuccessToast?: boolean
  showErrorToast?: boolean
  logError?: boolean
}

const DEFAULT_OPTIONS: ErrorHandlerOptions = {
  errorMessage: 'An error occurred',
  showSuccessToast: false,
  showErrorToast: true,
  logError: true
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
    if ('error' in error && typeof error.error === 'string') {
      return error.error
    }
  }
  return 'An unexpected error occurred'
}

/**
 * Wrapper for async operations with error handling
 * Usage:
 *   const result = await withErrorHandling(
 *     () => apiService.createItem(data),
 *     { successMessage: 'Item created!', errorMessage: 'Failed to create item' }
 *   )
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T | null> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  try {
    const result = await fn()

    if (opts.showSuccessToast && opts.successMessage) {
      toast({
        title: 'Success',
        description: opts.successMessage
      })
    }

    return result
  } catch (error) {
    if (opts.logError) {
      console.error('Operation failed:', error)
    }

    if (opts.showErrorToast) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: getErrorMessage(error) || opts.errorMessage
      })
    }

    return null
  }
}

/**
 * Wrapper for sync operations with try-catch
 */
export function withTryCatch<T>(
  fn: () => T,
  fallback: T,
  options: Pick<ErrorHandlerOptions, 'logError' | 'errorMessage'> = {}
): T {
  try {
    return fn()
  } catch (error) {
    if (options.logError !== false) {
      console.error(options.errorMessage || 'Operation failed:', error)
    }
    return fallback
  }
}

/**
 * Show error toast with consistent styling
 */
export function showErrorToast(message: string, title: string = 'Error') {
  toast({
    variant: 'destructive',
    title,
    description: message
  })
}

/**
 * Show success toast with consistent styling
 */
export function showSuccessToast(message: string, title: string = 'Success') {
  toast({
    title,
    description: message
  })
}

/**
 * Handle API response errors consistently
 */
export function handleApiError(error: unknown, context: string = 'operation') {
  const message = getErrorMessage(error)
  console.error(`Failed to ${context}:`, error)
  showErrorToast(`Failed to ${context}: ${message}`)
}

/**
 * Type guard to check if response is an error
 */
export function isApiError(response: unknown): response is { error: string; success: false } {
  return (
    response !== null &&
    typeof response === 'object' &&
    'success' in response &&
    response.success === false
  )
}

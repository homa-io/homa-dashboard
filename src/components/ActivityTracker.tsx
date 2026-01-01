'use client'

/**
 * ActivityTracker Component
 * Silent component that tracks user activity in the background
 */

import { useActivityTracker } from '@/hooks/useActivityTracker'

export function ActivityTracker() {
  // Initialize activity tracking - this runs the heartbeat in the background
  useActivityTracker()

  // This component doesn't render anything visible
  return null
}

export default ActivityTracker

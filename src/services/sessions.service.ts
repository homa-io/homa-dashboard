/**
 * Sessions Service
 * Handles session tracking, heartbeat, and activity statistics
 */

import { apiClient } from './api-client'

export interface UserSession {
  id: number
  user_id: string
  session_id: string
  tab_id?: string
  ip_address: string
  user_agent: string
  device_info?: Record<string, unknown>
  started_at: string
  last_activity: string
  ended_at?: string
  is_active: boolean
  end_reason?: string
}

export interface DailyActivity {
  id: number
  user_id: string
  activity_date: string
  total_active_seconds: number
  first_activity: string
  last_activity: string
  session_count: number
}

export interface ActivitySummary {
  total_hours: number
  total_days: number
  average_hours_per_day: number
  period: string
  start_date: string
  end_date: string
}

export interface ActivityStats {
  month: string
  year: string
  chart_data: Array<{
    date: string
    hours: number
    active: boolean
  }>
  total_hours: number
  active_days: number
}

export interface StartSessionRequest {
  session_id: string
  tab_id?: string
  device_info?: Record<string, unknown>
}

export interface HeartbeatRequest {
  session_id: string
  tab_id?: string
}

export interface EndSessionRequest {
  session_id: string
  tab_id?: string
  reason?: 'logout' | 'tab_close' | 'window_close'
}

export const sessionsService = {
  // Session Management
  async startSession(data: StartSessionRequest): Promise<{ session_id: number; message: string }> {
    const response = await apiClient.post<{ session_id: number; message: string }>('/api/sessions/start', data)
    return response
  },

  async heartbeat(data: HeartbeatRequest): Promise<{ last_activity: string }> {
    const response = await apiClient.post<{ last_activity: string }>('/api/sessions/heartbeat', data)
    return response
  },

  async endSession(data: EndSessionRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/sessions/end', data)
    return response
  },

  // Session Listing
  async getMySessions(): Promise<{ sessions: UserSession[] }> {
    const response = await apiClient.get<{ sessions: UserSession[] }>('/api/sessions')
    return response
  },

  async getActiveSessions(): Promise<{ sessions: UserSession[] }> {
    const response = await apiClient.get<{ sessions: UserSession[] }>('/api/sessions/active')
    return response
  },

  async terminateSession(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/api/sessions/${id}`)
    return response
  },

  async terminateAllOtherSessions(currentSessionId: string): Promise<{ terminated_count: number; message: string }> {
    const response = await apiClient.post<{ terminated_count: number; message: string }>(
      '/api/sessions/terminate-all',
      { current_session_id: currentSessionId }
    )
    return response
  },

  // Activity Tracking
  async getDailyActivity(startDate?: string, endDate?: string): Promise<{ activities: DailyActivity[] }> {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    const queryString = params.toString()
    const url = queryString ? `/api/activity/daily?${queryString}` : '/api/activity/daily'
    const response = await apiClient.get<{ activities: DailyActivity[] }>(url)
    return response
  },

  async getActivitySummary(period?: 'week' | 'month' | 'year'): Promise<{ summary: ActivitySummary }> {
    const url = period ? `/api/activity/summary?period=${period}` : '/api/activity/summary'
    const response = await apiClient.get<{ summary: ActivitySummary }>(url)
    return response
  },

  async getActivityStats(month?: string, year?: string): Promise<{ stats: ActivityStats }> {
    const params = new URLSearchParams()
    if (month) params.append('month', month)
    if (year) params.append('year', year)
    const queryString = params.toString()
    const url = queryString ? `/api/activity/stats?${queryString}` : '/api/activity/stats'
    const response = await apiClient.get<{ stats: ActivityStats }>(url)
    return response
  },
}

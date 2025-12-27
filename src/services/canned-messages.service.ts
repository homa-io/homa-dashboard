/**
 * Canned Messages Service
 * Handles all canned message CRUD operations
 */

import { getAccessToken } from '@/lib/cookies'

export interface CannedMessage {
  id: number
  title: string
  message: string
  shortcut: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CannedMessageInput {
  title: string
  message: string
  shortcut?: string
  is_active?: boolean
}

export interface CannedMessagesListResponse {
  data: CannedMessage[]
  total: number
  page: number
  per_page: number
}

export interface CannedMessagesListParams {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

class CannedMessagesService {
  private readonly baseURL: string
  private readonly basePath = '/api/agent/canned-messages'

  constructor() {
    this.baseURL = typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_API_URL || 'https://api.getevo.dev')
      : 'http://127.0.0.1:8033'
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    const token = getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  async list(params?: CannedMessagesListParams): Promise<CannedMessagesListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.is_active !== undefined) searchParams.append('is_active', String(params.is_active))
    if (params?.page) searchParams.append('page', String(params.page))
    if (params?.per_page) searchParams.append('per_page', String(params.per_page))

    const queryString = searchParams.toString()
    const endpoint = `${this.baseURL}${this.basePath}${queryString ? `?${queryString}` : ''}`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<CannedMessage[]> = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch canned messages')
      }

      return {
        data: result.data || [],
        total: result.meta?.total || 0,
        page: result.meta?.page || 1,
        per_page: result.meta?.limit || 10
      }
    } catch (error) {
      console.error('Error fetching canned messages:', error)
      throw error
    }
  }

  async get(id: number): Promise<CannedMessage> {
    const endpoint = `${this.baseURL}${this.basePath}/${id}`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<CannedMessage> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch canned message')
      }

      return result.data
    } catch (error) {
      console.error('Error fetching canned message:', error)
      throw error
    }
  }

  async create(data: CannedMessageInput): Promise<CannedMessage> {
    const endpoint = `${this.baseURL}${this.basePath}`

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<CannedMessage> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to create canned message')
      }

      return result.data
    } catch (error) {
      console.error('Error creating canned message:', error)
      throw error
    }
  }

  async update(id: number, data: Partial<CannedMessageInput>): Promise<CannedMessage> {
    const endpoint = `${this.baseURL}${this.basePath}/${id}`

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<CannedMessage> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to update canned message')
      }

      return result.data
    } catch (error) {
      console.error('Error updating canned message:', error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    const endpoint = `${this.baseURL}${this.basePath}/${id}`

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<{ message: string }> = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete canned message')
      }
    } catch (error) {
      console.error('Error deleting canned message:', error)
      throw error
    }
  }
}

export const cannedMessagesService = new CannedMessagesService()

export default cannedMessagesService

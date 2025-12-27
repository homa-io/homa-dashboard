/**
 * Custom Attributes Service
 * Handles all custom attribute CRUD operations
 * Backend API: /api/admin/attributes
 */

import { getAccessToken } from '@/lib/cookies'

// Scope types
export type CustomAttributeScope = 'client' | 'conversation'

// Data types supported by backend
export type CustomAttributeDataType = 'int' | 'float' | 'date' | 'string'

// Visibility levels
export type CustomAttributeVisibility = 'everyone' | 'administrator' | 'hidden'

// Custom attribute from backend
export interface CustomAttribute {
  scope: CustomAttributeScope
  name: string
  data_type: CustomAttributeDataType
  validation: string | null
  title: string
  description: string | null
  visibility: CustomAttributeVisibility
  created_at: string
  updated_at: string
}

// Request to create a custom attribute
export interface CreateCustomAttributeRequest {
  scope: CustomAttributeScope
  name: string
  data_type: CustomAttributeDataType
  validation?: string | null
  title: string
  description?: string | null
  visibility: CustomAttributeVisibility
}

// Request to update a custom attribute
export interface UpdateCustomAttributeRequest {
  data_type: CustomAttributeDataType
  validation?: string | null
  title: string
  description?: string | null
  visibility: CustomAttributeVisibility
}

// Search/filter parameters
export interface CustomAttributeSearchParams {
  search?: string
  scope?: CustomAttributeScope
  data_type?: CustomAttributeDataType
  visibility?: CustomAttributeVisibility
  order_by?: 'name' | 'title' | 'scope' | 'created_at'
  page?: number
  limit?: number
}

// API response wrapper
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

// Paginated response
export interface PaginatedCustomAttributesResponse {
  data: CustomAttribute[]
  meta: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

class CustomAttributesService {
  private readonly baseURL: string
  private readonly basePath = '/api/agent/attributes'

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

  /**
   * List all custom attributes with optional filtering
   */
  async listAttributes(params: CustomAttributeSearchParams = {}): Promise<PaginatedCustomAttributesResponse> {
    const searchParams = new URLSearchParams()

    if (params.search) searchParams.set('search', params.search)
    if (params.scope) searchParams.set('scope', params.scope)
    if (params.data_type) searchParams.set('data_type', params.data_type)
    if (params.visibility) searchParams.set('visibility', params.visibility)
    if (params.order_by) searchParams.set('order_by', params.order_by)
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())

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

      const result: ApiResponse<CustomAttribute[]> = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch attributes')
      }

      return {
        data: result.data || [],
        meta: result.meta || { page: 1, limit: 20, total: 0, total_pages: 1 }
      }
    } catch (error) {
      console.error('Error fetching attributes:', error)
      throw error
    }
  }

  /**
   * Get attributes by scope (client or conversation)
   */
  async getAttributesByScope(scope: CustomAttributeScope): Promise<CustomAttribute[]> {
    const response = await this.listAttributes({ scope, limit: 100 })
    return response.data
  }

  /**
   * Create a new custom attribute
   */
  async createAttribute(data: CreateCustomAttributeRequest): Promise<CustomAttribute> {
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

      const result: ApiResponse<CustomAttribute> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to create attribute')
      }

      return result.data
    } catch (error) {
      console.error('Error creating attribute:', error)
      throw error
    }
  }

  /**
   * Update an existing custom attribute
   */
  async updateAttribute(
    scope: CustomAttributeScope,
    name: string,
    data: UpdateCustomAttributeRequest
  ): Promise<CustomAttribute> {
    const endpoint = `${this.baseURL}${this.basePath}/${scope}/${name}`

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

      const result: ApiResponse<CustomAttribute> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to update attribute')
      }

      return result.data
    } catch (error) {
      console.error('Error updating attribute:', error)
      throw error
    }
  }

  /**
   * Delete a custom attribute
   */
  async deleteAttribute(scope: CustomAttributeScope, name: string): Promise<void> {
    const endpoint = `${this.baseURL}${this.basePath}/${scope}/${name}`

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
        throw new Error(result.error?.message || 'Failed to delete attribute')
      }
    } catch (error) {
      console.error('Error deleting attribute:', error)
      throw error
    }
  }
}

export const customAttributesService = new CustomAttributesService()

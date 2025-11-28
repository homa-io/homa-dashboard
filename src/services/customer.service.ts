/**
 * Customer service layer
 * Handles all customer-related API operations
 * Backend API: /api/admin/clients
 */

import { apiClient, type ApiResponse, type PaginatedResponse } from './api-client'
import type { ExternalID } from '@/types/conversation.types'

// Backend Client schema
export interface Client {
  id: string // UUID
  name: string
  data: Record<string, any> // Custom fields (flexible JSON)
  language: string | null
  timezone: string | null
  external_ids: ExternalID[]
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

export interface CreateClientRequest {
  name: string
  data?: Record<string, any>
  language?: string
  timezone?: string
  external_ids?: Array<{
    type: 'email' | 'phone' | 'whatsapp' | 'slack' | 'telegram' | 'web' | 'chat'
    value: string
  }>
}

export interface UpdateClientRequest {
  name?: string
  data?: Record<string, any>
  language?: string
  timezone?: string
  external_ids?: Array<{
    type: 'email' | 'phone' | 'whatsapp' | 'slack' | 'telegram' | 'web' | 'chat'
    value: string
  }>
}

export interface ClientListParams {
  page?: number
  limit?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

class CustomerService {
  private readonly basePath = '/api/admin/clients'

  /**
   * Get paginated list of clients with filters
   */
  async getClients(params: ClientListParams = {}): Promise<ApiResponse<PaginatedResponse<Client>>> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)
    if (params.sort_by) searchParams.set('sort_by', params.sort_by)
    if (params.sort_order) searchParams.set('sort_order', params.sort_order)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath

    return apiClient.get<PaginatedResponse<Client>>(endpoint)
  }

  /**
   * Search clients by query
   */
  async searchClients(query: string, limit = 10): Promise<ApiResponse<Client[]>> {
    const searchParams = new URLSearchParams()
    searchParams.set('search', query)
    searchParams.set('limit', limit.toString())

    return apiClient.get<Client[]>(`${this.basePath}?${searchParams.toString()}`)
  }

  /**
   * Get a single client by ID
   */
  async getClient(id: string): Promise<ApiResponse<Client>> {
    return apiClient.get<Client>(`${this.basePath}/${id}`)
  }

  /**
   * Create a new client
   */
  async createClient(client: CreateClientRequest): Promise<ApiResponse<Client>> {
    return apiClient.post<Client>(this.basePath, client)
  }

  /**
   * Update an existing client
   */
  async updateClient(id: string, updates: UpdateClientRequest): Promise<ApiResponse<Client>> {
    return apiClient.put<Client>(`${this.basePath}/${id}`, updates)
  }

  /**
   * Delete a client
   */
  async deleteClient(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`)
  }
}

export const customerService = new CustomerService()
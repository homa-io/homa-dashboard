/**
 * Customer service layer
 * Handles all customer-related API operations
 */

import { apiClient, type ApiResponse, type PaginatedResponse } from './api-client'
import type { Customer, CustomerFilters } from '@/types/customer.types'

export interface CreateCustomerRequest {
  name: string
  email: string
  phone?: string
  company?: string
  tags?: string[]
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  customFields?: Record<string, string | number | boolean | string[]>
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  status?: 'active' | 'inactive' | 'pending'
}

export interface CustomerListParams {
  page?: number
  limit?: number
  search?: string
  status?: string[]
  tags?: string[]
  sortBy?: 'name' | 'email' | 'company' | 'created' | 'value'
  sortOrder?: 'asc' | 'desc'
}

export interface CustomerStatsResponse {
  total: number
  active: number
  inactive: number
  pending: number
  totalValue: number
  averageValue: number
  growth: number
}

class CustomerService {
  private readonly basePath = '/customers'

  /**
   * Get paginated list of customers with filters
   */
  async getCustomers(params: CustomerListParams = {}): Promise<ApiResponse<PaginatedResponse<Customer>>> {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)
    if (params.status?.length) searchParams.set('status', params.status.join(','))
    if (params.tags?.length) searchParams.set('tags', params.tags.join(','))
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath
    
    return apiClient.get<PaginatedResponse<Customer>>(endpoint)
  }

  /**
   * Get a single customer by ID
   */
  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return apiClient.get<Customer>(`${this.basePath}/${id}`)
  }

  /**
   * Create a new customer
   */
  async createCustomer(customer: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    return apiClient.post<Customer>(this.basePath, customer)
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(id: string, updates: UpdateCustomerRequest): Promise<ApiResponse<Customer>> {
    return apiClient.patch<Customer>(`${this.basePath}/${id}`, updates)
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`)
  }

  /**
   * Get customer statistics
   */
  async getCustomerStats(): Promise<ApiResponse<CustomerStatsResponse>> {
    return apiClient.get<CustomerStatsResponse>(`${this.basePath}/stats`)
  }

  /**
   * Get customer tickets
   */
  async getCustomerTickets(customerId: string, params: { page?: number; limit?: number } = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    
    const queryString = searchParams.toString()
    const endpoint = queryString 
      ? `${this.basePath}/${customerId}/tickets?${queryString}`
      : `${this.basePath}/${customerId}/tickets`
    
    return apiClient.get(endpoint)
  }

  /**
   * Search customers by query
   */
  async searchCustomers(query: string, limit = 10): Promise<ApiResponse<Customer[]>> {
    const searchParams = new URLSearchParams()
    searchParams.set('q', query)
    searchParams.set('limit', limit.toString())
    
    return apiClient.get<Customer[]>(`${this.basePath}/search?${searchParams.toString()}`)
  }

  /**
   * Bulk update customers
   */
  async bulkUpdateCustomers(
    ids: string[], 
    updates: Partial<UpdateCustomerRequest>
  ): Promise<ApiResponse<Customer[]>> {
    return apiClient.patch<Customer[]>(`${this.basePath}/bulk`, { ids, updates })
  }

  /**
   * Export customers data
   */
  async exportCustomers(
    format: 'csv' | 'xlsx' | 'json',
    filters?: CustomerFilters
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.post<{ downloadUrl: string }>(`${this.basePath}/export`, {
      format,
      filters,
    })
  }
}

export const customerService = new CustomerService()
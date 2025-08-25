/**
 * Ticket service layer
 * Handles all ticket-related API operations
 */

import { apiClient, type ApiResponse, type PaginatedResponse } from './api-client'
import type { Ticket, TicketStatus, TicketPriority, Customer, Agent } from '@/types/ticket.types'

export interface CreateTicketRequest {
  title: string
  description?: string
  customerId: string
  priority: TicketPriority
  tags: string[]
  assignedTo?: string[]
}

export interface UpdateTicketRequest {
  title?: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
  assignedTo?: string[]
  tags?: string[]
}

export interface TicketListParams {
  page?: number
  limit?: number
  search?: string
  status?: TicketStatus[]
  priority?: TicketPriority[]
  assignedTo?: string[]
  customerId?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  sortBy?: 'created' | 'updated' | 'priority' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface TicketStatsResponse {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  avgResolutionTime: number
  avgResponseTime: number
  satisfactionScore: number
}

export interface TicketComment {
  id: string
  ticketId: string
  authorId: string
  author: {
    name: string
    avatar?: string
    type: 'agent' | 'customer' | 'system'
  }
  content: string
  isInternal: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AddCommentRequest {
  content: string
  isInternal?: boolean
}

class TicketService {
  private readonly basePath = '/tickets'

  /**
   * Get paginated list of tickets with filters
   */
  async getTickets(params: TicketListParams = {}): Promise<ApiResponse<PaginatedResponse<Ticket>>> {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)
    if (params.status?.length) searchParams.set('status', params.status.join(','))
    if (params.priority?.length) searchParams.set('priority', params.priority.join(','))
    if (params.assignedTo?.length) searchParams.set('assignedTo', params.assignedTo.join(','))
    if (params.customerId) searchParams.set('customerId', params.customerId)
    if (params.tags?.length) searchParams.set('tags', params.tags.join(','))
    if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom)
    if (params.dateTo) searchParams.set('dateTo', params.dateTo)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath
    
    return apiClient.get<PaginatedResponse<Ticket>>(endpoint)
  }

  /**
   * Get a single ticket by ID
   */
  async getTicket(id: string): Promise<ApiResponse<Ticket>> {
    return apiClient.get<Ticket>(`${this.basePath}/${id}`)
  }

  /**
   * Create a new ticket
   */
  async createTicket(ticket: CreateTicketRequest): Promise<ApiResponse<Ticket>> {
    return apiClient.post<Ticket>(this.basePath, ticket)
  }

  /**
   * Update an existing ticket
   */
  async updateTicket(id: string, updates: UpdateTicketRequest): Promise<ApiResponse<Ticket>> {
    return apiClient.patch<Ticket>(`${this.basePath}/${id}`, updates)
  }

  /**
   * Delete a ticket
   */
  async deleteTicket(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${id}`)
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(id: string, status: TicketStatus): Promise<ApiResponse<Ticket>> {
    return apiClient.patch<Ticket>(`${this.basePath}/${id}/status`, { status })
  }

  /**
   * Assign ticket to agents
   */
  async assignTicket(id: string, agentIds: string[]): Promise<ApiResponse<Ticket>> {
    return apiClient.patch<Ticket>(`${this.basePath}/${id}/assign`, { assignedTo: agentIds })
  }

  /**
   * Get ticket statistics
   */
  async getTicketStats(params?: { dateFrom?: string; dateTo?: string }): Promise<ApiResponse<TicketStatsResponse>> {
    const searchParams = new URLSearchParams()
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom)
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `${this.basePath}/stats?${queryString}` : `${this.basePath}/stats`
    
    return apiClient.get<TicketStatsResponse>(endpoint)
  }

  /**
   * Get ticket comments/conversation
   */
  async getTicketComments(ticketId: string): Promise<ApiResponse<TicketComment[]>> {
    return apiClient.get<TicketComment[]>(`${this.basePath}/${ticketId}/comments`)
  }

  /**
   * Add comment to ticket
   */
  async addTicketComment(ticketId: string, comment: AddCommentRequest): Promise<ApiResponse<TicketComment>> {
    return apiClient.post<TicketComment>(`${this.basePath}/${ticketId}/comments`, comment)
  }

  /**
   * Update ticket comment
   */
  async updateTicketComment(
    ticketId: string, 
    commentId: string, 
    updates: { content: string }
  ): Promise<ApiResponse<TicketComment>> {
    return apiClient.patch<TicketComment>(`${this.basePath}/${ticketId}/comments/${commentId}`, updates)
  }

  /**
   * Delete ticket comment
   */
  async deleteTicketComment(ticketId: string, commentId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.basePath}/${ticketId}/comments/${commentId}`)
  }

  /**
   * Search tickets by query
   */
  async searchTickets(query: string, limit = 10): Promise<ApiResponse<Ticket[]>> {
    const searchParams = new URLSearchParams()
    searchParams.set('q', query)
    searchParams.set('limit', limit.toString())
    
    return apiClient.get<Ticket[]>(`${this.basePath}/search?${searchParams.toString()}`)
  }

  /**
   * Bulk update tickets
   */
  async bulkUpdateTickets(
    ids: string[], 
    updates: Partial<UpdateTicketRequest>
  ): Promise<ApiResponse<Ticket[]>> {
    return apiClient.patch<Ticket[]>(`${this.basePath}/bulk`, { ids, updates })
  }

  /**
   * Get available agents for assignment
   */
  async getAvailableAgents(): Promise<ApiResponse<Agent[]>> {
    return apiClient.get<Agent[]>('/agents/available')
  }

  /**
   * Export tickets data
   */
  async exportTickets(
    format: 'csv' | 'xlsx' | 'json',
    filters?: TicketListParams
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.post<{ downloadUrl: string }>(`${this.basePath}/export`, {
      format,
      filters,
    })
  }
}

export const ticketService = new TicketService()
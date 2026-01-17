/**
 * Conversation service layer
 * Handles all conversation-related API operations
 * Backend API: http://127.0.0.1:8033/api/agent/conversations
 */

import type {
  Conversation,
  ConversationSearchParams,
  PaginatedConversationsResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
  DepartmentWithCount,
  TagWithUsage,
  MessagesResponse,
  ConversationDetailResponse
} from '@/types/conversation.types'
import { getAccessToken } from '@/lib/cookies'

// API response wrapper
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

class ConversationService {
  private readonly baseURL: string
  private readonly basePath = '/api/agent/conversations'

  constructor() {
    // Use environment variable or default to production API
    this.baseURL = typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_API_URL || 'https://api.getevo.dev')
      : 'http://127.0.0.1:8033'
  }

  /**
   * Get authorization headers with access token
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const token = getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Search and filter conversations with comprehensive options
   */
  async searchConversations(params: ConversationSearchParams = {}): Promise<PaginatedConversationsResponse> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)
    if (params.status) searchParams.set('status', params.status)
    if (params.priority) searchParams.set('priority', params.priority)
    if (params.channel) searchParams.set('channel', params.channel)
    if (params.department_id) searchParams.set('department_id', params.department_id)
    if (params.tags) searchParams.set('tags', params.tags)
    if (params.assigned_to_me !== undefined) searchParams.set('assigned_to_me', params.assigned_to_me.toString())
    if (params.unassigned !== undefined) searchParams.set('unassigned', params.unassigned.toString())
    if (params.sort_by) searchParams.set('sort_by', params.sort_by)
    if (params.sort_order) searchParams.set('sort_order', params.sort_order)
    if (params.include_unread_count !== undefined) searchParams.set('include_unread_count', params.include_unread_count.toString())

    const queryString = searchParams.toString()
    const endpoint = `${this.baseURL}${this.basePath}/search${queryString ? `?${queryString}` : ''}`

    const token = getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<PaginatedConversationsResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch conversations')
      }

      return result.data
    } catch (error) {
      console.error('Error fetching conversations:', error)
      throw error
    }
  }

  /**
   * Get total count of unread conversations
   */
  async getUnreadCount(): Promise<number> {
    const endpoint = `${this.baseURL}${this.basePath}/unread-count`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<UnreadCountResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch unread count')
      }

      return result.data.unread_count
    } catch (error) {
      console.error('Error fetching unread count:', error)
      throw error
    }
  }

  /**
   * Mark all messages in a conversation as read
   */
  async markAsRead(conversationId: number): Promise<MarkAsReadResponse> {
    const endpoint = `${this.baseURL}${this.basePath}/${conversationId}/read`

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<MarkAsReadResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to mark conversation as read')
      }

      return result.data
    } catch (error) {
      console.error('Error marking conversation as read:', error)
      throw error
    }
  }

  /**
   * Get list of all departments with agent counts
   */
  async getDepartments(): Promise<DepartmentWithCount[]> {
    const endpoint = `${this.baseURL}/api/agent/departments`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<DepartmentWithCount[]> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch departments')
      }

      return result.data
    } catch (error) {
      console.error('Error fetching departments:', error)
      throw error
    }
  }

  /**
   * Get list of users
   */
  async getUsers(search?: string): Promise<Array<{ id: string; name: string; last_name: string; display_name: string; email: string; avatar: string | null }>> {
    const searchParams = search ? `?search=${encodeURIComponent(search)}` : ''
    const endpoint = `${this.baseURL}/api/agent/users${searchParams}`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<Array<{ id: string; name: string; last_name: string; display_name: string; email: string; avatar: string | null }>> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch users')
      }

      return result.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  /**
   * Assign users to a conversation
   */
  async assignUsersToConversation(conversationId: number, userIds: string[]): Promise<void> {
    const endpoint = `${this.baseURL}${this.basePath}/${conversationId}/assign`

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ user_ids: userIds }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to assign users')
      }
    } catch (error) {
      console.error('Error assigning users:', error)
      throw error
    }
  }

  /**
   * Get list of all available tags with usage statistics
   */
  async getTags(): Promise<TagWithUsage[]> {
    const endpoint = `${this.baseURL}/api/agent/tags`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<TagWithUsage[]> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch tags')
      }

      return result.data
    } catch (error) {
      console.error('Error fetching tags:', error)
      throw error
    }
  }

  /**
   * Create a new tag
   */
  async createTag(name: string): Promise<TagWithUsage> {
    const endpoint = `${this.baseURL}/api/agent/tags`

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<TagWithUsage> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to create tag')
      }

      return result.data
    } catch (error) {
      console.error('Error creating tag:', error)
      throw error
    }
  }

  /**
   * Get conversation detail with messages in a single optimized API call
   * This replaces separate calls to get conversation and messages
   */
  async getConversation(id: number, page = 1, limit = 50, order: 'asc' | 'desc' = 'asc'): Promise<ConversationDetailResponse> {
    const endpoint = `${this.baseURL}${this.basePath}/${id}?page=${page}&limit=${limit}&order=${order}`

    const token = getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<ConversationDetailResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch conversation')
      }

      return result.data
    } catch (error) {
      console.error('Error fetching conversation:', error)
      throw error
    }
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessages(conversationId: number, page = 1, limit = 50, order: 'asc' | 'desc' = 'asc'): Promise<MessagesResponse> {
    const endpoint = `${this.baseURL}${this.basePath}/${conversationId}/messages?page=${page}&limit=${limit}&order=${order}`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<MessagesResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch messages')
      }

      return result.data
    } catch (error) {
      console.error('Error fetching messages:', error)
      throw error
    }
  }

  /**
   * Get previous conversations for a specific client
   */
  async getClientPreviousConversations(clientId: string, limit = 100, excludeId?: number): Promise<PreviousConversationsResponse> {
    const params = new URLSearchParams()
    params.set('limit', limit.toString())
    if (excludeId) {
      params.set('exclude_id', excludeId.toString())
    }

    const endpoint = `${this.baseURL}/api/agent/clients/${clientId}/conversations?${params.toString()}`

    const token = getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<PreviousConversationsResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch previous conversations')
      }

      return result.data
    } catch (error) {
      console.error('Error fetching previous conversations:', error)
      throw error
    }
  }

  /**
   * Update conversation properties (priority, status, department)
   */
  async updateConversationProperties(conversationId: number, updates: UpdateConversationPropertiesRequest): Promise<UpdateConversationPropertiesResponse> {
    const endpoint = `${this.baseURL}${this.basePath}/${conversationId}`

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<UpdateConversationPropertiesResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to update conversation properties')
      }

      return result.data
    } catch (error) {
      console.error('Error updating conversation properties:', error)
      throw error
    }
  }

  /**
   * Update conversation tags
   */
  async updateConversationTags(conversationId: number, tagIds: number[]): Promise<UpdateConversationTagsResponse> {
    const endpoint = `${this.baseURL}${this.basePath}/${conversationId}/tags`

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ tag_ids: tagIds }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<UpdateConversationTagsResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to update conversation tags')
      }

      return result.data
    } catch (error) {
      console.error('Error updating conversation tags:', error)
      throw error
    }
  }

  /**
   * Assign users and/or department to a conversation
   */
  async assignConversation(conversationId: number, assignment: AssignConversationRequest): Promise<AssignConversationResponse> {
    const endpoint = `${this.baseURL}${this.basePath}/${conversationId}/assign`

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<AssignConversationResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to assign conversation')
      }

      return result.data
    } catch (error) {
      console.error('Error assigning conversation:', error)
      throw error
    }
  }

  /**
   * Unassign all users from a conversation
   */
  async unassignConversation(conversationId: number): Promise<void> {
    const endpoint = `${this.baseURL}${this.basePath}/${conversationId}/assign`

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<{ message: string }> = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to unassign conversation')
      }
    } catch (error) {
      console.error('Error unassigning conversation:', error)
      throw error
    }
  }

  /**
   * Send a message to a conversation
   */
  async sendMessage(conversationId: number, body: string): Promise<SendMessageResponse> {
    const endpoint = `${this.baseURL}${this.basePath}/${conversationId}/messages`

    const token = getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<SendMessageResponse> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to send message')
      }

      return result.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }
}

// Types for previous conversations
export interface PreviousConversation {
  id: number
  conversation_number: string
  title: string
  status: string
  priority: string
  created_at: string
  updated_at: string
}

export interface PreviousConversationsResponse {
  page: number
  limit: number
  total: number
  total_pages: number
  data: PreviousConversation[]
}

// Types for updating conversation properties
export interface UpdateConversationPropertiesRequest {
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'new' | 'user_reply' | 'agent_reply' | 'processing' | 'closed' | 'archived' | 'postponed'
  department_id?: number
  handle_by_bot?: boolean
}

export interface UpdateConversationPropertiesResponse {
  id: number
  priority: string
  status: string
  department_id: number | null
  handle_by_bot: boolean
  updated_at: string
}

// Types for updating conversation tags
export interface UpdateConversationTagsResponse {
  message: string
  tags: Array<{
    id: number
    name: string
  }>
}

// Types for assigning conversations
export interface AssignConversationRequest {
  user_ids?: string[]
  department_id?: number
}

export interface AssignConversationResponse {
  message: string
  assignments: Array<{
    id: number
    conversation_id: number
    user_id?: string
    department_id?: number
  }>
}

// Types for sending messages
export interface SendMessageResponse {
  message: {
    id: number
    body: string
    is_agent: boolean
    is_system_message: boolean
    created_at: string
    author: {
      id: string
      name: string
      type: 'agent'
      avatar_url: string | null
      initials: string
    }
    attachments: Array<{
      id: number
      name: string
      size: number
      type: string
      url: string
      created_at: string
    }>
  }
}

export const conversationService = new ConversationService()

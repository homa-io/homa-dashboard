// Backend API types matching http://127.0.0.1:8033/api/agent/conversations/search
export type ConversationStatus = 'new' | 'open' | 'assigned' | 'pending' | 'closed'
export type ConversationPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ConversationChannel = 'web' | 'email' | 'whatsapp' | 'telegram' | 'slack'

export interface ExternalID {
  id: number
  type: 'email' | 'phone' | 'whatsapp' | 'slack' | 'telegram' | 'web' | 'chat'
  value: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  avatar_url: string | null
  initials: string
  external_ids: ExternalID[]
  language: string | null
  timezone: string | null
  data?: Record<string, any> // Custom attributes
}

export interface Agent {
  id: string
  name: string
  avatar_url: string | null
}

export interface Department {
  id: number
  name: string
  ai_agent_id: number | null
}

export interface Tag {
  id: number
  name: string
  color: string
}

export interface Conversation {
  id: number
  conversation_number: string
  title: string
  status: ConversationStatus
  priority: ConversationPriority
  handle_by_bot: boolean
  channel: ConversationChannel
  created_at: string
  updated_at: string
  last_message_at: string | null
  last_message_preview: string | null
  unread_messages_count: number
  is_assigned_to_me: boolean
  customer: Customer
  assigned_agents: Agent[]
  department: Department | null
  tags: Tag[]
  message_count: number
  has_attachments: boolean
  ip: string | null
  browser: string | null
  operating_system: string | null
  data?: Record<string, any> // Custom attributes
}

// Search and filter parameters
export interface ConversationSearchParams {
  page?: number
  limit?: number
  search?: string
  status?: string // comma-separated
  priority?: string // comma-separated
  channel?: string // comma-separated
  department_id?: string // comma-separated
  tags?: string // comma-separated
  assigned_to_me?: boolean
  unassigned?: boolean
  sort_by?: 'created_at' | 'updated_at' | 'priority' | 'status'
  sort_order?: 'asc' | 'desc'
  include_unread_count?: boolean
}

// Paginated response
export interface PaginatedConversationsResponse {
  page: number
  limit: number
  total: number
  total_pages: number
  unread_count?: number
  data: Conversation[]
}

// Unread count response
export interface UnreadCountResponse {
  unread_count: number
}

// Mark as read response
export interface MarkAsReadResponse {
  conversation_id: string
  marked_read_at: string
}

// Department with agent count
export interface DepartmentWithCount extends Department {
  agent_count: number
}

// Tag with usage count
export interface TagWithUsage extends Tag {
  usage_count: number
}

// Optimized conversation detail response (conversation + messages in one call)
export interface ConversationDetailResponse {
  conversation: Conversation
  messages: Message[]
  page: number
  limit: number
  total: number
  total_pages: number
}

// Message author
export interface MessageAuthor {
  id: string
  name: string
  type: 'customer' | 'agent' | 'system'
  avatar_url: string | null
  initials: string
}

// Message attachment
export interface MessageAttachment {
  id: number
  name: string
  size: number
  type: string
  url: string
  created_at: string
}

// Message
export interface Message {
  id: number
  body: string
  language: string | null // Detected language code (e.g., 'en', 'fa', 'es')
  is_agent: boolean
  is_system_message: boolean
  created_at: string
  author: MessageAuthor
  attachments: MessageAttachment[]
}

// Messages response
export interface MessagesResponse {
  conversation_id: number
  page: number
  limit: number
  total: number
  total_pages: number
  messages: Message[]
}
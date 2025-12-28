/**
 * Webhook Types - Matching backend model structure
 */

export interface Webhook {
  id: number
  name: string
  url: string
  secret: string
  enabled: boolean
  description: string

  // Event subscriptions
  event_all: boolean
  event_conversation_created: boolean
  event_conversation_updated: boolean
  event_conversation_status_change: boolean
  event_conversation_closed: boolean
  event_conversation_assigned: boolean
  event_message_created: boolean
  event_client_created: boolean
  event_client_updated: boolean
  event_user_created: boolean
  event_user_updated: boolean

  created_at: string
  updated_at: string
}

export interface WebhookCreateRequest {
  name: string
  url: string
  secret?: string
  enabled: boolean
  description?: string
  event_all?: boolean
  event_conversation_created?: boolean
  event_conversation_updated?: boolean
  event_conversation_status_change?: boolean
  event_conversation_closed?: boolean
  event_conversation_assigned?: boolean
  event_message_created?: boolean
  event_client_created?: boolean
  event_client_updated?: boolean
  event_user_created?: boolean
  event_user_updated?: boolean
}

export interface WebhookUpdateRequest extends Partial<WebhookCreateRequest> {}

export interface WebhookDelivery {
  id: number
  webhook_id: number
  event: string
  success: boolean

  // Request details for debugging
  request_url: string
  request_body: string
  request_headers: string

  // Response details
  status_code: number
  response: string

  // Duration in milliseconds
  duration_ms: number
  created_at: string

  webhook?: Webhook
}

export interface WebhookDeliveryListParams {
  webhook_id?: number
  event?: string
  success?: boolean
  page?: number
  per_page?: number
}

export interface WebhookDeliveryListResponse {
  data: WebhookDelivery[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface WebhookListResponse {
  data: Webhook[]
  total: number
}

// Event types for webhooks
export const WEBHOOK_EVENTS = [
  { id: 'event_all', label: 'All Events', description: 'Subscribe to all events' },
  { id: 'event_conversation_created', label: 'Conversation Created', description: 'When a new conversation is created' },
  { id: 'event_conversation_updated', label: 'Conversation Updated', description: 'When a conversation is updated' },
  { id: 'event_conversation_status_change', label: 'Status Changed', description: 'When conversation status changes' },
  { id: 'event_conversation_closed', label: 'Conversation Closed', description: 'When a conversation is closed' },
  { id: 'event_conversation_assigned', label: 'Conversation Assigned', description: 'When a conversation is assigned' },
  { id: 'event_message_created', label: 'Message Created', description: 'When a new message is created' },
  { id: 'event_client_created', label: 'Client Created', description: 'When a new client is created' },
  { id: 'event_client_updated', label: 'Client Updated', description: 'When a client is updated' },
  { id: 'event_user_created', label: 'User Created', description: 'When a new user is created' },
  { id: 'event_user_updated', label: 'User Updated', description: 'When a user is updated' },
] as const

// Test event types (event values sent to API)
export const TEST_EVENT_TYPES = [
  { value: 'webhook.test', label: 'Test Event', description: 'Generic test webhook' },
  { value: 'conversation.created', label: 'Conversation Created', description: 'Test conversation creation' },
  { value: 'conversation.updated', label: 'Conversation Updated', description: 'Test conversation update' },
  { value: 'conversation.status_changed', label: 'Status Changed', description: 'Test status change' },
  { value: 'conversation.closed', label: 'Conversation Closed', description: 'Test conversation close' },
  { value: 'conversation.assigned', label: 'Conversation Assigned', description: 'Test assignment' },
  { value: 'message.created', label: 'Message Created', description: 'Test new message' },
  { value: 'client.created', label: 'Client Created', description: 'Test client creation' },
  { value: 'client.updated', label: 'Client Updated', description: 'Test client update' },
  { value: 'user.created', label: 'User Created', description: 'Test user creation' },
  { value: 'user.updated', label: 'User Updated', description: 'Test user update' },
] as const

export type WebhookEventKey = typeof WEBHOOK_EVENTS[number]['id']
export type TestEventType = typeof TEST_EVENT_TYPES[number]['value']

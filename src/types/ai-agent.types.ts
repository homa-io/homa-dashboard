/**
 * AI Agent Type Definitions
 */

// Tone options for AI agent responses
export type AIAgentTone =
  | 'formal'
  | 'casual'
  | 'detailed'
  | 'precise'
  | 'empathetic'
  | 'technical'

export type AIAgentStatus = 'active' | 'inactive'

// Bot user reference (minimal info)
export interface AIAgentBot {
  id: string
  name: string
  display_name: string
  avatar?: string | null
}

// Handover user reference (minimal info)
export interface AIAgentHandoverUser {
  id: string
  name: string
  display_name: string
  avatar?: string | null
}

// Main AI Agent entity
export interface AIAgent {
  id: number
  name: string
  bot_id: string
  bot?: AIAgentBot
  handover_enabled: boolean
  handover_user_id: string | null
  handover_user?: AIAgentHandoverUser | null
  multi_language: boolean
  internet_access: boolean
  tone: AIAgentTone
  use_knowledge_base: boolean
  unit_conversion: boolean
  instructions: string
  greeting_message: string
  max_response_length: number
  context_window: number
  // New fields
  blocked_topics: string
  max_tool_calls: number
  collect_user_info: boolean
  collect_user_info_fields: string
  humor_level: number
  use_emojis: boolean
  formality_level: number
  priority_detection: boolean
  auto_tagging: boolean
  status: AIAgentStatus
  created_at: string
  updated_at: string
}

// Create request payload
export interface AIAgentCreateRequest {
  name: string
  bot_id: string
  handover_enabled: boolean
  handover_user_id?: string | null
  multi_language: boolean
  internet_access: boolean
  tone: AIAgentTone
  use_knowledge_base: boolean
  unit_conversion: boolean
  instructions: string
  greeting_message?: string
  max_response_length?: number
  context_window?: number
  blocked_topics?: string
  max_tool_calls?: number
  collect_user_info?: boolean
  collect_user_info_fields?: string
  humor_level?: number
  use_emojis?: boolean
  formality_level?: number
  priority_detection?: boolean
  auto_tagging?: boolean
}

// Update request payload
export interface AIAgentUpdateRequest extends Partial<AIAgentCreateRequest> {
  status?: AIAgentStatus
}

// List query parameters
export interface AIAgentListParams {
  search?: string
  status?: AIAgentStatus
  bot_id?: string
  page?: number
  limit?: number
  order_by?: 'name' | 'id' | 'created_at'
  order_direction?: 'asc' | 'desc'
}

// List response
export interface AIAgentListResponse {
  data: AIAgent[]
  total: number
}

// Tone option for UI display
export interface ToneOption {
  value: AIAgentTone
  label: string
  description: string
}

// Available tone options
export const TONE_OPTIONS: ToneOption[] = [
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional and formal responses',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Friendly and conversational',
  },
  {
    value: 'detailed',
    label: 'Detailed',
    description: 'Comprehensive explanations',
  },
  {
    value: 'precise',
    label: 'Precise',
    description: 'Short and to-the-point',
  },
  {
    value: 'empathetic',
    label: 'Empathetic',
    description: 'Warm and understanding',
  },
  {
    value: 'technical',
    label: 'Technical',
    description: 'Technical terminology preferred',
  },
]

// Max response length options (in tokens)
export const MAX_RESPONSE_LENGTH_OPTIONS = [
  { value: 150, label: 'Short (150 tokens)', description: '~100 words' },
  { value: 300, label: 'Medium (300 tokens)', description: '~200 words' },
  { value: 500, label: 'Long (500 tokens)', description: '~350 words' },
  { value: 1000, label: 'Very Long (1000 tokens)', description: '~700 words' },
  { value: 0, label: 'Unlimited', description: 'No limit' },
]

// Context window options (number of previous messages)
export const CONTEXT_WINDOW_OPTIONS = [
  { value: 5, label: '5 messages' },
  { value: 10, label: '10 messages' },
  { value: 15, label: '15 messages' },
  { value: 20, label: '20 messages' },
  { value: 30, label: '30 messages' },
]

// Max tool calls options
export const MAX_TOOL_CALLS_OPTIONS = [
  { value: 1, label: '1 call' },
  { value: 3, label: '3 calls' },
  { value: 5, label: '5 calls' },
  { value: 10, label: '10 calls' },
  { value: 0, label: 'Unlimited' },
]

// Default blocked topics
export const DEFAULT_BLOCKED_TOPICS = 'competitors, politics, legal advice, medical advice, financial advice, religion, violence, illegal activities'

// Default user info fields to collect
export const DEFAULT_COLLECT_USER_INFO_FIELDS = 'name, email, phone'

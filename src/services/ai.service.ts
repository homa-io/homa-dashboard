/**
 * AI Service for translation, text revision, and other AI-powered features
 */

import { apiClient, ApiResponse } from './api-client'

// ============================================================================
// Types
// ============================================================================

export interface TranslateRequest {
  text: string
  language: string
}

export interface TranslateResponse {
  original_text: string
  translated_text: string
  target_language: string
}

export interface ReviseRequest {
  text: string
  format: string
}

export interface ReviseResponse {
  original_text: string
  revised_text: string
  format: string
}

export interface RevisionFormat {
  id: string
  name: string
  description: string
}

export interface SummarizeRequest {
  messages: Array<{
    role: 'user' | 'agent'
    content: string
    author?: string
  }>
}

export interface SummarizeResponse {
  summary: string
  key_points: string[]
  message_count: number
}

export interface SmartReplyRequest {
  agent_message: string
  user_last_message: string
  tone?: string  // Optional: formal, casual, professional, friendly, empathetic
  target_language?: string  // Optional: override target language
}

// Available tones for smart reply
export const SMART_REPLY_TONES = [
  { id: 'formal', name: 'Formal', description: 'Professional and formal language' },
  { id: 'casual', name: 'Casual', description: 'Relaxed, conversational tone' },
  { id: 'professional', name: 'Professional', description: 'Business-appropriate language' },
  { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
  { id: 'empathetic', name: 'Empathetic', description: 'Understanding and supportive' },
] as const

export interface SmartReplyResponse {
  original_text: string
  improved_text: string
  detected_user_language: string
  detected_agent_language: string
  was_translated: boolean
  improvements: string[]
}

// Common languages for translation
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'fa', name: 'Persian' },
] as const

// ============================================================================
// API Functions
// ============================================================================

/**
 * Translate text to a target language
 */
export async function translateText(data: TranslateRequest): Promise<ApiResponse<TranslateResponse>> {
  return apiClient.post<TranslateResponse>('/api/ai/translate', data, { timeout: 30000 })
}

/**
 * Revise/rewrite text according to a format
 */
export async function reviseText(data: ReviseRequest): Promise<ApiResponse<ReviseResponse>> {
  return apiClient.post<ReviseResponse>('/api/ai/revise', data, { timeout: 30000 })
}

/**
 * Get available revision formats
 */
export async function getRevisionFormats(): Promise<ApiResponse<RevisionFormat[]>> {
  return apiClient.get<RevisionFormat[]>('/api/ai/formats')
}

/**
 * Summarize a conversation
 */
export async function summarizeConversation(data: SummarizeRequest): Promise<ApiResponse<SummarizeResponse>> {
  return apiClient.post<SummarizeResponse>('/api/ai/summarize', data, { timeout: 30000 })
}

/**
 * Smart reply - analyze, translate if needed, and fix grammar
 */
export async function smartReply(data: SmartReplyRequest): Promise<ApiResponse<SmartReplyResponse>> {
  return apiClient.post<SmartReplyResponse>('/api/ai/smart-reply', data, { timeout: 30000 })
}

// ============================================================================
// AI Service Object (for convenience)
// ============================================================================

export const aiService = {
  translate: translateText,
  revise: reviseText,
  getFormats: getRevisionFormats,
  summarize: summarizeConversation,
  smartReply: smartReply,
  languages: SUPPORTED_LANGUAGES,
}

/**
 * Translation service for message translations
 * Uses per-message language detection for translation
 */

import { apiClient, type ApiResponse } from './api-client'

export interface TranslationResponse {
  message_id: number
  original_content: string
  translated_content: string
  from_lang: string
  to_lang: string
  type: 'incoming' | 'outgoing'
  is_translated: boolean
}

export interface BatchTranslationResponse {
  translations: TranslationResponse[]
}

export interface TranslateOutgoingResponse {
  original_content: string
  translated_content: string
  from_lang: string
  to_lang: string
}

export interface LanguageInfo {
  agent_language: string
  detected_customer_language: string | null
  messages_needing_translation: number
  needs_translation: boolean
  auto_translate_incoming: boolean
  auto_translate_outgoing: boolean
  per_message_language_detection: boolean
}

class TranslationService {
  private readonly basePath = '/api/agent/conversations'

  /**
   * Get translations for messages in a conversation
   * Uses per-message language detection to translate any message not in agent's language
   */
  async getTranslations(
    conversationId: number,
    messageIds: number[]
  ): Promise<ApiResponse<BatchTranslationResponse>> {
    return apiClient.post<BatchTranslationResponse>(
      `${this.basePath}/${conversationId}/translations`,
      { message_ids: messageIds }
    )
  }

  /**
   * Get original content for outgoing messages that were auto-translated
   */
  async getOutgoingTranslations(
    conversationId: number,
    messageIds: number[]
  ): Promise<ApiResponse<BatchTranslationResponse>> {
    return apiClient.post<BatchTranslationResponse>(
      `${this.basePath}/${conversationId}/outgoing-translations`,
      { message_ids: messageIds }
    )
  }

  /**
   * Translate outgoing message to customer language
   */
  async translateOutgoing(
    conversationId: number,
    content: string
  ): Promise<ApiResponse<TranslateOutgoingResponse>> {
    return apiClient.post<TranslateOutgoingResponse>(
      `${this.basePath}/${conversationId}/translate-outgoing`,
      { content }
    )
  }

  /**
   * Get language information for a conversation
   */
  async getLanguageInfo(
    conversationId: number
  ): Promise<ApiResponse<LanguageInfo>> {
    return apiClient.get<LanguageInfo>(
      `${this.basePath}/${conversationId}/language-info`
    )
  }
}

export const translationService = new TranslationService()

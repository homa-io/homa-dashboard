/**
 * Hook for handling message translations in conversations
 * Uses per-message language detection
 *
 * LOGIC:
 * - Customer messages (incoming): Show TRANSLATED by default so agent can read them
 * - Agent messages (outgoing): Only show translation toggle if message was auto-translated
 *   - If auto-translated: show what agent typed (original) by default
 *   - If NOT auto-translated: show as-is, no toggle
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { translationService, type TranslationResponse, type LanguageInfo } from '@/services/translation.service'

interface TranslationState {
  [messageId: number]: {
    original: string
    translated: string
    isLoading: boolean
    showOriginal: boolean
    isTranslated: boolean
    fromLang?: string
    toLang?: string
    isOutgoing?: boolean // Track if this is an outgoing translation
  }
}

interface UseMessageTranslationOptions {
  conversationId: number | null
  enabled?: boolean
}

interface UseMessageTranslationResult {
  languageInfo: LanguageInfo | null
  translations: TranslationState
  isLoading: boolean
  needsTranslation: boolean
  getTranslation: (messageId: number, originalContent: string, messageLanguage?: string, isAgentMessage?: boolean, authorType?: string) => {
    content: string
    isLoading: boolean
    isTranslated: boolean
    showOriginal: boolean
  }
  toggleTranslation: (messageId: number) => void
  requestTranslations: (messageIds: number[]) => Promise<void>
  requestOutgoingTranslations: (messageIds: number[]) => Promise<void>
  translateOutgoing: (content: string) => Promise<{ original: string; translated: string } | null>
}

export function useMessageTranslation({
  conversationId,
  enabled = true,
}: UseMessageTranslationOptions): UseMessageTranslationResult {
  const [languageInfo, setLanguageInfo] = useState<LanguageInfo | null>(null)
  const [translations, setTranslations] = useState<TranslationState>({})
  const [isLoading, setIsLoading] = useState(false)
  const pendingRequestsRef = useRef<Set<number>>(new Set())
  const incomingBatchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const outgoingBatchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pendingBatchRef = useRef<number[]>([])
  const outgoingBatchRef = useRef<number[]>([])
  // Track messages that have no outgoing translation record (don't retry)
  const noOutgoingRecordRef = useRef<Set<number>>(new Set())

  // Fetch language info when conversation changes
  useEffect(() => {
    if (!conversationId || !enabled) {
      setLanguageInfo(null)
      setTranslations({})
      noOutgoingRecordRef.current.clear()
      return
    }

    const fetchLanguageInfo = async () => {
      try {
        const response = await translationService.getLanguageInfo(conversationId)
        if (response.success) {
          setLanguageInfo(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch language info:', error)
      }
    }

    fetchLanguageInfo()
  }, [conversationId, enabled])

  // Check if translation is needed (based on language info)
  const needsTranslation = languageInfo?.needs_translation && languageInfo?.auto_translate_incoming || false

  // Request translations for INCOMING messages (customer messages not in agent's language)
  const requestTranslations = useCallback(async (messageIds: number[]) => {
    if (!conversationId || !needsTranslation || messageIds.length === 0) {
      return
    }

    // Filter out messages that are already translated or being loaded
    const newMessageIds = messageIds.filter(
      id => !translations[id]?.isTranslated && !pendingRequestsRef.current.has(id)
    )

    if (newMessageIds.length === 0) {
      return
    }

    // Mark messages as loading
    newMessageIds.forEach(id => pendingRequestsRef.current.add(id))
    setTranslations(prev => {
      const updated = { ...prev }
      newMessageIds.forEach(id => {
        updated[id] = {
          ...updated[id],
          original: updated[id]?.original || '',
          translated: updated[id]?.translated || '',
          isLoading: true,
          showOriginal: false, // Show TRANSLATED by default for incoming
          isTranslated: false,
          isOutgoing: false,
        }
      })
      return updated
    })

    try {
      setIsLoading(true)
      const response = await translationService.getTranslations(conversationId, newMessageIds)

      if (response.success) {
        setTranslations(prev => {
          const updated = { ...prev }
          response.data.translations.forEach((t: TranslationResponse) => {
            updated[t.message_id] = {
              original: t.original_content,
              translated: t.translated_content,
              isLoading: false,
              showOriginal: false, // Show TRANSLATED by default for incoming
              isTranslated: t.is_translated,
              fromLang: t.from_lang,
              toLang: t.to_lang,
              isOutgoing: false,
            }
            pendingRequestsRef.current.delete(t.message_id)
          })
          return updated
        })
      }
    } catch (error) {
      console.error('Failed to get translations:', error)
      // Clear loading state on error
      setTranslations(prev => {
        const updated = { ...prev }
        newMessageIds.forEach(id => {
          if (updated[id]) {
            updated[id] = { ...updated[id], isLoading: false }
          }
          pendingRequestsRef.current.delete(id)
        })
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }, [conversationId, needsTranslation, translations])

  // Request outgoing translations (for agent messages that were auto-translated)
  const requestOutgoingTranslations = useCallback(async (messageIds: number[]) => {
    if (!conversationId || messageIds.length === 0) {
      return
    }

    // Filter out messages that are already loaded, being loaded, or known to have no record
    const newMessageIds = messageIds.filter(
      id => !translations[id]?.isTranslated &&
            !pendingRequestsRef.current.has(id) &&
            !noOutgoingRecordRef.current.has(id)
    )

    if (newMessageIds.length === 0) {
      return
    }

    // Mark messages as loading
    newMessageIds.forEach(id => pendingRequestsRef.current.add(id))

    try {
      const response = await translationService.getOutgoingTranslations(conversationId, newMessageIds)

      if (response.success) {
        // Track which messages have outgoing records
        const foundIds = new Set(response.data.translations.map((t: TranslationResponse) => t.message_id))

        // Messages without outgoing records - mark them so we don't retry
        const messagesWithoutRecords = newMessageIds.filter(id => !foundIds.has(id))
        messagesWithoutRecords.forEach(id => {
          noOutgoingRecordRef.current.add(id)
          pendingRequestsRef.current.delete(id)
        })

        setTranslations(prev => {
          const updated = { ...prev }
          response.data.translations.forEach((t: TranslationResponse) => {
            updated[t.message_id] = {
              original: t.original_content, // What agent typed
              translated: t.translated_content, // What customer sees (message.body)
              isLoading: false,
              showOriginal: true, // Show ORIGINAL (what agent typed) by default
              isTranslated: t.is_translated,
              fromLang: t.from_lang,
              toLang: t.to_lang,
              isOutgoing: true,
            }
            pendingRequestsRef.current.delete(t.message_id)
          })
          return updated
        })
      }
    } catch (error) {
      console.error('Failed to get outgoing translations:', error)
      newMessageIds.forEach(id => pendingRequestsRef.current.delete(id))
    }
  }, [conversationId, translations])

  // Debounced batch request for incoming translations
  const queueTranslation = useCallback((messageId: number) => {
    if (!needsTranslation) return

    pendingBatchRef.current.push(messageId)

    if (incomingBatchTimeoutRef.current) {
      clearTimeout(incomingBatchTimeoutRef.current)
    }

    incomingBatchTimeoutRef.current = setTimeout(() => {
      const batch = [...new Set(pendingBatchRef.current)]
      pendingBatchRef.current = []
      if (batch.length > 0) {
        requestTranslations(batch)
      }
    }, 100) // Batch requests within 100ms
  }, [needsTranslation, requestTranslations])

  // Queue outgoing translations
  const queueOutgoingTranslation = useCallback((messageId: number) => {
    // Don't queue if we know there's no outgoing record
    if (noOutgoingRecordRef.current.has(messageId)) return

    outgoingBatchRef.current.push(messageId)

    if (outgoingBatchTimeoutRef.current) {
      clearTimeout(outgoingBatchTimeoutRef.current)
    }

    outgoingBatchTimeoutRef.current = setTimeout(() => {
      const batch = [...new Set(outgoingBatchRef.current)]
      outgoingBatchRef.current = []
      if (batch.length > 0) {
        requestOutgoingTranslations(batch)
      }
    }, 100)
  }, [requestOutgoingTranslations])

  // Get translation for a specific message
  // messageLanguage: the detected language of the message (e.g., 'fa', 'en')
  // isAgentMessage: true if this is an agent/bot message
  // authorType: 'customer' | 'agent' | 'bot' | 'system' - distinguishes human agents from bots
  //
  // LOGIC:
  // - Customer messages: translate to agent's language, show translated by default
  // - Human agent messages: show original (what they typed) - check outgoing record if auto_translate_outgoing enabled
  // - Bot messages: translate like customer messages (bot writes in customer's language)
  const getTranslation = useCallback((
    messageId: number,
    originalContent: string,
    messageLanguage?: string,
    isAgentMessage: boolean = false,
    authorType?: string
  ) => {
    const state = translations[messageId]
    const agentLang = languageInfo?.agent_language || 'en'
    const hasAutoTranslateOutgoing = languageInfo?.auto_translate_outgoing || false
    const messageInForeignLang = messageLanguage && messageLanguage !== agentLang
    const isBot = authorType === 'bot'

    // === BOT MESSAGES ===
    // Bots write in customer's language, so treat like customer messages (translate for agent)
    if (isAgentMessage && isBot) {
      if (!needsTranslation || !messageInForeignLang) {
        return {
          content: originalContent,
          isLoading: false,
          isTranslated: false,
          showOriginal: true,
        }
      }

      if (!state) {
        queueTranslation(messageId)
        return {
          content: originalContent,
          isLoading: true,
          isTranslated: false,
          showOriginal: false,
        }
      }

      if (state.isLoading) {
        return {
          content: originalContent,
          isLoading: true,
          isTranslated: false,
          showOriginal: false,
        }
      }

      // Show translated by default for bot messages
      return {
        content: state.showOriginal ? (state.original || originalContent) : (state.translated || originalContent),
        isLoading: false,
        isTranslated: state.isTranslated,
        showOriginal: state.showOriginal,
      }
    }

    // === HUMAN AGENT MESSAGES ===
    if (isAgentMessage) {
      // Check if we already know there's no outgoing record for this message
      const knownNoOutgoingRecord = noOutgoingRecordRef.current.has(messageId)

      // CASE 1: We have state with outgoing translation record (agent message that was translated)
      if (state?.isTranslated && state?.isOutgoing) {
        // Show what agent originally typed
        return {
          content: state.showOriginal ? state.original : (state.translated || originalContent),
          isLoading: false,
          isTranslated: true,
          showOriginal: state.showOriginal,
        }
      }

      // CASE 2: Known no outgoing record - agent typed in this language (show as-is)
      if (knownNoOutgoingRecord) {
        return {
          content: originalContent,
          isLoading: false,
          isTranslated: false,
          showOriginal: true,
        }
      }

      // CASE 3: auto_translate_outgoing is disabled - no translation happened, show as-is
      if (!hasAutoTranslateOutgoing) {
        return {
          content: originalContent,
          isLoading: false,
          isTranslated: false,
          showOriginal: true,
        }
      }

      // CASE 5: Need to check for outgoing translation record
      if (!state) {
        queueOutgoingTranslation(messageId)
        return {
          content: originalContent,
          isLoading: true,
          isTranslated: false,
          showOriginal: true,
        }
      }

      // Still loading
      if (state.isLoading) {
        return {
          content: originalContent,
          isLoading: true,
          isTranslated: false,
          showOriginal: true,
        }
      }

      // Fallback - show as-is
      return {
        content: originalContent,
        isLoading: false,
        isTranslated: false,
        showOriginal: true,
      }
    }

    // === CUSTOMER MESSAGES ===
    // Translate to agent's language if needed
    if (!needsTranslation || !messageInForeignLang) {
      return {
        content: originalContent,
        isLoading: false,
        isTranslated: false,
        showOriginal: true,
      }
    }

    if (!state) {
      queueTranslation(messageId)
      return {
        content: originalContent,
        isLoading: true,
        isTranslated: false,
        showOriginal: false,
      }
    }

    if (state.isLoading) {
      return {
        content: originalContent,
        isLoading: true,
        isTranslated: false,
        showOriginal: false,
      }
    }

    // Show TRANSLATED by default for customer messages
    return {
      content: state.showOriginal ? (state.original || originalContent) : (state.translated || originalContent),
      isLoading: false,
      isTranslated: state.isTranslated,
      showOriginal: state.showOriginal,
    }
  }, [translations, needsTranslation, languageInfo, queueTranslation, queueOutgoingTranslation])

  // Toggle between original and translated content
  const toggleTranslation = useCallback((messageId: number) => {
    setTranslations(prev => {
      const current = prev[messageId]
      if (!current) return prev
      return {
        ...prev,
        [messageId]: {
          ...current,
          showOriginal: !current.showOriginal,
        },
      }
    })
  }, [])

  // Translate outgoing message
  const translateOutgoing = useCallback(async (content: string) => {
    if (!conversationId || !languageInfo?.auto_translate_outgoing || !languageInfo?.needs_translation) {
      return null
    }

    try {
      const response = await translationService.translateOutgoing(conversationId, content)
      if (response.success) {
        return {
          original: response.data.original_content,
          translated: response.data.translated_content,
        }
      }
    } catch (error) {
      console.error('Failed to translate outgoing message:', error)
    }
    return null
  }, [conversationId, languageInfo])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (incomingBatchTimeoutRef.current) {
        clearTimeout(incomingBatchTimeoutRef.current)
      }
      if (outgoingBatchTimeoutRef.current) {
        clearTimeout(outgoingBatchTimeoutRef.current)
      }
    }
  }, [])

  return {
    languageInfo,
    translations,
    isLoading,
    needsTranslation,
    getTranslation,
    toggleTranslation,
    requestTranslations,
    requestOutgoingTranslations,
    translateOutgoing,
  }
}

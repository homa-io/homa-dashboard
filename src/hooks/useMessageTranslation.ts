/**
 * Hook for handling message translations in conversations
 * Uses per-message language detection
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
  getTranslation: (messageId: number, originalContent: string, messageLanguage?: string, isAgentMessage?: boolean) => {
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

  // Fetch language info when conversation changes
  useEffect(() => {
    if (!conversationId || !enabled) {
      setLanguageInfo(null)
      setTranslations({})
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

  // Request translations for messages (incoming - messages not in agent's language)
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
          showOriginal: false, // Show translated by default for incoming
          isTranslated: false,
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
              showOriginal: false, // Show translated by default for incoming
              isTranslated: t.is_translated,
              fromLang: t.from_lang,
              toLang: t.to_lang,
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

    // Filter out messages that are already loaded or being loaded
    const newMessageIds = messageIds.filter(
      id => !translations[id]?.isTranslated && !pendingRequestsRef.current.has(id)
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

        // Messages without outgoing records (e.g., AI bot messages) need regular translation
        const messagesWithoutRecords = newMessageIds.filter(id => !foundIds.has(id))

        setTranslations(prev => {
          const updated = { ...prev }
          response.data.translations.forEach((t: TranslationResponse) => {
            updated[t.message_id] = {
              original: t.original_content, // What agent typed
              translated: t.translated_content, // What customer sees (message.body)
              isLoading: false,
              showOriginal: true, // Show original (what agent typed) by default
              isTranslated: t.is_translated,
              fromLang: t.from_lang,
              toLang: t.to_lang,
            }
            pendingRequestsRef.current.delete(t.message_id)
          })
          return updated
        })

        // For messages without outgoing records, use regular translation
        if (messagesWithoutRecords.length > 0) {
          messagesWithoutRecords.forEach(id => pendingRequestsRef.current.delete(id))
          // Queue for regular translation
          messagesWithoutRecords.forEach(id => {
            pendingBatchRef.current.push(id)
          })
          // Trigger the batch
          if (incomingBatchTimeoutRef.current) {
            clearTimeout(incomingBatchTimeoutRef.current)
          }
          incomingBatchTimeoutRef.current = setTimeout(() => {
            const batch = [...new Set(pendingBatchRef.current)]
            pendingBatchRef.current = []
            if (batch.length > 0) {
              requestTranslations(batch)
            }
          }, 50)
        }
      }
    } catch (error) {
      console.error('Failed to get outgoing translations:', error)
      newMessageIds.forEach(id => pendingRequestsRef.current.delete(id))
    }
  }, [conversationId, translations, requestTranslations])

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
  const getTranslation = useCallback((
    messageId: number,
    originalContent: string,
    messageLanguage?: string,
    isAgentMessage: boolean = false
  ) => {
    const state = translations[messageId]
    const agentLang = languageInfo?.agent_language || 'en'

    // Check if translation is needed for this message
    // A message needs translation if its language differs from agent's language
    const messageNeedsTranslation = messageLanguage && messageLanguage !== agentLang

    if (!needsTranslation || !messageNeedsTranslation) {
      return {
        content: originalContent,
        isLoading: false,
        isTranslated: false,
        showOriginal: true,
      }
    }

    if (!state) {
      // Queue this message for translation
      if (isAgentMessage) {
        // For agent messages: fetch original from outgoing translation record
        queueOutgoingTranslation(messageId)
      } else {
        // For customer messages: translate to agent's language
        queueTranslation(messageId)
      }
      return {
        content: originalContent,
        isLoading: true,
        isTranslated: false,
        showOriginal: true,
      }
    }

    if (isAgentMessage && state.original) {
      // For agent messages with outgoing translation record:
      // - Default: show what agent typed (original)
      // - Toggle: show what customer sees (translated/message.body)
      return {
        content: state.showOriginal ? state.original : (state.translated || originalContent),
        isLoading: false,
        isTranslated: true,
        showOriginal: state.showOriginal,
      }
    }

    // For customer messages:
    // - Show translated by default (translated to agent's language)
    // - Toggle shows original (what customer typed)
    return {
      content: state.showOriginal ? (state.original || originalContent) : (state.translated || originalContent),
      isLoading: state.isLoading,
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

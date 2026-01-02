"use client"

import { useState, useEffect, useCallback } from 'react'
import { Sparkles, ChevronDown, ChevronUp, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getConversationSummary, generateConversationSummary, ConversationSummaryResponse } from '@/services/ai.service'
import { isSettingEnabledAction } from '@/actions/settings.actions'

interface ConversationSummaryProps {
  conversationId: number
  messageCount: number
  fallbackText?: string
  language?: string // Agent's preferred language for summary generation
}

export function ConversationSummary({ conversationId, messageCount, fallbackText, language }: ConversationSummaryProps) {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null)
  const [summary, setSummary] = useState<ConversationSummaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if conversation summary is enabled in settings using server action
  useEffect(() => {
    const checkSetting = async () => {
      try {
        const enabled = await isSettingEnabledAction('ai.conversation_summary_enabled')
        setIsEnabled(enabled)
      } catch (err) {
        console.error('Error checking conversation summary setting:', err)
        setIsEnabled(false)
      }
    }
    checkSetting()
  }, [])

  // Fetch summary when conversation changes
  const fetchSummary = useCallback(async () => {
    if (!isEnabled || !conversationId) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await getConversationSummary(conversationId, language)
      if (response.success && response.data) {
        setSummary(response.data)

        if (response.data.needs_update && response.data.summary) {
          regenerateSummary()
        } else if (response.data.needs_update && !response.data.summary && messageCount > 0) {
          regenerateSummary()
        }
      }
    } catch (err) {
      console.error('Error fetching summary:', err)
      setError('Failed to fetch summary')
    } finally {
      setIsLoading(false)
    }
  }, [conversationId, isEnabled, messageCount, language])

  const regenerateSummary = async () => {
    if (!conversationId || isGenerating) return

    setIsGenerating(true)
    setError(null)
    try {
      const response = await generateConversationSummary(conversationId, language)
      if (response.success && response.data) {
        setSummary(response.data)
      }
    } catch (err) {
      console.error('Error generating summary:', err)
      setError('Failed to generate summary')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (isEnabled === true) {
      fetchSummary()
    }
  }, [isEnabled, conversationId, fetchSummary])

  if (isEnabled === null || isEnabled === false) {
    return null
  }

  if (messageCount === 0) {
    return null
  }

  const displayText = summary?.summary || fallbackText || ''
  const isShowingFallback = !summary?.summary && !!fallbackText
  const isUpdating = isLoading || isGenerating
  const hasSummary = !!summary?.summary

  if (!displayText && !isUpdating) {
    return null
  }

  // Get bullet points for display
  const bulletPoints = displayText.includes('\n')
    ? displayText.split('\n').filter(line => line.trim())
    : [displayText]

  const hasMoreContent = bulletPoints.length > 2

  return (
    <div
      className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border border-blue-200/60 dark:border-slate-600/60 rounded-lg px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
      onClick={() => hasMoreContent && setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {/* Header row - compact */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">AI Summary</span>
              {isUpdating && (
                <Loader2 className="w-3 h-3 text-blue-500 dark:text-blue-400 animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-1">
              {hasSummary && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    regenerateSummary()
                  }}
                  disabled={isGenerating}
                  title="Regenerate"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                </Button>
              )}
              {hasMoreContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-blue-500 dark:text-blue-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(!isExpanded)
                  }}
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>
              )}
            </div>
          </div>

          {/* Content - max 2 lines when collapsed */}
          {displayText && (
            <div className={`text-xs leading-relaxed ${
              isShowingFallback
                ? 'text-blue-600/70 dark:text-blue-300/70 italic'
                : 'text-blue-700 dark:text-blue-200'
            }`}>
              {!isShowingFallback && bulletPoints.length > 0 ? (
                <ul className="space-y-0.5 list-none m-0 p-0">
                  {(isExpanded ? bulletPoints : bulletPoints.slice(0, 2)).map((line, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-blue-500 dark:text-blue-400">•</span>
                      <span className="flex-1">{line.trim()}</span>
                    </li>
                  ))}
                  {!isExpanded && bulletPoints.length > 2 && (
                    <li className="text-blue-500 dark:text-blue-400 text-xs">
                      +{bulletPoints.length - 2} more...
                    </li>
                  )}
                </ul>
              ) : (
                <p className="m-0 line-clamp-2">{displayText}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

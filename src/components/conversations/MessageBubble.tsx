"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Languages, Eye, EyeOff } from "lucide-react"
import { getAvatarColor } from "@/lib/avatar-colors"
import type { Message } from "@/types/conversation.types"

interface MessageBubbleProps {
  message: Message
  translation?: {
    content: string
    isLoading: boolean
    isTranslated: boolean
    showOriginal: boolean
  }
  onToggleTranslation?: () => void
  needsTranslation?: boolean
}

export function MessageBubble({
  message,
  translation,
  onToggleTranslation,
  needsTranslation = false,
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Determine what content to show
  const isClientMessage = !message.is_agent
  const shouldShowTranslation = needsTranslation && isClientMessage && translation
  const displayContent = shouldShowTranslation && !translation.showOriginal
    ? translation.content
    : message.body

  return (
    <div className={`flex gap-2 sm:gap-3 ${message.is_agent ? "flex-row-reverse" : ""}`}>
      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
        <AvatarFallback
          className="text-xs font-medium text-white"
          style={{ backgroundColor: getAvatarColor(message.author?.name || "Unknown") }}
        >
          {message.author?.initials || "?"}
        </AvatarFallback>
      </Avatar>
      <div className={`flex-1 max-w-[80%] sm:max-w-[70%] ${message.is_agent ? "text-right" : ""}`}>
        <div className={`inline-block p-2 sm:p-4 rounded-lg relative ${
          message.is_agent ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <span className="font-medium text-xs sm:text-sm">{message.author?.name || "Unknown"}</span>
            <span className="text-[10px] sm:text-xs opacity-70">{formatTime(message.created_at)}</span>

            {/* Translation indicator and toggle */}
            {shouldShowTranslation && translation.isTranslated && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-5 w-5 p-0 ml-1 ${
                        message.is_agent ? "hover:bg-primary-foreground/20" : "hover:bg-muted-foreground/20"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleTranslation?.()
                      }}
                    >
                      {translation.showOriginal ? (
                        <Eye className="h-3 w-3 opacity-70" />
                      ) : (
                        <Languages className="h-3 w-3 opacity-70" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {translation.showOriginal ? "Show translated" : "Show original"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Message content with translation loading state */}
          {shouldShowTranslation && translation.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-xs sm:text-sm whitespace-pre-wrap">{displayContent}</p>
          )}

          {/* Translation indicator badge */}
          {shouldShowTranslation && translation.isTranslated && !translation.showOriginal && (
            <div className={`mt-2 pt-2 border-t ${
              message.is_agent ? "border-primary-foreground/20" : "border-muted-foreground/20"
            }`}>
              <span className="text-[10px] opacity-60 flex items-center gap-1">
                <Languages className="h-3 w-3" />
                Translated
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

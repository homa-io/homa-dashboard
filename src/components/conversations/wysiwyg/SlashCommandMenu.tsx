"use client"

import React from "react"
import { createPortal } from "react-dom"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SlashCommandMenuProps } from "./types"

export function SlashCommandMenu({
  show,
  position,
  slashQuery,
  cannedMessages,
  isLoading,
  selectedIndex,
  onSelect,
  menuRef,
}: SlashCommandMenuProps) {
  if (!show || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-popover border border-border rounded-lg shadow-lg max-h-[300px] overflow-y-auto w-[320px]"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="p-2 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MessageSquare className="h-3 w-3" />
          <span>Canned Messages</span>
          {slashQuery && (
            <span className="ml-auto">Filtering: "/{slashQuery}"</span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
          <span className="text-xs">Loading...</span>
        </div>
      ) : cannedMessages.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground text-xs">
          No matching canned messages found
        </div>
      ) : (
        <div className="py-1">
          {cannedMessages.slice(0, 10).map((msg, index) => (
            <div
              key={msg.id}
              onClick={() => onSelect(msg)}
              className={cn(
                "px-3 py-2 cursor-pointer transition-colors",
                index === selectedIndex
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm truncate">{msg.title}</span>
                {msg.shortcut && (
                  <Badge
                    variant={index === selectedIndex ? "secondary" : "outline"}
                    className="text-xs shrink-0"
                  >
                    /{msg.shortcut}
                  </Badge>
                )}
              </div>
              <p className={cn(
                "text-xs mt-1 line-clamp-2",
                index === selectedIndex
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="p-2 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
        <span>↑↓ Navigate</span>
        <span>↵ Select</span>
        <span>Esc Close</span>
      </div>
    </div>,
    document.body
  )
}

"use client"

import React, { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, MessageSquare, Loader2 } from "lucide-react"
import type { TemplateModalProps } from "./types"

export function TemplateModal({
  open,
  onOpenChange,
  cannedMessages,
  isLoading,
  onInsertTemplate,
}: TemplateModalProps) {
  const [search, setSearch] = useState('')

  const filteredMessages = useMemo(() => {
    return cannedMessages.filter(msg => {
      if (!search) return true
      const query = search.toLowerCase()
      return (
        msg.title.toLowerCase().includes(query) ||
        (msg.shortcut && msg.shortcut.toLowerCase().includes(query)) ||
        msg.message.toLowerCase().includes(query)
      )
    })
  }, [cannedMessages, search])

  const handleInsert = (message: typeof cannedMessages[0]) => {
    onInsertTemplate(message)
    setSearch('')
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (!isOpen) setSearch('')
    }}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Canned Messages / Templates
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Search canned messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Canned Messages List */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-muted-foreground">Loading canned messages...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{search ? 'No matching canned messages found' : 'No canned messages available'}</p>
                <p className="text-xs mt-1">You can create canned messages in Settings</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleInsert(message)}
                  className="p-4 border border-border rounded-md hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {message.title}
                    </h4>
                    {message.shortcut && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        /{message.shortcut}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {message.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Tip */}
          <div className="text-xs text-muted-foreground border-t pt-3">
            <span className="font-medium">Tip:</span> You can also type <Badge variant="secondary" className="text-xs mx-1">/</Badge> in the editor to quickly search and insert canned messages.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

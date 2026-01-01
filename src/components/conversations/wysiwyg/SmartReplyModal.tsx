"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Languages, RefreshCw, MessageSquare, Check, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { SUPPORTED_LANGUAGES, SMART_REPLY_TONES } from "@/services/ai.service"
import type { SmartReplyModalProps } from "./types"

export function SmartReplyModal({
  open,
  onOpenChange,
  aiReview,
  isLoading,
  isRegenerating,
  selectedVersion,
  onSelectVersion,
  smartReplyTone,
  onToneChange,
  smartReplyLanguage,
  onLanguageChange,
  onRegenerate,
  onSend,
  onCancel,
}: SmartReplyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Reply - Choose Your Message
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {isLoading || isRegenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <span className="text-lg font-medium">
                {isRegenerating ? 'Regenerating with new settings...' : 'AI is analyzing your message...'}
              </span>
              <span className="text-sm text-muted-foreground mt-1">Checking language, grammar, and more</span>
            </div>
          ) : aiReview ? (
            <>
              {/* Tone and Language Selectors */}
              <div className="flex flex-wrap gap-4 pt-2 pb-3 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tone:</span>
                  <Select value={smartReplyTone || "auto"} onValueChange={(v) => onToneChange(v === "auto" ? "" : v)}>
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue placeholder="Auto-detect" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      {SMART_REPLY_TONES.map((tone) => (
                        <SelectItem key={tone.id} value={tone.id}>
                          {tone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Language:</span>
                  <Select value={smartReplyLanguage || "auto"} onValueChange={(v) => onLanguageChange(v === "auto" ? "" : v)}>
                    <SelectTrigger className="w-[160px] h-8">
                      <SelectValue placeholder="Auto-detect" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.name}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRegenerate}
                  disabled={isRegenerating}
                  className="h-8"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-1", isRegenerating && "animate-spin")} />
                  Regenerate
                </Button>
              </div>

              {/* Language & Translation Info */}
              {(aiReview.wasTranslated || aiReview.detectedUserLanguage) && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {aiReview.detectedUserLanguage && (
                    <Badge variant="outline" className="text-xs">
                      <Languages className="h-3 w-3 mr-1" />
                      User language: {aiReview.detectedUserLanguage}
                    </Badge>
                  )}
                  {aiReview.detectedAgentLanguage && aiReview.detectedAgentLanguage !== aiReview.detectedUserLanguage && (
                    <Badge variant="outline" className="text-xs">
                      Your language: {aiReview.detectedAgentLanguage}
                    </Badge>
                  )}
                  {aiReview.wasTranslated && (
                    <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                      Translated to match user language
                    </Badge>
                  )}
                </div>
              )}

              {/* Two selectable message boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Message */}
                <div
                  onClick={() => onSelectVersion('original')}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedVersion === 'original'
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Your Original
                    </h4>
                    {selectedVersion === 'original' && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Check className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-foreground whitespace-pre-wrap min-h-[200px] max-h-[50vh] overflow-y-auto">
                    {aiReview.originalText}
                  </div>
                </div>

                {/* AI Improved Message */}
                <div
                  onClick={() => onSelectVersion('improved')}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedVersion === 'improved'
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20 ring-2 ring-green-500/20"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
                      <Sparkles className="h-4 w-4" />
                      AI Improved
                    </h4>
                    {selectedVersion === 'improved' && (
                      <Badge className="bg-green-600 text-white">
                        <Check className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-foreground whitespace-pre-wrap min-h-[200px] max-h-[50vh] overflow-y-auto">
                    {aiReview.suggestedText}
                  </div>
                </div>
              </div>

              {/* Improvements List */}
              {aiReview.improvements && aiReview.improvements.length > 0 && (
                <div className="pt-2">
                  <h5 className="text-xs font-medium text-muted-foreground mb-2">Improvements made:</h5>
                  <div className="flex flex-wrap gap-1">
                    {aiReview.improvements.map((improvement, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {improvement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        {aiReview && !isLoading && !isRegenerating && (
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSend}>
              <Send className="h-4 w-4 mr-2" />
              Send {selectedVersion === 'improved' ? 'Improved' : 'Original'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

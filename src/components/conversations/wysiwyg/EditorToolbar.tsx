"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold, Italic, Underline, List, ListOrdered, Link2,
  Mic, MicOff, Languages, Sparkles, RefreshCw,
  BookOpen, FileText, Loader2, ChevronDown
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SUPPORTED_LANGUAGES } from "@/services/ai.service"
import type { EditorToolbarProps } from "./types"

export function EditorToolbar({
  value,
  hasContent,
  isRecording,
  isTranslating,
  isGenerating,
  isRevising,
  revisionFormats,
  recognitionAvailable,
  onBold,
  onItalic,
  onUnderline,
  onList,
  onOrderedList,
  onInsertLink,
  onToggleSpeechToText,
  onTranslate,
  onGenerate,
  onRevise,
  onOpenKnowledgeBase,
  onOpenTemplates,
}: EditorToolbarProps) {
  const characterCount = value?.replace(/<[^>]*>/g, '').length || 0

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-t-lg border-x border-t border-border flex-wrap">
      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault()
          onBold()
        }}
        className="h-8 px-2"
        title="Bold (Ctrl+B)"
        tabIndex={-1}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault()
          onItalic()
        }}
        className="h-8 px-2"
        title="Italic (Ctrl+I)"
        tabIndex={-1}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault()
          onUnderline()
        }}
        className="h-8 px-2"
        title="Underline (Ctrl+U)"
        tabIndex={-1}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-4" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault()
          onList()
        }}
        className="h-8 px-2"
        title="Bullet List"
        tabIndex={-1}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault()
          onOrderedList()
        }}
        className="h-8 px-2"
        title="Numbered List"
        tabIndex={-1}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault()
          onInsertLink()
        }}
        className="h-8 px-2"
        title="Insert Link"
        tabIndex={-1}
      >
        <Link2 className="h-4 w-4" />
      </Button>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

      {/* Audio and AI Features */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSpeechToText}
        className={isRecording ? "h-8 px-2 bg-red-100 text-red-700" : "h-8 px-2"}
        disabled={!recognitionAvailable}
        title="Audio to Text"
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            disabled={isTranslating || (!hasContent && !value.trim())}
            title="Translate"
          >
            {isTranslating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Languages className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => onTranslate(lang.name)}
              className="cursor-pointer"
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        onClick={onGenerate}
        className="h-8 px-2"
        disabled={isGenerating}
        title="AI Generate"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            disabled={isRevising || (!hasContent && !value.trim())}
            title="Rewrite/Revise Response"
          >
            {isRevising ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {revisionFormats.map((format) => (
            <DropdownMenuItem
              key={format.id}
              onClick={() => onRevise(format.id)}
              className="cursor-pointer flex flex-col items-start"
            >
              <span className="font-medium">{format.name}</span>
              <span className="text-xs text-muted-foreground">{format.description}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

      {/* Templates and Knowledge Base */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenKnowledgeBase}
        className="h-8 px-2"
        title="Knowledge Base"
      >
        <BookOpen className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenTemplates}
        className="h-8 px-2"
        title="Templates"
      >
        <FileText className="h-4 w-4" />
      </Button>

      <div className="ml-auto text-xs text-muted-foreground">
        {characterCount} characters
      </div>
    </div>
  )
}

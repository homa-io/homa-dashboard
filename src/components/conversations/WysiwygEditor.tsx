"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Mic, Languages, Sparkles, Reply, Send, Volume2, MicOff, CheckCircle, AlertCircle, Loader2, BookOpen, Search, ExternalLink, Bold, Italic, Underline, List, ListOrdered, Link2, FileText, RefreshCw, MessageSquare, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { cannedMessagesService, CannedMessage } from "@/services/canned-messages.service"
import { aiService, SUPPORTED_LANGUAGES, SMART_REPLY_TONES, type RevisionFormat, type SmartReplyResponse } from "@/services/ai.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Editor implementation - using textarea for React 19 compatibility

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSend?: (message?: string) => void  // Optional message param for direct send
  onFastReply?: () => void
  className?: string
  minHeight?: string
  disabled?: boolean
  userLastMessage?: string // Last message from the user for smart reply
}

interface AIReview {
  originalText: string
  suggestedText: string
  detectedUserLanguage?: string
  detectedAgentLanguage?: string
  wasTranslated?: boolean
  improvements?: string[]
}

interface KnowledgeBaseArticle {
  id: string
  title: string
  summary: string
  category: string
  tags: string[]
  url: string
}

// Mock knowledge base articles - defined outside component to prevent recreation
const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    id: "1",
    title: "How to Reset Your Password",
    summary: "Step-by-step guide to reset your account password",
    category: "Account Management",
    tags: ["password", "reset", "security"],
    url: "/kb/password-reset"
  },
  {
    id: "2",
    title: "Payment Failed - Troubleshooting Guide",
    summary: "Common reasons why payments fail and how to resolve them",
    category: "Billing",
    tags: ["payment", "billing", "failed", "troubleshooting"],
    url: "/kb/payment-failed"
  },
  {
    id: "3",
    title: "Understanding Your Invoice",
    summary: "Explanation of invoice details and billing cycles",
    category: "Billing",
    tags: ["invoice", "billing", "charges"],
    url: "/kb/invoice-explanation"
  },
  {
    id: "4",
    title: "Setting Up Two-Factor Authentication",
    summary: "Enable 2FA for enhanced account security",
    category: "Security",
    tags: ["2fa", "security", "authentication"],
    url: "/kb/two-factor-setup"
  },
  {
    id: "5",
    title: "API Rate Limits and Best Practices",
    summary: "Understanding API limits and optimization techniques",
    category: "Developer",
    tags: ["api", "rate-limits", "optimization"],
    url: "/kb/api-rate-limits"
  }
]

export function WysiwygEditor({
  value,
  onChange,
  placeholder = "Type your message...",
  onSend,
  onFastReply,
  className,
  minHeight = "150px",
  disabled = false,
  userLastMessage = ""
}: WysiwygEditorProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [aiReview, setAiReview] = useState<AIReview | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<'original' | 'improved'>('improved')
  const [smartReplyTone, setSmartReplyTone] = useState<string>('')
  const [smartReplyLanguage, setSmartReplyLanguage] = useState<string>('')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false)
  const [knowledgeBaseSearch, setKnowledgeBaseSearch] = useState('')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateSearch, setTemplateSearch] = useState('')
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [isRevising, setIsRevising] = useState(false)
  const [revisionFormats, setRevisionFormats] = useState<RevisionFormat[]>([])
  // Slash command state
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashQuery, setSlashQuery] = useState('')
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 })
  const [cannedMessages, setCannedMessages] = useState<CannedMessage[]>([])
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0)
  const [isLoadingCannedMessages, setIsLoadingCannedMessages] = useState(false)
  const [hasContent, setHasContent] = useState(() => value.trim().length > 0) // Track if editor has content for button states
  const slashStartPositionRef = useRef<number | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const slashMenuRef = useRef<HTMLDivElement>(null)
  const isUserTypingRef = useRef(false)
  const savedSelectionRef = useRef<Range | null>(null)
  const lastEmittedValueRef = useRef<string>('')

  // Sync external value changes to contentEditable (but not during user typing)
  useEffect(() => {
    if (editorRef.current && !isUserTypingRef.current) {
      // Only sync if the value changed from an external source (not from our onChange)
      if (editorRef.current.innerHTML !== value && lastEmittedValueRef.current !== value) {
        editorRef.current.innerHTML = value
        lastEmittedValueRef.current = value
      }
    }
  }, [value])

  // Refs to hold current values for speech recognition callback
  const valueRef = useRef(value)
  const onChangeRef = useRef(onChange)

  // Keep refs updated
  useEffect(() => {
    valueRef.current = value
    onChangeRef.current = onChange
  }, [value, onChange])

  // Initialize speech recognition (only once on mount)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          const currentValue = valueRef.current || ''
          const newContent = currentValue + ' ' + finalTranscript
          lastEmittedValueRef.current = newContent
          onChangeRef.current(newContent)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, []) // Only run once on mount

  // Load canned messages on mount
  useEffect(() => {
    const loadCannedMessages = async () => {
      try {
        setIsLoadingCannedMessages(true)
        const response = await cannedMessagesService.list({ is_active: true, per_page: 100 })
        setCannedMessages(response.data)
      } catch (error) {
        console.error('Failed to load canned messages:', error)
      } finally {
        setIsLoadingCannedMessages(false)
      }
    }
    loadCannedMessages()
  }, [])

  // Load revision formats on mount
  useEffect(() => {
    const loadRevisionFormats = async () => {
      try {
        const response = await aiService.getFormats()
        if (response.success && response.data) {
          setRevisionFormats(response.data)
        }
      } catch (error) {
        console.error('Failed to load revision formats:', error)
      }
    }
    loadRevisionFormats()
  }, [])

  // Filter canned messages based on slash query (memoized)
  const filteredCannedMessages = useMemo(() => {
    return cannedMessages.filter(msg => {
      if (!slashQuery) return true
      const query = slashQuery.toLowerCase()
      return (
        msg.title.toLowerCase().includes(query) ||
        (msg.shortcut && msg.shortcut.toLowerCase().includes(query)) ||
        msg.message.toLowerCase().includes(query)
      )
    })
  }, [cannedMessages, slashQuery])

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedSlashIndex(0)
  }, [slashQuery])

  // Close slash menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (slashMenuRef.current && !slashMenuRef.current.contains(event.target as Node)) {
        setShowSlashMenu(false)
        setSlashQuery('')
        slashStartPositionRef.current = null
      }
    }

    if (showSlashMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSlashMenu])

  // Filter articles based on search (memoized)
  const filteredArticles = useMemo(() => {
    return knowledgeBaseArticles.filter(article =>
      article.title.toLowerCase().includes(knowledgeBaseSearch.toLowerCase()) ||
      article.summary.toLowerCase().includes(knowledgeBaseSearch.toLowerCase()) ||
      article.category.toLowerCase().includes(knowledgeBaseSearch.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(knowledgeBaseSearch.toLowerCase()))
    )
  }, [knowledgeBaseSearch])

  const insertKnowledgeBaseArticle = (article: KnowledgeBaseArticle) => {
    const linkText = `<a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>`
    const currentValue = value || ''
    const newContent = currentValue + ' ' + linkText
    lastEmittedValueRef.current = newContent
    onChange(newContent)
    setShowKnowledgeBase(false)
    setKnowledgeBaseSearch('')
  }

  const toggleSpeechToText = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  // Helper function to replace editor content in an undo-friendly way
  const replaceEditorContent = (newContent: string) => {
    if (!editorRef.current) return

    // Focus the editor
    editorRef.current.focus()

    // Select all content
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(editorRef.current)
    selection?.removeAllRanges()
    selection?.addRange(range)

    // Use execCommand to insert text (this is undoable)
    // insertText doesn't support HTML, so we use insertHTML for formatted content
    document.execCommand('insertText', false, newContent)

    // Update our tracking refs
    lastEmittedValueRef.current = newContent
    onChange(newContent)
  }

  const handleAITranslate = async (targetLanguage: string) => {
    // Get the current text from editor
    const textContent = editorRef.current?.innerText?.trim() || value.replace(/<[^>]*>/g, '').trim()
    if (!textContent) return

    setIsTranslating(true)
    try {
      const response = await aiService.translate({
        text: textContent,
        language: targetLanguage,
      })

      if (response.success && response.data) {
        // Update the editor with translated text (undo-friendly)
        replaceEditorContent(response.data.translated_text)
      }
    } catch (error) {
      console.error('Translation failed:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleAIGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI message generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock AI generated response
    const aiResponse = "Thank you for reaching out to us. I understand your concern and I'm here to help you resolve this issue. Based on the information provided, I can see that you're experiencing difficulties with your recent transaction. Let me look into this matter immediately and provide you with a solution. I'll ensure this gets resolved as quickly as possible."
    lastEmittedValueRef.current = aiResponse
    onChange(aiResponse)
    setIsGenerating(false)
  }

  const handlePreviewAndReview = async () => {
    // Flush any pending content to parent before preview
    if (onChangeTimerRef.current) {
      clearTimeout(onChangeTimerRef.current)
    }
    const currentContent = editorRef.current?.innerText?.trim() || value.replace(/<[^>]*>/g, '').trim()
    if (!currentContent) return

    // Sync content immediately
    const htmlContent = editorRef.current?.innerHTML || pendingContentRef.current || value
    if (htmlContent !== value) {
      onChange(htmlContent)
    }

    // Reset tone and language for fresh modal
    setSmartReplyTone('')
    setSmartReplyLanguage('')
    setIsLoadingAI(true)
    setShowPreview(true)
    setSelectedVersion('improved') // Default to improved version

    try {
      // Call smart reply API
      const response = await aiService.smartReply({
        agent_message: currentContent,
        user_last_message: userLastMessage || ''
      })

      if (response.success && response.data) {
        const review: AIReview = {
          originalText: response.data.original_text,
          suggestedText: response.data.improved_text,
          detectedUserLanguage: response.data.detected_user_language,
          detectedAgentLanguage: response.data.detected_agent_language,
          wasTranslated: response.data.was_translated,
          improvements: response.data.improvements
        }
        setAiReview(review)
        // Set the detected language as default for the language selector
        if (response.data.detected_user_language) {
          setSmartReplyLanguage(response.data.detected_user_language)
        }
      } else {
        // Fallback if API fails - just use original
        setAiReview({
          originalText: currentContent,
          suggestedText: currentContent,
          improvements: []
        })
      }
    } catch (error) {
      console.error('Smart reply failed:', error)
      // Fallback on error
      setAiReview({
        originalText: currentContent,
        suggestedText: currentContent,
        improvements: []
      })
    } finally {
      setIsLoadingAI(false)
    }
  }

  // Regenerate the smart reply with new tone/language
  const handleRegenerateSmartReply = async () => {
    if (!aiReview) return

    setIsRegenerating(true)
    try {
      const response = await aiService.smartReply({
        agent_message: aiReview.originalText,
        user_last_message: userLastMessage || '',
        tone: smartReplyTone || undefined,
        target_language: smartReplyLanguage || undefined
      })

      if (response.success && response.data) {
        const review: AIReview = {
          originalText: response.data.original_text,
          suggestedText: response.data.improved_text,
          detectedUserLanguage: response.data.detected_user_language,
          detectedAgentLanguage: response.data.detected_agent_language,
          wasTranslated: response.data.was_translated,
          improvements: response.data.improvements
        }
        setAiReview(review)
        setSelectedVersion('improved')
      }
    } catch (error) {
      console.error('Smart reply regeneration failed:', error)
    } finally {
      setIsRegenerating(false)
    }
  }

  const sendSelectedVersion = () => {
    if (aiReview) {
      const textToSend = selectedVersion === 'improved' ? aiReview.suggestedText : aiReview.originalText
      lastEmittedValueRef.current = textToSend

      // Also update the editor content directly so it's in sync
      if (editorRef.current) {
        editorRef.current.innerHTML = textToSend
      }

      onChange(textToSend)
      setShowPreview(false)
      setAiReview(null)
      setSmartReplyTone('')
      setSmartReplyLanguage('')

      // Pass the message directly to onSend to bypass stale state issues
      onSend?.(textToSend)
    }
  }

  const cancelPreview = () => {
    setShowPreview(false)
    setAiReview(null)
    setSmartReplyTone('')
    setSmartReplyLanguage('')
  }

  const handleFastReply = () => {
    // Flush any pending content to parent before sending
    if (onChangeTimerRef.current) {
      clearTimeout(onChangeTimerRef.current)
    }
    const currentContent = editorRef.current?.innerHTML || pendingContentRef.current || value
    if (!disabled && currentContent.trim()) {
      // Sync content immediately before sending
      if (currentContent !== value) {
        onChange(currentContent)
      }
      // Small delay to ensure state is synced
      setTimeout(() => onFastReply?.(), 0)
    }
  }

  // Insert canned message from slash command
  const insertCannedMessage = useCallback((message: CannedMessage) => {
    if (!editorRef.current) return

    // Get current content as text
    const currentHtml = editorRef.current.innerHTML
    const textContent = editorRef.current.innerText || ''

    // Find the slash command pattern in the text
    const slashPattern = new RegExp(`/${slashQuery}$`, 'i')
    const slashPatternWithSpace = new RegExp(`\\s/${slashQuery}$`, 'i')

    let newContent: string

    // Check if it's at the start or after a space/newline
    if (textContent.match(/^\/\w*$/)) {
      // Slash command is the only content
      newContent = message.message
    } else if (textContent.match(slashPatternWithSpace)) {
      // Slash command is preceded by whitespace
      newContent = textContent.replace(slashPatternWithSpace, ' ' + message.message)
    } else if (textContent.match(slashPattern)) {
      newContent = textContent.replace(slashPattern, message.message)
    } else {
      // Fallback: just append the message
      newContent = textContent + message.message
    }

    // Update the editor content
    editorRef.current.innerHTML = newContent
    lastEmittedValueRef.current = newContent
    onChange(newContent)

    // Close slash menu
    setShowSlashMenu(false)
    setSlashQuery('')
    slashStartPositionRef.current = null

    // Focus editor and move cursor to end
    editorRef.current.focus()
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(editorRef.current)
    range.collapse(false)
    selection?.removeAllRanges()
    selection?.addRange(range)
  }, [slashQuery, onChange])

  // Get caret position for positioning slash menu (absolute screen coordinates for portal)
  const getCaretPosition = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    // Return absolute screen coordinates for portal positioning
    return {
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX
    }
  }

  // Check for slash command in editor input - optimized to minimize state updates
  const checkForSlashCommand = useCallback(() => {
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      if (showSlashMenu) {
        setShowSlashMenu(false)
        setSlashQuery('')
      }
      return
    }

    const range = selection.getRangeAt(0)
    const textNode = range.startContainer

    // Quick check: only process text nodes for performance
    if (textNode.nodeType !== Node.TEXT_NODE) {
      if (showSlashMenu) {
        setShowSlashMenu(false)
        setSlashQuery('')
      }
      return
    }

    // Get text before cursor from current text node only (faster than full DOM traversal)
    const textBeforeCursor = textNode.textContent?.substring(0, range.startOffset) || ''

    // Quick check: if no slash in recent text, skip regex
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/')
    if (lastSlashIndex === -1) {
      if (showSlashMenu) {
        setShowSlashMenu(false)
        setSlashQuery('')
      }
      return
    }

    // Check if there's a slash command pattern (/ followed by word characters at end)
    const slashMatch = textBeforeCursor.match(/(?:^|\s)\/(\w*)$/)

    if (slashMatch) {
      const query = slashMatch[1] || ''
      setSlashQuery(query)

      // Position the menu
      const pos = getCaretPosition()
      if (pos) {
        setSlashMenuPosition(pos)
      }

      if (!showSlashMenu) {
        setShowSlashMenu(true)
      }
    } else if (showSlashMenu) {
      setShowSlashMenu(false)
      setSlashQuery('')
    }
  }, [showSlashMenu])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle slash menu navigation
    if (showSlashMenu && filteredCannedMessages.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedSlashIndex(prev =>
            prev < filteredCannedMessages.length - 1 ? prev + 1 : 0
          )
          return
        case 'ArrowUp':
          e.preventDefault()
          setSelectedSlashIndex(prev =>
            prev > 0 ? prev - 1 : filteredCannedMessages.length - 1
          )
          return
        case 'Enter':
        case 'Tab':
          e.preventDefault()
          insertCannedMessage(filteredCannedMessages[selectedSlashIndex])
          return
        case 'Escape':
          e.preventDefault()
          setShowSlashMenu(false)
          setSlashQuery('')
          return
      }
    }

    // Ctrl+Enter or Cmd+Enter to fast reply
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleFastReply()
    }

    // Handle keyboard shortcuts for formatting
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault()
          handleBold()
          break
        case 'i':
          e.preventDefault()
          handleItalic()
          break
        case 'u':
          e.preventDefault()
          handleUnderline()
          break
      }
    }
  }

  // Debounce timer refs
  const slashCheckTimerRef = useRef<NodeJS.Timeout | null>(null)
  const onChangeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingContentRef = useRef<string>('')

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    isUserTypingRef.current = true
    const content = e.currentTarget.innerHTML
    const textContent = e.currentTarget.innerText?.trim() || ''
    lastEmittedValueRef.current = content
    pendingContentRef.current = content

    // Update hasContent immediately for responsive button states
    const contentExists = textContent.length > 0
    if (contentExists !== hasContent) {
      setHasContent(contentExists)
    }

    // Debounce onChange to parent - only notify after 150ms of no typing
    // This prevents parent re-renders on every keystroke
    if (onChangeTimerRef.current) {
      clearTimeout(onChangeTimerRef.current)
    }
    onChangeTimerRef.current = setTimeout(() => {
      onChange(pendingContentRef.current)
    }, 150)

    // Debounce slash command check - only check after 50ms of no typing
    if (slashCheckTimerRef.current) {
      clearTimeout(slashCheckTimerRef.current)
    }
    slashCheckTimerRef.current = setTimeout(() => {
      checkForSlashCommand()
      isUserTypingRef.current = false
    }, 50)
  }

  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0)
    }
  }

  const restoreSelection = () => {
    if (savedSelectionRef.current && editorRef.current) {
      editorRef.current.focus()
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedSelectionRef.current)
      }
    }
  }

  const executeCommand = (command: string, value: string | boolean = false) => {
    if (!editorRef.current) return

    // Mark as user action to prevent React from overwriting
    isUserTypingRef.current = true

    // Focus editor first
    editorRef.current.focus()

    // Restore selection or create one if none exists
    const selection = window.getSelection()
    if (savedSelectionRef.current && selection) {
      try {
        selection.removeAllRanges()
        selection.addRange(savedSelectionRef.current.cloneRange())
      } catch {
        // Selection restore failed, continue anyway
      }
    } else if (selection && editorRef.current) {
      // No saved selection, create one at the end of content
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    // Execute command
    try {
      document.execCommand(command, false, value as string)
    } catch {
      // execCommand failed, ignore
    }

    // Small delay to let DOM update
    setTimeout(() => {
      saveSelection()
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML
        lastEmittedValueRef.current = newContent
        onChange(newContent)
      }
      // Reset flag after a bit longer to ensure state has updated
      setTimeout(() => {
        isUserTypingRef.current = false
      }, 100)
    }, 10)
  }

  // Text formatting functions for WYSIWYG
  const handleBold = () => {
    executeCommand('bold')
  }

  const handleItalic = () => {
    executeCommand('italic')
  }

  const handleUnderline = () => {
    executeCommand('underline')
  }

  const handleList = () => {
    executeCommand('insertUnorderedList')
  }

  const handleOrderedList = () => {
    executeCommand('insertOrderedList')
  }

  const insertText = (text: string) => {
    if (!editorRef.current) return

    // Mark as user action to prevent React from overwriting
    isUserTypingRef.current = true

    // Focus editor
    editorRef.current.focus()

    // Try to restore saved selection first
    let selection = window.getSelection()
    if (savedSelectionRef.current && selection) {
      try {
        selection.removeAllRanges()
        selection.addRange(savedSelectionRef.current.cloneRange())
      } catch {
        // Selection restore failed, continue anyway
      }
    }

    // Get current selection
    selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()

      // Create and insert HTML content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = text
      const fragment = document.createDocumentFragment()

      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild)
      }

      range.insertNode(fragment)

      // Move cursor after inserted content
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)

      // Save new selection
      saveSelection()
    } else {
      // Fallback: append to end
      editorRef.current.innerHTML += text
    }

    // Trigger onChange with updated content
    setTimeout(() => {
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML
        lastEmittedValueRef.current = newContent
        onChange(newContent)
      }
      // Reset flag
      setTimeout(() => {
        isUserTypingRef.current = false
      }, 100)
    }, 10)
  }

  const handleInsertLink = () => {
    // Save current selection
    saveSelection()
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString()
      if (selectedText) {
        setLinkText(selectedText)
      }
    }
    setShowLinkDialog(true)
  }

  const insertLink = () => {
    if (!linkUrl) return

    const text = linkText || linkUrl
    const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`
    insertText(link)

    setShowLinkDialog(false)
    setLinkUrl('')
    setLinkText('')
  }

  const handleReviseResponse = async (format: string) => {
    // Get the current text from editor
    const textContent = editorRef.current?.innerText?.trim() || value.replace(/<[^>]*>/g, '').trim()
    if (!textContent) return

    setIsRevising(true)
    try {
      const response = await aiService.revise({
        text: textContent,
        format: format,
      })

      if (response.success && response.data) {
        // Update the editor with revised text (undo-friendly)
        replaceEditorContent(response.data.revised_text)
      }
    } catch (error) {
      console.error('Revision failed:', error)
    } finally {
      setIsRevising(false)
    }
  }

  // Filter canned messages for template modal search (memoized)
  const filteredTemplateMessages = useMemo(() => {
    return cannedMessages.filter(msg => {
      if (!templateSearch) return true
      const query = templateSearch.toLowerCase()
      return (
        msg.title.toLowerCase().includes(query) ||
        (msg.shortcut && msg.shortcut.toLowerCase().includes(query)) ||
        msg.message.toLowerCase().includes(query)
      )
    })
  }, [cannedMessages, templateSearch])

  const insertTemplateMessage = (message: CannedMessage) => {
    // Update the editor content directly
    if (editorRef.current) {
      editorRef.current.innerHTML = message.message
    }
    lastEmittedValueRef.current = message.message
    onChange(message.message)
    setShowTemplateModal(false)
    setTemplateSearch('')

    // Focus editor after inserting
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus()
        // Move cursor to end
        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }, 0)
  }

  // Editor configuration - simplified for compatibility

  return (
    <>
      <div className={cn(className)}>
        {/* Editor Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-t-lg border-x border-t border-border flex-wrap">
          {/* Text Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              handleBold()
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
              handleItalic()
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
              handleUnderline()
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
              handleList()
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
              handleOrderedList()
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
              handleInsertLink()
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
            onClick={toggleSpeechToText}
            className={cn("h-8 px-2", isRecording && "bg-red-100 text-red-700")}
            disabled={!recognitionRef.current}
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
                  onClick={() => handleAITranslate(lang.name)}
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
            onClick={handleAIGenerate}
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
                  onClick={() => handleReviseResponse(format.id)}
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
            onClick={() => setShowKnowledgeBase(true)}
            className="h-8 px-2"
            title="Knowledge Base"
          >
            <BookOpen className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplateModal(true)}
            className="h-8 px-2"
            title="Templates"
          >
            <FileText className="h-4 w-4" />
          </Button>

          <div className="ml-auto text-xs text-muted-foreground">
            {value?.replace(/<[^>]*>/g, '').length || 0} characters
          </div>
        </div>

        {/* WYSIWYG Editor */}
        <div className="rounded-b-lg overflow-hidden relative">
          <div
            ref={editorRef}
            contentEditable={!disabled}
            onInput={handleEditorInput}
            onKeyDown={handleKeyDown}
            onMouseUp={saveSelection}
            onKeyUp={saveSelection}
            className="min-h-[150px] p-3 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-b-lg bg-background overflow-auto"
            style={{
              minHeight: minHeight,
            }}
            data-placeholder={placeholder}
            suppressContentEditableWarning
          />

          {/* Slash Command Menu - Rendered via Portal to escape overflow:hidden */}
          {showSlashMenu && typeof document !== 'undefined' && createPortal(
            <div
              ref={slashMenuRef}
              className="fixed z-[9999] bg-popover border border-border rounded-lg shadow-lg max-h-[300px] overflow-y-auto w-[320px]"
              style={{
                top: slashMenuPosition.top,
                left: slashMenuPosition.left,
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

              {isLoadingCannedMessages ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  <span className="text-xs">Loading...</span>
                </div>
              ) : filteredCannedMessages.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-xs">
                  No matching canned messages found
                </div>
              ) : (
                <div className="py-1">
                  {filteredCannedMessages.slice(0, 10).map((msg, index) => (
                    <div
                      key={msg.id}
                      onClick={() => insertCannedMessage(msg)}
                      className={cn(
                        "px-3 py-2 cursor-pointer transition-colors",
                        index === selectedSlashIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm truncate">{msg.title}</span>
                        {msg.shortcut && (
                          <Badge
                            variant={index === selectedSlashIndex ? "secondary" : "outline"}
                            className="text-xs shrink-0"
                          >
                            /{msg.shortcut}
                          </Badge>
                        )}
                      </div>
                      <p className={cn(
                        "text-xs mt-1 line-clamp-2",
                        index === selectedSlashIndex
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
          )}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: hsl(var(--muted-foreground));
            pointer-events: none;
            position: absolute;
          }
          [contenteditable] ul {
            list-style-type: disc !important;
            margin-left: 20px !important;
            padding-left: 20px !important;
            display: block !important;
          }
          [contenteditable] ol {
            list-style-type: decimal !important;
            margin-left: 20px !important;
            padding-left: 20px !important;
            display: block !important;
          }
          [contenteditable] li {
            display: list-item !important;
            margin-left: 0 !important;
          }
          [contenteditable] strong {
            font-weight: bold !important;
          }
          [contenteditable] em {
            font-style: italic !important;
          }
          [contenteditable] u {
            text-decoration: underline !important;
          }
          [contenteditable] a {
            color: #0066cc !important;
            text-decoration: underline !important;
          }
        `}} />

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Volume2 className="h-3 w-3 mr-1" />
                Recording...
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFastReply}
              disabled={(!hasContent && !value.trim()) || disabled}
              title="Ctrl+Enter"
            >
              {disabled ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Fast Reply
            </Button>

            <Button
              onClick={handlePreviewAndReview}
              disabled={(!hasContent && !value.trim()) || disabled}
            >
              {disabled ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Reply className="h-4 w-4 mr-2" />
              )}
              Send Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Preview and AI Review Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Smart Reply - Choose Your Message
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {isLoadingAI || isRegenerating ? (
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
                    <Select value={smartReplyTone || "auto"} onValueChange={(v) => setSmartReplyTone(v === "auto" ? "" : v)}>
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
                    <Select value={smartReplyLanguage || "auto"} onValueChange={(v) => setSmartReplyLanguage(v === "auto" ? "" : v)}>
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
                    onClick={handleRegenerateSmartReply}
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
                    onClick={() => setSelectedVersion('original')}
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
                    onClick={() => setSelectedVersion('improved')}
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
          {aiReview && !isLoadingAI && !isRegenerating && (
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button variant="outline" onClick={cancelPreview}>
                Cancel
              </Button>
              <Button onClick={sendSelectedVersion}>
                <Send className="h-4 w-4 mr-2" />
                Send {selectedVersion === 'improved' ? 'Improved' : 'Original'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Knowledge Base Modal */}
      <Dialog open={showKnowledgeBase} onOpenChange={setShowKnowledgeBase}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Knowledge Base
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={knowledgeBaseSearch}
                onChange={(e) => setKnowledgeBaseSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Articles List */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No articles found</p>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => insertKnowledgeBaseArticle(article)}
                    className="p-3 border border-border rounded-md hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <div className="flex gap-1">
                            {article.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {article.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{article.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">URL</label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Link Text (optional)</label>
              <Input
                type="text"
                placeholder="Click here"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
              <Button onClick={insertLink} disabled={!linkUrl}>
                Insert Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Modal */}
      <Dialog open={showTemplateModal} onOpenChange={(open) => {
        setShowTemplateModal(open)
        if (!open) setTemplateSearch('')
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
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>

            {/* Canned Messages List */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {isLoadingCannedMessages ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">Loading canned messages...</span>
                </div>
              ) : filteredTemplateMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{templateSearch ? 'No matching canned messages found' : 'No canned messages available'}</p>
                  <p className="text-xs mt-1">You can create canned messages in Settings</p>
                </div>
              ) : (
                filteredTemplateMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => insertTemplateMessage(message)}
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
    </>
  )
}
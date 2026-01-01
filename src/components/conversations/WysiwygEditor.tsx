"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Reply, Send, Volume2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { cannedMessagesService, CannedMessage } from "@/services/canned-messages.service"
import { aiService, type RevisionFormat } from "@/services/ai.service"
import {
  EditorToolbar,
  SmartReplyModal,
  KnowledgeBaseModal,
  TemplateModal,
  LinkDialog,
  SlashCommandMenu,
  AIReview,
  KnowledgeBaseArticle,
} from "./wysiwyg"

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSend?: (message?: string) => void
  onFastReply?: () => void
  className?: string
  minHeight?: string
  disabled?: boolean
  userLastMessage?: string
}

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
  // Recording and AI states
  const [isRecording, setIsRecording] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRevising, setIsRevising] = useState(false)
  const [revisionFormats, setRevisionFormats] = useState<RevisionFormat[]>([])

  // Smart Reply Modal states
  const [showPreview, setShowPreview] = useState(false)
  const [aiReview, setAiReview] = useState<AIReview | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<'original' | 'improved'>('improved')
  const [smartReplyTone, setSmartReplyTone] = useState<string>('')
  const [smartReplyLanguage, setSmartReplyLanguage] = useState<string>('')
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Modal states
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  // Slash command states
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashQuery, setSlashQuery] = useState('')
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 })
  const [cannedMessages, setCannedMessages] = useState<CannedMessage[]>([])
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0)
  const [isLoadingCannedMessages, setIsLoadingCannedMessages] = useState(false)

  // Content tracking
  const [hasContent, setHasContent] = useState(() => value.trim().length > 0)

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const slashMenuRef = useRef<HTMLDivElement>(null)
  const isUserTypingRef = useRef(false)
  const savedSelectionRef = useRef<Range | null>(null)
  const lastEmittedValueRef = useRef<string>('')
  const valueRef = useRef(value)
  const onChangeRef = useRef(onChange)
  const slashCheckTimerRef = useRef<NodeJS.Timeout | null>(null)
  const onChangeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingContentRef = useRef<string>('')

  // Keep refs updated
  useEffect(() => {
    valueRef.current = value
    onChangeRef.current = onChange
  }, [value, onChange])

  // Sync external value changes to contentEditable
  useEffect(() => {
    if (editorRef.current && !isUserTypingRef.current) {
      if (editorRef.current.innerHTML !== value && lastEmittedValueRef.current !== value) {
        editorRef.current.innerHTML = value
        lastEmittedValueRef.current = value
      }
    }
  }, [value])

  // Initialize speech recognition
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

      recognitionRef.current.onerror = () => setIsRecording(false)
      recognitionRef.current.onend = () => setIsRecording(false)
    }
  }, [])

  // Load canned messages
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

  // Load revision formats
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

  // Filter canned messages
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
      }
    }

    if (showSlashMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSlashMenu])

  // Helper functions
  const replaceEditorContent = (newContent: string) => {
    if (!editorRef.current) return
    editorRef.current.focus()
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(editorRef.current)
    selection?.removeAllRanges()
    selection?.addRange(range)
    document.execCommand('insertText', false, newContent)
    lastEmittedValueRef.current = newContent
    onChange(newContent)
  }

  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0)
    }
  }

  const executeCommand = (command: string, commandValue: string | boolean = false) => {
    if (!editorRef.current) return
    isUserTypingRef.current = true
    editorRef.current.focus()

    const selection = window.getSelection()
    if (savedSelectionRef.current && selection) {
      try {
        selection.removeAllRanges()
        selection.addRange(savedSelectionRef.current.cloneRange())
      } catch { /* ignore */ }
    } else if (selection && editorRef.current) {
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    try {
      document.execCommand(command, false, commandValue as string)
    } catch { /* ignore */ }

    setTimeout(() => {
      saveSelection()
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML
        lastEmittedValueRef.current = newContent
        onChange(newContent)
      }
      setTimeout(() => { isUserTypingRef.current = false }, 100)
    }, 10)
  }

  const insertText = (text: string) => {
    if (!editorRef.current) return
    isUserTypingRef.current = true
    editorRef.current.focus()

    let selection = window.getSelection()
    if (savedSelectionRef.current && selection) {
      try {
        selection.removeAllRanges()
        selection.addRange(savedSelectionRef.current.cloneRange())
      } catch { /* ignore */ }
    }

    selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = text
      const fragment = document.createDocumentFragment()
      while (tempDiv.firstChild) fragment.appendChild(tempDiv.firstChild)
      range.insertNode(fragment)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      saveSelection()
    } else {
      editorRef.current.innerHTML += text
    }

    setTimeout(() => {
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML
        lastEmittedValueRef.current = newContent
        onChange(newContent)
      }
      setTimeout(() => { isUserTypingRef.current = false }, 100)
    }, 10)
  }

  // Toolbar handlers
  const handleBold = () => executeCommand('bold')
  const handleItalic = () => executeCommand('italic')
  const handleUnderline = () => executeCommand('underline')
  const handleList = () => executeCommand('insertUnorderedList')
  const handleOrderedList = () => executeCommand('insertOrderedList')

  const handleInsertLink = () => {
    saveSelection()
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString()
      if (selectedText) setLinkText(selectedText)
    }
    setShowLinkDialog(true)
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

  const handleAITranslate = async (targetLanguage: string) => {
    const textContent = editorRef.current?.innerText?.trim() || value.replace(/<[^>]*>/g, '').trim()
    if (!textContent) return
    setIsTranslating(true)
    try {
      const response = await aiService.translate({ text: textContent, language: targetLanguage })
      if (response.success && response.data) {
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
    await new Promise(resolve => setTimeout(resolve, 2000))
    const aiResponse = "Thank you for reaching out. I understand your concern and I'm here to help you resolve this issue."
    lastEmittedValueRef.current = aiResponse
    onChange(aiResponse)
    setIsGenerating(false)
  }

  const handleReviseResponse = async (format: string) => {
    const textContent = editorRef.current?.innerText?.trim() || value.replace(/<[^>]*>/g, '').trim()
    if (!textContent) return
    setIsRevising(true)
    try {
      const response = await aiService.revise({ text: textContent, format })
      if (response.success && response.data) {
        replaceEditorContent(response.data.revised_text)
      }
    } catch (error) {
      console.error('Revision failed:', error)
    } finally {
      setIsRevising(false)
    }
  }

  // Smart Reply handlers
  const handlePreviewAndReview = async () => {
    if (onChangeTimerRef.current) clearTimeout(onChangeTimerRef.current)
    const currentContent = editorRef.current?.innerText?.trim() || value.replace(/<[^>]*>/g, '').trim()
    if (!currentContent) return

    const htmlContent = editorRef.current?.innerHTML || pendingContentRef.current || value
    if (htmlContent !== value) onChange(htmlContent)

    setSmartReplyTone('')
    setSmartReplyLanguage('')
    setIsLoadingAI(true)
    setShowPreview(true)
    setSelectedVersion('improved')

    try {
      const response = await aiService.smartReply({
        agent_message: currentContent,
        user_last_message: userLastMessage || ''
      })

      if (response.success && response.data) {
        setAiReview({
          originalText: response.data.original_text,
          suggestedText: response.data.improved_text,
          detectedUserLanguage: response.data.detected_user_language,
          detectedAgentLanguage: response.data.detected_agent_language,
          wasTranslated: response.data.was_translated,
          improvements: response.data.improvements
        })
        if (response.data.detected_user_language) {
          setSmartReplyLanguage(response.data.detected_user_language)
        }
      } else {
        setAiReview({ originalText: currentContent, suggestedText: currentContent, improvements: [] })
      }
    } catch (error) {
      console.error('Smart reply failed:', error)
      setAiReview({ originalText: currentContent, suggestedText: currentContent, improvements: [] })
    } finally {
      setIsLoadingAI(false)
    }
  }

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
        setAiReview({
          originalText: response.data.original_text,
          suggestedText: response.data.improved_text,
          detectedUserLanguage: response.data.detected_user_language,
          detectedAgentLanguage: response.data.detected_agent_language,
          wasTranslated: response.data.was_translated,
          improvements: response.data.improvements
        })
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
      if (editorRef.current) editorRef.current.innerHTML = textToSend
      onChange(textToSend)
      setShowPreview(false)
      setAiReview(null)
      setSmartReplyTone('')
      setSmartReplyLanguage('')
      onSend?.(textToSend)
    }
  }

  const cancelPreview = () => {
    setShowPreview(false)
    setAiReview(null)
    setSmartReplyTone('')
    setSmartReplyLanguage('')
  }

  // Fast Reply handler
  const handleFastReply = () => {
    if (onChangeTimerRef.current) clearTimeout(onChangeTimerRef.current)
    const currentContent = editorRef.current?.innerHTML || pendingContentRef.current || value
    if (!disabled && currentContent.trim()) {
      if (currentContent !== value) onChange(currentContent)
      setTimeout(() => onFastReply?.(), 0)
    }
  }

  // Knowledge Base handler
  const insertKnowledgeBaseArticle = (article: KnowledgeBaseArticle) => {
    const linkText = `<a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>`
    const currentValue = value || ''
    const newContent = currentValue + ' ' + linkText
    lastEmittedValueRef.current = newContent
    onChange(newContent)
    setShowKnowledgeBase(false)
  }

  // Template handler
  const insertTemplateMessage = (message: CannedMessage) => {
    if (editorRef.current) editorRef.current.innerHTML = message.message
    lastEmittedValueRef.current = message.message
    onChange(message.message)
    setShowTemplateModal(false)
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus()
        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }, 0)
  }

  // Link handler
  const insertLink = () => {
    if (!linkUrl) return
    const text = linkText || linkUrl
    const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`
    insertText(link)
    setShowLinkDialog(false)
    setLinkUrl('')
    setLinkText('')
  }

  // Slash command handlers
  const insertCannedMessage = useCallback((message: CannedMessage) => {
    if (!editorRef.current) return
    const textContent = editorRef.current.innerText || ''
    const slashPattern = new RegExp(`/${slashQuery}$`, 'i')
    const slashPatternWithSpace = new RegExp(`\\s/${slashQuery}$`, 'i')
    let newContent: string

    if (textContent.match(/^\/\w*$/)) {
      newContent = message.message
    } else if (textContent.match(slashPatternWithSpace)) {
      newContent = textContent.replace(slashPatternWithSpace, ' ' + message.message)
    } else if (textContent.match(slashPattern)) {
      newContent = textContent.replace(slashPattern, message.message)
    } else {
      newContent = textContent + message.message
    }

    editorRef.current.innerHTML = newContent
    lastEmittedValueRef.current = newContent
    onChange(newContent)
    setShowSlashMenu(false)
    setSlashQuery('')

    editorRef.current.focus()
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(editorRef.current)
    range.collapse(false)
    selection?.removeAllRanges()
    selection?.addRange(range)
  }, [slashQuery, onChange])

  const getCaretPosition = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    return { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX }
  }

  const checkForSlashCommand = useCallback(() => {
    if (!editorRef.current) return
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      if (showSlashMenu) { setShowSlashMenu(false); setSlashQuery('') }
      return
    }

    const range = selection.getRangeAt(0)
    const textNode = range.startContainer
    if (textNode.nodeType !== Node.TEXT_NODE) {
      if (showSlashMenu) { setShowSlashMenu(false); setSlashQuery('') }
      return
    }

    const textBeforeCursor = textNode.textContent?.substring(0, range.startOffset) || ''
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/')
    if (lastSlashIndex === -1) {
      if (showSlashMenu) { setShowSlashMenu(false); setSlashQuery('') }
      return
    }

    const slashMatch = textBeforeCursor.match(/(?:^|\s)\/(\w*)$/)
    if (slashMatch) {
      setSlashQuery(slashMatch[1] || '')
      const pos = getCaretPosition()
      if (pos) setSlashMenuPosition(pos)
      if (!showSlashMenu) setShowSlashMenu(true)
    } else if (showSlashMenu) {
      setShowSlashMenu(false)
      setSlashQuery('')
    }
  }, [showSlashMenu])

  // Editor event handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (showSlashMenu && filteredCannedMessages.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedSlashIndex(prev => prev < filteredCannedMessages.length - 1 ? prev + 1 : 0)
          return
        case 'ArrowUp':
          e.preventDefault()
          setSelectedSlashIndex(prev => prev > 0 ? prev - 1 : filteredCannedMessages.length - 1)
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

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleFastReply()
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); handleBold(); break
        case 'i': e.preventDefault(); handleItalic(); break
        case 'u': e.preventDefault(); handleUnderline(); break
      }
    }
  }

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    isUserTypingRef.current = true
    const content = e.currentTarget.innerHTML
    const textContent = e.currentTarget.innerText?.trim() || ''
    lastEmittedValueRef.current = content
    pendingContentRef.current = content

    const contentExists = textContent.length > 0
    if (contentExists !== hasContent) setHasContent(contentExists)

    if (onChangeTimerRef.current) clearTimeout(onChangeTimerRef.current)
    onChangeTimerRef.current = setTimeout(() => onChange(pendingContentRef.current), 150)

    if (slashCheckTimerRef.current) clearTimeout(slashCheckTimerRef.current)
    slashCheckTimerRef.current = setTimeout(() => {
      checkForSlashCommand()
      isUserTypingRef.current = false
    }, 50)
  }

  return (
    <>
      <div className={cn(className)}>
        {/* Editor Toolbar */}
        <EditorToolbar
          value={value}
          hasContent={hasContent}
          isRecording={isRecording}
          isTranslating={isTranslating}
          isGenerating={isGenerating}
          isRevising={isRevising}
          revisionFormats={revisionFormats}
          recognitionAvailable={!!recognitionRef.current}
          onBold={handleBold}
          onItalic={handleItalic}
          onUnderline={handleUnderline}
          onList={handleList}
          onOrderedList={handleOrderedList}
          onInsertLink={handleInsertLink}
          onToggleSpeechToText={toggleSpeechToText}
          onTranslate={handleAITranslate}
          onGenerate={handleAIGenerate}
          onRevise={handleReviseResponse}
          onOpenKnowledgeBase={() => setShowKnowledgeBase(true)}
          onOpenTemplates={() => setShowTemplateModal(true)}
        />

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
            style={{ minHeight }}
            data-placeholder={placeholder}
            suppressContentEditableWarning
          />

          {/* Slash Command Menu */}
          <SlashCommandMenu
            show={showSlashMenu}
            position={slashMenuPosition}
            slashQuery={slashQuery}
            cannedMessages={filteredCannedMessages}
            isLoading={isLoadingCannedMessages}
            selectedIndex={selectedSlashIndex}
            onSelect={insertCannedMessage}
            menuRef={slashMenuRef}
          />
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: hsl(var(--muted-foreground));
            pointer-events: none;
            position: absolute;
          }
          [contenteditable] ul { list-style-type: disc !important; margin-left: 20px !important; padding-left: 20px !important; display: block !important; }
          [contenteditable] ol { list-style-type: decimal !important; margin-left: 20px !important; padding-left: 20px !important; display: block !important; }
          [contenteditable] li { display: list-item !important; margin-left: 0 !important; }
          [contenteditable] strong { font-weight: bold !important; }
          [contenteditable] em { font-style: italic !important; }
          [contenteditable] u { text-decoration: underline !important; }
          [contenteditable] a { color: #0066cc !important; text-decoration: underline !important; }
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
              {disabled ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Fast Reply
            </Button>

            <Button
              onClick={handlePreviewAndReview}
              disabled={(!hasContent && !value.trim()) || disabled}
            >
              {disabled ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Reply className="h-4 w-4 mr-2" />}
              Send Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Smart Reply Modal */}
      <SmartReplyModal
        open={showPreview}
        onOpenChange={setShowPreview}
        aiReview={aiReview}
        isLoading={isLoadingAI}
        isRegenerating={isRegenerating}
        selectedVersion={selectedVersion}
        onSelectVersion={setSelectedVersion}
        smartReplyTone={smartReplyTone}
        onToneChange={setSmartReplyTone}
        smartReplyLanguage={smartReplyLanguage}
        onLanguageChange={setSmartReplyLanguage}
        onRegenerate={handleRegenerateSmartReply}
        onSend={sendSelectedVersion}
        onCancel={cancelPreview}
      />

      {/* Knowledge Base Modal */}
      <KnowledgeBaseModal
        open={showKnowledgeBase}
        onOpenChange={setShowKnowledgeBase}
        onInsertArticle={insertKnowledgeBaseArticle}
      />

      {/* Template Modal */}
      <TemplateModal
        open={showTemplateModal}
        onOpenChange={setShowTemplateModal}
        cannedMessages={cannedMessages}
        isLoading={isLoadingCannedMessages}
        onInsertTemplate={insertTemplateMessage}
      />

      {/* Link Dialog */}
      <LinkDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        linkUrl={linkUrl}
        linkText={linkText}
        onUrlChange={setLinkUrl}
        onTextChange={setLinkText}
        onInsert={insertLink}
      />
    </>
  )
}

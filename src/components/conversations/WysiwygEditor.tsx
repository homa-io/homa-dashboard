"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Mic, Languages, Sparkles, Reply, Send, Volume2, MicOff, CheckCircle, AlertCircle, Loader2, BookOpen, Search, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

// Editor implementation - using textarea for React 19 compatibility

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSend?: () => void
  onFastReply?: () => void
  className?: string
  minHeight?: string
}

interface AIReview {
  originalText: string
  suggestedText: string
  corrections: Array<{
    original: string
    corrected: string
    reason: string
  }>
}

interface KnowledgeBaseArticle {
  id: string
  title: string
  summary: string
  category: string
  tags: string[]
  url: string
}

export function WysiwygEditor({
  value,
  onChange,
  placeholder = "Type your message...",
  onSend,
  onFastReply,
  className,
  minHeight = "150px"
}: WysiwygEditorProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [aiReview, setAiReview] = useState<AIReview | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false)
  const [knowledgeBaseSearch, setKnowledgeBaseSearch] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Mock knowledge base articles
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
          const currentValue = value || ''
          onChange(currentValue + ' ' + finalTranscript)
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
  }, [value, onChange])

  // Filter articles based on search
  const filteredArticles = knowledgeBaseArticles.filter(article => 
    article.title.toLowerCase().includes(knowledgeBaseSearch.toLowerCase()) ||
    article.summary.toLowerCase().includes(knowledgeBaseSearch.toLowerCase()) ||
    article.category.toLowerCase().includes(knowledgeBaseSearch.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(knowledgeBaseSearch.toLowerCase()))
  )

  const insertKnowledgeBaseArticle = (article: KnowledgeBaseArticle) => {
    const linkText = `<a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>`
    const currentValue = value || ''
    onChange(currentValue + ' ' + linkText)
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

  const handleAITranslate = async () => {
    if (!value.trim()) return
    
    setIsTranslating(true)
    // Simulate AI translation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock translation - in reality, this would call an AI service
    const translatedText = value + " [AI Translated to English]"
    onChange(translatedText)
    setIsTranslating(false)
  }

  const handleAIGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI message generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock AI generated response
    const aiResponse = "Thank you for reaching out to us. I understand your concern and I'm here to help you resolve this issue. Based on the information provided, I can see that you're experiencing difficulties with your recent transaction. Let me look into this matter immediately and provide you with a solution. I'll ensure this gets resolved as quickly as possible."
    onChange(aiResponse)
    setIsGenerating(false)
  }

  const handlePreviewAndReview = async () => {
    if (!value.trim()) return
    
    setIsLoadingAI(true)
    setShowPreview(true)
    
    // Simulate AI review
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock AI review
    const mockReview: AIReview = {
      originalText: value,
      suggestedText: value.replace(/cant/g, "can't").replace(/wont/g, "won't").replace(/\s+/g, " ").trim(),
      corrections: [
        { original: "cant", corrected: "can't", reason: "Contraction correction" },
        { original: "Multiple spaces", corrected: "Single space", reason: "Formatting improvement" }
      ]
    }
    
    setAiReview(mockReview)
    setIsLoadingAI(false)
  }

  const acceptAIReview = () => {
    if (aiReview) {
      onChange(aiReview.suggestedText)
      setShowPreview(false)
      setAiReview(null)
      onSend?.()
    }
  }

  const rejectAIReview = () => {
    setShowPreview(false)
    setAiReview(null)
    onSend?.()
  }

  const handleFastReply = () => {
    onFastReply?.()
  }

  // Editor configuration - simplified for compatibility

  return (
    <>
      <div className={cn("space-y-3", className)}>
        {/* Editor Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-t-lg border-x border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSpeechToText}
            className={cn("h-8 px-2", isRecording && "bg-red-100 text-red-700")}
            disabled={!recognitionRef.current}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Separator orientation="vertical" className="h-4" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAITranslate}
            className="h-8 px-2"
            disabled={isTranslating || !value.trim()}
          >
            {isTranslating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Languages className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAIGenerate}
            className="h-8 px-2"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKnowledgeBase(true)}
            className="h-8 px-2"
            title="Knowledge Base"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          
          <div className="ml-auto text-xs text-muted-foreground">
            {value?.replace(/<[^>]*>/g, '').length || 0} characters
          </div>
        </div>

        {/* Text Editor */}
        <div className="border border-border rounded-b-lg">
          <Textarea
            value={value.replace(/<[^>]*>/g, '')} // Strip HTML tags for now
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[150px] resize-none border-0 focus-visible:ring-0 rounded-b-lg"
            style={{
              minHeight: minHeight,
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2">
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
              disabled={!value.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Fast Reply
            </Button>
            
            <Button
              onClick={handlePreviewAndReview}
              disabled={!value.trim()}
            >
              <Reply className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Preview and AI Review Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Review Message Before Sending</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {isLoadingAI ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>AI is reviewing your message...</span>
              </div>
            ) : aiReview ? (
              <>
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Improved Message:
                  </h4>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm">
                    <div dangerouslySetInnerHTML={{ __html: aiReview.suggestedText }} />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={rejectAIReview}>
                    Send Original
                  </Button>
                  <Button onClick={acceptAIReview}>
                    Accept & Send
                  </Button>
                </div>
              </>
            ) : null}
          </div>
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
    </>
  )
}
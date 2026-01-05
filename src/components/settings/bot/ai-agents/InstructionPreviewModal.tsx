"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Check, FileText, Loader2, AlertCircle } from "lucide-react"
import { aiAgentService } from "@/services/ai-agent.service"
import ReactMarkdown from "react-markdown"

interface InstructionPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentId: number
}

export function InstructionPreviewModal({
  open,
  onOpenChange,
  agentId,
}: InstructionPreviewModalProps) {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")
  const [tokenCount, setTokenCount] = useState(0)
  const [isCustomTemplate, setIsCustomTemplate] = useState(false)

  useEffect(() => {
    if (open && agentId > 0) {
      fetchTemplate()
    }
  }, [open, agentId])

  const fetchTemplate = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await aiAgentService.getTemplate(agentId)
      setGeneratedPrompt(response.template)
      setTokenCount(response.token_count)
      setIsCustomTemplate(response.is_custom || false)
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to load template")
      console.error("Error loading template:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const charCount = generatedPrompt.length
  const lineCount = generatedPrompt.split("\n").length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <DialogTitle>System Prompt Preview</DialogTitle>
            </div>
            {!loading && !error && (
              <div className="flex items-center gap-2 mr-8">
                {isCustomTemplate && (
                  <Badge variant="secondary" className="text-xs">
                    Custom Template
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  ~{tokenCount.toLocaleString()} tokens
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {charCount.toLocaleString()} chars
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {lineCount} lines
                </Badge>
              </div>
            )}
          </div>
          <DialogDescription>
            This is the system prompt that will be sent to the AI model. It combines your agent configuration, tools, and instructions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 mt-4">
          <ScrollArea className="h-[60vh] rounded-md border bg-muted/30">
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-40 gap-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <p className="text-destructive">{error}</p>
                  <Button variant="outline" size="sm" onClick={fetchTemplate}>
                    Retry
                  </Button>
                </div>
              ) : generatedPrompt ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      // Custom styling for code blocks
                      code: ({ node, className, children, ...props }) => {
                        const isInline = !className
                        if (isInline) {
                          return (
                            <code
                              className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-mono"
                              {...props}
                            >
                              {children}
                            </code>
                          )
                        }
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                      // Style headings
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold mt-6 mb-3 text-primary border-b pb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-medium mt-4 mb-2">{children}</h3>
                      ),
                      // Style lists
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 ml-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 ml-2">{children}</ol>
                      ),
                      // Style blockquotes
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-yellow-500 bg-yellow-500/10 pl-4 py-2 my-2 italic">
                          {children}
                        </blockquote>
                      ),
                      // Style horizontal rules
                      hr: () => <hr className="my-4 border-border" />,
                      // Style strong/bold
                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">{children}</strong>
                      ),
                    }}
                  >
                    {generatedPrompt}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  No template generated
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            This prompt will be used as the system message for the AI agent.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopy} disabled={loading || !generatedPrompt}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

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
import { Copy, Check, FileText, Loader2 } from "lucide-react"
import { generateAgentPrompt, estimateTokenCount, type TemplateContext } from "@/lib/ai-agent-template"
import type { AIAgent, AIAgentTone } from "@/types/ai-agent.types"
import type { AIAgentTool } from "@/types/ai-agent-tool.types"
import ReactMarkdown from "react-markdown"

interface InstructionPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  agent: {
    name: string
    bot?: { id: string; name: string; display_name: string } | null
    handover_enabled: boolean
    handover_user_id: string | null
    multi_language: boolean
    internet_access: boolean
    tone: AIAgentTone
    use_knowledge_base: boolean
    unit_conversion: boolean
    instructions: string
    greeting_message: string
    max_response_length: number
    context_window: number
    blocked_topics: string
    max_tool_calls: number
    collect_user_info: boolean
    collect_user_info_fields: string
    humor_level: number
    use_emojis: boolean
    formality_level: number
    priority_detection: boolean
    auto_tagging: boolean
  }
  tools: AIAgentTool[]
}

export function InstructionPreviewModal({
  open,
  onOpenChange,
  projectName,
  agent,
  tools,
}: InstructionPreviewModalProps) {
  const [copied, setCopied] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("")

  useEffect(() => {
    if (open) {
      // Build the context for template generation
      const context: TemplateContext = {
        projectName: projectName || "Your Project",
        agent: {
          id: 0,
          name: agent.name,
          bot_id: agent.bot?.id || "",
          bot: agent.bot || undefined,
          handover_enabled: agent.handover_enabled,
          handover_user_id: agent.handover_user_id,
          multi_language: agent.multi_language,
          internet_access: agent.internet_access,
          tone: agent.tone,
          use_knowledge_base: agent.use_knowledge_base,
          unit_conversion: agent.unit_conversion,
          instructions: agent.instructions,
          greeting_message: agent.greeting_message,
          max_response_length: agent.max_response_length,
          context_window: agent.context_window,
          blocked_topics: agent.blocked_topics,
          max_tool_calls: agent.max_tool_calls,
          collect_user_info: agent.collect_user_info,
          collect_user_info_fields: agent.collect_user_info_fields,
          humor_level: agent.humor_level,
          use_emojis: agent.use_emojis,
          formality_level: agent.formality_level,
          priority_detection: agent.priority_detection,
          auto_tagging: agent.auto_tagging,
          status: "active",
          created_at: "",
          updated_at: "",
        },
        tools: tools,
        knowledgeBaseItems: [], // Could be populated from a separate API call
      }

      const prompt = generateAgentPrompt(context)
      setGeneratedPrompt(prompt)
    }
  }, [open, projectName, agent, tools])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const tokenCount = estimateTokenCount(generatedPrompt)
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
            <div className="flex items-center gap-2 mr-8">
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
          </div>
          <DialogDescription>
            This is the system prompt that will be sent to the AI model. It combines your agent configuration, tools, and instructions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 mt-4">
          <ScrollArea className="h-[60vh] rounded-md border bg-muted/30">
            <div className="p-4">
              {generatedPrompt ? (
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
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
            <Button variant="outline" onClick={handleCopy}>
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

import { CannedMessage } from "@/services/canned-messages.service"
import { RevisionFormat } from "@/services/ai.service"

export interface AIReview {
  originalText: string
  suggestedText: string
  detectedUserLanguage?: string
  detectedAgentLanguage?: string
  wasTranslated?: boolean
  improvements?: string[]
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  summary: string
  category: string
  tags: string[]
  url: string
}

export interface EditorToolbarProps {
  value: string
  hasContent: boolean
  isRecording: boolean
  isTranslating: boolean
  isGenerating: boolean
  isRevising: boolean
  revisionFormats: RevisionFormat[]
  recognitionAvailable: boolean
  onBold: () => void
  onItalic: () => void
  onUnderline: () => void
  onList: () => void
  onOrderedList: () => void
  onInsertLink: () => void
  onToggleSpeechToText: () => void
  onTranslate: (language: string) => void
  onGenerate: () => void
  onRevise: (format: string) => void
  onOpenKnowledgeBase: () => void
  onOpenTemplates: () => void
}

export interface SmartReplyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  aiReview: AIReview | null
  isLoading: boolean
  isRegenerating: boolean
  selectedVersion: 'original' | 'improved'
  onSelectVersion: (version: 'original' | 'improved') => void
  smartReplyTone: string
  onToneChange: (tone: string) => void
  smartReplyLanguage: string
  onLanguageChange: (language: string) => void
  onRegenerate: () => void
  onSend: () => void
  onCancel: () => void
}

export interface KnowledgeBaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsertArticle: (article: KnowledgeBaseArticle) => void
}

export interface TemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cannedMessages: CannedMessage[]
  isLoading: boolean
  onInsertTemplate: (message: CannedMessage) => void
}

export interface LinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  linkUrl: string
  linkText: string
  onUrlChange: (url: string) => void
  onTextChange: (text: string) => void
  onInsert: () => void
}

export interface SlashCommandMenuProps {
  show: boolean
  position: { top: number; left: number }
  slashQuery: string
  cannedMessages: CannedMessage[]
  isLoading: boolean
  selectedIndex: number
  onSelect: (message: CannedMessage) => void
  menuRef: React.RefObject<HTMLDivElement>
}

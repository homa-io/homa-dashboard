"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Bot } from "lucide-react"
import type {
  AIAgent,
  AIAgentCreateRequest,
  AIAgentTone,
} from "@/types/ai-agent.types"
import { TONE_OPTIONS } from "@/types/ai-agent.types"
import { getUsers } from "@/services/users"
import type { User } from "@/types/user"

interface AIAgentFormProps {
  agent: AIAgent | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: AIAgentCreateRequest) => Promise<void>
}

export function AIAgentForm({
  agent,
  isOpen,
  onClose,
  onSave,
}: AIAgentFormProps) {
  // Form fields
  const [name, setName] = useState("")
  const [botId, setBotId] = useState("")
  const [handoverEnabled, setHandoverEnabled] = useState(false)
  const [handoverUserId, setHandoverUserId] = useState("")
  const [multiLanguage, setMultiLanguage] = useState(true)
  const [internetAccess, setInternetAccess] = useState(false)
  const [tone, setTone] = useState<AIAgentTone>("casual")
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(true)
  const [unitConversion, setUnitConversion] = useState(true)
  const [instructions, setInstructions] = useState("")

  // UI state
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bots, setBots] = useState<User[]>([])
  const [agents, setAgents] = useState<User[]>([])

  useEffect(() => {
    if (isOpen) {
      loadUsers()
      if (agent) {
        setName(agent.name)
        setBotId(agent.bot_id)
        setHandoverEnabled(agent.handover_enabled)
        setHandoverUserId(agent.handover_user_id || "")
        setMultiLanguage(agent.multi_language)
        setInternetAccess(agent.internet_access)
        setTone(agent.tone)
        setUseKnowledgeBase(agent.use_knowledge_base)
        setUnitConversion(agent.unit_conversion)
        setInstructions(agent.instructions)
      } else {
        resetForm()
      }
      setError(null)
    }
  }, [isOpen, agent])

  const resetForm = () => {
    setName("")
    setBotId("")
    setHandoverEnabled(false)
    setHandoverUserId("")
    setMultiLanguage(true)
    setInternetAccess(false)
    setTone("casual")
    setUseKnowledgeBase(true)
    setUnitConversion(true)
    setInstructions("")
  }

  const loadUsers = async () => {
    try {
      setLoadingUsers(true)

      // Fetch all users - response format: { success, data: { users: [...], total, ... } }
      const response = await getUsers({})

      if (response.success && response.data) {
        const allUsers = response.data.users || []

        // Filter bots
        const botUsers = allUsers.filter(
          (user) => user.type === "bot" && user.status === "active"
        )
        setBots(botUsers)

        // Filter agents and administrators for handover
        const agentUsers = allUsers.filter(
          (user) =>
            (user.type === "agent" || user.type === "administrator") &&
            user.status === "active"
        )
        setAgents(agentUsers)
      }
    } catch (err) {
      console.error("Failed to load users:", err)
      setBots([])
      setAgents([])
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!name.trim()) {
      setError("AI Agent name is required")
      return
    }
    if (!botId) {
      setError("Bot selection is required")
      return
    }
    if (handoverEnabled && !handoverUserId) {
      setError("Handover user is required when handover is enabled")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await onSave({
        name: name.trim(),
        bot_id: botId,
        handover_enabled: handoverEnabled,
        handover_user_id: handoverEnabled ? handoverUserId : null,
        multi_language: multiLanguage,
        internet_access: internetAccess,
        tone,
        use_knowledge_base: useKnowledgeBase,
        unit_conversion: unitConversion,
        instructions: instructions.trim(),
      })
      onClose()
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to save AI agent")
    } finally {
      setLoading(false)
    }
  }

  const isEditing = !!agent

  return (
    <Dialog open={isOpen} onOpenChange={() => !loading && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {isEditing ? "Edit AI Agent" : "Create AI Agent"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update AI agent configuration and behavior."
                : "Configure a new AI agent to handle conversations automatically."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Customer Support Agent"
                disabled={loading}
              />
            </div>

            {/* Bot Selection */}
            <div className="grid gap-2">
              <Label htmlFor="bot">Select Bot *</Label>
              {loadingUsers ? (
                <div className="flex items-center justify-center h-10 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Select value={botId} onValueChange={setBotId} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bot user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {bots.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No bots available
                      </div>
                    ) : (
                      bots.map((bot) => (
                        <SelectItem key={bot.id} value={bot.id}>
                          <div className="flex items-center gap-2">
                            <Bot className="h-3 w-3" />
                            {bot.display_name || `${bot.name} ${bot.last_name}`}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                The bot user that will represent this AI agent
              </p>
            </div>

            {/* Behavior Settings */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-medium">Behavior Settings</h3>

              {/* Handover to Human */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="handover" className="text-sm font-normal">
                    Handover to Human Agent
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Transfer conversation to a human if the user is not
                    satisfied or insists
                  </p>
                </div>
                <Switch
                  id="handover"
                  checked={handoverEnabled}
                  onCheckedChange={setHandoverEnabled}
                  disabled={loading}
                />
              </div>

              {/* Handover User Selection */}
              {handoverEnabled && (
                <div className="grid gap-2 ml-4">
                  <Label htmlFor="handover-user">Handover To *</Label>
                  <Select
                    value={handoverUserId}
                    onValueChange={setHandoverUserId}
                    disabled={loading || loadingUsers}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an agent..." />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No agents available
                        </div>
                      ) : (
                        agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.display_name ||
                              `${agent.name} ${agent.last_name}`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Multi-Language */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="multilang" className="text-sm font-normal">
                    Multi-Language
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Respond in the user&apos;s language automatically
                  </p>
                </div>
                <Switch
                  id="multilang"
                  checked={multiLanguage}
                  onCheckedChange={setMultiLanguage}
                  disabled={loading}
                />
              </div>

              {/* Internet Access */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="internet" className="text-sm font-normal">
                    Internet Access
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allow the agent to search the web for information
                  </p>
                </div>
                <Switch
                  id="internet"
                  checked={internetAccess}
                  onCheckedChange={setInternetAccess}
                  disabled={loading}
                />
              </div>

              {/* Knowledge Base */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="kb" className="text-sm font-normal">
                    Use Knowledge Base
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use RAG to answer questions from your knowledge base
                  </p>
                </div>
                <Switch
                  id="kb"
                  checked={useKnowledgeBase}
                  onCheckedChange={setUseKnowledgeBase}
                  disabled={loading}
                />
              </div>

              {/* Unit Conversion */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="units" className="text-sm font-normal">
                    Unit Conversion
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Convert units to human-readable format (time, bytes, etc.)
                  </p>
                </div>
                <Switch
                  id="units"
                  checked={unitConversion}
                  onCheckedChange={setUnitConversion}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Response Style */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-medium">Response Style</h3>

              <div className="grid gap-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={tone}
                  onValueChange={(value) => setTone(value as AIAgentTone)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-medium">Instructions</h3>

              <div className="grid gap-2">
                <Label htmlFor="instructions">Custom Instructions</Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="You are a helpful customer support agent. Always greet the customer warmly and professionally. If you don&apos;t know the answer to a question, ask for help instead of making up information..."
                  rows={6}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  {instructions.length} characters
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? "Save Changes" : "Create AI Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

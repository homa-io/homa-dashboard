"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Bot, Loader2, Save, Eye } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { useToast } from "@/hooks/use-toast"
import type { AIAgent, AIAgentTone } from "@/types/ai-agent.types"
import { TONE_OPTIONS, MAX_RESPONSE_LENGTH_OPTIONS, CONTEXT_WINDOW_OPTIONS, MAX_TOOL_CALLS_OPTIONS, DEFAULT_BLOCKED_TOPICS, DEFAULT_COLLECT_USER_INFO_FIELDS } from "@/types/ai-agent.types"
import type { AIAgentTool } from "@/types/ai-agent-tool.types"
import { aiAgentService } from "@/services/ai-agent.service"
import { aiAgentToolService } from "@/services/ai-agent-tool.service"
import { getUsers } from "@/services/users"
import type { User } from "@/types/user"
import { ToolsManager } from "./ToolsManager"
import { InstructionPreviewModal } from "./InstructionPreviewModal"
import { SettingsPageWrapper } from "@/components/settings/SettingsPageWrapper"

interface AIAgentEditPageProps {
  agentId: number
}

export function AIAgentEditPage({ agentId }: AIAgentEditPageProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Form fields
  const [name, setName] = useState("")
  const [botId, setBotId] = useState("")
  const [handoverEnabled, setHandoverEnabled] = useState(false)
  const [handoverUserIds, setHandoverUserIds] = useState<string[]>([])
  const [multiLanguage, setMultiLanguage] = useState(true)
  const [internetAccess, setInternetAccess] = useState(false)
  const [tone, setTone] = useState<AIAgentTone>("casual")
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(true)
  const [unitConversion, setUnitConversion] = useState(true)
  const [instructions, setInstructions] = useState("")
  const [greetingMessage, setGreetingMessage] = useState("")
  const [maxResponseLength, setMaxResponseLength] = useState(0)
  const [contextWindow, setContextWindow] = useState(10)
  const [blockedTopics, setBlockedTopics] = useState(DEFAULT_BLOCKED_TOPICS)
  const [maxToolCalls, setMaxToolCalls] = useState(5)
  const [collectUserInfo, setCollectUserInfo] = useState(false)
  const [collectUserInfoFields, setCollectUserInfoFields] = useState(DEFAULT_COLLECT_USER_INFO_FIELDS)
  const [humorLevel, setHumorLevel] = useState(50)
  const [useEmojis, setUseEmojis] = useState(false)
  const [formalityLevel, setFormalityLevel] = useState(50)
  const [priorityDetection, setPriorityDetection] = useState(false)
  const [autoTagging, setAutoTagging] = useState(false)

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [bots, setBots] = useState<User[]>([])
  const [agents, setAgents] = useState<User[]>([])
  const [tools, setTools] = useState<AIAgentTool[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    loadAgent()
    loadUsers()
    loadTools()
  }, [agentId])

  const loadTools = async () => {
    try {
      const toolsData = await aiAgentToolService.list(agentId)
      setTools(toolsData)
    } catch (err) {
      console.error("Failed to load tools:", err)
    }
  }

  const loadAgent = async () => {
    try {
      setLoading(true)
      setError(null)
      const agent = await aiAgentService.get(agentId)
      setName(agent.name)
      setBotId(agent.bot_id)
      setHandoverEnabled(agent.handover_enabled)
      // Load handover user IDs - try new field first, fallback to old field
      if (agent.handover_user_ids && Array.isArray(agent.handover_user_ids) && agent.handover_user_ids.length > 0) {
        setHandoverUserIds(agent.handover_user_ids)
      } else if (agent.handover_user_id) {
        setHandoverUserIds([agent.handover_user_id])
      } else {
        setHandoverUserIds([])
      }
      setMultiLanguage(agent.multi_language)
      setInternetAccess(agent.internet_access)
      setTone(agent.tone)
      setUseKnowledgeBase(agent.use_knowledge_base)
      setUnitConversion(agent.unit_conversion)
      setInstructions(agent.instructions || "")
      setGreetingMessage(agent.greeting_message || "")
      setMaxResponseLength(agent.max_response_length || 0)
      setContextWindow(agent.context_window || 10)
      setBlockedTopics(agent.blocked_topics || DEFAULT_BLOCKED_TOPICS)
      setMaxToolCalls(agent.max_tool_calls ?? 5)
      setCollectUserInfo(agent.collect_user_info || false)
      setCollectUserInfoFields(agent.collect_user_info_fields || DEFAULT_COLLECT_USER_INFO_FIELDS)
      setHumorLevel(agent.humor_level ?? 50)
      setUseEmojis(agent.use_emojis || false)
      setFormalityLevel(agent.formality_level ?? 50)
      setPriorityDetection(agent.priority_detection || false)
      setAutoTagging(agent.auto_tagging || false)
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to load AI agent")
      console.error("Error loading AI agent:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      setLoadingUsers(true)
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

  const handleSave = async () => {
    if (!name.trim()) {
      setSaveError("AI Agent name is required")
      return
    }
    if (!botId) {
      setSaveError("Bot selection is required")
      return
    }
    if (handoverEnabled && handoverUserIds.length === 0) {
      setSaveError("At least one handover user is required when handover is enabled")
      return
    }

    try {
      setSaving(true)
      setSaveError(null)
      await aiAgentService.update(agentId, {
        name: name.trim(),
        bot_id: botId,
        handover_enabled: handoverEnabled,
        handover_user_ids: handoverEnabled ? handoverUserIds : [],
        multi_language: multiLanguage,
        internet_access: internetAccess,
        tone,
        use_knowledge_base: useKnowledgeBase,
        unit_conversion: unitConversion,
        instructions: instructions.trim(),
        greeting_message: greetingMessage.trim(),
        max_response_length: maxResponseLength,
        context_window: contextWindow,
        blocked_topics: blockedTopics.trim(),
        max_tool_calls: maxToolCalls,
        collect_user_info: collectUserInfo,
        collect_user_info_fields: collectUserInfoFields.trim(),
        humor_level: humorLevel,
        use_emojis: useEmojis,
        formality_level: formalityLevel,
        priority_detection: priorityDetection,
        auto_tagging: autoTagging,
      })
      toast({
        title: "Changes saved",
        description: "AI Agent has been updated successfully.",
      })
    } catch (err) {
      const error = err as Error
      setSaveError(error.message || "Failed to save AI agent")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <SettingsPageWrapper activeTab="bot">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </SettingsPageWrapper>
    )
  }

  if (error) {
    return (
      <SettingsPageWrapper activeTab="bot">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">{error}</div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/settings/bot")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to AI Agents
              </Button>
              <Button onClick={loadAgent}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </SettingsPageWrapper>
    )
  }

  return (
    <SettingsPageWrapper activeTab="bot">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/settings/bot">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Edit AI Agent</h1>
                <p className="text-sm text-muted-foreground">
                  Update AI agent configuration and behavior
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-14 sm:pl-0">
            <Button
              variant="outline"
              onClick={() => setPreviewOpen(true)}
              disabled={saving}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Prompt
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/settings/bot")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {saveError && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            {saveError}
          </div>
        )}

        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Name and bot association for this AI agent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Customer Support Agent"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot">Select Bot *</Label>
                {loadingUsers ? (
                  <div className="flex items-center justify-center h-10 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Select value={botId} onValueChange={setBotId} disabled={saving}>
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
            </div>
          </CardContent>
        </Card>

        {/* Behavior Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Behavior Settings</CardTitle>
            <CardDescription>
              Configure how the AI agent behaves and responds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Handover to Human */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="handover" className="text-sm font-medium">
                  Handover to Human Agent
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Transfer conversation to a human if the user is not satisfied or insists
                </p>
              </div>
              <Switch
                id="handover"
                checked={handoverEnabled}
                onCheckedChange={setHandoverEnabled}
                disabled={saving}
              />
            </div>

            {/* Handover User Selection - Multiple Users */}
            {handoverEnabled && (
              <div className="space-y-2 ml-0 sm:ml-4 p-4 bg-muted/50 rounded-lg">
                <Label>Handover To *</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Select one or more agents to receive handovers
                </p>
                {loadingUsers ? (
                  <div className="flex items-center justify-center h-10 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <MultiSelect
                    options={agents.map((agent) => ({
                      value: agent.id,
                      label: agent.display_name || `${agent.name} ${agent.last_name}`,
                    }))}
                    selected={handoverUserIds}
                    onChange={setHandoverUserIds}
                    placeholder="Select agents..."
                    searchPlaceholder="Search agents..."
                    emptyMessage="No agents found."
                    disabled={saving}
                  />
                )}
              </div>
            )}

            {/* Multi-Language */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="multilang" className="text-sm font-medium">
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
                disabled={saving}
              />
            </div>

            {/* Internet Access */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="internet" className="text-sm font-medium">
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
                disabled={saving}
              />
            </div>

            {/* Knowledge Base */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="kb" className="text-sm font-medium">
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
                disabled={saving}
              />
            </div>

            {/* Unit Conversion */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="units" className="text-sm font-medium">
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
                disabled={saving}
              />
            </div>

            {/* Collect User Info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="collectInfo" className="text-sm font-medium">
                  Collect User Info
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Prompt agent to collect user information when appropriate
                </p>
              </div>
              <Switch
                id="collectInfo"
                checked={collectUserInfo}
                onCheckedChange={setCollectUserInfo}
                disabled={saving}
              />
            </div>

            {/* Collect User Info Fields */}
            {collectUserInfo && (
              <div className="space-y-2 ml-0 sm:ml-4 p-4 bg-muted/50 rounded-lg">
                <Label htmlFor="collectInfoFields">Fields to Collect</Label>
                <Input
                  id="collectInfoFields"
                  value={collectUserInfoFields}
                  onChange={(e) => setCollectUserInfoFields(e.target.value)}
                  placeholder="name, email, phone, company..."
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of information to collect from users
                </p>
              </div>
            )}

            {/* Priority Detection */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority Detection
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically detect and set conversation priority based on urgency
                </p>
              </div>
              <Switch
                id="priority"
                checked={priorityDetection}
                onCheckedChange={setPriorityDetection}
                disabled={saving}
              />
            </div>

            {/* Auto Tagging */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="autoTag" className="text-sm font-medium">
                  Auto Tag Conversation
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically tag conversations based on topic detection
                </p>
              </div>
              <Switch
                id="autoTag"
                checked={autoTagging}
                onCheckedChange={setAutoTagging}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Response Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Response Settings</CardTitle>
            <CardDescription>
              Configure response style, length, and context.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-4">
              {/* Tone */}
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={tone}
                  onValueChange={(value) => setTone(value as AIAgentTone)}
                  disabled={saving}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Max Response Length */}
              <div className="space-y-2">
                <Label htmlFor="maxLength">Max Length</Label>
                <Select
                  value={maxResponseLength.toString()}
                  onValueChange={(value) => setMaxResponseLength(parseInt(value))}
                  disabled={saving}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MAX_RESPONSE_LENGTH_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Context Window */}
              <div className="space-y-2">
                <Label htmlFor="contextWindow">Context Window</Label>
                <Select
                  value={contextWindow.toString()}
                  onValueChange={(value) => setContextWindow(parseInt(value))}
                  disabled={saving}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTEXT_WINDOW_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Max Tool Calls */}
              <div className="space-y-2">
                <Label htmlFor="maxToolCalls">Max Tool Calls</Label>
                <Select
                  value={maxToolCalls.toString()}
                  onValueChange={(value) => setMaxToolCalls(parseInt(value))}
                  disabled={saving}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MAX_TOOL_CALLS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Greeting Message */}
            <div className="space-y-2">
              <Label htmlFor="greeting">Greeting Message</Label>
              <Textarea
                id="greeting"
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                placeholder="Hi! I'm your AI assistant. How can I help you today?"
                rows={2}
                disabled={saving}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Auto-sent when a new conversation starts. Leave empty to disable.
              </p>
            </div>

            {/* Blocked Topics */}
            <div className="space-y-2">
              <Label htmlFor="blockedTopics">Blocked Topics</Label>
              <Textarea
                id="blockedTopics"
                value={blockedTopics}
                onChange={(e) => setBlockedTopics(e.target.value)}
                placeholder="competitors, politics, legal advice, medical advice..."
                rows={2}
                disabled={saving}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of topics the agent should refuse to discuss.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personality Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personality Settings</CardTitle>
            <CardDescription>
              Fine-tune the agent&apos;s personality and communication style.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Humor Level */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="humor">Humor Level</Label>
                <span className="text-sm text-muted-foreground">{humorLevel}%</span>
              </div>
              <Slider
                id="humor"
                value={[humorLevel]}
                onValueChange={(value) => setHumorLevel(value[0])}
                max={100}
                step={10}
                disabled={saving}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Serious</span>
                <span>Playful</span>
              </div>
            </div>

            {/* Formality Level */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="formality">Formality Level</Label>
                <span className="text-sm text-muted-foreground">{formalityLevel}%</span>
              </div>
              <Slider
                id="formality"
                value={[formalityLevel]}
                onValueChange={(value) => setFormalityLevel(value[0])}
                max={100}
                step={10}
                disabled={saving}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Casual</span>
                <span>Formal</span>
              </div>
            </div>

            {/* Use Emojis */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label htmlFor="emojis" className="text-sm font-medium">
                  Use Emojis
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Allow the agent to use emojis in responses
                </p>
              </div>
              <Switch
                id="emojis"
                checked={useEmojis}
                onCheckedChange={setUseEmojis}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Instructions</CardTitle>
            <CardDescription>
              Provide specific instructions for how the AI agent should behave.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="You are a helpful customer support agent. Always greet the customer warmly and professionally. If you don't know the answer to a question, ask for help instead of making up information..."
                rows={8}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                {instructions.length} characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tools Section */}
        <ToolsManager agentId={agentId} onToolsChange={setTools} />
      </div>

      {/* Instruction Preview Modal */}
      <InstructionPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        agentId={agentId}
      />
    </SettingsPageWrapper>
  )
}

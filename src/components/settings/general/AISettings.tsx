"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, Eye, EyeOff, Loader2, Bot } from "lucide-react"
import { settingsService, AI_ENDPOINTS, AI_MODELS, SETTING_KEYS } from "@/services/settings.service"

export function AISettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [endpoint, setEndpoint] = useState("")
  const [customEndpoint, setCustomEndpoint] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("")
  const [customModel, setCustomModel] = useState("")
  const [summaryEnabled, setSummaryEnabled] = useState(false)
  const [summaryDelay, setSummaryDelay] = useState("60")

  const isCustomEndpoint = endpoint === "custom" || !AI_ENDPOINTS.find(e => e.value === endpoint)
  const availableModels = AI_MODELS[endpoint] || []
  const isCustomModel = model === "custom" || !availableModels.find(m => m.value === model)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const settings = await settingsService.getSettings()

      const savedEndpoint = settings[SETTING_KEYS.AI_ENDPOINT] || ""
      const savedModel = settings[SETTING_KEYS.AI_MODEL] || ""

      // Check if endpoint is one of predefined
      const isPredefinedEndpoint = AI_ENDPOINTS.find(e => e.value === savedEndpoint)
      if (isPredefinedEndpoint) {
        setEndpoint(savedEndpoint)
        setCustomEndpoint("")
      } else if (savedEndpoint) {
        setEndpoint("custom")
        setCustomEndpoint(savedEndpoint)
      }

      // Check if model is one of predefined for this endpoint
      const endpointModels = AI_MODELS[savedEndpoint] || []
      const isPredefinedModel = endpointModels.find(m => m.value === savedModel)
      if (isPredefinedModel) {
        setModel(savedModel)
        setCustomModel("")
      } else if (savedModel) {
        setModel("custom")
        setCustomModel(savedModel)
      }

      setApiKey(settings[SETTING_KEYS.AI_API_KEY] || "")

      // Load summary settings
      setSummaryEnabled(settings[SETTING_KEYS.AI_CONVERSATION_SUMMARY_ENABLED] === "true")
      setSummaryDelay(settings[SETTING_KEYS.AI_CONVERSATION_SUMMARY_DELAY] || "60")
    } catch (err: any) {
      setError(err.message || "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleEndpointChange = (value: string) => {
    setEndpoint(value)
    // Reset model when endpoint changes
    setModel("")
    setCustomModel("")
    if (value !== "custom") {
      setCustomEndpoint("")
    }
  }

  const handleModelChange = (value: string) => {
    setModel(value)
    if (value !== "custom") {
      setCustomModel("")
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const finalEndpoint = isCustomEndpoint ? customEndpoint : endpoint
      const finalModel = isCustomModel ? customModel : model

      await settingsService.updateSettings({
        [SETTING_KEYS.AI_ENDPOINT]: finalEndpoint,
        [SETTING_KEYS.AI_API_KEY]: apiKey,
        [SETTING_KEYS.AI_MODEL]: finalModel,
        [SETTING_KEYS.AI_CONVERSATION_SUMMARY_ENABLED]: summaryEnabled ? "true" : "false",
        [SETTING_KEYS.AI_CONVERSATION_SUMMARY_DELAY]: summaryDelay,
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <CardTitle className="text-base sm:text-lg">AI Settings</CardTitle>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Configure the AI provider for smart replies, translations, and other AI features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            Settings saved successfully!
          </div>
        )}

        {/* Endpoint Selection */}
        <div className="space-y-2">
          <Label htmlFor="ai-endpoint" className="text-xs sm:text-sm font-medium text-muted-foreground">
            OpenAI Compatible Endpoint
          </Label>
          <Select value={isCustomEndpoint ? "custom" : endpoint} onValueChange={handleEndpointChange}>
            <SelectTrigger className="text-sm h-9 sm:h-10">
              <SelectValue placeholder="Select AI provider..." />
            </SelectTrigger>
            <SelectContent>
              {AI_ENDPOINTS.map((ep) => (
                <SelectItem key={ep.value} value={ep.value}>
                  {ep.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isCustomEndpoint && (
            <Input
              id="custom-endpoint"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              placeholder="https://your-api-endpoint.com/v1"
              className="text-sm h-9 sm:h-10 mt-2"
            />
          )}
          <p className="text-xs text-muted-foreground">
            Select a pre-configured provider or enter a custom OpenAI-compatible API endpoint.
          </p>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-xs sm:text-sm font-medium text-muted-foreground">
            API Key
          </Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="text-sm h-9 sm:h-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your API key is stored securely and never exposed to clients.
          </p>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="ai-model" className="text-xs sm:text-sm font-medium text-muted-foreground">
            Default Model
          </Label>
          <Select value={isCustomModel ? "custom" : model} onValueChange={handleModelChange}>
            <SelectTrigger className="text-sm h-9 sm:h-10">
              <SelectValue placeholder="Select model..." />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom Model</SelectItem>
            </SelectContent>
          </Select>
          {isCustomModel && (
            <Input
              id="custom-model"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="gpt-4o"
              className="text-sm h-9 sm:h-10 mt-2"
            />
          )}
          <p className="text-xs text-muted-foreground">
            Select a model from the list or enter a custom model name.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-4" />

        {/* Conversation Summary Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Conversation Summary</h4>

          {/* Summary Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="summary-enabled" className="text-xs sm:text-sm font-medium text-muted-foreground">
                Enable Conversation Summary
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically generate AI summaries for conversations.
              </p>
            </div>
            <Switch
              id="summary-enabled"
              checked={summaryEnabled}
              onCheckedChange={setSummaryEnabled}
            />
          </div>

          {/* Summary Delay */}
          {summaryEnabled && (
            <div className="space-y-2">
              <Label htmlFor="summary-delay" className="text-xs sm:text-sm font-medium text-muted-foreground">
                Summary Generation Delay (seconds)
              </Label>
              <Input
                id="summary-delay"
                type="number"
                min="10"
                max="600"
                value={summaryDelay}
                onChange={(e) => setSummaryDelay(e.target.value)}
                placeholder="60"
                className="text-sm h-9 sm:h-10 w-32"
              />
              <p className="text-xs text-muted-foreground">
                Wait this many seconds after the last message before generating a summary.
                Multiple messages within this window will only trigger one summary generation.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="text-sm h-9 sm:h-10">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save AI Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

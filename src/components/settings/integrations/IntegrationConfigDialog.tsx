"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, Eye, EyeOff, TestTube, CheckCircle, XCircle, Copy, Check, ExternalLink } from "lucide-react"
import { Integration, ConfigField, integrationsService, INTEGRATION_EMOJIS } from "@/services/integrations.service"

interface IntegrationConfigDialogProps {
  integration: Integration | null
  isOpen: boolean
  onClose: () => void
  onSave: (type: string, status: string, config: Record<string, any>) => Promise<void>
  onTest: (type: string, config: Record<string, any>) => Promise<{ success: boolean; message: string }>
}

// Get base URL for webhooks - uses the API URL from environment
function getWebhookBaseUrl(): string {
  // Use the configured API URL which points to the backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    return apiUrl
  }
  // Fallback for development: use current host with backend port
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href)
    if (url.port === "3000") {
      url.port = "8033"
    }
    return `${url.protocol}//${url.host}`
  }
  return ""
}

export function IntegrationConfigDialog({
  integration,
  isOpen,
  onClose,
  onSave,
  onTest,
}: IntegrationConfigDialogProps) {
  const [fields, setFields] = useState<ConfigField[]>([])
  const [config, setConfig] = useState<Record<string, any>>({})
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [copiedUrl, setCopiedUrl] = useState(false)

  useEffect(() => {
    if (integration && isOpen) {
      loadFields()
    }
  }, [integration, isOpen])

  const loadFields = async () => {
    if (!integration) return

    try {
      setLoading(true)
      const fetchedFields = await integrationsService.getFields(integration.type)
      setFields(fetchedFields)
      setConfig(integration.config || {})
      setEnabled(integration.status === "enabled")
      setTestResult(null)
      setShowPasswords({})
      setCopiedUrl(false)
    } catch (error) {
      console.error("Failed to load integration fields:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
    setTestResult(null)
  }

  const handleTest = async () => {
    if (!integration) return

    try {
      setTesting(true)
      setTestResult(null)
      const result = await onTest(integration.type, config)
      setTestResult(result)
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || "Test failed",
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    if (!integration) return

    try {
      setSaving(true)
      await onSave(integration.type, enabled ? "enabled" : "disabled", config)
      onClose()
    } catch (error) {
      console.error("Failed to save integration:", error)
    } finally {
      setSaving(false)
    }
  }

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getWebhookUrl = (type: string): string => {
    const baseUrl = getWebhookBaseUrl()
    return `${baseUrl}/api/integrations/webhooks/${type}`
  }

  const renderWebhookSetup = () => {
    if (!integration) return null

    const webhookUrl = getWebhookUrl(integration.type)

    switch (integration.type) {
      case "slack":
        return (
          <div className="p-3 bg-muted/50 rounded-md space-y-3 border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ExternalLink className="w-4 h-4" />
              Webhook Setup Instructions
            </div>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Go to your <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Slack App settings</a></li>
              <li>Navigate to <strong>Event Subscriptions</strong></li>
              <li>Enable events and set the Request URL to:</li>
            </ol>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background p-2 rounded border font-mono break-all">
                {webhookUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhookUrl)}
                className="shrink-0 h-8 w-8 p-0"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside" start={4}>
              <li>Subscribe to bot events: <code className="bg-muted px-1 rounded">message.channels</code>, <code className="bg-muted px-1 rounded">message.im</code></li>
              <li>Save changes and reinstall the app to your workspace</li>
            </ol>
          </div>
        )

      case "telegram":
        return (
          <div className="p-3 bg-muted/50 rounded-md space-y-3 border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ExternalLink className="w-4 h-4" />
              How to Set Up Your Telegram Bot
            </div>

            {/* Step 1: Create Bot */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground">Step 1: Create a Telegram Bot</p>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside pl-2">
                <li>Open Telegram and search for <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">@BotFather</a></li>
                <li>Start a chat and send the command <code className="bg-muted px-1 rounded">/newbot</code></li>
                <li>Follow the prompts to choose a <strong>name</strong> (display name) and <strong>username</strong> (must end in &quot;bot&quot;)</li>
                <li>BotFather will send you a <strong>Bot Token</strong> - it looks like: <code className="bg-muted px-1 rounded text-[10px]">123456789:ABCdefGHIjklMNOpqrsTUVwxyz</code></li>
              </ol>
            </div>

            {/* Step 2: Configure Here */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground">Step 2: Configure the Integration</p>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside pl-2">
                <li>Copy the <strong>Bot Token</strong> from BotFather and paste it in the &quot;Bot Token&quot; field above</li>
                <li>Enable the integration using the toggle at the top</li>
                <li>Click <strong>Save</strong> - the webhook will be registered automatically</li>
              </ol>
            </div>

            {/* Webhook URL Info */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground">Webhook URL (Auto-Registered)</p>
              <p className="text-xs text-muted-foreground">When you save this integration, messages from your bot will be received at:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background p-2 rounded border font-mono break-all">
                  {webhookUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(webhookUrl)}
                  className="shrink-0 h-8 w-8 p-0"
                  title="Copy URL"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>

            {/* Important Notes */}
            <div className="space-y-1.5 pt-1 border-t">
              <p className="text-xs font-medium text-foreground">Important Notes</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside pl-2">
                <li><strong>HTTPS Required:</strong> Telegram only sends webhooks to secure HTTPS URLs with valid SSL certificates</li>
                <li><strong>Start a Chat:</strong> Users must first send a message to your bot before the bot can message them</li>
                <li><strong>Test:</strong> Use the &quot;Test Connection&quot; button to verify your bot token is valid</li>
              </ul>
            </div>
          </div>
        )

      case "whatsapp":
        return (
          <div className="p-3 bg-muted/50 rounded-md space-y-3 border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ExternalLink className="w-4 h-4" />
              Webhook Setup Instructions
            </div>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meta for Developers</a> and select your app</li>
              <li>Navigate to <strong>WhatsApp &gt; Configuration</strong></li>
              <li>Click <strong>Edit</strong> next to Webhook and set the Callback URL to:</li>
            </ol>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background p-2 rounded border font-mono break-all">
                {webhookUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhookUrl)}
                className="shrink-0 h-8 w-8 p-0"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside" start={4}>
              <li>Set the <strong>Verify Token</strong> to match the value in the &quot;Webhook Verify Token&quot; field above</li>
              <li>Click <strong>Verify and Save</strong></li>
              <li>Subscribe to the <code className="bg-muted px-1 rounded">messages</code> webhook field</li>
            </ol>
          </div>
        )

      default:
        return null
    }
  }

  const renderField = (field: ConfigField) => {
    const value = config[field.name] || ""
    const isPassword = field.type === "password"
    const showPassword = showPasswords[field.name]

    switch (field.type) {
      case "select":
        return (
          <Select value={value} onValueChange={(v) => handleFieldChange(field.name, v)}>
            <SelectTrigger className="h-9 sm:h-10">
              <SelectValue placeholder={field.placeholder || `Select ${field.label}...`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value) || 0)}
            placeholder={field.placeholder}
            className="h-9 sm:h-10"
          />
        )

      case "password":
        return (
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="h-9 sm:h-10 pr-10"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field.name)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )

      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="h-9 sm:h-10"
          />
        )
    }
  }

  if (!integration) return null

  const emoji = INTEGRATION_EMOJIS[integration.type] || "🔌"
  const hasWebhookSetup = ["slack", "telegram", "whatsapp"].includes(integration.type)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <span className="text-xl">{emoji}</span>
            Configure {integration.name}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Set up your {integration.name} integration to send and receive messages.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between py-2 border-b">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Enable Integration</Label>
                <p className="text-xs text-muted-foreground">
                  Turn on to start using this integration
                </p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>

            {/* Configuration Fields */}
            {fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}

            {/* Webhook Setup Instructions */}
            {hasWebhookSetup && renderWebhookSetup()}

            {/* Test Result */}
            {testResult && (
              <div
                className={`p-3 rounded-md text-sm flex items-start gap-2 ${
                  testResult.success
                    ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={loading || testing || saving}
            className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
          >
            {testing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            Test Connection
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="flex-1 sm:flex-none text-xs sm:text-sm h-9 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || saving}
              className="flex-1 sm:flex-none text-xs sm:text-sm h-9 sm:h-10"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

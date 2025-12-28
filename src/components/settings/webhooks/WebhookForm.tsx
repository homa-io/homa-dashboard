"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save, Loader2 } from "lucide-react"
import type { Webhook, WebhookCreateRequest } from "@/types/webhook.types"
import { WEBHOOK_EVENTS } from "@/types/webhook.types"

interface WebhookFormProps {
  webhook: Webhook | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: WebhookCreateRequest) => Promise<void>
}

export function WebhookForm({ webhook, isOpen, onClose, onSave }: WebhookFormProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<WebhookCreateRequest>({
    name: "",
    url: "",
    secret: "",
    enabled: true,
    description: "",
    event_all: false,
    event_conversation_created: true,
    event_conversation_updated: true,
    event_conversation_status_change: true,
    event_conversation_closed: true,
    event_conversation_assigned: true,
    event_message_created: true,
    event_client_created: false,
    event_client_updated: false,
    event_user_created: false,
    event_user_updated: false,
  })

  useEffect(() => {
    if (webhook && isOpen) {
      setFormData({
        name: webhook.name,
        url: webhook.url,
        secret: webhook.secret,
        enabled: webhook.enabled,
        description: webhook.description,
        event_all: webhook.event_all,
        event_conversation_created: webhook.event_conversation_created,
        event_conversation_updated: webhook.event_conversation_updated,
        event_conversation_status_change: webhook.event_conversation_status_change,
        event_conversation_closed: webhook.event_conversation_closed,
        event_conversation_assigned: webhook.event_conversation_assigned,
        event_message_created: webhook.event_message_created,
        event_client_created: webhook.event_client_created,
        event_client_updated: webhook.event_client_updated,
        event_user_created: webhook.event_user_created,
        event_user_updated: webhook.event_user_updated,
      })
    } else if (isOpen) {
      setFormData({
        name: "",
        url: "",
        secret: "",
        enabled: true,
        description: "",
        event_all: false,
        event_conversation_created: true,
        event_conversation_updated: true,
        event_conversation_status_change: true,
        event_conversation_closed: true,
        event_conversation_assigned: true,
        event_message_created: true,
        event_client_created: false,
        event_client_updated: false,
        event_user_created: false,
        event_user_updated: false,
      })
    }
  }, [webhook, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error saving webhook:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleEventChange = (eventId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [eventId]: checked,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {webhook ? "Edit Webhook" : "Add New Webhook"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Configure webhook settings to receive event notifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Webhook"
              required
              className="text-sm h-9 sm:h-10"
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-xs sm:text-sm font-medium">
              Webhook URL *
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com/webhook"
              required
              className="text-sm h-9 sm:h-10"
            />
            <p className="text-xs text-muted-foreground">
              The URL where webhook events will be sent via POST request.
            </p>
          </div>

          {/* Secret */}
          <div className="space-y-2">
            <Label htmlFor="secret" className="text-xs sm:text-sm font-medium">
              Secret Key (optional)
            </Label>
            <Input
              id="secret"
              type="password"
              value={formData.secret}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              placeholder="Your secret key for HMAC signing"
              className="text-sm h-9 sm:h-10"
            />
            <p className="text-xs text-muted-foreground">
              Used to sign webhook payloads with HMAC-SHA256. Sent in X-Webhook-Signature header.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the purpose of this webhook..."
              rows={2}
              className="text-sm"
            />
          </div>

          {/* Enabled Switch */}
          <div className="flex items-center justify-between py-2 border-t border-b">
            <div className="space-y-0.5">
              <Label className="text-xs sm:text-sm font-medium">Enabled</Label>
              <p className="text-xs text-muted-foreground">
                When disabled, no events will be sent to this webhook.
              </p>
            </div>
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
            />
          </div>

          {/* Event Types */}
          <div className="space-y-3">
            <Label className="text-xs sm:text-sm font-medium">Event Subscriptions</Label>
            <p className="text-xs text-muted-foreground -mt-1">
              Select which events should trigger this webhook.
            </p>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {WEBHOOK_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md"
                >
                  <div className="space-y-0.5">
                    <Label className="text-xs sm:text-sm font-medium">{event.label}</Label>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  </div>
                  <Switch
                    checked={formData[event.id as keyof WebhookCreateRequest] as boolean || false}
                    onCheckedChange={(checked) => handleEventChange(event.id, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="text-xs sm:text-sm h-9 sm:h-10 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="text-xs sm:text-sm h-9 sm:h-10 order-1 sm:order-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                  Save Webhook
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { webhookService } from "@/services/webhook.service"
import { WebhookForm } from "./WebhookForm"
import { WebhookList } from "./WebhookList"
import type { Webhook, WebhookCreateRequest } from "@/types/webhook.types"
import { WEBHOOK_EVENTS } from "@/types/webhook.types"

export function WebhookManager() {
  const router = useRouter()
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [testingId, setTestingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchWebhooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await webhookService.list()
      setWebhooks(response.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load webhooks")
      console.error("Error fetching webhooks:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const handleAdd = () => {
    setEditingWebhook(null)
    setIsFormOpen(true)
  }

  const handleEdit = (webhook: Webhook) => {
    setEditingWebhook(webhook)
    setIsFormOpen(true)
  }

  const handleSave = async (data: WebhookCreateRequest) => {
    if (editingWebhook) {
      await webhookService.update(editingWebhook.id, data)
    } else {
      await webhookService.create(data)
    }
    await fetchWebhooks()
  }

  const handleDelete = async (webhook: Webhook) => {
    if (!confirm(`Are you sure you want to delete "${webhook.name}"?\n\nThis action cannot be undone.`)) {
      return
    }
    try {
      setDeletingId(webhook.id)
      await webhookService.delete(webhook.id)
      await fetchWebhooks()
    } catch (err: any) {
      alert(err.message || "Failed to delete webhook")
    } finally {
      setDeletingId(null)
    }
  }

  const handleTest = async (webhook: Webhook, eventType?: string) => {
    try {
      setTestingId(webhook.id)
      const result = await webhookService.test(webhook.id, eventType)
      if (result.success) {
        alert(result.message || "Test webhook sent successfully!")
      } else {
        alert(`Test failed: ${result.message}`)
      }
    } catch (err: any) {
      alert(err.message || "Failed to test webhook")
    } finally {
      setTestingId(null)
    }
  }

  const handleViewLogs = (webhook: Webhook) => {
    // Navigate to dedicated logs page with webhook filter
    router.push(`/webhook-logs?webhook_id=${webhook.id}`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">Webhooks</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Configure webhooks to receive real-time notifications when events occur.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-6">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Configured Webhooks</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage your webhook endpoints and view delivery logs.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/webhook-logs">
              <Button variant="outline" size="sm" className="text-xs h-9">
                <FileText className="w-4 h-4 mr-1" />
                View Logs
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchWebhooks}
              disabled={loading}
              className="text-xs h-9"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={handleAdd} className="text-xs sm:text-sm h-9 sm:h-10">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button variant="outline" onClick={fetchWebhooks} className="mt-4">
                Retry
              </Button>
            </div>
          )}

          {!error && (
            <WebhookList
              webhooks={webhooks}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTest={handleTest}
              onViewLogs={handleViewLogs}
              testingId={testingId}
              deletingId={deletingId}
            />
          )}
        </CardContent>
      </Card>

      {/* Webhook Event Types Info */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Available Events</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Events that can trigger webhook notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WEBHOOK_EVENTS.filter(e => e.id !== 'event_all').map((event) => (
              <div key={event.id} className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm">{event.label}</h4>
                <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Webhook Payload Format</h4>
            <pre className="text-xs text-muted-foreground overflow-auto">
{`{
  "event": "conversation.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": 123,
    // Event-specific data
  }
}

Headers:
  Content-Type: application/json
  User-Agent: Homa-Webhook/1.0
  X-Webhook-Event: conversation.created
  X-Webhook-ID: 1
  X-Webhook-Signature: <HMAC-SHA256 if secret is set>`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Form Modal */}
      <WebhookForm
        webhook={editingWebhook}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingWebhook(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}

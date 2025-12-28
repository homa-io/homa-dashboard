"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Edit,
  Trash2,
  MoreVertical,
  Play,
  FileText,
  Loader2,
  Globe,
  ChevronRight,
} from "lucide-react"
import type { Webhook } from "@/types/webhook.types"
import { TEST_EVENT_TYPES } from "@/types/webhook.types"

interface WebhookListProps {
  webhooks: Webhook[]
  loading: boolean
  onEdit: (webhook: Webhook) => void
  onDelete: (webhook: Webhook) => void
  onTest: (webhook: Webhook, eventType?: string) => void
  onViewLogs: (webhook: Webhook) => void
  testingId: number | null
  deletingId: number | null
}

export function WebhookList({
  webhooks,
  loading,
  onEdit,
  onDelete,
  onTest,
  onViewLogs,
  testingId,
  deletingId,
}: WebhookListProps) {
  const getActiveEvents = (webhook: Webhook): string[] => {
    const events: string[] = []
    if (webhook.event_all) return ['All Events']
    if (webhook.event_conversation_created) events.push('Conv.Created')
    if (webhook.event_conversation_updated) events.push('Conv.Updated')
    if (webhook.event_conversation_status_change) events.push('Status')
    if (webhook.event_conversation_closed) events.push('Conv.Closed')
    if (webhook.event_conversation_assigned) events.push('Assigned')
    if (webhook.event_message_created) events.push('Message')
    if (webhook.event_client_created) events.push('Client.Created')
    if (webhook.event_client_updated) events.push('Client.Updated')
    if (webhook.event_user_created) events.push('User.Created')
    if (webhook.event_user_updated) events.push('User.Updated')
    return events
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
        <p>Loading webhooks...</p>
      </div>
    )
  }

  if (webhooks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No webhooks configured yet.</p>
        <p className="text-sm mt-1">Click "Add Webhook" to create your first webhook.</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{webhook.name}</p>
                <p className="text-xs text-muted-foreground truncate">{webhook.url}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant={webhook.enabled ? "secondary" : "outline"} className="text-xs">
                    {webhook.enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(webhook)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled={testingId === webhook.id}>
                      {testingId === webhook.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Test Event
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {TEST_EVENT_TYPES.map((event) => (
                        <DropdownMenuItem
                          key={event.value}
                          onClick={() => onTest(webhook, event.value)}
                        >
                          {event.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={() => onViewLogs(webhook)}>
                    <FileText className="w-4 h-4 mr-2" />
                    View Logs
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(webhook)}
                    disabled={deletingId === webhook.id}
                    className="text-red-600"
                  >
                    {deletingId === webhook.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-wrap gap-1">
              {getActiveEvents(webhook).slice(0, 3).map((event) => (
                <Badge key={event} variant="outline" className="text-xs">
                  {event}
                </Badge>
              ))}
              {getActiveEvents(webhook).length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{getActiveEvents(webhook).length - 3} more
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Name</TableHead>
              <TableHead className="text-xs sm:text-sm">URL</TableHead>
              <TableHead className="text-xs sm:text-sm">Events</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
              <TableHead className="w-[120px] text-xs sm:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooks.map((webhook) => (
              <TableRow key={webhook.id}>
                <TableCell className="font-medium text-xs sm:text-sm">
                  {webhook.name}
                </TableCell>
                <TableCell className="text-xs sm:text-sm max-w-[200px] truncate">
                  {webhook.url}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {getActiveEvents(webhook).slice(0, 2).map((event) => (
                      <Badge key={event} variant="outline" className="text-xs px-1.5">
                        {event}
                      </Badge>
                    ))}
                    {getActiveEvents(webhook).length > 2 && (
                      <Badge variant="outline" className="text-xs px-1.5">
                        +{getActiveEvents(webhook).length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={webhook.enabled ? "secondary" : "outline"}
                    className={`text-xs ${
                      webhook.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {webhook.enabled ? "Active" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(webhook)}
                      className="h-8 w-8 p-0"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={testingId === webhook.id}
                          className="h-8 w-8 p-0"
                          title="Test"
                        >
                          {testingId === webhook.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {TEST_EVENT_TYPES.map((event) => (
                          <DropdownMenuItem
                            key={event.value}
                            onClick={() => onTest(webhook, event.value)}
                          >
                            <span className="font-medium">{event.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewLogs(webhook)}
                      className="h-8 w-8 p-0"
                      title="View Logs"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(webhook)}
                      disabled={deletingId === webhook.id}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      {deletingId === webhook.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

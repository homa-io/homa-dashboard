"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Copy,
  Terminal,
  Clock,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { webhookService } from "@/services/webhook.service"
import { useSearchParams } from "next/navigation"
import type { WebhookDelivery, Webhook } from "@/types/webhook.types"

export default function WebhookLogsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="text-center py-8 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p>Loading webhook logs...</p>
        </div>
      </div>
    }>
      <WebhookLogsContent />
    </Suspense>
  )
}

function WebhookLogsContent() {
  const searchParams = useSearchParams()
  const initialWebhookId = searchParams.get("webhook_id")

  const [logs, setLogs] = useState<WebhookDelivery[]>([])
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)

  // Filters - initialize from URL params
  const [webhookFilter, setWebhookFilter] = useState<string>(initialWebhookId || "all")
  const [successFilter, setSuccessFilter] = useState<string>("all")
  const [eventFilter, setEventFilter] = useState("")

  // Selected log for detail view
  const [selectedLog, setSelectedLog] = useState<WebhookDelivery | null>(null)

  const itemsPerPage = 20

  const fetchWebhooks = async () => {
    try {
      const response = await webhookService.list()
      setWebhooks(response.data || [])
    } catch (err) {
      console.error("Error fetching webhooks:", err)
    }
  }

  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await webhookService.deliveries.list({
        webhook_id: webhookFilter !== "all" ? parseInt(webhookFilter) : undefined,
        success: successFilter !== "all" ? successFilter === "true" : undefined,
        event: eventFilter || undefined,
        page: currentPage,
        per_page: itemsPerPage,
      })
      setLogs(response.data || [])
      setTotalPages(response.total_pages || 1)
      setTotalLogs(response.total || 0)
    } catch (err: any) {
      setError(err.message || "Failed to load webhook logs")
      console.error("Error fetching webhook logs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWebhooks()
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [currentPage, webhookFilter, successFilter, eventFilter])

  const clearFilters = () => {
    setWebhookFilter("all")
    setSuccessFilter("all")
    setEventFilter("")
    setCurrentPage(1)
  }

  const hasActiveFilters = webhookFilter !== "all" || successFilter !== "all" || eventFilter !== ""

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

  const getWebhookName = (webhookId: number) => {
    const webhook = webhooks.find(w => w.id === webhookId)
    return webhook?.name || `Webhook #${webhookId}`
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/settings/webhooks">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Webhooks
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold">Webhook Delivery Logs</h1>
        <p className="text-muted-foreground">
          View detailed webhook delivery history with debugging information in curl format.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Delivery History</CardTitle>
              <CardDescription>
                {totalLogs} total deliveries
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-4 border-b">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Webhook</Label>
              <Select value={webhookFilter} onValueChange={setWebhookFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="All Webhooks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Webhooks</SelectItem>
                  {webhooks.map((w) => (
                    <SelectItem key={w.id} value={w.id.toString()}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Status</Label>
              <Select value={successFilter} onValueChange={setSuccessFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Success</SelectItem>
                  <SelectItem value="false">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Event</Label>
              <Input
                placeholder="Filter by event..."
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="flex items-end">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button variant="outline" onClick={fetchLogs} className="mt-4">
                Retry
              </Button>
            </div>
          )}

          {/* Loading */}
          {!error && loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p>Loading logs...</p>
            </div>
          )}

          {/* Empty State */}
          {!error && !loading && logs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No delivery logs found.</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Table */}
          {!error && !loading && logs.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Status</TableHead>
                      <TableHead>Webhook</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead className="w-[100px]">HTTP Code</TableHead>
                      <TableHead className="w-[100px]">Duration</TableHead>
                      <TableHead className="w-[180px]">Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedLog(log)}>
                        <TableCell>
                          {log.success ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {getWebhookName(log.webhook_id)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.event}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={log.status_code >= 200 && log.status_code < 300 ? "secondary" : "destructive"}
                            className="font-mono"
                          >
                            {log.status_code || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.duration_ms ? `${log.duration_ms}ms` : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(log.created_at)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLog(log)
                            }}
                          >
                            <Terminal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} ({totalLogs} total)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <DeliveryDetailModal
        log={selectedLog}
        webhookName={selectedLog ? getWebhookName(selectedLog.webhook_id) : ""}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  )
}

interface DeliveryDetailModalProps {
  log: WebhookDelivery | null
  webhookName: string
  onClose: () => void
}

function DeliveryDetailModal({ log, webhookName, onClose }: DeliveryDetailModalProps) {
  const [copied, setCopied] = useState(false)

  if (!log) return null

  // Generate curl command
  const generateCurl = () => {
    let headers: Record<string, string> = {}
    try {
      headers = JSON.parse(log.request_headers || "{}")
    } catch {
      headers = {}
    }

    const headerLines = Object.entries(headers)
      .map(([key, value]) => `-H '${key}: ${value}'`)
      .join(" \\\n  ")

    // Escape single quotes in body
    const escapedBody = (log.request_body || "").replace(/'/g, "'\\''")

    return `curl -X POST '${log.request_url}' \\
  ${headerLines} \\
  -d '${escapedBody}'`
  }

  const curlCommand = generateCurl()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Dialog open={!!log} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {log.success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span>{webhookName}</span>
            <Badge variant="outline" className="font-mono ml-2">
              {log.event}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4">
            <span>{new Date(log.created_at).toLocaleString()}</span>
            {log.duration_ms > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {log.duration_ms}ms
              </span>
            )}
            <Badge variant={log.success ? "secondary" : "destructive"}>
              HTTP {log.status_code || "Error"}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Curl Command */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                cURL Command
              </Label>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-3 h-3 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="p-4 bg-zinc-950 text-green-400 rounded-lg text-xs overflow-auto max-h-48 font-mono">
              {curlCommand}
            </pre>
          </div>

          {/* Request URL */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Request URL</Label>
            <pre className="p-3 bg-muted rounded-md text-sm overflow-auto font-mono">
              POST {log.request_url}
            </pre>
          </div>

          {/* Request Headers */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Request Headers</Label>
            <pre className="p-3 bg-muted rounded-md text-xs overflow-auto max-h-32 font-mono">
              {(() => {
                try {
                  return JSON.stringify(JSON.parse(log.request_headers || "{}"), null, 2)
                } catch {
                  return log.request_headers || "(empty)"
                }
              })()}
            </pre>
          </div>

          {/* Request Body */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Request Body</Label>
            <pre className="p-3 bg-muted rounded-md text-xs overflow-auto max-h-64 font-mono">
              {log.request_body || "(empty)"}
            </pre>
          </div>

          {/* Response */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Response (HTTP {log.status_code || "N/A"})
            </Label>
            <pre className={`p-3 rounded-md text-xs overflow-auto max-h-32 font-mono ${log.success ? "bg-muted" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"}`}>
              {log.response || "(empty)"}
            </pre>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

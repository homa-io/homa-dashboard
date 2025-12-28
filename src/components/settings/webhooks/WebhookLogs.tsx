"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  RefreshCw,
} from "lucide-react"
import { webhookService } from "@/services/webhook.service"
import type { WebhookDelivery, Webhook } from "@/types/webhook.types"

interface WebhookLogsProps {
  webhook: Webhook | null
  isOpen: boolean
  onClose: () => void
}

export function WebhookLogs({ webhook, isOpen, onClose }: WebhookLogsProps) {
  const [logs, setLogs] = useState<WebhookDelivery[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const [successFilter, setSuccessFilter] = useState<string>("")
  const [selectedLog, setSelectedLog] = useState<WebhookDelivery | null>(null)
  const itemsPerPage = 10

  const fetchLogs = async () => {
    if (!webhook) return

    try {
      setLoading(true)
      setError(null)
      const response = await webhookService.deliveries.list({
        webhook_id: webhook.id,
        success: successFilter ? successFilter === "true" : undefined,
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
    if (isOpen && webhook) {
      setCurrentPage(1)
      fetchLogs()
    }
  }, [isOpen, webhook])

  useEffect(() => {
    if (isOpen && webhook) {
      fetchLogs()
    }
  }, [currentPage, successFilter])

  const clearFilters = () => {
    setSuccessFilter("")
    setCurrentPage(1)
  }

  const hasActiveFilters = successFilter !== ""

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Webhook Delivery Logs</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm truncate">
              {webhook?.name} - {webhook?.url}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Filters */}
            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-48">
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Status</Label>
                  <Select value={successFilter || "all"} onValueChange={(v) => setSuccessFilter(v === "all" ? "" : v)}>
                    <SelectTrigger className="text-sm h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Success</SelectItem>
                      <SelectItem value="false">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      Showing {logs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                      {Math.min(currentPage * itemsPerPage, totalLogs)} of {totalLogs} logs
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs h-8"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchLogs}
                    disabled={loading}
                    className="text-xs h-8"
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Logs Content */}
            <div className="flex-1 overflow-auto">
              {error && (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                  <Button variant="outline" onClick={fetchLogs} className="mt-4">
                    Retry
                  </Button>
                </div>
              )}

              {!error && loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p>Loading logs...</p>
                </div>
              )}

              {!error && !loading && logs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No delivery logs found.</p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}

              {!error && !loading && logs.length > 0 && (
                <>
                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="border rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedLog(log)}
                      >
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={log.success ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {log.success ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {log.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">{log.event}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(log.created_at)}
                        </div>
                        {log.response && !log.success && (
                          <div className="text-xs text-red-500 truncate">{log.response}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Status</TableHead>
                          <TableHead className="text-xs">Event</TableHead>
                          <TableHead className="text-xs">Response</TableHead>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-xs w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              {log.success ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </TableCell>
                            <TableCell className="text-xs font-medium">{log.event}</TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                              {log.response || "-"}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(log.created_at)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedLog(log)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <div className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-xs h-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="text-xs h-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Detail Modal */}
      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </>
  )
}

interface LogDetailModalProps {
  log: WebhookDelivery | null
  onClose: () => void
}

function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  if (!log) return null

  return (
    <Dialog open={!!log} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
            {log.success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            {log.event}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {new Date(log.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Status Info */}
          <div>
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Badge variant={log.success ? "secondary" : "destructive"} className="mt-1">
              {log.success ? "Success" : "Failed"}
            </Badge>
          </div>

          {/* Response */}
          <div>
            <Label className="text-xs text-muted-foreground">Response</Label>
            <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-auto max-h-48">
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

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CustomBadge } from "@/components/ui/custom-badge"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Timer,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from "lucide-react"
import { sessionsService, UserSession } from "@/services/sessions.service"
import { format, formatDistanceToNow, differenceInSeconds, differenceInMinutes } from "date-fns"
import { toast } from "@/hooks/use-toast"

function getDeviceIcon(userAgent: string) {
  const ua = userAgent.toLowerCase()
  if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
    return <Smartphone className="w-4 h-4" />
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return <Tablet className="w-4 h-4" />
  }
  return <Monitor className="w-4 h-4" />
}

function getBrowserName(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome'
  if (ua.includes('firefox')) return 'Firefox'
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari'
  if (ua.includes('edg')) return 'Edge'
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera'
  return 'Browser'
}

function getOSName(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('mac os') || ua.includes('macintosh')) return 'macOS'
  if (ua.includes('linux')) return 'Linux'
  if (ua.includes('android')) return 'Android'
  if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS'
  return 'Unknown'
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return '< 1m'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h`
  return `${minutes}m`
}

function formatSessionDuration(startedAt: string, lastActivity: string): string {
  const start = new Date(startedAt)
  const last = new Date(lastActivity)
  const seconds = differenceInSeconds(last, start)
  return formatDuration(seconds)
}

// Check if session is active (last_activity within 5 minutes)
const SESSION_ACTIVE_THRESHOLD_MINUTES = 5
function isSessionActive(session: UserSession): boolean {
  const lastActivity = new Date(session.last_activity)
  const minutesAgo = differenceInMinutes(new Date(), lastActivity)
  return minutesAgo < SESSION_ACTIVE_THRESHOLD_MINUTES
}

export default function SessionsHistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  })
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('homa_session_id') : null

  const loadSessions = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const result = await sessionsService.getSessionHistory({
        page,
        limit: 20,
        start_date: startDate || undefined,
        end_date: endDate || undefined
      })
      setSessions(result.sessions)
      setPagination(result.pagination)
    } catch (error) {
      console.error('Failed to load sessions:', error)
      toast({
        title: "Failed to load sessions",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    loadSessions(1)
  }, []) // Initial load

  const handleFilter = () => {
    loadSessions(1)
  }

  const handleClearFilter = () => {
    setStartDate("")
    setEndDate("")
    // Load immediately with cleared filters
    setTimeout(() => loadSessions(1), 0)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      loadSessions(newPage)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Fetch all data for export
      let allSessions: UserSession[] = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        const result = await sessionsService.getSessionHistory({
          page,
          limit: 100,
          start_date: startDate || undefined,
          end_date: endDate || undefined
        })
        allSessions = [...allSessions, ...result.sessions]
        hasMore = page < result.pagination.total_pages
        page++
      }

      // Generate CSV
      const headers = ['Started At', 'Last Activity', 'Duration', 'IP Address', 'Browser', 'OS']
      const rows = allSessions.map(session => [
        format(new Date(session.started_at), 'yyyy-MM-dd HH:mm:ss'),
        format(new Date(session.last_activity), 'yyyy-MM-dd HH:mm:ss'),
        formatSessionDuration(session.started_at, session.last_activity),
        session.ip_address,
        getBrowserName(session.user_agent),
        getOSName(session.user_agent)
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `sessions_${format(new Date(), 'yyyy-MM-dd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({ title: `Exported ${allSessions.length} sessions` })
    } catch (error) {
      console.error('Export failed:', error)
      toast({
        title: "Export failed",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const isCurrentSession = (session: UserSession) => session.session_id === currentSessionId

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Session History</h1>
              <p className="text-sm text-muted-foreground">
                View all your login sessions
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export to Excel
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleFilter} className="gap-2">
                  <Search className="w-4 h-4" />
                  Filter
                </Button>
                {(startDate || endDate) && (
                  <Button variant="ghost" onClick={handleClearFilter}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Sessions
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                {pagination.total} total
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No sessions found
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const sessionIsActive = isSessionActive(session)
                  return (
                  <div
                    key={session.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2.5 rounded-lg shrink-0 bg-muted">
                      {getDeviceIcon(session.user_agent)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">
                          {getBrowserName(session.user_agent)} on {getOSName(session.user_agent)}
                        </p>
                        {sessionIsActive && (
                          <CustomBadge variant="green" className="text-[10px]">
                            Active
                          </CustomBadge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">{session.ip_address}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 shrink-0" />
                          {format(new Date(session.started_at), "MMM d, HH:mm")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer className="w-3 h-3 shrink-0" />
                          {formatSessionDuration(session.started_at, session.last_activity)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" />
                          {formatDistanceToNow(new Date(session.last_activity), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.total_pages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || isLoading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.total_pages || isLoading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

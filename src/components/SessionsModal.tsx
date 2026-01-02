'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { CustomBadge } from '@/components/ui/custom-badge'
import { sessionsService, UserSession, DailyActivity } from '@/services/sessions.service'
import { Monitor, Smartphone, Tablet, Globe, Clock, X, Loader2, Timer } from 'lucide-react'
import { formatDistanceToNow, format, differenceInMinutes } from 'date-fns'

interface SessionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

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

// Format seconds to human readable format (e.g., "2h 30m" or "45m")
function formatDuration(seconds: number): string {
  if (seconds < 60) return 'Less than 1 minute'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${minutes}m`
  }
}

// Check if session is active (last_activity within 5 minutes)
const SESSION_ACTIVE_THRESHOLD_MINUTES = 5
function isSessionActive(session: UserSession): boolean {
  const lastActivity = new Date(session.last_activity)
  const minutesAgo = differenceInMinutes(new Date(), lastActivity)
  return minutesAgo < SESSION_ACTIVE_THRESHOLD_MINUTES
}

export function SessionsModal({ open, onOpenChange }: SessionsModalProps) {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [todayActivity, setTodayActivity] = useState<DailyActivity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [terminatingId, setTerminatingId] = useState<number | null>(null)
  const [isTerminatingAll, setIsTerminatingAll] = useState(false)
  const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('homa_session_id') : null

  useEffect(() => {
    if (open) {
      loadSessions()
      loadTodayActivity()
    }
  }, [open])

  const loadSessions = async () => {
    setIsLoading(true)
    try {
      const sessionsData = await sessionsService.getActiveSessions()
      setSessions(sessionsData || [])
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTodayActivity = async () => {
    try {
      const activity = await sessionsService.getTodayActivity()
      setTodayActivity(activity)
    } catch (error) {
      console.error('Failed to load today activity:', error)
    }
  }

  const handleTerminate = async (id: number) => {
    setTerminatingId(id)
    try {
      await sessionsService.terminateSession(id)
      setSessions(sessions.filter(s => s.id !== id))
    } catch (error) {
      console.error('Failed to terminate session:', error)
    } finally {
      setTerminatingId(null)
    }
  }

  const handleTerminateAll = async () => {
    if (!currentSessionId) return
    setIsTerminatingAll(true)
    try {
      await sessionsService.terminateAllOtherSessions(currentSessionId)
      // Only keep the current session
      setSessions(sessions.filter(s => s.session_id === currentSessionId))
    } catch (error) {
      console.error('Failed to terminate all sessions:', error)
    } finally {
      setIsTerminatingAll(false)
    }
  }

  const isCurrentSession = (session: UserSession) => session.session_id === currentSessionId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Active Sessions</DialogTitle>
          <DialogDescription>
            Manage your active sessions across devices
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Today's Activity */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Timer className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Today's Activity</p>
                <p className="text-xs text-muted-foreground">Total time active today</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                {todayActivity ? formatDuration(todayActivity.total_active_seconds) : '0m'}
              </p>
              {todayActivity && (
                <p className="text-xs text-muted-foreground">
                  {todayActivity.session_count} session{todayActivity.session_count !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Header with terminate all button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {sessions.length} active session{sessions.length !== 1 ? 's' : ''}
            </p>
            {sessions.length > 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleTerminateAll}
                disabled={isTerminatingAll}
              >
                {isTerminatingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                End All Other
              </Button>
            )}
          </div>

          <ScrollArea className="max-h-[350px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active sessions
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 rounded-lg border ${
                      isCurrentSession(session)
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          {getDeviceIcon(session.user_agent)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {getBrowserName(session.user_agent)} on {getOSName(session.user_agent)}
                            </p>
                            {isCurrentSession(session) && (
                              <CustomBadge variant="green" className="text-xs">
                                Current
                              </CustomBadge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe className="w-3 h-3" />
                            <span>{session.ip_address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              Started {formatDistanceToNow(new Date(session.started_at), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last active: {format(new Date(session.last_activity), 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                      </div>
                      {!isCurrentSession(session) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleTerminate(session.id)}
                          disabled={terminatingId === session.id}
                        >
                          {terminatingId === session.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SessionsModal

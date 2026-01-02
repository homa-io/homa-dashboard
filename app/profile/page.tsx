"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomBadge } from "@/components/ui/custom-badge"
import { PasswordModal } from "@/components/PasswordModal"
import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMediaUrl } from "@/services/api-client"
import {
  User,
  Mail,
  Calendar,
  Shield,
  Building2,
  Clock,
  Sun,
  Moon,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Key,
  Pencil,
  Check,
  X,
  BarChart3,
  ChevronRight,
  Timer
} from "lucide-react"
import { useDarkMode } from "@/hooks/useDarkMode"
import { sessionsService, DailyActivity, UserSession } from "@/services/sessions.service"
import { departmentService } from "@/services/department.service"
import { authService } from "@/services/auth.service"
import { useAuth } from "@/contexts/AuthContext"
import { format, formatDistanceToNow, differenceInSeconds, differenceInMinutes } from "date-fns"
import { toast } from "@/hooks/use-toast"
import type { Department } from "@/types/department.types"

interface ProfileFormData {
  name: string
  last_name: string
  display_name: string
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

export default function ProfilePage() {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { user, refreshUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [todayActivity, setTodayActivity] = useState<DailyActivity | null>(null)
  const [isLoadingActivity, setIsLoadingActivity] = useState(true)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true)
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('homa_session_id') : null

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    last_name: "",
    display_name: ""
  })

  const [originalData, setOriginalData] = useState<ProfileFormData>({
    name: "",
    last_name: "",
    display_name: ""
  })

  useEffect(() => {
    if (user) {
      const data: ProfileFormData = {
        name: user.name || "",
        last_name: user.last_name || "",
        display_name: user.display_name || ""
      }
      setOriginalData(data)
      setFormData(data)
      if (user.avatar) setAvatarUrl(user.avatar)
    }
  }, [user])

  useEffect(() => {
    const loadTodayActivity = async () => {
      try {
        const activity = await sessionsService.getTodayActivity()
        setTodayActivity(activity)
      } catch (error) {
        console.error('Failed to load today activity:', error)
      } finally {
        setIsLoadingActivity(false)
      }
    }
    loadTodayActivity()
  }, [])

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await sessionsService.getActiveSessions()
        setSessions(data || [])
      } catch (error) {
        console.error('Failed to load sessions:', error)
      } finally {
        setIsLoadingSessions(false)
      }
    }
    loadSessions()
  }, [])

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await departmentService.getMyDepartments()
        setDepartments(data)
      } catch (error) {
        console.error('Failed to load departments:', error)
      } finally {
        setIsLoadingDepartments(false)
      }
    }
    loadDepartments()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await authService.updateProfile({
        name: `${formData.name} ${formData.last_name}`.trim(),
      })
      await refreshUser()
      setOriginalData(formData)
      setIsEditing(false)
      toast({ title: "Profile updated successfully" })
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error?.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  const handleAvatarChange = async (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl)
    await refreshUser()
  }

  const getDisplayName = () => {
    if (formData.display_name) return formData.display_name
    return `${formData.name} ${formData.last_name}`.trim() || 'User'
  }

  const getInitials = () => {
    const name = getDisplayName()
    if (!name || name === 'User') return ''
    const parts = name.split(' ').filter(p => p)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return parts[0]?.substring(0, 2).toUpperCase() || ''
  }

  const getUserRole = () => {
    if (!user) return 'User'
    switch (user.type) {
      case 'administrator': return 'Administrator'
      case 'agent': return 'Agent'
      case 'bot': return 'Bot'
      default: return user.type || 'User'
    }
  }

  const isCurrentSession = (session: UserSession) => session.session_id === currentSessionId

  // Show only latest 5 sessions
  const displayedSessions = sessions.slice(0, 5)

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <Avatar className="w-20 h-20 ring-4 ring-background shadow-xl">
                  {avatarUrl && <AvatarImage src={getMediaUrl(avatarUrl)} alt={getDisplayName()} />}
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <ProfileAvatarUpload
                  currentAvatar={avatarUrl}
                  onAvatarChange={handleAvatarChange}
                  userName={getDisplayName()}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold truncate">{getDisplayName()}</h1>
                <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <CustomBadge variant="blue">
                    <Shield className="w-3 h-3 mr-1" />
                    {getUserRole()}
                  </CustomBadge>
                  {!isLoadingDepartments && departments.slice(0, 2).map((dept) => (
                    <CustomBadge key={dept.id} variant="gray">
                      <Building2 className="w-3 h-3 mr-1" />
                      {dept.name}
                    </CustomBadge>
                  ))}
                  {!isLoadingDepartments && departments.length > 2 && (
                    <CustomBadge variant="gray">+{departments.length - 2}</CustomBadge>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-6 self-start sm:self-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {isLoadingActivity ? '-' : (todayActivity ? formatDuration(todayActivity.total_active_seconds) : '0m')}
                  </p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter first name"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">{formData.name || '-'}</div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                {isEditing ? (
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Enter last name"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">{formData.last_name || '-'}</div>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Display Name</label>
                {isEditing ? (
                  <Input
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="How you want to be called"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">{formData.display_name || '-'}</div>
                )}
                <p className="text-xs text-muted-foreground">This name will be displayed to others</p>
              </div>
            </div>

            {/* Member Info */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Member since {user?.created_at ? format(new Date(user.created_at), "MMMM d, yyyy") : '-'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Active Sessions
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  ({sessions.length} active)
                </span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push('/profile/sessions')}>
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSessions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active sessions
              </div>
            ) : (
              <div className="space-y-3">
                {displayedSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      isCurrentSession(session)
                        ? 'border-primary/50 bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg shrink-0 ${isCurrentSession(session) ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                      {getDeviceIcon(session.user_agent)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">
                          {getBrowserName(session.user_agent)} on {getOSName(session.user_agent)}
                        </p>
                        {isCurrentSession(session) && (
                          <CustomBadge variant="green" className="text-[10px]">
                            This device
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
                ))}
                {sessions.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/profile/sessions')}>
                      View {sessions.length - 5} more sessions
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Theme Setting */}
            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-medium text-sm">Appearance</p>
                  <p className="text-xs text-muted-foreground">
                    Currently using {isDarkMode ? 'dark' : 'light'} mode
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={toggleDarkMode}>
                Switch to {isDarkMode ? 'Light' : 'Dark'}
              </Button>
            </div>

            {/* Password Setting */}
            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Password</p>
                  <p className="text-xs text-muted-foreground">Update your password</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </Button>
            </div>

            {/* Activity Stats */}
            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Activity Statistics</p>
                  <p className="text-xs text-muted-foreground">View detailed performance metrics</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push('/profile/statistic')}>
                View Stats
              </Button>
            </div>

            {/* Departments */}
            {!isLoadingDepartments && departments.length > 0 && (
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Departments</p>
                    <p className="text-xs text-muted-foreground">
                      Assigned to {departments.length} department{departments.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <CustomBadge key={dept.id} variant="gray">
                      {dept.name}
                    </CustomBadge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PasswordModal
        open={showPasswordModal}
        onOpenChange={setShowPasswordModal}
        onSave={() => toast({ title: "Password changed successfully" })}
      />
    </div>
  )
}

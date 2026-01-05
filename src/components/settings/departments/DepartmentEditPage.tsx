"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowLeft, Bot, User, Loader2, Save, Building2, Plus, Search, Check, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Department, DepartmentUser, DepartmentStatus } from "@/types/department.types"
import type { AIAgent } from "@/types/ai-agent.types"
import { departmentService } from "@/services/department.service"
import { aiAgentService } from "@/services/ai-agent.service"
import { SortableUserItem } from "./SortableUserItem"
import { SettingsPageWrapper } from "@/components/settings/SettingsPageWrapper"

interface DepartmentEditPageProps {
  departmentId: number
}

export function DepartmentEditPage({ departmentId }: DepartmentEditPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [department, setDepartment] = useState<Department | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<DepartmentStatus>("active")
  const [selectedAIAgentId, setSelectedAIAgentId] = useState<string>("none")
  const [assignedUsers, setAssignedUsers] = useState<DepartmentUser[]>([])
  const [availableUsers, setAvailableUsers] = useState<DepartmentUser[]>([])
  const [availableAIAgents, setAvailableAIAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingAIAgents, setLoadingAIAgents] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Users not yet assigned (available to add)
  const unassignedUsers = useMemo(() => {
    const assignedIds = new Set(assignedUsers.map(u => u.id))
    return availableUsers.filter(u => !assignedIds.has(u.id))
  }, [availableUsers, assignedUsers])

  // Filtered users based on search
  const filteredUnassignedUsers = useMemo(() => {
    if (!userSearch.trim()) return unassignedUsers
    const search = userSearch.toLowerCase()
    return unassignedUsers.filter(u =>
      (u.display_name?.toLowerCase().includes(search)) ||
      (u.name?.toLowerCase().includes(search)) ||
      (u.last_name?.toLowerCase().includes(search)) ||
      (u.email?.toLowerCase().includes(search))
    )
  }, [unassignedUsers, userSearch])

  useEffect(() => {
    loadDepartment()
    loadUsers()
    loadAIAgents()
  }, [departmentId])

  const loadDepartment = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await departmentService.get(departmentId)
      setDepartment(data)
      setName(data.name)
      setDescription(data.description || "")
      setStatus(data.status)
      setSelectedAIAgentId(data.ai_agent_id ? data.ai_agent_id.toString() : "none")
      // Set assigned users in order (they should come with priority from backend)
      const users = data.users || []
      setAssignedUsers(Array.isArray(users) ? users : [])
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to load department")
      console.error("Error loading department:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      setLoadingUsers(true)
      const users = await departmentService.getAssignableUsers()
      setAvailableUsers(Array.isArray(users) ? users : [])
    } catch (err) {
      console.error("Failed to load users:", err)
      setAvailableUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }

  const loadAIAgents = async () => {
    try {
      setLoadingAIAgents(true)
      const response = await aiAgentService.list({ status: "active" })
      setAvailableAIAgents(response.data || [])
    } catch (err) {
      console.error("Failed to load AI agents:", err)
      setAvailableAIAgents([])
    } finally {
      setLoadingAIAgents(false)
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setSaveError("Department name is required")
      return
    }

    try {
      setSaving(true)
      setSaveError(null)
      // Send user IDs in order (priority is determined by array index)
      await departmentService.update(departmentId, {
        name: name.trim(),
        description: description.trim(),
        status,
        user_ids: assignedUsers.map(u => u.id),
        ai_agent_id: selectedAIAgentId && selectedAIAgentId !== "none" ? parseInt(selectedAIAgentId) : null,
      })
      toast({
        title: "Changes saved",
        description: "Department has been updated successfully.",
      })
    } catch (err) {
      const error = err as Error
      setSaveError(error.message || "Failed to save department")
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setAssignedUsers((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addUser = (user: DepartmentUser) => {
    setAssignedUsers(prev => [...prev, user])
    setUserSearch("")
  }

  const removeUser = (userId: string) => {
    setAssignedUsers(prev => prev.filter(u => u.id !== userId))
  }

  if (loading) {
    return (
      <SettingsPageWrapper activeTab="departments">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </SettingsPageWrapper>
    )
  }

  if (error) {
    return (
      <SettingsPageWrapper activeTab="departments">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">{error}</div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/settings/departments")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Departments
              </Button>
              <Button onClick={loadDepartment}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </SettingsPageWrapper>
    )
  }

  return (
    <SettingsPageWrapper activeTab="departments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/settings/departments">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Edit Department</h1>
                <p className="text-sm text-muted-foreground">
                  Update department details and assigned users
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-14 sm:pl-0">
            <Button
              variant="outline"
              onClick={() => router.push("/settings/departments")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {saveError && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            {saveError}
          </div>
        )}

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Department Details</CardTitle>
            <CardDescription>
              Basic information about this department.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sales, Support, Technical"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value: DepartmentStatus) => setStatus(value)}
                  disabled={saving}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this department's responsibilities..."
                rows={3}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-agent">AI Agent</Label>
              {loadingAIAgents ? (
                <div className="flex items-center justify-center h-10 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Select value={selectedAIAgentId} onValueChange={setSelectedAIAgentId} disabled={saving}>
                  <SelectTrigger id="ai-agent">
                    <SelectValue placeholder="No AI agent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-muted-foreground">No AI agent</span>
                    </SelectItem>
                    {availableAIAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          {agent.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                Assign an AI agent to automatically handle conversations in this department
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Users Card - Assigned Users with Drag & Drop */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Users & Bots</CardTitle>
            <CardDescription>
              Drag to reorder priority. Users at the top have higher priority for conversation assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Assigned Users - Sortable */}
                {assignedUsers.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={assignedUsers.map(u => u.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {assignedUsers.map((user, index) => (
                          <SortableUserItem
                            key={user.id}
                            user={user}
                            index={index}
                            onRemove={removeUser}
                            disabled={saving}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                    No users assigned. Click &quot;Add User&quot; to assign users to this department.
                  </div>
                )}

                {/* Footer with Add User button */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    {assignedUsers.length} user{assignedUsers.length !== 1 ? 's' : ''} assigned
                  </span>
                  <div className="flex items-center gap-2">
                    {assignedUsers.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAssignedUsers([])}
                        disabled={saving}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </Button>
                    )}
                    <Popover open={addUserOpen} onOpenChange={(open) => {
                      setAddUserOpen(open)
                      if (open) {
                        setUserSearch("")
                        setTimeout(() => searchInputRef.current?.focus(), 100)
                      }
                    }}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={saving || unassignedUsers.length === 0}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="end">
                        <div className="p-3 border-b">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              ref={searchInputRef}
                              placeholder="Search users..."
                              value={userSearch}
                              onChange={(e) => setUserSearch(e.target.value)}
                              className="pl-9 h-9"
                            />
                          </div>
                        </div>
                        <ScrollArea className="max-h-[280px]">
                          {filteredUnassignedUsers.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              {userSearch ? "No users found" : "No users available"}
                            </div>
                          ) : (
                            <div className="p-1">
                              {filteredUnassignedUsers.map((user) => (
                                <button
                                  key={user.id}
                                  onClick={() => addUser(user)}
                                  className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-muted transition-colors text-left"
                                >
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    {user.type === 'bot' ? (
                                      <Bot className="h-4 w-4 text-blue-500" />
                                    ) : (
                                      <User className="h-4 w-4 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {user.display_name || `${user.name} ${user.last_name}`}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {user.email}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                                    {user.type}
                                  </Badge>
                                </button>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </SettingsPageWrapper>
  )
}

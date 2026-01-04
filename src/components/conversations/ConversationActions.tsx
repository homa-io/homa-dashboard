"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TagPicker } from "@/components/ui/tag-picker"
import { CustomBadge } from "@/components/ui/custom-badge"
import { Check, ChevronsUpDown, X, Plus, ChevronDown, ChevronRight, Settings, AlertCircle, CircleDot, Building, Users, Tag, Archive, XCircle, Circle, ArrowUp, ArrowDown, Clock, Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMediaUrl } from "@/services/api-client"

interface ConversationActionsProps {
  currentPriority: string
  currentStatus: string
  currentDepartment: string
  currentAssignees: string[]
  currentTags: string[]
  availableDepartments: string[]
  availableTags?: string[]
  availableUsers: Array<{ id: string; name: string; last_name: string; display_name: string; email: string; avatar: string | null }>
  isExpanded: boolean
  onToggle: () => void
  onPriorityChange: (priority: string) => void
  onStatusChange: (status: string) => void
  onDepartmentChange: (department: string) => void
  onAssigneesChange: (assignees: string[]) => void
  onTagsChange: (tags: string[]) => void
}

export function ConversationActions({
  currentPriority,
  currentStatus,
  currentDepartment,
  currentAssignees,
  currentTags,
  availableDepartments,
  availableTags = [],
  availableUsers,
  isExpanded,
  onToggle,
  onPriorityChange,
  onStatusChange,
  onDepartmentChange,
  onAssigneesChange,
  onTagsChange,
}: ConversationActionsProps) {
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false)
  const [tempAssignees, setTempAssignees] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Circle className="w-3 h-3" />
      case 'wait_for_agent': return <Clock className="w-3 h-3" />
      case 'in_progress': return <Loader className="w-3 h-3" />
      case 'wait_for_user': return <Clock className="w-3 h-3" />
      case 'on_hold': return <Clock className="w-3 h-3" />
      case 'resolved': return <Check className="w-3 h-3" />
      case 'closed': return <XCircle className="w-3 h-3" />
      case 'unresolved': return <AlertCircle className="w-3 h-3" />
      case 'spam': return <Archive className="w-3 h-3" />
      default: return <Circle className="w-3 h-3" />
    }
  }

  const getInitials = (name: string, lastName: string) => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }


  const priorities = [
    { value: "low", label: "Low Priority", variant: "gray" },
    { value: "medium", label: "Medium Priority", variant: "yellow" },
    { value: "high", label: "High Priority", variant: "red" },
    { value: "urgent", label: "Urgent", variant: "red-dot" },
  ]

  const statuses = [
    { value: "new", label: "New", variant: "blue" },
    { value: "wait_for_agent", label: "Wait for Agent", variant: "yellow" },
    { value: "in_progress", label: "In Progress", variant: "blue" },
    { value: "wait_for_user", label: "Wait for User", variant: "green" },
    { value: "on_hold", label: "On Hold", variant: "yellow" },
    { value: "resolved", label: "Resolved", variant: "green" },
    { value: "closed", label: "Closed", variant: "gray" },
    { value: "unresolved", label: "Unresolved", variant: "red" },
    { value: "spam", label: "Spam", variant: "gray" },
  ]

  const toggleTempAssignee = useCallback((userId: string) => {
    setTempAssignees(prev => {
      const isAssigned = prev.includes(userId)
      if (isAssigned) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }, [])

  const handleOpenAssigneeModal = useCallback(() => {
    setTempAssignees([...currentAssignees])
    setSearchValue("")
    setIsAssigneeOpen(true)
  }, [currentAssignees])

  const handleSaveAssignees = useCallback(() => {
    onAssigneesChange(tempAssignees)
    setIsAssigneeOpen(false)
  }, [tempAssignees, onAssigneesChange])

  const handleCancelAssignees = useCallback(() => {
    setTempAssignees([...currentAssignees])
    setIsAssigneeOpen(false)
  }, [currentAssignees])

  const toggleAssignee = useCallback((userId: string) => {
    const isAssigned = currentAssignees.includes(userId)
    if (isAssigned) {
      onAssigneesChange(currentAssignees.filter(id => id !== userId))
    } else {
      onAssigneesChange([...currentAssignees, userId])
    }
  }, [currentAssignees, onAssigneesChange])


  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Conversation Actions
          </h3>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="p-4 space-y-6">
        {/* Priority */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Priority
          </label>
          <Select value={currentPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="h-9">
              <SelectValue>
                <div className="flex items-center w-full">
                  <CustomBadge variant={priorities.find(p => p.value === currentPriority)?.variant as "gray" | "yellow" | "red" | "red-dot"} className="w-full justify-center">
                    {priorities.find(p => p.value === currentPriority)?.label}
                  </CustomBadge>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value} className="py-3">
                  <div className="flex items-center w-full">
                    <CustomBadge variant={priority.variant as "gray" | "yellow" | "red" | "red-dot"} className="w-full justify-center">
                      {priority.label}
                    </CustomBadge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <CircleDot className="w-3 h-3" />
            Status
          </label>
          <Select value={currentStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9">
              <SelectValue>
                <div className="flex items-center w-full">
                  <CustomBadge variant={statuses.find(s => s.value === currentStatus)?.variant as "blue" | "green" | "yellow" | "gray"} className="w-full justify-center gap-1">
                    {getStatusIcon(currentStatus)}
                    {statuses.find(s => s.value === currentStatus)?.label}
                  </CustomBadge>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value} className="py-3">
                  <div className="flex items-center w-full">
                    <CustomBadge variant={status.variant as "blue" | "green" | "yellow" | "gray"} className="w-full justify-center gap-1">
                      {getStatusIcon(status.value)}
                      {status.label}
                    </CustomBadge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Department */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Building className="w-3 h-3" />
            Department
          </label>
          <Select value={currentDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  <Building className="w-4 h-4 mr-2 inline" />
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assignees */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Users className="w-3 h-3" />
            Assignees
          </label>
          <div className="space-y-2">
            {currentAssignees.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {currentAssignees.map((userId) => {
                  const user = availableUsers.find(u => u.id === userId)
                  return user ? (
                    <CustomBadge key={userId} variant="blue" className="text-sm h-8 px-3">
                      {user.display_name}
                      <button onClick={() => toggleAssignee(userId)} className="ml-2 hover:opacity-70">
                        <X className="w-4 h-4" />
                      </button>
                    </CustomBadge>
                  ) : null
                })}
              </div>
            )}
            <Dialog open={isAssigneeOpen} onOpenChange={setIsAssigneeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-full text-sm" onClick={handleOpenAssigneeModal}>
                  <Users className="w-4 h-4 mr-2" />
                  Add Assignee
                </Button>
              </DialogTrigger>
              <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Assign Team Members</DialogTitle>
                  <DialogDescription>
                    Select one or more team members to assign to this conversation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center border border-input rounded-md px-3 py-2">
                    <input
                      type="text"
                      placeholder="Search team members..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto border border-border rounded-md p-2">
                    {availableUsers
                      .filter(user =>
                        searchValue === "" ||
                        user.display_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchValue.toLowerCase())
                      )
                      .map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center px-2 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                      >
                        <input
                          type="checkbox"
                          checked={tempAssignees.includes(user.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            toggleTempAssignee(user.id)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-3 h-4 w-4 cursor-pointer"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          {user.avatar ? (
                            <img
                              src={getMediaUrl(user.avatar)}
                              alt={user.display_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                              {getInitials(user.name, user.last_name)}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-sm">{user.display_name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                    {availableUsers.filter(user =>
                      searchValue === "" ||
                      user.display_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchValue.toLowerCase())
                    ).length === 0 && (
                      <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                        No team members found.
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={handleCancelAssignees}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveAssignees}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            Tags
          </label>
          <TagPicker
            tags={currentTags}
            onTagsChange={onTagsChange}
            placeholder="Add tags..."
            suggestions={availableTags}
            allowCreate={true}
          />
        </div>

        </div>
      </div>
    </div>
  )
}
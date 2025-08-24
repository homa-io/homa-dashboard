"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TagInput } from "@/components/ui/tag-input"
import { CustomBadge } from "@/components/ui/custom-badge"
import { Check, ChevronsUpDown, Workflow, X, Plus, ChevronDown, ChevronRight, Settings, AlertCircle, CircleDot, Building, Users, Tag, Save, Archive, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TicketActionsProps {
  currentPriority: string
  currentStatus: string
  currentDepartment: string
  currentAssignees: string[]
  currentTags: string[]
  isExpanded: boolean
  onToggle: () => void
  onPriorityChange: (priority: string) => void
  onStatusChange: (status: string) => void
  onDepartmentChange: (department: string) => void
  onAssigneesChange: (assignees: string[]) => void
  onTagsChange: (tags: string[]) => void
  hasChanges?: boolean
  onSave?: () => void
}

export function TicketActions({
  currentPriority,
  currentStatus,
  currentDepartment,
  currentAssignees,
  currentTags,
  isExpanded,
  onToggle,
  onPriorityChange,
  onStatusChange,
  onDepartmentChange,
  onAssigneesChange,
  onTagsChange,
  hasChanges = false,
  onSave,
}: TicketActionsProps) {
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false)
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false)

  // Mock data
  const users = [
    { id: "1", name: "John Doe", email: "john@example.com", avatar: "JD" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", avatar: "JS" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", avatar: "MJ" },
    { id: "4", name: "Sarah Wilson", email: "sarah@example.com", avatar: "SW" },
  ]

  const workflows = [
    { id: "1", name: "Standard Support Flow", description: "Default customer support workflow" },
    { id: "2", name: "Escalation Process", description: "For high priority issues" },
    { id: "3", name: "Technical Review", description: "For technical support tickets" },
    { id: "4", name: "Billing Inquiry", description: "For billing and payment issues" },
  ]

  const priorities = [
    { value: "low", label: "Low Priority", variant: "gray" },
    { value: "medium", label: "Medium Priority", variant: "yellow" },
    { value: "high", label: "High Priority", variant: "red" },
    { value: "urgent", label: "Urgent", variant: "red-dot" },
  ]

  const statuses = [
    { value: "new", label: "New", variant: "blue" },
    { value: "open", label: "Open", variant: "green" },
    { value: "pending", label: "Pending", variant: "yellow" },
    { value: "resolved", label: "Resolved", variant: "green" },
    { value: "closed", label: "Closed", variant: "gray" },
  ]

  const departments = [
    "Sales Department",
    "Support Department", 
    "Marketing Department",
    "Technical Department",
    "Billing Department"
  ]

  const toggleAssignee = (userId: string) => {
    const isAssigned = currentAssignees.includes(userId)
    if (isAssigned) {
      onAssigneesChange(currentAssignees.filter(id => id !== userId))
    } else {
      onAssigneesChange([...currentAssignees, userId])
    }
  }

  const WorkflowModal = () => (
    <Dialog open={isWorkflowOpen} onOpenChange={setIsWorkflowOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-full text-sm">
          <Workflow className="w-4 h-4 mr-2" />
          Assign to Workflow
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign to Workflow</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Command>
            <CommandInput placeholder="Search workflows..." />
            <CommandList>
              <CommandEmpty>No workflows found.</CommandEmpty>
              <CommandGroup>
                {workflows.map((workflow) => (
                  <CommandItem
                    key={workflow.id}
                    onSelect={() => {
                      setIsWorkflowOpen(false)
                      // Handle workflow assignment
                    }}
                    className="cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-sm">{workflow.name}</div>
                      <div className="text-xs text-muted-foreground">{workflow.description}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )

  const AssigneeModal = () => (
    <Dialog open={isAssigneeOpen} onOpenChange={setIsAssigneeOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-full text-sm">
          <Users className="w-4 h-4 mr-2" />
          Add Assignee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Team Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Command>
            <CommandInput placeholder="Search team members..." />
            <CommandList>
              <CommandEmpty>No team members found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => toggleAssignee(user.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentAssignees.includes(user.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Ticket Actions
          </h3>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
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
                  <CustomBadge variant={statuses.find(s => s.value === currentStatus)?.variant as "blue" | "green" | "yellow" | "gray"} className="w-full justify-center">
                    {statuses.find(s => s.value === currentStatus)?.label}
                  </CustomBadge>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value} className="py-3">
                  <div className="flex items-center w-full">
                    <CustomBadge variant={status.variant as "blue" | "green" | "yellow" | "gray"} className="w-full justify-center">
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
              {departments.map((dept) => (
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
                  const user = users.find(u => u.id === userId)
                  return user ? (
                    <CustomBadge key={userId} variant="blue" className="text-sm h-8 px-3">
                      {user.name}
                      <button onClick={() => toggleAssignee(userId)} className="ml-2 hover:opacity-70">
                        <X className="w-4 h-4" />
                      </button>
                    </CustomBadge>
                  ) : null
                })}
              </div>
            )}
            <AssigneeModal />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            Tags
          </label>
          <TagInput
            tags={currentTags}
            onTagsChange={onTagsChange}
            placeholder="Add tags..."
          />
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="pt-6 border-t border-border">
            <Button onClick={onSave} className="w-full h-10 text-sm font-medium">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-6 border-t border-border">
          <WorkflowModal />
          <div className="grid grid-cols-2 gap-3">
            <Button variant="destructive" size="sm" className="h-9 text-sm">
              <XCircle className="w-4 h-4 mr-2" />
              Close Ticket
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-sm">
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
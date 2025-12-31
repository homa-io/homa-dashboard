"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Loader2 } from "lucide-react"
import type { Department, DepartmentCreateRequest, DepartmentUser } from "@/types/department.types"
import { departmentService } from "@/services/department.service"

interface DepartmentFormProps {
  department: Department | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: DepartmentCreateRequest) => Promise<void>
}

export function DepartmentForm({ department, isOpen, onClose, onSave }: DepartmentFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [availableUsers, setAvailableUsers] = useState<DepartmentUser[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadUsers()
      if (department) {
        setName(department.name)
        setDescription(department.description || "")
        setSelectedUserIds(department.users?.map(u => u.id) || [])
      } else {
        setName("")
        setDescription("")
        setSelectedUserIds([])
      }
      setError(null)
    }
  }, [isOpen, department])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Department name is required")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await onSave({
        name: name.trim(),
        description: description.trim(),
        user_ids: selectedUserIds,
      })
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to save department")
    } finally {
      setLoading(false)
    }
  }

  const toggleUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const isEditing = !!department

  return (
    <Dialog open={isOpen} onOpenChange={() => !loading && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Department" : "Create Department"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update department details and assigned users."
                : "Create a new department to organize conversations and assign team members."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sales, Support, Technical"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this department's responsibilities..."
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label>Assigned Users & Bots</Label>
              <p className="text-xs text-muted-foreground">
                Select users and bots that will handle conversations for this department.
              </p>
              {loadingUsers ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : availableUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No users available</p>
              ) : (
                <ScrollArea className="h-[200px] rounded-md border p-3">
                  <div className="space-y-2">
                    {availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleUser(user.id)}
                      >
                        <Checkbox
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={() => toggleUser(user.id)}
                        />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {user.type === 'bot' ? (
                            <Bot className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate">
                            {user.display_name || `${user.name} ${user.last_name}`}
                          </span>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {user.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              {selectedUserIds.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

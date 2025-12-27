"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Key } from "lucide-react"
import { getUser, updateUser } from "@/services/users"
import { toast } from "@/hooks/use-toast"
import type { User, UserType } from "@/types/user"
import { AvatarUpload } from "./AvatarUpload"
import { generatePassword } from "@/lib/password-generator"

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
  onSuccess: () => void
}

export function EditUserModal({ open, onOpenChange, userId, onSuccess }: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    display_name: "",
    email: "",
    password: "",
    type: "agent" as UserType,
    avatar: "",
  })

  useEffect(() => {
    if (open && userId) {
      fetchUser()
    }
  }, [open, userId])

  const fetchUser = async () => {
    if (!userId) return

    setIsFetching(true)
    try {
      const response = await getUser(userId)
      if (response.success && response.data) {
        setUser(response.data)
        setFormData({
          name: response.data.name,
          last_name: response.data.last_name,
          display_name: response.data.display_name,
          email: response.data.email,
          password: "",
          type: response.data.type,
          avatar: response.data.avatar || "",
        })
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) return

    setIsLoading(true)
    try {
      // Backend requires all fields, not just changed ones
      const updateData: any = {
        name: formData.name,
        last_name: formData.last_name,
        display_name: formData.display_name,
        email: formData.email,
        type: formData.type,
      }

      // Only include password if provided
      if (formData.password) {
        updateData.password = formData.password
      }

      // Include avatar (can be null to remove)
      if (formData.avatar !== (user?.avatar || "")) {
        updateData.avatar = formData.avatar || null
      }

      const response = await updateUser(userId, updateData)

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "User updated successfully",
        })
        onOpenChange(false)
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: "Failed to update user",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error updating user:", error)
      const errorMessage = error?.message || "An unexpected error occurred"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Leave password blank to keep it unchanged.
          </DialogDescription>
        </DialogHeader>
        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">First Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-last_name">Last Name</Label>
                <Input
                  id="edit-last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-display_name">Display Name</Label>
                <Input
                  id="edit-display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave blank to keep current password"
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newPassword = generatePassword()
                      setFormData({ ...formData, password: newPassword })
                      toast({
                        title: "Password Generated",
                        description: "A secure password has been generated and filled in",
                      })
                    }}
                    disabled={isLoading}
                    title="Generate secure password"
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <AvatarUpload
                currentAvatar={formData.avatar}
                onAvatarChange={(avatarUrl) => setFormData({ ...formData, avatar: avatarUrl })}
                disabled={isLoading}
                userName={formData.display_name || `${formData.name} ${formData.last_name}`}
              />
              <div className="grid gap-2">
                <Label htmlFor="edit-type">User Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as UserType })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update User"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

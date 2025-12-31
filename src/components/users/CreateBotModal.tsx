"use client"

import { useState } from "react"
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
import { Loader2, Bot } from "lucide-react"
import { createBot } from "@/services/users"
import { toast } from "@/hooks/use-toast"
import { AvatarUpload } from "./AvatarUpload"

interface CreateBotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateBotModal({ open, onOpenChange, onSuccess }: CreateBotModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    display_name: "",
    avatar: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.last_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await createBot({
        name: formData.name,
        last_name: formData.last_name,
        display_name: formData.display_name || `${formData.name} ${formData.last_name}`,
        avatar: formData.avatar || undefined,
      })

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Bot created successfully",
        })
        setFormData({
          name: "",
          last_name: "",
          display_name: "",
          avatar: "",
        })
        onOpenChange(false)
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: "Failed to create bot",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error creating bot:", error)
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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle>Create New Bot</DialogTitle>
              <DialogDescription>
                Add a new bot to the system. Bots can be assigned to departments and handle conversations.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bot-name">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bot-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Support"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bot-last_name">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bot-last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Bot"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bot-display_name">Display Name</Label>
              <Input
                id="bot-display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Support Bot (optional)"
                disabled={isLoading}
              />
            </div>
            <AvatarUpload
              currentAvatar={formData.avatar}
              onAvatarChange={(avatarUrl) => setFormData({ ...formData, avatar: avatarUrl })}
              disabled={isLoading}
              userName={formData.display_name || `${formData.name} ${formData.last_name}`}
            />
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
                  Creating...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Create Bot
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

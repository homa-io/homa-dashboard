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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Key } from "lucide-react"
import { createUser } from "@/services/users"
import { toast } from "@/hooks/use-toast"
import type { UserType } from "@/types/user"
import { AvatarUpload } from "./AvatarUpload"
import { generatePassword } from "@/lib/password-generator"

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateUserModal({ open, onOpenChange, onSuccess }: CreateUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    display_name: "",
    email: "",
    password: "",
    type: "agent" as UserType,
    avatar: "",
    language: "en",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.last_name || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await createUser({
        name: formData.name,
        last_name: formData.last_name,
        display_name: formData.display_name || `${formData.name} ${formData.last_name}`,
        email: formData.email,
        password: formData.password,
        type: formData.type,
        avatar: formData.avatar || undefined,
        language: formData.language,
      })

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "User created successfully",
        })
        setFormData({
          name: "",
          last_name: "",
          display_name: "",
          email: "",
          password: "",
          type: "agent",
          avatar: "",
          language: "en",
        })
        onOpenChange(false)
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: "Failed to create user",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error creating user:", error)
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
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Doe"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="John D. (optional)"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
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
              <Label htmlFor="type">
                User Type <span className="text-red-500">*</span>
              </Label>
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
                  <SelectItem value="bot">Bot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fa">Persian (فارسی)</SelectItem>
                  <SelectItem value="ar">Arabic (العربية)</SelectItem>
                  <SelectItem value="es">Spanish (Español)</SelectItem>
                  <SelectItem value="fr">French (Français)</SelectItem>
                  <SelectItem value="de">German (Deutsch)</SelectItem>
                  <SelectItem value="zh">Chinese (中文)</SelectItem>
                  <SelectItem value="ja">Japanese (日本語)</SelectItem>
                  <SelectItem value="ko">Korean (한국어)</SelectItem>
                  <SelectItem value="ru">Russian (Русский)</SelectItem>
                  <SelectItem value="pt">Portuguese (Português)</SelectItem>
                  <SelectItem value="tr">Turkish (Türkçe)</SelectItem>
                  <SelectItem value="it">Italian (Italiano)</SelectItem>
                  <SelectItem value="nl">Dutch (Nederlands)</SelectItem>
                  <SelectItem value="pl">Polish (Polski)</SelectItem>
                  <SelectItem value="uk">Ukrainian (Українська)</SelectItem>
                  <SelectItem value="vi">Vietnamese (Tiếng Việt)</SelectItem>
                  <SelectItem value="th">Thai (ไทย)</SelectItem>
                  <SelectItem value="id">Indonesian (Bahasa Indonesia)</SelectItem>
                  <SelectItem value="ms">Malay (Bahasa Melayu)</SelectItem>
                  <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                  <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                  <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                  <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                  <SelectItem value="ur">Urdu (اردو)</SelectItem>
                  <SelectItem value="he">Hebrew (עברית)</SelectItem>
                  <SelectItem value="el">Greek (Ελληνικά)</SelectItem>
                  <SelectItem value="cs">Czech (Čeština)</SelectItem>
                  <SelectItem value="sv">Swedish (Svenska)</SelectItem>
                  <SelectItem value="da">Danish (Dansk)</SelectItem>
                  <SelectItem value="fi">Finnish (Suomi)</SelectItem>
                  <SelectItem value="no">Norwegian (Norsk)</SelectItem>
                  <SelectItem value="hu">Hungarian (Magyar)</SelectItem>
                  <SelectItem value="ro">Romanian (Română)</SelectItem>
                  <SelectItem value="bg">Bulgarian (Български)</SelectItem>
                  <SelectItem value="hr">Croatian (Hrvatski)</SelectItem>
                  <SelectItem value="sk">Slovak (Slovenčina)</SelectItem>
                  <SelectItem value="sl">Slovenian (Slovenščina)</SelectItem>
                  <SelectItem value="sr">Serbian (Српски)</SelectItem>
                  <SelectItem value="lt">Lithuanian (Lietuvių)</SelectItem>
                  <SelectItem value="lv">Latvian (Latviešu)</SelectItem>
                  <SelectItem value="et">Estonian (Eesti)</SelectItem>
                  <SelectItem value="fil">Filipino (Tagalog)</SelectItem>
                  <SelectItem value="sw">Swahili (Kiswahili)</SelectItem>
                  <SelectItem value="af">Afrikaans</SelectItem>
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
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

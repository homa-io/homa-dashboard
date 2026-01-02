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
import { Loader2, Key, Copy, Check } from "lucide-react"
import { getUser, updateUser } from "@/services/users"
import { toast } from "@/hooks/use-toast"
import type { User, UserType } from "@/types/user"
import { AvatarUpload } from "./AvatarUpload"
import { generatePassword } from "@/lib/password-generator"

// Generate a random 12-character alphanumeric security key
function generateSecurityKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

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
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    display_name: "",
    email: "",
    password: "",
    type: "agent" as UserType,
    avatar: "",
    security_key: "",
    language: "en",
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
          security_key: response.data.security_key || "",
          language: response.data.language || "en",
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
        avatar: formData.avatar || null,
        language: formData.language,
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      // Include security_key for bot users
      if (formData.type === "bot" && formData.security_key) {
        updateData.security_key = formData.security_key
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
              {/* Hide email/password for bots - they can't login */}
              {formData.type !== "bot" && (
                <>
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
                </>
              )}
              {/* Show Bot ID and security key for bots */}
              {formData.type === "bot" && user && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-bot_id">Bot ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-bot_id"
                      value={user.id}
                      readOnly
                      disabled
                      className="flex-1 font-mono text-xs bg-muted"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(user.id)
                        toast({
                          title: "Copied",
                          description: "Bot ID copied to clipboard",
                        })
                      }}
                      title="Copy Bot ID"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this ID in the bot API: POST /api/bot/{"{bot_id}"}/conversation/{"{conversation_id}"}
                  </p>
                </div>
              )}
              {formData.type === "bot" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-security_key">Security Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-security_key"
                      value={formData.security_key}
                      onChange={(e) => setFormData({ ...formData, security_key: e.target.value })}
                      placeholder="Bot security key"
                      disabled={isLoading}
                      className="flex-1 font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(formData.security_key)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                        toast({
                          title: "Copied",
                          description: "Security key copied to clipboard",
                        })
                      }}
                      disabled={isLoading}
                      title="Copy security key"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setFormData({ ...formData, security_key: generateSecurityKey() })
                        setCopied(false)
                        toast({
                          title: "Regenerated",
                          description: "A new security key has been generated",
                        })
                      }}
                      disabled={isLoading}
                      title="Generate new security key"
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This key is used for bot authentication. Changing it will require updating any integrations.
                  </p>
                </div>
              )}
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
                    <SelectItem value="bot">Bot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-language">Language</Label>
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

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarUpload } from "@/components/shared/AvatarUpload"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Save,
  X,
  User,
  Globe,
  MessageSquare,
  Plus,
  Trash2,
  Loader2,
  ExternalLink,
  AlertCircle,
  Clock,
  Hash,
  Settings
} from "lucide-react"
import { customerService, type Client } from "@/services/customer.service"
import { conversationService, type PreviousConversation } from "@/services/conversation.service"
import { toast } from "@/hooks/use-toast"
import { StatusBadge } from "@/components/badges"
import { TimezoneCombobox } from "@/components/ui/timezone-combobox"
import { LanguageCombobox, LANGUAGES } from "@/components/ui/language-combobox"
import { DynamicAttributeForm } from "@/components/customers"

interface ExternalIDInput {
  id?: number
  type: 'email' | 'phone' | 'whatsapp' | 'slack' | 'telegram' | 'web' | 'chat'
  value: string
}

// Helper to get language name from code
const getLanguageName = (code: string): string => {
  const lang = LANGUAGES.find(l => l.code === code)
  return lang ? lang.name : code
}

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string

  // Customer data state
  const [customer, setCustomer] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState("")
  const [editLanguage, setEditLanguage] = useState("")
  const [editTimezone, setEditTimezone] = useState("")
  const [editCustomData, setEditCustomData] = useState<Record<string, any>>({})
  const [editExternalIds, setEditExternalIds] = useState<ExternalIDInput[]>([])

  // Conversations state
  const [conversations, setConversations] = useState<PreviousConversation[]>([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [conversationsTotal, setConversationsTotal] = useState(0)

  // Load customer data
  const loadCustomer = useCallback(async () => {
    if (!customerId) return

    setIsLoading(true)
    try {
      const response = await customerService.getClient(customerId)

      if (response.success && response.data) {
        setCustomer(response.data)
        // Initialize edit form with current values
        setEditName(response.data.name)
        setEditLanguage(response.data.language || "")
        setEditTimezone(response.data.timezone || "")
        setEditCustomData(response.data.data || {})
        setEditExternalIds((response.data.external_ids || []).map(id => ({
          id: id.id,
          type: id.type as ExternalIDInput['type'],
          value: id.value
        })))
      } else {
        toast({
          title: "Error",
          description: "Failed to load customer data",
          variant: "destructive"
        })
        router.push('/customers')
      }
    } catch (error) {
      console.error('Error loading customer:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
      router.push('/customers')
    } finally {
      setIsLoading(false)
    }
  }, [customerId, router])

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!customerId) return

    setConversationsLoading(true)
    try {
      const response = await conversationService.getClientPreviousConversations(
        customerId,
        50
      )

      setConversations(response.data || [])
      setConversationsTotal(response.total || 0)
    } catch (error) {
      console.error('Error loading conversations:', error)
      setConversations([])
      setConversationsTotal(0)
    } finally {
      setConversationsLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    loadCustomer()
    loadConversations()
  }, [loadCustomer, loadConversations])

  // Helper functions
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPrimaryEmail = () => {
    const emailId = (customer?.external_ids || []).find(id => id.type === 'email')
    return emailId?.value || ''
  }

  const getPrimaryPhone = () => {
    const phoneId = (customer?.external_ids || []).find(id => id.type === 'phone' || id.type === 'whatsapp')
    return phoneId?.value || ''
  }

  // Edit handlers
  const handleStartEdit = () => {
    if (customer) {
      setEditName(customer.name)
      setEditLanguage(customer.language || "")
      setEditTimezone(customer.timezone || "")
      setEditCustomData(customer.data || {})
      setEditExternalIds((customer.external_ids || []).map(id => ({
        id: id.id,
        type: id.type as ExternalIDInput['type'],
        value: id.value
      })))
    }
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleAddExternalId = () => {
    setEditExternalIds([...editExternalIds, { type: 'email', value: '' }])
  }

  const handleRemoveExternalId = (index: number) => {
    setEditExternalIds(editExternalIds.filter((_, i) => i !== index))
  }

  const handleExternalIdChange = (
    index: number,
    field: 'type' | 'value',
    value: string
  ) => {
    const updated = [...editExternalIds]
    if (field === 'type') {
      updated[index].type = value as ExternalIDInput['type']
    } else {
      updated[index].value = value
    }
    setEditExternalIds(updated)
  }

  // Avatar handlers
  const handleAvatarUpload = async (base64Data: string) => {
    if (!customerId) return

    try {
      const response = await customerService.uploadAvatar(customerId, base64Data)
      if (response.success && response.data) {
        // Update local state with new avatar URL
        setCustomer(prev => prev ? { ...prev, avatar: response.data!.avatar } : null)
        toast({
          title: "Success",
          description: "Avatar uploaded successfully"
        })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      throw error
    }
  }

  const handleAvatarDelete = async () => {
    if (!customerId) return

    try {
      const response = await customerService.deleteAvatar(customerId)
      if (response.success) {
        // Update local state to remove avatar
        setCustomer(prev => prev ? { ...prev, avatar: null } : null)
        toast({
          title: "Success",
          description: "Avatar removed successfully"
        })
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Avatar delete error:', error)
      throw error
    }
  }

  const handleSave = async () => {
    if (!customerId || !editName.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)

    try {
      // Filter out empty values from custom data
      const filteredData = Object.fromEntries(
        Object.entries(editCustomData).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      )

      // Filter out empty external IDs
      const validExternalIds = editExternalIds.filter(id => id.value.trim() !== '')

      // Build the update payload - always send data to allow clearing/updating
      const updatePayload: {
        name: string
        language?: string
        timezone?: string
        data?: Record<string, unknown>
        external_ids?: Array<{ type: string; value: string }>
      } = {
        name: editName.trim(),
        language: editLanguage || undefined,
        timezone: editTimezone || undefined,
        data: filteredData, // Always send data, even if empty object
        external_ids: validExternalIds.map(id => ({
          type: id.type,
          value: id.value
        }))
      }

      const response = await customerService.updateClient(customerId, updatePayload)

      if (response.success) {
        toast({
          title: "Success",
          description: "Customer updated successfully"
        })
        setIsEditing(false)
        loadCustomer()
      } else {
        toast({
          title: "Error",
          description: "Failed to update customer",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Customer Not Found</h2>
        <p className="text-muted-foreground mb-4">The customer you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/customers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/customers')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {isEditing ? (
            <AvatarUpload
              currentAvatar={customer.avatar}
              name={customer.name}
              size="lg"
              onUpload={handleAvatarUpload}
              onDelete={customer.avatar ? handleAvatarDelete : undefined}
            />
          ) : (
            <Avatar className="h-12 w-12">
              {customer.avatar && (
                <AvatarImage src={customer.avatar} alt={customer.name} />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-sm text-muted-foreground">
              Customer since {formatDate(customer.created_at)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={handleStartEdit}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
              <CardDescription>Basic details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Field */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter customer name"
                  />
                ) : (
                  <p className="text-sm py-2">{customer.name}</p>
                )}
              </div>

              <Separator />

              {/* Contact Information Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <p className="text-sm">{getPrimaryEmail() || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone
                  </Label>
                  <p className="text-sm">{getPrimaryPhone() || '-'}</p>
                </div>
              </div>

              <Separator />

              {/* Regional Settings */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Language
                  </Label>
                  {isEditing ? (
                    <LanguageCombobox
                      value={editLanguage}
                      onValueChange={setEditLanguage}
                      placeholder="Select language..."
                    />
                  ) : (
                    <p className="text-sm">
                      {customer.language ? getLanguageName(customer.language) : '-'}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Timezone
                  </Label>
                  {isEditing ? (
                    <TimezoneCombobox
                      value={editTimezone}
                      onValueChange={setEditTimezone}
                      placeholder="Select timezone..."
                    />
                  ) : (
                    <p className="text-sm">{customer.timezone || '-'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* External IDs Card */}
          {(isEditing || (customer.external_ids && customer.external_ids.length > 0)) && (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Contact Identifiers
                    </CardTitle>
                    <CardDescription>External IDs used across different channels</CardDescription>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm" onClick={handleAddExternalId}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-3">
                    {editExternalIds.map((externalId, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Select
                          value={externalId.type}
                          onValueChange={(value) => handleExternalIdChange(index, 'type', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="slack">Slack</SelectItem>
                            <SelectItem value="telegram">Telegram</SelectItem>
                            <SelectItem value="web">Web</SelectItem>
                            <SelectItem value="chat">Chat</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={externalId.value}
                          onChange={(e) => handleExternalIdChange(index, 'value', e.target.value)}
                          placeholder="Enter value"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveExternalId(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    {editExternalIds.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No contact IDs. Click "Add" to add email, phone, or other contact methods.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(customer.external_ids || []).map((extId, index) => (
                      <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {extId.type}
                        </Badge>
                        <span className="text-sm">{extId.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Custom Attributes Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Custom Attributes
              </CardTitle>
              <CardDescription>Additional customer information based on your settings</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <DynamicAttributeForm
                  values={editCustomData}
                  onChange={setEditCustomData}
                />
              ) : (
                customer.data && Object.keys(customer.data).length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(customer.data).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </Label>
                        <p className="text-sm">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No custom attributes set. Click Edit to add attributes.
                  </p>
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{formatDate(customer.created_at)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium">{formatDate(customer.updated_at)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversations</span>
                <Badge variant="secondary">{conversationsTotal}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Conversation History Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conversationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversations.slice(0, 10).map((conversation) => (
                    <Link
                      key={conversation.id}
                      href={`/conversations?ticket_id=${conversation.id}`}
                      className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs text-muted-foreground">
                              #{conversation.conversation_number}
                            </span>
                            <StatusBadge status={conversation.status} type="conversation" size="sm" />
                          </div>
                          <p className="text-sm font-medium truncate">
                            {conversation.title || 'Untitled'}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(conversation.created_at)}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                  {conversations.length > 10 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{conversations.length - 10} more conversations
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { customerService } from "@/services/customer.service"
import { toast } from "@/hooks/use-toast"
import { Plus, X, Loader2, User, Mail, Settings } from "lucide-react"
import { TimezoneCombobox } from "@/components/ui/timezone-combobox"
import { LanguageCombobox } from "@/components/ui/language-combobox"
import { DynamicAttributeForm } from "./DynamicAttributeForm"

interface CreateCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface ExternalIDInput {
  type: 'email' | 'phone' | 'whatsapp' | 'slack' | 'telegram' | 'web' | 'chat'
  value: string
}

export function CreateCustomerModal({
  open,
  onOpenChange,
  onSuccess
}: CreateCustomerModalProps) {
  const [name, setName] = useState("")
  const [language, setLanguage] = useState("")
  const [timezone, setTimezone] = useState("")
  const [customData, setCustomData] = useState<Record<string, any>>({})
  const [externalIds, setExternalIds] = useState<ExternalIDInput[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddExternalId = () => {
    setExternalIds([...externalIds, { type: 'email', value: '' }])
  }

  const handleRemoveExternalId = (index: number) => {
    setExternalIds(externalIds.filter((_, i) => i !== index))
  }

  const handleExternalIdChange = (
    index: number,
    field: 'type' | 'value',
    value: string
  ) => {
    const updated = [...externalIds]
    if (field === 'type') {
      updated[index].type = value as ExternalIDInput['type']
    } else {
      updated[index].value = value
    }
    setExternalIds(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Filter out empty values from custom data
      const filteredData = Object.fromEntries(
        Object.entries(customData).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      )

      // Filter out empty external IDs
      const validExternalIds = externalIds.filter(id => id.value.trim() !== '')

      const response = await customerService.createClient({
        name: name.trim(),
        language: language || undefined,
        timezone: timezone || undefined,
        data: Object.keys(filteredData).length > 0 ? filteredData : undefined,
        external_ids: validExternalIds.length > 0 ? validExternalIds : undefined
      })

      if (response.success) {
        toast({
          title: "Success",
          description: "Customer created successfully"
        })

        // Reset form
        setName("")
        setLanguage("")
        setTimezone("")
        setCustomData({})
        setExternalIds([])

        onOpenChange(false)
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: response.error?.message || "Failed to create customer",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setName("")
    setLanguage("")
    setTimezone("")
    setCustomData({})
    setExternalIds([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Create New Customer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Basic Information
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <LanguageCombobox
                  value={language}
                  onValueChange={setLanguage}
                  placeholder="Select language..."
                />
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <TimezoneCombobox
                  value={timezone}
                  onValueChange={setTimezone}
                  placeholder="Select timezone..."
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Identifiers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Contact Identifiers
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddExternalId}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {externalIds.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No contact identifiers added. Click "Add" to add email, phone, or other contact methods.
              </p>
            ) : (
              <div className="space-y-2">
                {externalIds.map((externalId, index) => (
                  <div key={index} className="flex gap-2">
                    <Select
                      value={externalId.type}
                      onValueChange={(value) => handleExternalIdChange(index, 'type', value)}
                    >
                      <SelectTrigger className="w-[130px]">
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
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExternalId(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Custom Attributes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Settings className="h-4 w-4" />
              Custom Attributes
            </div>

            <DynamicAttributeForm
              values={customData}
              onChange={setCustomData}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Customer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

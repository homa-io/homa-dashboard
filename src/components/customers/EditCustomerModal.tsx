"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { customerService, type Client } from "@/services/customer.service"
import { toast } from "@/hooks/use-toast"
import { Plus, X, Loader2 } from "lucide-react"

interface EditCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: string | null
  onSuccess?: () => void
}

interface ExternalIDInput {
  id?: number
  type: 'email' | 'phone' | 'whatsapp' | 'slack' | 'telegram' | 'web' | 'chat'
  value: string
}

export function EditCustomerModal({
  open,
  onOpenChange,
  customerId,
  onSuccess
}: EditCustomerModalProps) {
  const [name, setName] = useState("")
  const [language, setLanguage] = useState("")
  const [timezone, setTimezone] = useState("")
  const [dataJson, setDataJson] = useState("")
  const [externalIds, setExternalIds] = useState<ExternalIDInput[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load customer data when modal opens
  useEffect(() => {
    if (open && customerId) {
      loadCustomerData()
    }
  }, [open, customerId])

  const loadCustomerData = async () => {
    if (!customerId) return

    setIsLoading(true)
    try {
      const response = await customerService.getClient(customerId)

      if (response.success && response.data) {
        const customer = response.data
        setName(customer.name)
        setLanguage(customer.language || "")
        setTimezone(customer.timezone || "")
        setDataJson(customer.data ? JSON.stringify(customer.data, null, 2) : "")
        setExternalIds(customer.external_ids.map(id => ({
          id: id.id,
          type: id.type,
          value: id.value
        })))
      } else {
        toast({
          title: "Error",
          description: "Failed to load customer data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error loading customer:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

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

    if (!customerId) return

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
      // Parse custom data JSON if provided
      let parsedData: Record<string, any> | undefined
      if (dataJson.trim()) {
        try {
          parsedData = JSON.parse(dataJson)
        } catch (error) {
          toast({
            title: "Invalid JSON",
            description: "The custom data field contains invalid JSON",
            variant: "destructive"
          })
          setIsSubmitting(false)
          return
        }
      }

      // Filter out empty external IDs
      const validExternalIds = externalIds.filter(id => id.value.trim() !== '')

      const response = await customerService.updateClient(customerId, {
        name: name.trim(),
        language: language || undefined,
        timezone: timezone || undefined,
        data: parsedData,
        external_ids: validExternalIds.length > 0 ? validExternalIds.map(id => ({
          type: id.type,
          value: id.value
        })) : undefined
      })

      if (response.success) {
        toast({
          title: "Success",
          description: "Customer updated successfully"
        })

        onOpenChange(false)
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: response.error?.message || "Failed to update customer",
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
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g., en, es, fr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g., America/New_York"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>External IDs</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExternalId}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add ID
                </Button>
              </div>

              {externalIds.map((externalId, index) => (
                <div key={index} className="flex gap-2">
                  <Select
                    value={externalId.type}
                    onValueChange={(value) => handleExternalIdChange(index, 'type', value)}
                  >
                    <SelectTrigger className="w-[140px]">
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
                    size="sm"
                    onClick={() => handleRemoveExternalId(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {externalIds.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No external IDs added. Click "Add ID" to add contact information.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Custom Data (JSON)</Label>
              <Textarea
                id="data"
                value={dataJson}
                onChange={(e) => setDataJson(e.target.value)}
                placeholder='{"key": "value", "custom_field": "data"}'
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add custom attributes as JSON object
              </p>
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
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

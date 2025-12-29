"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  customAttributesService,
  CustomAttribute,
  CustomAttributeScope,
  CustomAttributeDataType,
  CustomAttributeVisibility,
  CreateCustomAttributeRequest,
  UpdateCustomAttributeRequest,
} from "@/services/custom-attributes.service"

// Utility function to convert any string to snake_case
const toSnakeCase = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
}

interface AttributeManagerProps {
  title: string
  description: string
  scope: CustomAttributeScope
}

export function AttributeManager({ title, description, scope }: AttributeManagerProps) {
  const [attributes, setAttributes] = useState<CustomAttribute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingAttribute, setEditingAttribute] = useState<CustomAttribute | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const fetchAttributes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await customAttributesService.getAttributesByScope(scope)
      setAttributes(data)
    } catch (err) {
      console.error('Error fetching attributes:', err)
      setError('Failed to load custom attributes. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [scope])

  // Fetch attributes on mount and when scope changes
  useEffect(() => {
    fetchAttributes()
  }, [fetchAttributes])

  const handleAddAttribute = () => {
    setIsCreating(true)
    setEditingAttribute(null)
    setIsDialogOpen(true)
  }

  const handleEditAttribute = (attribute: CustomAttribute) => {
    setIsCreating(false)
    setEditingAttribute(attribute)
    setIsDialogOpen(true)
  }

  const handleDeleteAttribute = async (attribute: CustomAttribute) => {
    try {
      await customAttributesService.deleteAttribute(scope, attribute.name)
      setAttributes(attributes.filter(a => a.name !== attribute.name))
      toast({
        title: "Attribute deleted",
        description: `"${attribute.title}" has been deleted successfully.`
      })
    } catch (err) {
      console.error('Error deleting attribute:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete attribute. Please try again."
      })
    }
  }

  const handleSaveAttribute = async (data: CreateCustomAttributeRequest | UpdateCustomAttributeRequest, originalName?: string) => {
    try {
      if (isCreating) {
        const newAttribute = await customAttributesService.createAttribute(data as CreateCustomAttributeRequest)
        setAttributes([...attributes, newAttribute])
        toast({
          title: "Attribute created",
          description: `"${newAttribute.title}" has been created successfully.`
        })
      } else if (originalName) {
        const updated = await customAttributesService.updateAttribute(scope, originalName, data as UpdateCustomAttributeRequest)
        setAttributes(attributes.map(a => a.name === originalName ? updated : a))
        toast({
          title: "Attribute updated",
          description: `"${updated.title}" has been updated successfully.`
        })
      }
      setIsDialogOpen(false)
      setEditingAttribute(null)
    } catch (err) {
      console.error('Error saving attribute:', err)
      const message = err instanceof Error ? err.message : 'Failed to save attribute. Please try again.'
      toast({
        variant: "destructive",
        title: "Error",
        description: message
      })
      throw err // Re-throw to let dialog handle it
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">{title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{description}</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading attributes...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">{title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{description}</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchAttributes}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">{title}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{description}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Custom Attributes</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Define custom attributes for {scope === 'client' ? 'customers' : 'conversations'}
            </CardDescription>
          </div>
          <Button onClick={handleAddAttribute} className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Add Attribute
          </Button>
        </CardHeader>
        <CardContent>
          {attributes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No custom attributes defined yet.</p>
              <Button variant="outline" onClick={handleAddAttribute} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Attribute
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {attributes.map((attribute) => (
                <AttributeCard
                  key={`${attribute.scope}-${attribute.name}`}
                  attribute={attribute}
                  onEdit={() => handleEditAttribute(attribute)}
                  onDelete={() => handleDeleteAttribute(attribute)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AttributeDialog
        attribute={editingAttribute}
        isOpen={isDialogOpen}
        isCreating={isCreating}
        scope={scope}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingAttribute(null)
        }}
        onSave={handleSaveAttribute}
      />
    </div>
  )
}

interface AttributeCardProps {
  attribute: CustomAttribute
  onEdit: () => void
  onDelete: () => void
}

function AttributeCard({ attribute, onEdit, onDelete }: AttributeCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getTypeColor = (type: CustomAttributeDataType) => {
    const colors: Record<string, string> = {
      string: 'bg-blue-100 text-blue-800',
      int: 'bg-green-100 text-green-800',
      float: 'bg-emerald-100 text-emerald-800',
      date: 'bg-purple-100 text-purple-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getTypeLabel = (type: CustomAttributeDataType) => {
    const labels: Record<string, string> = {
      string: 'Text',
      int: 'Integer',
      float: 'Decimal',
      date: 'Date',
    }
    return labels[type] || type
  }

  const getVisibilityColor = (visibility: CustomAttributeVisibility) => {
    const colors: Record<string, string> = {
      everyone: 'bg-green-100 text-green-800',
      administrator: 'bg-yellow-100 text-yellow-800',
      hidden: 'bg-gray-100 text-gray-800',
    }
    return colors[visibility] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <div className="min-w-0">
              <h4 className="font-medium text-sm sm:text-base truncate">{attribute.title}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Variable: <code className="bg-muted px-1 rounded text-xs">{attribute.name}</code>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${getTypeColor(attribute.data_type)} text-xs`}>
                {getTypeLabel(attribute.data_type)}
              </Badge>
              <Badge className={`${getVisibilityColor(attribute.visibility)} text-xs`}>
                {attribute.visibility}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 self-start">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0"
          >
            {expanded ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onDelete} className="text-red-600 text-xs sm:text-sm">
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Delete Attribute
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {attribute.description && (
        <p className="text-xs sm:text-sm text-muted-foreground">{attribute.description}</p>
      )}

      {expanded && (
        <div className="border-t pt-2 sm:pt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          {attribute.validation && (
            <div className="break-words">
              <span className="font-medium">Validation:</span>
              <code className="bg-muted px-1 rounded ml-1 text-xs">{attribute.validation}</code>
            </div>
          )}
          {attribute.created_at && (
            <div>
              <span className="font-medium">Created:</span> {new Date(attribute.created_at).toLocaleString()}
            </div>
          )}
          {attribute.updated_at && (
            <div>
              <span className="font-medium">Updated:</span> {new Date(attribute.updated_at).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface AttributeDialogProps {
  attribute: CustomAttribute | null
  isOpen: boolean
  isCreating: boolean
  scope: CustomAttributeScope
  onClose: () => void
  onSave: (data: CreateCustomAttributeRequest | UpdateCustomAttributeRequest, originalName?: string) => Promise<void>
}

function AttributeDialog({ attribute, isOpen, isCreating, scope, onClose, onSave }: AttributeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    data_type: 'string' as CustomAttributeDataType,
    validation: '',
    visibility: 'everyone' as CustomAttributeVisibility,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update form data when attribute changes
  useEffect(() => {
    if (attribute && isOpen) {
      setFormData({
        name: attribute.name,
        title: attribute.title,
        description: attribute.description || '',
        data_type: attribute.data_type,
        validation: attribute.validation || '',
        visibility: attribute.visibility,
      })
    } else if (isOpen) {
      setFormData({
        name: '',
        title: '',
        description: '',
        data_type: 'string',
        validation: '',
        visibility: 'everyone',
      })
    }
    setError(null)
  }, [attribute, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (isCreating) {
        const createData: CreateCustomAttributeRequest = {
          scope,
          name: formData.name,
          title: formData.title,
          description: formData.description || null,
          data_type: formData.data_type,
          validation: formData.validation || null,
          visibility: formData.visibility,
        }
        await onSave(createData)
      } else {
        const updateData: UpdateCustomAttributeRequest = {
          title: formData.title,
          description: formData.description || null,
          data_type: formData.data_type,
          validation: formData.validation || null,
          visibility: formData.visibility,
        }
        await onSave(updateData, attribute?.name)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save attribute')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {isCreating ? 'Add New Attribute' : 'Edit Attribute'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Configure the attribute properties for {scope === 'client' ? 'customers' : 'conversations'}.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm font-medium text-muted-foreground">
                Variable Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const snakeCaseValue = toSnakeCase(e.target.value)
                  setFormData({ ...formData, name: snakeCaseValue })
                }}
                placeholder="e.g., customer_tier"
                required
                disabled={!isCreating}
                className="text-sm h-9 sm:h-10"
              />
              <p className="text-xs text-muted-foreground">
                {isCreating ? 'Lowercase letters and underscores only' : 'Cannot be changed after creation'}
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="title" className="text-xs sm:text-sm font-medium text-muted-foreground">
                Display Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Customer Tier"
                required
                className="text-sm h-9 sm:h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm font-medium text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this attribute"
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="data_type" className="text-xs sm:text-sm font-medium text-muted-foreground">
                Data Type *
              </Label>
              <Select
                value={formData.data_type}
                onValueChange={(value) => setFormData({ ...formData, data_type: value as CustomAttributeDataType })}
              >
                <SelectTrigger className="text-sm h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">Text (String)</SelectItem>
                  <SelectItem value="int">Integer (Whole Number)</SelectItem>
                  <SelectItem value="float">Decimal (Float)</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="visibility" className="text-xs sm:text-sm font-medium text-muted-foreground">
                Visibility *
              </Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value as CustomAttributeVisibility })}
              >
                <SelectTrigger className="text-sm h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="administrator">Administrators Only</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="validation" className="text-xs sm:text-sm font-medium text-muted-foreground">
              Validation Rule
            </Label>
            <Input
              id="validation"
              value={formData.validation}
              onChange={(e) => setFormData({ ...formData, validation: e.target.value })}
              placeholder="e.g., min:1,max:100"
              className="text-sm h-9 sm:h-10"
            />
            <p className="text-xs text-muted-foreground">
              Optional validation rules (e.g., min:1,max:100 for numbers)
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-2 pt-3 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  {isCreating ? 'Create Attribute' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

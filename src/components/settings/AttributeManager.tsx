"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  X,
  Edit,
  Trash2,
  Save,
  Eye,
  ChevronDown,
  ChevronUp
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
  DialogTrigger,
} from "@/components/ui/dialog"
import type { CustomAttribute, SelectOption } from "@/types/settings.types"

// Utility function to convert any string to snake_case
const toSnakeCase = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')           // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, '')     // Remove any non-alphanumeric characters except underscores
    .replace(/_+/g, '_')            // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '')        // Remove leading/trailing underscores
}

interface AttributeManagerProps {
  title: string
  description: string
  attributes: CustomAttribute[]
  onSave: (attributes: CustomAttribute[]) => void
}

export function AttributeManager({ title, description, attributes, onSave }: AttributeManagerProps) {
  const [localAttributes, setLocalAttributes] = useState<CustomAttribute[]>(attributes)
  const [editingAttribute, setEditingAttribute] = useState<CustomAttribute | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSave = () => {
    onSave(localAttributes)
  }

  const addAttribute = () => {
    const newAttribute: CustomAttribute = {
      id: Date.now().toString(),
      varName: '',
      displayName: '',
      description: '',
      type: 'text',
      defaultValue: '',
      validationRule: '',
      selectOptions: [],
      required: false
    }
    setEditingAttribute(newAttribute)
    setIsDialogOpen(true)
  }

  const editAttribute = (attribute: CustomAttribute) => {
    setEditingAttribute({ ...attribute })
    setIsDialogOpen(true)
  }

  const deleteAttribute = (id: string) => {
    setLocalAttributes(localAttributes.filter(attr => attr.id !== id))
  }

  const saveAttribute = (attribute: CustomAttribute) => {
    if (attribute.id && localAttributes.find(attr => attr.id === attribute.id)) {
      // Update existing
      setLocalAttributes(localAttributes.map(attr => 
        attr.id === attribute.id ? attribute : attr
      ))
    } else {
      // Add new
      if (!attribute.id) {
        attribute.id = Date.now().toString()
      }
      setLocalAttributes([...localAttributes, attribute])
    }
    setIsDialogOpen(false)
    setEditingAttribute(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">{title}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{description}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-6">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Custom Attributes</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Define custom attributes with comprehensive configuration options
            </CardDescription>
          </div>
          <Button onClick={addAttribute} className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Add Attribute
          </Button>
        </CardHeader>
        <CardContent>
          {localAttributes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No custom attributes defined yet.</p>
              <Button variant="outline" onClick={addAttribute} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Attribute
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {localAttributes.map((attribute) => (
                <AttributeCard 
                  key={attribute.id} 
                  attribute={attribute}
                  onEdit={() => editAttribute(attribute)}
                  onDelete={() => deleteAttribute(attribute.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2 sm:pt-0">
        <Button onClick={handleSave} className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
          <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Save Changes
        </Button>
      </div>

      <AttributeDialog
        attribute={editingAttribute}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingAttribute(null)
        }}
        onSave={saveAttribute}
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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: 'bg-blue-100 text-blue-800',
      longtext: 'bg-blue-100 text-blue-800',
      integer: 'bg-green-100 text-green-800',
      decimal: 'bg-green-100 text-green-800',
      date: 'bg-purple-100 text-purple-800',
      image: 'bg-orange-100 text-orange-800',
      select: 'bg-yellow-100 text-yellow-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
      {/* Header Row - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <div className="min-w-0">
              <h4 className="font-medium text-sm sm:text-base truncate">{attribute.displayName || attribute.varName}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Variable: <code className="bg-muted px-1 rounded text-xs">{attribute.varName}</code>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${getTypeColor(attribute.type)} text-xs`}>
                {attribute.type}
              </Badge>
              {attribute.required && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                  Required
                </Badge>
              )}
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

      {/* Description */}
      {attribute.description && (
        <p className="text-xs sm:text-sm text-muted-foreground">{attribute.description}</p>
      )}

      {/* Expanded Details - Mobile Responsive */}
      {expanded && (
        <div className="border-t pt-2 sm:pt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
          {attribute.defaultValue && (
            <div className="break-words">
              <span className="font-medium">Default Value:</span> {attribute.defaultValue}
            </div>
          )}
          {attribute.validationRule && (
            <div className="break-words">
              <span className="font-medium">Validation:</span> 
              <code className="bg-muted px-1 rounded ml-1 text-xs">{attribute.validationRule}</code>
            </div>
          )}
          {attribute.type === 'select' && attribute.selectOptions && attribute.selectOptions.length > 0 && (
            <div>
              <span className="font-medium">Options:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {attribute.selectOptions.map((option) => (
                  <Badge key={option.key} variant="outline" className="text-xs">
                    {option.key}: {option.label}
                  </Badge>
                ))}
              </div>
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
  onClose: () => void
  onSave: (attribute: CustomAttribute) => void
}

function AttributeDialog({ attribute, isOpen, onClose, onSave }: AttributeDialogProps) {
  const [formData, setFormData] = useState<CustomAttribute>({
    id: '',
    varName: '',
    displayName: '',
    description: '',
    type: 'text',
    defaultValue: '',
    validationRule: '',
    selectOptions: [],
    required: false
  })

  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([])
  const [newOptionKey, setNewOptionKey] = useState('')
  const [newOptionLabel, setNewOptionLabel] = useState('')

  // Update form data when attribute changes
  React.useEffect(() => {
    if (attribute && isOpen) {
      setFormData({ ...attribute })
      setSelectOptions(attribute.selectOptions || [])
    } else if (isOpen) {
      const newAttribute: CustomAttribute = {
        id: '',
        varName: '',
        displayName: '',
        description: '',
        type: 'text',
        defaultValue: '',
        validationRule: '',
        selectOptions: [],
        required: false
      }
      setFormData(newAttribute)
      setSelectOptions([])
    }
  }, [attribute, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const attributeToSave = {
      ...formData,
      selectOptions: formData.type === 'select' ? selectOptions : []
    }
    onSave(attributeToSave)
  }

  const addSelectOption = () => {
    if (newOptionKey && newOptionLabel) {
      setSelectOptions([...selectOptions, { key: newOptionKey, label: newOptionLabel }])
      setNewOptionKey('')
      setNewOptionLabel('')
    }
  }

  const removeSelectOption = (key: string) => {
    setSelectOptions(selectOptions.filter(option => option.key !== key))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {attribute?.id ? 'Edit Attribute' : 'Add New Attribute'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Configure the attribute properties and validation rules.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Basic Information - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="varName" className="text-xs sm:text-sm font-medium text-muted-foreground">Variable Name *</Label>
              <Input
                id="varName"
                value={formData.varName}
                onChange={(e) => {
                  const snakeCaseValue = toSnakeCase(e.target.value)
                  setFormData({ ...formData, varName: snakeCaseValue })
                }}
                placeholder="e.g., customer_tier"
                required
                className="text-sm h-9 sm:h-10"
              />
              <p className="text-xs text-muted-foreground">
                Automatically converted to snake_case for API compatibility
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="displayName" className="text-xs sm:text-sm font-medium text-muted-foreground">Display Name *</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="e.g., Customer Tier"
                required
                className="text-sm h-9 sm:h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm font-medium text-muted-foreground">Description</Label>
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
              <Label htmlFor="type" className="text-xs sm:text-sm font-medium text-muted-foreground">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  type: value as CustomAttribute['type'],
                  selectOptions: value !== 'select' ? [] : formData.selectOptions
                })}
              >
                <SelectTrigger className="text-sm h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="longtext">Long Text</SelectItem>
                  <SelectItem value="integer">Integer</SelectItem>
                  <SelectItem value="decimal">Decimal</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="select">Select (Dropdown)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="defaultValue" className="text-xs sm:text-sm font-medium text-muted-foreground">Default Value</Label>
              <Input
                id="defaultValue"
                value={formData.defaultValue?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                placeholder="Optional default value"
                className="text-sm h-9 sm:h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="validationRule" className="text-xs sm:text-sm font-medium text-muted-foreground">Validation Rule</Label>
            <Input
              id="validationRule"
              value={formData.validationRule || ''}
              onChange={(e) => setFormData({ ...formData, validationRule: e.target.value })}
              placeholder="e.g., min:1,max:100 or regex:^[A-Z]+$"
              className="text-sm h-9 sm:h-10"
            />
            <p className="text-xs text-muted-foreground">
              Validation rules for data entry (format depends on type)
            </p>
          </div>

          {/* Select Options - Only shown for select type */}
          {formData.type === 'select' && (
            <div className="space-y-3 sm:space-y-4 border-t pt-3 sm:pt-4">
              <Label className="text-xs sm:text-sm font-medium">Select Options</Label>
              
              {/* Add new option - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={newOptionKey}
                  onChange={(e) => {
                    const snakeCaseKey = toSnakeCase(e.target.value)
                    setNewOptionKey(snakeCaseKey)
                  }}
                  placeholder="Option key (e.g., premium)"
                  className="flex-1 text-sm h-9 sm:h-10"
                />
                <Input
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  placeholder="Display label (e.g., Premium Plan)"
                  className="flex-1 text-sm h-9 sm:h-10"
                />
                <Button type="button" onClick={addSelectOption} className="w-full sm:w-auto h-9 sm:h-10">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="sm:hidden ml-1.5">Add Option</span>
                </Button>
              </div>

              {/* Existing options - Mobile Responsive */}
              {selectOptions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-medium">Current Options:</p>
                  <div className="space-y-1">
                    {selectOptions.map((option) => (
                      <div key={option.key} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-xs sm:text-sm break-all">
                          <code className="text-xs">{option.key}</code> → {option.label}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSelectOption(option.key)}
                          className="h-6 w-6 p-0 flex-shrink-0 ml-2"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="required"
              checked={formData.required || false}
              onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
            />
            <Label htmlFor="required" className="text-xs sm:text-sm">Required field</Label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-2 pt-3 sm:pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Save Attribute
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Custom Attributes</CardTitle>
            <CardDescription>
              Define custom attributes with comprehensive configuration options
            </CardDescription>
          </div>
          <Button onClick={addAttribute}>
            <Plus className="w-4 h-4 mr-2" />
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

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
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
    <div className="border rounded-lg p-4 space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h4 className="font-medium">{attribute.displayName || attribute.varName}</h4>
            <p className="text-sm text-muted-foreground">
              Variable: <code className="bg-muted px-1 rounded">{attribute.varName}</code>
            </p>
          </div>
          <Badge className={getTypeColor(attribute.type)}>
            {attribute.type}
          </Badge>
          {attribute.required && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Required
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Description */}
      {attribute.description && (
        <p className="text-sm text-muted-foreground">{attribute.description}</p>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t pt-3 space-y-2 text-sm">
          {attribute.defaultValue && (
            <div>
              <span className="font-medium">Default Value:</span> {attribute.defaultValue}
            </div>
          )}
          {attribute.validationRule && (
            <div>
              <span className="font-medium">Validation:</span> 
              <code className="bg-muted px-1 rounded ml-1">{attribute.validationRule}</code>
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {attribute?.id ? 'Edit Attribute' : 'Add New Attribute'}
          </DialogTitle>
          <DialogDescription>
            Configure the attribute properties and validation rules.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="varName">Variable Name *</Label>
              <Input
                id="varName"
                value={formData.varName}
                onChange={(e) => {
                  const snakeCaseValue = toSnakeCase(e.target.value)
                  setFormData({ ...formData, varName: snakeCaseValue })
                }}
                placeholder="e.g., customer_tier"
                required
              />
              <p className="text-xs text-muted-foreground">
                Automatically converted to snake_case for API compatibility
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="e.g., Customer Tier"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this attribute"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  type: value as CustomAttribute['type'],
                  selectOptions: value !== 'select' ? [] : formData.selectOptions
                })}
              >
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input
                id="defaultValue"
                value={formData.defaultValue?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                placeholder="Optional default value"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validationRule">Validation Rule</Label>
            <Input
              id="validationRule"
              value={formData.validationRule || ''}
              onChange={(e) => setFormData({ ...formData, validationRule: e.target.value })}
              placeholder="e.g., min:1,max:100 or regex:^[A-Z]+$"
            />
            <p className="text-xs text-muted-foreground">
              Validation rules for data entry (format depends on type)
            </p>
          </div>

          {/* Select Options - Only shown for select type */}
          {formData.type === 'select' && (
            <div className="space-y-4 border-t pt-4">
              <Label>Select Options</Label>
              
              {/* Add new option */}
              <div className="flex gap-2">
                <Input
                  value={newOptionKey}
                  onChange={(e) => {
                    const snakeCaseKey = toSnakeCase(e.target.value)
                    setNewOptionKey(snakeCaseKey)
                  }}
                  placeholder="Option key (e.g., premium)"
                  className="flex-1"
                />
                <Input
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  placeholder="Display label (e.g., Premium Plan)"
                  className="flex-1"
                />
                <Button type="button" onClick={addSelectOption}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Existing options */}
              {selectOptions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Current Options:</p>
                  <div className="space-y-1">
                    {selectOptions.map((option) => (
                      <div key={option.key} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">
                          <code>{option.key}</code> → {option.label}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSelectOption(option.key)}
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

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={formData.required || false}
              onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
            />
            <Label htmlFor="required">Required field</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Save Attribute
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
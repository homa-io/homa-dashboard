"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertCircle, Info } from "lucide-react"
import {
  customAttributesService,
  type CustomAttribute
} from "@/services/custom-attributes.service"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DynamicAttributeFormProps {
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
  disabled?: boolean
}

export function DynamicAttributeForm({
  values,
  onChange,
  disabled = false,
}: DynamicAttributeFormProps) {
  const [attributes, setAttributes] = useState<CustomAttribute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch custom attributes for clients
  useEffect(() => {
    async function loadAttributes() {
      try {
        setLoading(true)
        setError(null)
        const clientAttributes = await customAttributesService.getAttributesByScope('client')
        // Filter out hidden attributes
        const visibleAttributes = clientAttributes.filter(
          attr => attr.visibility !== 'hidden'
        )
        setAttributes(visibleAttributes)
      } catch (err) {
        console.error('Error loading attributes:', err)
        setError('Failed to load custom attributes')
      } finally {
        setLoading(false)
      }
    }

    loadAttributes()
  }, [])

  const handleValueChange = (name: string, value: any) => {
    onChange({
      ...values,
      [name]: value
    })
  }

  const renderInput = (attribute: CustomAttribute) => {
    const value = values[attribute.name] ?? ''

    switch (attribute.data_type) {
      case 'int':
        return (
          <Input
            type="number"
            step="1"
            value={value}
            onChange={(e) => {
              const numValue = e.target.value === '' ? '' : parseInt(e.target.value, 10)
              handleValueChange(attribute.name, numValue)
            }}
            placeholder={`Enter ${attribute.title.toLowerCase()}`}
            disabled={disabled}
          />
        )

      case 'float':
        return (
          <Input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => {
              const numValue = e.target.value === '' ? '' : parseFloat(e.target.value)
              handleValueChange(attribute.name, numValue)
            }}
            placeholder={`Enter ${attribute.title.toLowerCase()}`}
            disabled={disabled}
          />
        )

      case 'date':
        return (
          <Input
            type="date"
            value={value ? (typeof value === 'string' ? value.split('T')[0] : '') : ''}
            onChange={(e) => handleValueChange(attribute.name, e.target.value)}
            disabled={disabled}
          />
        )

      case 'string':
      default:
        // Check if validation suggests a specific format
        const validation = attribute.validation?.toLowerCase() || ''

        if (validation.includes('email')) {
          return (
            <Input
              type="email"
              value={value}
              onChange={(e) => handleValueChange(attribute.name, e.target.value)}
              placeholder={`Enter ${attribute.title.toLowerCase()}`}
              disabled={disabled}
            />
          )
        }

        if (validation.includes('url') || validation.includes('http')) {
          return (
            <Input
              type="url"
              value={value}
              onChange={(e) => handleValueChange(attribute.name, e.target.value)}
              placeholder="https://..."
              disabled={disabled}
            />
          )
        }

        if (validation.includes('phone') || validation.includes('tel')) {
          return (
            <Input
              type="tel"
              value={value}
              onChange={(e) => handleValueChange(attribute.name, e.target.value)}
              placeholder={`Enter ${attribute.title.toLowerCase()}`}
              disabled={disabled}
            />
          )
        }

        // Check if it might be a long text field
        if (
          validation.includes('text') ||
          attribute.name.includes('description') ||
          attribute.name.includes('note') ||
          attribute.name.includes('comment') ||
          attribute.name.includes('address')
        ) {
          return (
            <Textarea
              value={value}
              onChange={(e) => handleValueChange(attribute.name, e.target.value)}
              placeholder={`Enter ${attribute.title.toLowerCase()}`}
              rows={3}
              disabled={disabled}
            />
          )
        }

        // Default to regular text input
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleValueChange(attribute.name, e.target.value)}
            placeholder={`Enter ${attribute.title.toLowerCase()}`}
            disabled={disabled}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading attributes...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 py-4 px-3 rounded-md bg-destructive/10 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{error}</span>
      </div>
    )
  }

  if (attributes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        No custom attributes defined for customers.
        <br />
        <span className="text-xs">
          Configure them in Settings &gt; Customer Attributes
        </span>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-4">
        {attributes.map((attribute) => (
          <div key={`${attribute.scope}-${attribute.name}`} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={attribute.name} className="text-sm font-medium">
                {attribute.title}
              </Label>
              {attribute.description && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex">
                      <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={5}>
                    <p className="max-w-xs">{attribute.description}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <span className="text-xs text-muted-foreground">
                ({attribute.data_type})
              </span>
            </div>
            {renderInput(attribute)}
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}

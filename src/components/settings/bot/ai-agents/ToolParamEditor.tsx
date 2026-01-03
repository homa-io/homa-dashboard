"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { ToolParam, ToolParamValueType, ToolParamDataType } from "@/types/ai-agent-tool.types"
import { VALUE_TYPE_OPTIONS, DATA_TYPE_OPTIONS, createEmptyParam } from "@/types/ai-agent-tool.types"

interface ToolParamEditorProps {
  params: ToolParam[]
  onChange: (params: ToolParam[]) => void
  disabled?: boolean
}

export function ToolParamEditor({ params, onChange, disabled }: ToolParamEditorProps) {
  const handleAdd = () => {
    onChange([...params, createEmptyParam()])
  }

  const handleRemove = (index: number) => {
    onChange(params.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: keyof ToolParam, value: string | boolean) => {
    const updated = [...params]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {params.length === 0 ? (
        <div className="text-sm text-muted-foreground py-2">
          No parameters defined
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-2 px-2 text-xs text-muted-foreground font-medium">
            <div className="col-span-2">Key</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Data Type</div>
            <div className="col-span-2">Example</div>
            <div className="col-span-1 text-center">Req</div>
            <div className="col-span-1"></div>
          </div>
          {params.map((param, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded-md">
              <div className="col-span-2">
                <Input
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => handleChange(index, 'key', e.target.value)}
                  disabled={disabled}
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-2">
                <Input
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => handleChange(index, 'value', e.target.value)}
                  disabled={disabled}
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={param.value_type}
                  onValueChange={(v) => handleChange(index, 'value_type', v)}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VALUE_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Select
                  value={param.data_type}
                  onValueChange={(v) => handleChange(index, 'data_type', v)}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Input
                  placeholder="Example"
                  value={param.example}
                  onChange={(e) => handleChange(index, 'example', e.target.value)}
                  disabled={disabled}
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Checkbox
                  checked={param.required}
                  onCheckedChange={(checked) => handleChange(index, 'required', !!checked)}
                  disabled={disabled}
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        disabled={disabled}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Parameter
      </Button>
    </div>
  )
}

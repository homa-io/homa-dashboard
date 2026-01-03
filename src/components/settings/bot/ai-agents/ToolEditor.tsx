"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Globe,
  Loader2,
  Save,
  Trash2,
  ArrowLeft,
  Settings2,
  Key,
  MessageSquare,
  Link2,
  Braces,
} from "lucide-react"
import type {
  AIAgentTool,
  ToolParam,
  ToolMethod,
  ToolBodyType,
  ToolAuthType
} from "@/types/ai-agent-tool.types"
import {
  METHOD_OPTIONS,
  BODY_TYPE_OPTIONS,
  AUTH_TYPE_OPTIONS,
  createEmptyTool
} from "@/types/ai-agent-tool.types"
import { ToolParamEditor } from "./ToolParamEditor"

interface ToolEditorProps {
  tool: AIAgentTool | null
  onSave: (tool: Partial<AIAgentTool>) => Promise<void>
  onDelete?: () => Promise<void>
  onCancel: () => void
  saving?: boolean
}

const methodColors: Record<ToolMethod, string> = {
  GET: "bg-green-500/10 text-green-600 border-green-500/30",
  POST: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  PUT: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  PATCH: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  DELETE: "bg-red-500/10 text-red-600 border-red-500/30",
}

// Content component for use inside modal
export function ToolEditorContent({ tool, onSave, onDelete, onCancel, saving }: ToolEditorProps) {
  const isNew = !tool?.id

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [endpoint, setEndpoint] = useState("")
  const [method, setMethod] = useState<ToolMethod>("GET")
  const [queryParams, setQueryParams] = useState<ToolParam[]>([])
  const [headerParams, setHeaderParams] = useState<ToolParam[]>([])
  const [bodyType, setBodyType] = useState<ToolBodyType>("JSON")
  const [bodyParams, setBodyParams] = useState<ToolParam[]>([])
  const [authType, setAuthType] = useState<ToolAuthType>("None")
  const [authHeader, setAuthHeader] = useState("")
  const [authValue, setAuthValue] = useState("")
  const [responseInstructions, setResponseInstructions] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("endpoint")

  useEffect(() => {
    if (tool) {
      setName(tool.name || "")
      setDescription(tool.description || "")
      setEndpoint(tool.endpoint || "")
      setMethod(tool.method || "GET")
      setQueryParams(tool.query_params || [])
      setHeaderParams(tool.header_params || [])
      setBodyType(tool.body_type || "JSON")
      setBodyParams(tool.body_params || [])
      setAuthType(tool.authorization_type || "None")
      setAuthHeader(tool.authorization_header || "")
      setAuthValue(tool.authorization_value || "")
      setResponseInstructions(tool.response_instructions || "")
    } else {
      const empty = createEmptyTool()
      setName(empty.name)
      setDescription(empty.description)
      setEndpoint(empty.endpoint)
      setMethod(empty.method)
      setQueryParams(empty.query_params || [])
      setHeaderParams(empty.header_params || [])
      setBodyType(empty.body_type)
      setBodyParams(empty.body_params || [])
      setAuthType(empty.authorization_type)
      setAuthHeader(empty.authorization_header)
      setAuthValue(empty.authorization_value)
      setResponseInstructions(empty.response_instructions)
    }
  }, [tool])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Tool name is required")
      return
    }
    if (!endpoint.trim()) {
      setError("Endpoint URL is required")
      return
    }

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        endpoint: endpoint.trim(),
        method,
        query_params: queryParams.length > 0 ? queryParams : null,
        header_params: headerParams.length > 0 ? headerParams : null,
        body_type: bodyType,
        body_params: bodyParams.length > 0 ? bodyParams : null,
        authorization_type: authType,
        authorization_header: authHeader.trim(),
        authorization_value: authValue.trim(),
        response_instructions: responseInstructions.trim(),
      })
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to save tool")
    }
  }

  const showBodySection = method !== "GET" && method !== "DELETE"

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-10 bg-muted/50 p-1 gap-1 w-full grid grid-cols-5">
          <TabsTrigger value="endpoint" className="text-xs">
            <Link2 className="h-3 w-3 mr-1" />
            Endpoint
          </TabsTrigger>
          <TabsTrigger value="params" className="text-xs">
            <Settings2 className="h-3 w-3 mr-1" />
            Params
            {(queryParams.length > 0 || headerParams.length > 0) && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {queryParams.length + headerParams.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="body" className="text-xs" disabled={!showBodySection}>
            <Braces className="h-3 w-3 mr-1" />
            Body
            {bodyParams.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {bodyParams.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="auth" className="text-xs">
            <Key className="h-3 w-3 mr-1" />
            Auth
            {authType !== "None" && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px] bg-green-500/10 text-green-600">
                On
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="response" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Response
          </TabsTrigger>
        </TabsList>

        {/* Endpoint Tab */}
        <TabsContent value="endpoint" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tool Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Get Weather, Search Products"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                A clear name that describes what this tool does
              </p>
            </div>
            <div className="space-y-2">
              <Label>HTTP Method</Label>
              <div className="flex gap-1">
                {METHOD_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMethod(opt.value)}
                    disabled={saving}
                    className={`flex-1 text-xs ${method === opt.value ? methodColors[opt.value] : ""}`}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint URL *</Label>
            <div className="flex gap-2">
              <Badge variant="outline" className={`${methodColors[method]} shrink-0 h-9 px-3 flex items-center`}>
                {method}
              </Badge>
              <Input
                id="endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/v1/resource"
                disabled={saving}
                className="font-mono text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The full URL of the API endpoint. Use {"{{variable}}"} for dynamic values.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe when the AI should use this tool and what it returns..."
              rows={3}
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">
              Help the AI understand when and how to use this tool
            </p>
          </div>
        </TabsContent>

        {/* Parameters Tab */}
        <TabsContent value="params" className="space-y-6 mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Query Parameters</Label>
                <p className="text-xs text-muted-foreground">
                  Parameters appended to the URL (e.g., ?key=value)
                </p>
              </div>
              {queryParams.length > 0 && (
                <Badge variant="secondary">{queryParams.length} params</Badge>
              )}
            </div>
            <ToolParamEditor
              params={queryParams}
              onChange={setQueryParams}
              disabled={saving}
            />
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Headers</Label>
                <p className="text-xs text-muted-foreground">
                  Custom HTTP headers to send with the request
                </p>
              </div>
              {headerParams.length > 0 && (
                <Badge variant="secondary">{headerParams.length} headers</Badge>
              )}
            </div>
            <ToolParamEditor
              params={headerParams}
              onChange={setHeaderParams}
              disabled={saving}
            />
          </div>
        </TabsContent>

        {/* Body Tab */}
        <TabsContent value="body" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Content Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {BODY_TYPE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant="outline"
                  onClick={() => setBodyType(opt.value)}
                  disabled={saving}
                  className={`h-auto py-2 flex flex-col items-start ${bodyType === opt.value ? "border-primary bg-primary/5" : ""}`}
                >
                  <span className="font-medium text-sm">{opt.label}</span>
                  <span className="text-xs text-muted-foreground font-normal">{opt.description}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Body Parameters</Label>
                <p className="text-xs text-muted-foreground">
                  Data fields to include in the request body
                </p>
              </div>
              {bodyParams.length > 0 && (
                <Badge variant="secondary">{bodyParams.length} fields</Badge>
              )}
            </div>
            <ToolParamEditor
              params={bodyParams}
              onChange={setBodyParams}
              disabled={saving}
            />
          </div>
        </TabsContent>

        {/* Auth Tab */}
        <TabsContent value="auth" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Authentication Method</Label>
            <div className="grid grid-cols-2 gap-2">
              {AUTH_TYPE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant="outline"
                  onClick={() => setAuthType(opt.value)}
                  disabled={saving}
                  className={`h-auto py-2 flex flex-col items-start ${authType === opt.value ? "border-primary bg-primary/5" : ""}`}
                >
                  <span className="font-medium text-sm">{opt.label}</span>
                  <span className="text-xs text-muted-foreground font-normal">{opt.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {authType !== "None" && (
            <div className="border-t pt-4 space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="authHeader">Header Name</Label>
                  <Input
                    id="authHeader"
                    value={authHeader}
                    onChange={(e) => setAuthHeader(e.target.value)}
                    placeholder={authType === "Bearer" || authType === "BasicAuth" ? "Authorization" : "X-API-Key"}
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    {authType === "Bearer" && "Usually 'Authorization' for Bearer tokens"}
                    {authType === "BasicAuth" && "Usually 'Authorization' for Basic auth"}
                    {authType === "APIKey" && "The header name where API key should be sent"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authValue">Header Value</Label>
                  <Input
                    id="authValue"
                    value={authValue}
                    onChange={(e) => setAuthValue(e.target.value)}
                    placeholder={
                      authType === "Bearer" ? "Bearer {{token}}" :
                      authType === "BasicAuth" ? "Basic {{base64_credentials}}" :
                      "{{api_key}}"
                    }
                    disabled={saving}
                    type="password"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {"{{variable}}"} syntax for dynamic values from context
                  </p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Response Tab */}
        <TabsContent value="response" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="responseInstructions">Response Instructions</Label>
            <Textarea
              id="responseInstructions"
              value={responseInstructions}
              onChange={(e) => setResponseInstructions(e.target.value)}
              placeholder={`Example:
- The response contains a JSON object with a "data" array
- Each item has "id", "name", and "price" fields
- Present the results as a formatted list to the user
- If no results, let the user know politely`}
              rows={6}
              disabled={saving}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Tell the AI how to interpret the response and present it to users.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {!isNew && onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete} disabled={saving}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            <Save className="h-4 w-4 mr-1" />
            {isNew ? "Create Tool" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Standalone editor with header (for non-modal use)
export function ToolEditor({ tool, onSave, onDelete, onCancel, saving }: ToolEditorProps) {
  const isNew = !tool?.id

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {isNew ? "New Tool" : "Edit Tool"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isNew ? "Configure a new API endpoint" : "API endpoint configuration"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          <ToolEditorContent
            tool={tool}
            onSave={onSave}
            onDelete={onDelete}
            onCancel={onCancel}
            saving={saving}
          />
        </CardContent>
      </Card>
    </div>
  )
}

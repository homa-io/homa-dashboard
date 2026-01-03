"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Wrench, Globe, ChevronRight, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { AIAgentTool } from "@/types/ai-agent-tool.types"
import { aiAgentToolService } from "@/services/ai-agent-tool.service"
import { ToolEditorContent } from "./ToolEditor"

interface ToolsManagerProps {
  agentId: number
  onToolsChange?: (tools: AIAgentTool[]) => void
}

export function ToolsManager({ agentId, onToolsChange }: ToolsManagerProps) {
  const { toast } = useToast()
  const [tools, setTools] = useState<AIAgentTool[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedTool, setSelectedTool] = useState<AIAgentTool | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [toolToDelete, setToolToDelete] = useState<AIAgentTool | null>(null)

  useEffect(() => {
    loadTools()
  }, [agentId])

  const loadTools = async () => {
    try {
      setLoading(true)
      const data = await aiAgentToolService.list(agentId)
      setTools(data)
      onToolsChange?.(data)
    } catch (err) {
      console.error("Failed to load tools:", err)
      toast({
        title: "Error",
        description: "Failed to load tools",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedTool(null)
    setEditorOpen(true)
  }

  const handleEdit = (tool: AIAgentTool) => {
    setSelectedTool(tool)
    setEditorOpen(true)
  }

  const handleSave = async (data: Partial<AIAgentTool>) => {
    try {
      setSaving(true)
      if (selectedTool?.id) {
        await aiAgentToolService.update(agentId, selectedTool.id, data)
        toast({
          title: "Tool updated",
          description: "The tool has been updated successfully.",
        })
      } else {
        await aiAgentToolService.create(agentId, data as any)
        toast({
          title: "Tool created",
          description: "The new tool has been created successfully.",
        })
      }
      await loadTools()
      setEditorOpen(false)
      setSelectedTool(null)
    } catch (err) {
      const error = err as Error
      toast({
        title: "Error",
        description: error.message || "Failed to save tool",
        variant: "destructive",
      })
      throw err
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = (tool: AIAgentTool) => {
    setToolToDelete(tool)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!toolToDelete) return

    try {
      setSaving(true)
      await aiAgentToolService.delete(agentId, toolToDelete.id)
      toast({
        title: "Tool deleted",
        description: "The tool has been deleted successfully.",
      })
      await loadTools()
      setEditorOpen(false)
      setSelectedTool(null)
    } catch (err) {
      const error = err as Error
      toast({
        title: "Error",
        description: error.message || "Failed to delete tool",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
      setDeleteDialogOpen(false)
      setToolToDelete(null)
    }
  }

  const handleEditorClose = () => {
    setEditorOpen(false)
    setSelectedTool(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Tools
              </CardTitle>
              <CardDescription>
                API endpoints that this AI agent can call to perform actions
              </CardDescription>
            </div>
            <Button onClick={handleCreate} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Tool
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : tools.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-2">No tools configured</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add API endpoints that the AI agent can use to fetch data or perform actions
              </p>
              <Button onClick={handleCreate} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add First Tool
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleEdit(tool)}
                  className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{tool.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {tool.method}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {tool.endpoint}
                    </p>
                    {tool.description && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {tool.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tool Editor Modal */}
      <Dialog open={editorOpen} onOpenChange={handleEditorClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {selectedTool ? "Edit Tool" : "New Tool"}
            </DialogTitle>
          </DialogHeader>
          <ToolEditorContent
            tool={selectedTool}
            onSave={handleSave}
            onDelete={selectedTool ? () => {
              handleDeleteClick(selectedTool)
              return Promise.resolve()
            } : undefined}
            onCancel={handleEditorClose}
            saving={saving}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tool</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{toolToDelete?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

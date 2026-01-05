"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, RefreshCw, Search, Bot, FileCode, ChevronRight } from "lucide-react"
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
import { aiAgentService } from "@/services/ai-agent.service"
import { AIAgentForm } from "./AIAgentForm"
import { AIAgentList } from "./AIAgentList"
import { BotPromptTemplateModal } from "./BotPromptTemplateModal"
import type {
  AIAgent,
  AIAgentCreateRequest,
} from "@/types/ai-agent.types"

export function AIAgentManager() {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<AIAgent | null>(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await aiAgentService.list({
        search: searchQuery || undefined,
      })
      setAgents(response.data || [])
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to load AI agents")
      console.error("Error fetching AI agents:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchAgents()
    }, 300)
    return () => clearTimeout(debounce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleAdd = () => {
    setIsFormOpen(true)
  }

  const handleSave = async (data: AIAgentCreateRequest) => {
    await aiAgentService.create(data)
    await fetchAgents()
  }

  const handleDeleteClick = (agent: AIAgent) => {
    setAgentToDelete(agent)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!agentToDelete) return

    try {
      setDeletingId(agentToDelete.id)
      await aiAgentService.delete(agentToDelete.id)
      await fetchAgents()
    } catch (err) {
      const error = err as Error
      alert(error.message || "Failed to delete AI agent")
    } finally {
      setDeletingId(null)
      setDeleteDialogOpen(false)
      setAgentToDelete(null)
    }
  }

  const handleToggleStatus = async (agent: AIAgent) => {
    try {
      const newStatus = agent.status === "active" ? "inactive" : "active"
      await aiAgentService.toggleStatus(agent.id, newStatus)
      await fetchAgents()
    } catch (err) {
      const error = err as Error
      alert(error.message || "Failed to update AI agent status")
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2 flex items-center gap-2">
          <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
          AI Agents
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Configure AI agents to handle conversations with custom behavior and
          instructions.
        </p>
      </div>

      {/* Bot Prompt Template Card */}
      <Card
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsTemplateModalOpen(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Bot Prompt Template</CardTitle>
              <CardDescription className="text-xs">
                Customize the system prompt template used for all AI agents
              </CardDescription>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">AI Agent List</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Create and manage AI agents with custom settings.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAgents}
              disabled={loading}
              className="text-xs h-9"
            >
              <RefreshCw
                className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={handleAdd} className="text-xs sm:text-sm h-9 sm:h-10">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              Create AI Agent
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search AI agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm h-9"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* List */}
          <AIAgentList
            agents={agents}
            loading={loading}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      {/* Create Form */}
      <AIAgentForm
        agent={null}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete AI Agent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{agentToDelete?.name}&quot;?
              This action cannot be undone. Departments using this agent will have
              their AI agent assignment removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingId ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bot Prompt Template Modal */}
      <BotPromptTemplateModal
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
      />
    </div>
  )
}

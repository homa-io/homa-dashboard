"use client"

import React, { useState, useEffect } from "react"
import { CustomBadge } from "@/components/ui/custom-badge"
import { ConversationModal } from "@/components/conversations/ConversationModal"
import { conversationService } from "@/services/conversation.service"
import type { Conversation } from "@/types/conversation.types"
import {
  Circle,
  Clock,
  XCircle,
  CheckCircle,
  Loader,
  Mail,
  MessageSquare,
  Phone,
  UserCheck,
  Pause,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Conversation Card Component - Modern card design
function ConversationCard({ conversation, onClick }: { conversation: Conversation; onClick: () => void }) {
  const getSourceIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-3 h-3" />
      case 'whatsapp': return <Phone className="w-3 h-3" />
      case 'telegram': return <MessageSquare className="w-3 h-3" />
      case 'web': return <MessageSquare className="w-3 h-3" />
      default: return <Mail className="w-3 h-3" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div
      className="group relative bg-card rounded-lg border border-border p-2 sm:p-3 cursor-pointer hover:shadow-lg hover:border-accent transition-all duration-200 hover:-translate-y-0.5"
      onClick={onClick}
    >
      {/* Priority indicator stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getPriorityColor(conversation.priority)}`}></div>

      {/* Header row */}
      <div className="flex items-start justify-between mb-2 ml-2">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <CustomBadge
            variant={
              conversation.priority === "urgent" ? "red-dot" :
              conversation.priority === "high" ? "red" :
              conversation.priority === "medium" ? "yellow" : "gray"
            }
            className="text-[10px] sm:text-xs font-medium"
          >
            {conversation.priority.toUpperCase()}
          </CustomBadge>
          {conversation.department && (
            <CustomBadge variant="outline" className="text-[10px] sm:text-xs hidden sm:inline-flex">
              {conversation.department.name}
            </CustomBadge>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">{getSourceIcon(conversation.channel)}</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">{getTimeAgo(conversation.last_message_at || conversation.created_at)}</span>
        </div>
      </div>

      {/* Customer name */}
      <h4 className="text-xs sm:text-sm font-semibold text-card-foreground leading-tight line-clamp-1 sm:line-clamp-2 mb-2 ml-2">
        {conversation.customer.name}
      </h4>

      {/* Preview with subtle background */}
      <div className="bg-muted rounded-md p-1.5 sm:p-2 mb-2 ml-2 mr-0">
        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {conversation.last_message_preview || conversation.title || "No messages yet"}
        </p>
      </div>

      {/* Footer - Tags and Unread Count */}
      <div className="ml-2 flex items-center justify-between">
        {/* Tags */}
        {conversation.tags && conversation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {conversation.tags.slice(0, 1).map((tag, index) => (
              <span key={index} className="inline-flex items-center px-1 py-0.5 rounded text-[9px] sm:text-[10px] bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                #{tag.name}
              </span>
            ))}
            {conversation.tags.length > 1 && (
              <span className="inline-flex items-center px-1 py-0.5 rounded text-[9px] sm:text-[10px] bg-muted text-muted-foreground border border-border">
                +{conversation.tags.length - 1}
              </span>
            )}
          </div>
        )}
        {/* Unread count */}
        {conversation.unread_messages_count > 0 && (
          <CustomBadge variant="red" className="text-[9px] sm:text-[10px] h-5">
            {conversation.unread_messages_count}
          </CustomBadge>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  // State management
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [conversations, setConversations] = useState<Record<string, Conversation[]>>({
    new: [],
    wait_for_agent: [],
    in_progress: [],
    wait_for_user: [],
    on_hold: [],
    resolved: []
  })
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { toast } = useToast()

  // Fetch conversations by status
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true)
      try {
        // Fetch conversations for each status in parallel
        const statuses = ['new', 'wait_for_agent', 'in_progress', 'wait_for_user', 'on_hold', 'resolved']
        const results = await Promise.all(
          statuses.map(status =>
            conversationService.searchConversations({
              status,
              assigned_to_me: true,
              limit: 50,
              sort_by: 'updated_at',
              sort_order: 'desc'
            })
          )
        )

        // Map results to conversations state
        const conversationsMap: Record<string, Conversation[]> = {}
        statuses.forEach((status, index) => {
          conversationsMap[status] = results[index].data
        })

        setConversations(conversationsMap)

        // Update selected conversation if modal is open
        if (selectedConversation) {
          const allConversations = Object.values(conversationsMap).flat()
          const updated = allConversations.find(c => c.id === selectedConversation.id)
          if (updated) {
            setSelectedConversation(updated)
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load conversations"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [refreshTrigger, toast])

  // Modal handlers
  const openConversationModal = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setIsModalOpen(true)
  }

  const handleConversationUpdate = () => {
    // Refresh all conversations to get latest data from server
    setRefreshTrigger(prev => prev + 1)
  }

  const handleStatusChange = async (conversationId: number, newStatus: string) => {
    try {
      // Update locally first for instant feedback
      setConversations(prev => {
        const updated = { ...prev }
        // Find and remove conversation from old status
        Object.keys(updated).forEach(status => {
          updated[status] = updated[status].filter(c => c.id !== conversationId)
        })
        // Add to new status
        const conversation = Object.values(prev)
          .flat()
          .find(c => c.id === conversationId)
        if (conversation) {
          updated[newStatus] = [...(updated[newStatus] || []), { ...conversation, status: newStatus as any }]
        }
        return updated
      })

      // Trigger refresh to get updated data from server
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Error updating conversation status:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update conversation status"
      })
    }
  }

  const statuses = [
    { key: "new", label: "New", icon: Circle, color: "text-blue-600" },
    { key: "wait_for_agent", label: "Wait for Agent", icon: UserCheck, color: "text-purple-600" },
    { key: "in_progress", label: "In Progress", icon: Loader, color: "text-yellow-600" },
    { key: "wait_for_user", label: "Wait for User", icon: Clock, color: "text-orange-600" },
    { key: "on_hold", label: "On Hold", icon: Pause, color: "text-gray-500" },
    { key: "resolved", label: "Resolved", icon: CheckCircle, color: "text-green-600" },
  ]

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-8 pt-4 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Support Dashboard</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage customer support conversations by status</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        /* Mobile-Responsive Kanban Board */
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {statuses.map((status) => {
            const statusConversations = conversations[status.key] || []
            const StatusIcon = status.icon

            return (
              <div key={status.key} className="space-y-3">
                {/* Kanban Header */}
                <div className="bg-muted rounded-lg p-3 flex items-center justify-center h-14">
                  <div className="flex items-center gap-2 w-full justify-center">
                    <StatusIcon className={`h-4 w-4 ${status.color}`} />
                    <h3 className="text-base font-semibold text-foreground flex-1 text-center">{status.label}</h3>
                    <CustomBadge variant="secondary" className="text-xs">
                      {statusConversations.length}
                    </CustomBadge>
                  </div>
                </div>

                {/* Conversations */}
                <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
                  {statusConversations.map((conversation) => (
                    <ConversationCard
                      key={conversation.id}
                      conversation={conversation}
                      onClick={() => openConversationModal(conversation)}
                    />
                  ))}

                  {statusConversations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <StatusIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No {status.label.toLowerCase()} conversations</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Conversation Modal */}
      <ConversationModal
        conversation={selectedConversation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
        onUpdate={handleConversationUpdate}
      />
    </div>
  )
}

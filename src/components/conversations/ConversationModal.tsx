"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CustomBadge } from "@/components/ui/custom-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisitorInformation } from "./VisitorInformation"
import { ConversationActions } from "./ConversationActions"
import { WysiwygEditor } from "./WysiwygEditor"
import { conversationService } from "@/services/conversation.service"
import { useToast } from "@/hooks/use-toast"
import type { Conversation, Message } from "@/types/conversation.types"
import {
  Mail,
  MessageCircle,
  Phone,
  Monitor,
  ChevronUp,
  Sparkles,
  X,
  Circle,
  ArrowUp,
  ArrowDown,
  Clock,
  XCircle,
  Loader,
  Archive,
  Building
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAvatarColor, getInitials } from "@/lib/avatar-colors"

interface ConversationModalProps {
  conversation: Conversation | null
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (conversationId: number, newStatus: string) => void
  onUpdate?: () => void
}

export function ConversationModal({ conversation, isOpen, onClose, onStatusChange, onUpdate }: ConversationModalProps) {
  const [isActionsExpanded, setIsActionsExpanded] = useState(true)
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; name: string; last_name: string; display_name: string; email: string; avatar: string | null }>>([])
  const { toast } = useToast()

  // Fetch messages, departments, tags, and users when modal opens
  useEffect(() => {
    if (isOpen && conversation) {
      fetchMessages()
      fetchMetadata()
      // Clear reply text when opening modal
      setReplyText("")
    }
  }, [isOpen, conversation])

  const fetchMessages = async () => {
    if (!conversation) return
    setLoading(true)
    try {
      const data = await conversationService.getConversation(conversation.id)
      setMessages(data.messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversation messages"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMetadata = async () => {
    try {
      const [departments, tags, users] = await Promise.all([
        conversationService.getDepartments(),
        conversationService.getTags(),
        conversationService.getUsers()
      ])
      setAvailableDepartments(departments.map(d => d.name))
      setAvailableTags(tags.map(t => t.name))
      setAvailableUsers(users)
    } catch (error) {
      console.error('Error fetching metadata:', error)
    }
  }

  const handleTicketHeaderChange = async (field: 'status' | 'priority' | 'department', value: string) => {
    if (!conversation) return

    try {
      const updates: any = {}
      if (field === 'status') updates.status = value
      if (field === 'priority') updates.priority = value
      if (field === 'department') {
        const dept = availableDepartments.find(d => d === value)
        if (dept) updates.department_id = dept
      }

      await conversationService.updateConversationProperties(conversation.id, updates)

      toast({
        title: "Success",
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`
      })

      // Call parent callbacks
      if (field === 'status' && onStatusChange) {
        onStatusChange(conversation.id, value)
      }

      // Notify parent to refresh data
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update ${field}`
      })
    }
  }

  const getSourceIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-3 h-3" />
      case 'whatsapp': return <Phone className="w-3 h-3" />
      case 'telegram': return <MessageCircle className="w-3 h-3" />
      case 'web': return <MessageCircle className="w-3 h-3" />
      default: return <Monitor className="w-3 h-3" />
    }
  }

  const getSourceColor = (channel: string) => {
    switch (channel) {
      case 'email': return 'blue'
      case 'whatsapp': return 'green'
      case 'telegram': return 'blue'
      case 'web': return 'purple'
      default: return 'gray'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'gray'
      case 'medium': return 'yellow'
      case 'high': return 'red'
      case 'urgent': return 'red-dot'
      default: return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'blue'
      case 'user_reply': return 'green'
      case 'agent_reply': return 'blue'
      case 'processing': return 'yellow'
      case 'closed': return 'gray'
      case 'archived': return 'gray'
      case 'postponed': return 'yellow'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Circle className="w-3 h-3 mr-1" />
      case 'user_reply': return <ArrowUp className="w-3 h-3 mr-1" />
      case 'agent_reply': return <ArrowDown className="w-3 h-3 mr-1" />
      case 'processing': return <Loader className="w-3 h-3 mr-1" />
      case 'closed': return <XCircle className="w-3 h-3 mr-1" />
      case 'archived': return <Archive className="w-3 h-3 mr-1" />
      case 'postponed': return <Clock className="w-3 h-3 mr-1" />
      default: return <Circle className="w-3 h-3 mr-1" />
    }
  }


  const [isSending, setIsSending] = useState(false)

  const handleSendReply = async () => {
    if (!conversation || !replyText.trim() || isSending) return

    setIsSending(true)
    try {
      const response = await conversationService.sendMessage(conversation.id, replyText.trim())

      // Add the new message to the messages list
      setMessages(prev => [...prev, response.message])

      toast({
        title: "Reply sent",
        description: "Your reply has been sent to the customer"
      })
      setReplyText("")

      // Notify parent to refresh data
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reply. Please try again."
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleFastReply = async () => {
    if (!conversation || !replyText.trim() || isSending) return

    setIsSending(true)
    try {
      // Send the message
      const response = await conversationService.sendMessage(conversation.id, replyText.trim())

      // Add the new message to the messages list
      setMessages(prev => [...prev, response.message])

      // Update conversation status to agent_reply
      await conversationService.updateConversationProperties(conversation.id, {
        status: 'agent_reply'
      })

      toast({
        title: "Fast reply sent",
        description: "Your reply has been sent and status changed to Agent Reply"
      })
      setReplyText("")

      // Notify parent to refresh data
      if (onUpdate) {
        onUpdate()
      }

      // Call onStatusChange if provided to update the UI immediately
      if (onStatusChange) {
        onStatusChange(conversation.id, 'agent_reply')
      }
    } catch (error) {
      console.error('Error sending fast reply:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send fast reply. Please try again."
      })
    } finally {
      setIsSending(false)
    }
  }

  if (!conversation) return null

  const statuses = [
    { value: "new", label: "New" },
    { value: "user_reply", label: "User Reply" },
    { value: "agent_reply", label: "Agent Reply" },
    { value: "processing", label: "Processing" },
    { value: "closed", label: "Closed" },
    { value: "archived", label: "Archived" },
    { value: "postponed", label: "Postponed" },
  ]

  const priorities = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent Priority" },
  ]

  // Format visitor information from conversation data
  const visitorInfo = {
    name: conversation.customer.name,
    email: conversation.customer.email,
    phone: conversation.customer.phone || "Not provided",
    location: "Not provided",
    localTime: new Date().toLocaleTimeString(),
    language: conversation.customer.language || "Not specified",
    ip: conversation.ip || "Not available",
    os: conversation.operating_system || "Not available",
    browser: conversation.browser || "Not available",
    country: "Not specified",
    clientId: conversation.customer.id,
    externalIDs: conversation.customer.external_ids || [],
    timezone: conversation.customer.timezone
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] lg:max-w-[1200px] max-h-[80vh] sm:max-h-[85vh] w-full p-0 rounded-lg sm:rounded-xl overflow-hidden [&>button]:hidden my-auto shadow-2xl border-2">
        <div className="flex flex-col h-full max-h-[80vh] sm:max-h-[85vh]">
          {/* Conversation Header */}
          <div className="p-3 sm:p-4 border-b border-border bg-card relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 sm:right-4 sm:top-4 p-1 h-7 w-7 sm:h-8 sm:w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <DialogTitle className="text-base sm:text-xl font-semibold mb-2 sm:mb-3 pr-10 sm:pr-12">
              {conversation.title || `Conversation #${conversation.conversation_number}`}
            </DialogTitle>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <CustomBadge variant={getSourceColor(conversation.channel) as any} className="text-[10px] sm:text-xs h-5 sm:h-6 px-2 sm:px-3">
                {getSourceIcon(conversation.channel)}
                <span className="ml-1 capitalize">{conversation.channel.replace('_', ' ')}</span>
              </CustomBadge>

              {/* Status Badge */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <CustomBadge variant={getStatusColor(conversation.status) as any} className="text-[10px] sm:text-xs h-5 sm:h-6 cursor-pointer hover:opacity-80">
                      {getStatusIcon(conversation.status)}
                      <span className="capitalize">{conversation.status.replace('_', ' ')}</span>
                    </CustomBadge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statuses.map((status) => (
                    <DropdownMenuItem
                      key={status.value}
                      onClick={() => handleTicketHeaderChange('status', status.value)}
                      className="cursor-pointer"
                    >
                      {getStatusIcon(status.value)}
                      {status.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Priority Badge */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <CustomBadge variant={getPriorityColor(conversation.priority) as any} className="text-[10px] sm:text-xs h-5 sm:h-6 cursor-pointer hover:opacity-80">
                      <span className="capitalize">{conversation.priority} Priority</span>
                    </CustomBadge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Change Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {priorities.map((priority) => (
                    <DropdownMenuItem
                      key={priority.value}
                      onClick={() => handleTicketHeaderChange('priority', priority.value)}
                      className="cursor-pointer"
                    >
                      {priority.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Department Badge */}
              {conversation.department && (
                <CustomBadge variant="gray" className="text-[10px] sm:text-xs h-5 sm:h-6 hidden sm:inline-flex">
                  <Building className="w-3 h-3 mr-1" />
                  {conversation.department.name}
                </CustomBadge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 pt-3 sm:pt-4 min-h-0">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-full">
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 max-w-full">
                {/* AI Summary */}
                <Card className="mb-3 sm:mb-6">
                  <CardHeader className="cursor-pointer p-3 sm:p-6" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                        AI Summary
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-[10px] sm:text-xs p-1 sm:p-2 h-auto">
                        <ChevronUp className={`w-4 h-4 mr-1 transition-transform ${isSummaryExpanded ? '' : 'rotate-180'}`} />
                        {isSummaryExpanded ? 'Collapse' : 'Expand'}
                      </Button>
                    </div>
                  </CardHeader>
                  {isSummaryExpanded && (
                    <CardContent className="p-3 sm:p-6 pt-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {conversation.last_message_preview || conversation.title || "No summary available"}
                      </p>
                    </CardContent>
                  )}
                </Card>

                {/* Messages */}
                <div className="mb-1">
                  <h3 className="text-xs sm:text-sm font-semibold mb-2 px-1">Messages ({messages.length})</h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-3 sm:mb-6 min-h-[200px] sm:min-h-0 bg-muted/10 rounded-lg p-2 sm:p-3">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((message) => (
                      <div key={message.id} className={`flex gap-2 sm:gap-3 ${message.is_agent ? "flex-row-reverse" : ""}`}>
                        <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                          <AvatarFallback
                            className="text-xs font-medium text-white"
                            style={{ backgroundColor: getAvatarColor(message.author?.name || "Unknown") }}
                          >
                            {message.author?.initials || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 max-w-[80%] sm:max-w-[70%] ${message.is_agent ? "text-right" : ""}`}>
                          <div className={`inline-block p-2 sm:p-4 rounded-lg ${message.is_agent ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                              <span className="font-medium text-xs sm:text-sm">{message.author?.name || "Unknown"}</span>
                              <span className="text-[10px] sm:text-xs opacity-70">{formatTime(message.created_at)}</span>
                            </div>
                            <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.body}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <p className="text-sm">No messages yet</p>
                    </div>
                  )}
                </div>

                {/* Reply Section */}
                <Card className="flex-shrink-0">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">SA</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1">
                          <span className="text-xs font-medium">Reply to:</span>
                          <div className="text-xs truncate">
                            <span className="font-medium">{conversation.customer.name}</span>
                            <span className="text-muted-foreground"> ({conversation.customer.email})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <WysiwygEditor
                      value={replyText}
                      onChange={setReplyText}
                      placeholder="Type your reply..."
                      onSend={handleSendReply}
                      onFastReply={handleFastReply}
                      disabled={isSending}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="hidden lg:block lg:w-80 space-y-4">
                <ConversationActions
                  currentPriority={conversation.priority}
                  currentStatus={conversation.status}
                  currentDepartment={conversation.department?.name || ""}
                  currentAssignees={conversation.assigned_agents?.map(a => a.id) || []}
                  currentTags={conversation.tags?.map(t => t.name) || []}
                  availableDepartments={availableDepartments}
                  availableTags={availableTags}
                  availableUsers={availableUsers}
                  isExpanded={isActionsExpanded}
                  onToggle={() => setIsActionsExpanded(!isActionsExpanded)}
                  onPriorityChange={(priority) => handleTicketHeaderChange('priority', priority)}
                  onStatusChange={(status) => handleTicketHeaderChange('status', status)}
                  onDepartmentChange={(department) => handleTicketHeaderChange('department', department)}
                  onAssigneesChange={async (assignees) => {
                    try {
                      await conversationService.assignUsersToConversation(conversation.id, assignees)
                      toast({ title: "Success", description: "Assignees updated" })
                      if (onUpdate) onUpdate()
                    } catch (error) {
                      toast({ variant: "destructive", title: "Error", description: "Failed to update assignees" })
                    }
                  }}
                  onTagsChange={async (tags) => {
                    try {
                      const tagObjs = await conversationService.getTags()
                      const tagIds = tags.map(tagName => {
                        const tag = tagObjs.find(t => t.name === tagName)
                        return tag?.id
                      }).filter(Boolean) as number[]
                      await conversationService.updateConversationTags(conversation.id, tagIds)
                      toast({ title: "Success", description: "Tags updated" })
                      if (onUpdate) onUpdate()
                    } catch (error) {
                      toast({ variant: "destructive", title: "Error", description: "Failed to update tags" })
                    }
                  }}
                />

                <VisitorInformation visitor={visitorInfo} currentConversationId={conversation.id} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

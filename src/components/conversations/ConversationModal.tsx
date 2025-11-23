"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CustomBadge } from "@/components/ui/custom-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisitorInformation } from "./VisitorInformation"
import { ConversationActions } from "./ConversationActions"
import { WysiwygEditor } from "./WysiwygEditor"
import { CannedMessages } from "./CannedMessages"
import { 
  Mail, 
  Globe, 
  MessageCircle, 
  Phone, 
  Monitor, 
  ChevronUp, 
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Circle,
  CircleDot,
  Clock,
  CheckCircle,
  XCircle,
  Minus,
  AlertCircle,
  AlertTriangle,
  Zap,
  Building,
  Loader
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
import type { Conversation } from "@/types/conversation.types"

// Use the correct conversation interface from types

interface ConversationModalProps {
  conversation: Conversation | null
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (ticketId: number, newStatus: string) => void
}

export function ConversationModal({ conversation, isOpen, onClose, onStatusChange }: ConversationModalProps) {
  const [isActionsExpanded, setIsActionsExpanded] = useState(false)
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false)
  const [replyText, setReplyText] = useState(() => {
    if (!conversation?.customer?.name) return "Hi there,\n\nThank you for contacting us. I understand your concern and I'm here to help you resolve this issue. Let me look into this matter immediately and provide you with a solution.\n\nPlease let me know if you need any additional information."
    return "Hi " + (conversation.customer.name.split(' ')[0] || "there") + ",\n\nThank you for contacting us. I understand your concern and I'm here to help you resolve this issue. Let me look into this matter immediately and provide you with a solution.\n\nPlease let me know if you need any additional information."
  })
  const [conversationActions, setConversationActions] = useState({
    priority: conversation?.priority || "medium",
    status: conversation?.status || "new", 
    department: "Support Department",
    assignees: ["1", "2"],
    tags: ["support", "customer-inquiry"]
  })

  // Conversation header state (same as conversations page)
  const [ticketHeader, setTicketHeader] = useState({
    priority: conversation?.priority || "medium",
    status: conversation?.status || "new",
    department: conversation?.department || "Support Department"
  })

  // Loading states for conversation header changes
  const [loadingStates, setLoadingStates] = useState({
    status: false,
    priority: false,
    department: false
  })
  
  // Return early if no conversation is provided (after all hooks)
  if (!conversation) {
    return null
  }

  // Available options (same as conversations page)
  const availableStatuses = [
    { value: "new", label: "New" },
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ]

  const availablePriorities = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent Priority" },
  ]

  const availableDepartments = [
    "Sales Department",
    "Support Department", 
    "Marketing Department",
    "Technical Department",
    "Billing Department"
  ]

  // Handle conversation header changes (same as conversations page)
  const handleTicketHeaderChange = async (field: 'status' | 'priority' | 'department', value: string) => {
    setLoadingStates(prev => ({ ...prev, [field]: true }))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setTicketHeader(prev => ({ ...prev, [field]: value }))
    setLoadingStates(prev => ({ ...prev, [field]: false }))
    
    // Call parent onStatusChange if status changed
    if (field === 'status' && onStatusChange) {
      onStatusChange(conversation.id, value)
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'email': return 'blue'
      case 'webform': return 'green'
      case 'whatsapp': return 'green'
      case 'phone_call': return 'yellow'
      case 'webchat': return 'purple'
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
      case 'open': return 'green'
      case 'pending': return 'yellow'
      case 'resolved': return 'green'
      case 'closed': return 'gray'
      default: return 'gray'
    }
  }

  if (!conversation) return null

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'email': return <Mail className="w-3 h-3" />
      case 'webform': return <Globe className="w-3 h-3" />
      case 'whatsapp': return <MessageCircle className="w-3 h-3" />
      case 'phone_call': return <Phone className="w-3 h-3" />
      case 'webchat': return <MessageCircle className="w-3 h-3" />
      default: return <Monitor className="w-3 h-3" />
    }
  }

  const handleSaveTicketActions = () => {
    console.log('Saving conversation actions:', conversationActions)
    if (onStatusChange && conversationActions.status !== conversation.status) {
      onStatusChange(conversation.id, conversationActions.status)
    }
  }

  const handleCannedMessageSelect = (message: string) => {
    setReplyText(message)
  }

  // Mock visitor data based on conversation
  const mockVisitor = {
    name: conversation.customer?.name || "Unknown",
    email: conversation.customer?.email || "Unknown",
    phone: conversation.customer?.phone || "Unknown",
    location: "Location not provided",
    localTime: "Current time",
    language: "English",
    ip: "192.168.1.100",
    os: "Windows 10",
    browser: "Chrome",
    country: "Unknown"
  }

  // Mock messages based on conversation
  const mockMessages = [
    {
      id: 1,
      author: conversation.customer?.name || "Customer",
      initials: getInitials(conversation.customer?.name || "Customer"),
      time: new Date(conversation.created_at).toLocaleTimeString(),
      message: conversation.title + "\n\nThis is the detailed description of the issue. The customer is experiencing problems and needs assistance with resolving this matter."
    },
    {
      id: 2,
      author: "Support Agent",
      initials: "SA",
      time: "Just now",
      message: "Thank you for contacting us. I understand your concern and I'm here to help you resolve this issue. Let me look into this matter immediately."
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] sm:max-w-[95vw] max-h-[85vh] sm:max-h-[90vh] w-full p-0 rounded-lg sm:rounded-xl overflow-hidden [&>button]:hidden my-auto">
        <div className="flex flex-col h-full max-h-[85vh] sm:max-h-[90vh]">
          {/* Conversation Header - Mobile Responsive */}
          <div className="p-3 sm:p-4 border-b border-border bg-card relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 sm:right-4 sm:top-4 p-1 h-7 w-7 sm:h-8 sm:w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <DialogTitle className="text-base sm:text-xl font-semibold mb-2 sm:mb-3 pr-10 sm:pr-12">{conversation.title}</DialogTitle>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <CustomBadge variant={getSourceColor(conversation.channel || 'email') as "blue" | "green" | "yellow" | "purple" | "gray"} className="text-[10px] sm:text-xs h-5 sm:h-6 px-2 sm:px-3">
                {getSourceIcon(conversation.channel || 'email')}
                <span className="ml-1 capitalize">{(conversation.channel || 'email').replace('_', ' ')}</span>
              </CustomBadge>
              
              {/* Clickable Status Badge */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none" disabled={loadingStates.status}>
                    <CustomBadge variant={getStatusColor(ticketHeader.status) as "blue" | "green" | "yellow" | "gray"} className="text-[10px] sm:text-xs h-5 sm:h-6 cursor-pointer hover:opacity-80 disabled:opacity-60">
                      {loadingStates.status ? (
                        <Loader className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <>
                          {ticketHeader.status === 'new' && <Circle className="w-3 h-3 mr-1" />}
                          {ticketHeader.status === 'open' && <CircleDot className="w-3 h-3 mr-1" />}
                          {ticketHeader.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {ticketHeader.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {ticketHeader.status === 'closed' && <XCircle className="w-3 h-3 mr-1" />}
                        </>
                      )}
                      <span className="capitalize">{loadingStates.status ? 'Updating...' : ticketHeader.status}</span>
                    </CustomBadge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableStatuses.map((status) => (
                    <DropdownMenuItem
                      key={status.value}
                      onClick={() => handleTicketHeaderChange('status', status.value)}
                      className="cursor-pointer"
                      disabled={loadingStates.status}
                    >
                      {status.value === 'new' && <Circle className="mr-2 h-4 w-4 text-blue-500" />}
                      {status.value === 'open' && <CircleDot className="mr-2 h-4 w-4 text-green-500" />}
                      {status.value === 'pending' && <Clock className="mr-2 h-4 w-4 text-yellow-500" />}
                      {status.value === 'resolved' && <CheckCircle className="mr-2 h-4 w-4 text-green-600" />}
                      {status.value === 'closed' && <XCircle className="mr-2 h-4 w-4 text-gray-500" />}
                      {status.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clickable Priority Badge */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none" disabled={loadingStates.priority}>
                    <CustomBadge variant={getPriorityColor(ticketHeader.priority) as "gray" | "yellow" | "red" | "red-dot"} className="text-[10px] sm:text-xs h-5 sm:h-6 cursor-pointer hover:opacity-80 disabled:opacity-60">
                      {loadingStates.priority ? (
                        <Loader className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <>
                          {ticketHeader.priority === 'low' && <Minus className="w-3 h-3 mr-1" />}
                          {ticketHeader.priority === 'medium' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {ticketHeader.priority === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {ticketHeader.priority === 'urgent' && <Zap className="w-3 h-3 mr-1" />}
                        </>
                      )}
                      <span className="capitalize">{loadingStates.priority ? 'Updating...' : `${ticketHeader.priority} Priority`}</span>
                    </CustomBadge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Change Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availablePriorities.map((priority) => (
                    <DropdownMenuItem
                      key={priority.value}
                      onClick={() => handleTicketHeaderChange('priority', priority.value)}
                      className="cursor-pointer"
                      disabled={loadingStates.priority}
                    >
                      {priority.value === 'low' && <Minus className="mr-2 h-4 w-4 text-gray-500" />}
                      {priority.value === 'medium' && <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />}
                      {priority.value === 'high' && <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />}
                      {priority.value === 'urgent' && <Zap className="mr-2 h-4 w-4 text-red-600" />}
                      {priority.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Clickable Department Badge */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none" disabled={loadingStates.department}>
                    <CustomBadge variant="gray" className="text-[10px] sm:text-xs h-5 sm:h-6 cursor-pointer hover:opacity-80 disabled:opacity-60 hidden sm:inline-flex">
                      {loadingStates.department ? (
                        <Loader className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Building className="w-3 h-3 mr-1" />
                      )}
                      {loadingStates.department ? 'Updating...' : ticketHeader.department}
                    </CustomBadge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Change Department</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableDepartments.map((dept) => (
                    <DropdownMenuItem
                      key={dept}
                      onClick={() => handleTicketHeaderChange('department', dept)}
                      className="cursor-pointer"
                      disabled={loadingStates.department}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      {dept}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>


          {/* Content - Mobile Responsive */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 pt-3 sm:pt-4 min-h-0">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-full">
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 max-w-full">
                {/* AI Summary - Mobile Responsive */}
                <Card className="mb-3 sm:mb-6">
                  <CardHeader className="cursor-pointer p-3 sm:p-6" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                        AI Summary
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-[10px] sm:text-xs p-1 sm:p-2 h-auto">
                        {isSummaryExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Collapse
                          </>
                        ) : (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1 rotate-180" />
                            Expand
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {isSummaryExpanded && (
                    <CardContent className="p-3 sm:p-6 pt-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Customer experiencing issues with {conversation.title.toLowerCase()}. This is a {conversation.priority}-priority conversation that requires immediate attention. The customer has provided details about their problem and is waiting for a resolution.
                      </p>
                    </CardContent>
                  )}
                </Card>

                {/* Messages - Mobile Responsive */}
                <div className="mb-1">
                  <h3 className="text-xs sm:text-sm font-semibold mb-2 px-1">Customer Messages</h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-6 mb-3 sm:mb-6 min-h-[200px] sm:min-h-0 bg-muted/10 rounded-lg p-2 sm:p-3">
                  {mockMessages.map((message, index) => (
                    <div key={message.id} className={`flex gap-2 sm:gap-3 ${message.author === "Support Agent" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                        <AvatarFallback 
                          className="text-xs font-medium text-white"
                          style={{ backgroundColor: getAvatarColor(message.author) }}
                        >
                          {message.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-[80%] sm:max-w-[70%] ${message.author === "Support Agent" ? "text-right" : ""}`}>
                        <div className={`inline-block p-2 sm:p-4 rounded-lg ${
                          message.author === "Support Agent" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <span className="font-medium text-xs sm:text-sm break-all sm:break-words">{message.author || 'Customer'}</span>
                            <span className="text-[10px] sm:text-xs opacity-70 whitespace-nowrap">{message.time}</span>
                          </div>
                          <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Section - Mobile Responsive */}
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
                            <span className="font-medium">{conversation.customer?.name || 'Customer'}</span>
                            <span className="text-muted-foreground"> ({conversation.customer?.email})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <WysiwygEditor
                      value={replyText}
                      onChange={setReplyText}
                      placeholder="Type your reply..."
                      onSend={() => {
                        console.log('Sending reply:', replyText)
                      }}
                      onFastReply={() => {
                        console.log('Fast reply sent:', replyText)
                      }}
                      className="mb-4"
                    />
                    
                    <div className="flex justify-start">
                      <CannedMessages onMessageSelect={handleCannedMessageSelect} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Hidden on Mobile */}
              <div className="hidden lg:block lg:w-80 space-y-4">
                <ConversationActions
                  currentPriority={conversationActions.priority}
                  currentStatus={conversationActions.status}
                  currentDepartment={conversationActions.department}
                  currentAssignees={conversationActions.assignees}
                  currentTags={conversationActions.tags}
                  isExpanded={isActionsExpanded}
                  onToggle={() => setIsActionsExpanded(!isActionsExpanded)}
                  onPriorityChange={(priority) => setConversationActions(prev => ({ ...prev, priority }))}
                  onStatusChange={(status) => setConversationActions(prev => ({ ...prev, status }))}
                  onDepartmentChange={(department) => setConversationActions(prev => ({ ...prev, department }))}
                  onAssigneesChange={(assignees) => setConversationActions(prev => ({ ...prev, assignees }))}
                  onTagsChange={(tags) => setConversationActions(prev => ({ ...prev, tags }))}
                  hasChanges={JSON.stringify(conversationActions) !== JSON.stringify({
                    priority: conversation?.priority || "medium",
                    status: conversation?.status || "new",
                    department: "Support Department", 
                    assignees: ["1", "2"],
                    tags: ["support", "customer-inquiry"]
                  })}
                  onSave={handleSaveTicketActions}
                />
                
                <VisitorInformation visitor={mockVisitor} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
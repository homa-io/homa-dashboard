"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CustomBadge } from '@/components/ui/custom-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAgentWebSocket, WebSocketMessage } from '@/hooks/useAgentWebSocket'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Search, Filter, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Download, FileText, Image as ImageIcon, ChevronDown, Reply, Mail, Globe, MessageCircle, Phone, Monitor, ChevronUp, Sparkles, Check, ArrowUpDown, ArrowUp, ArrowDown, AlertCircle, CircleDot, X, Tag, Building, Minus, AlertTriangle, Zap, Circle, Clock, CheckCircle, XCircle, Pause, Loader, Archive, UserCheck, Languages, Bot } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { VisitorInformation } from '@/components/conversations/VisitorInformation'
import { ConversationActions } from '@/components/conversations/ConversationActions'
import { WysiwygEditor } from '@/components/conversations/WysiwygEditor'
import { ConversationModal } from '@/components/conversations/ConversationModal'
import { ConversationSummary } from '@/components/conversations/ConversationSummary'
import { getAvatarColor, getInitials } from '@/lib/avatar-colors'
import { conversationService } from '@/services'
import { getMediaUrl } from '@/services/api-client'
import type { Conversation } from '@/types/conversation.types'
import { useToast } from '@/hooks/use-toast'
import { useMessageTranslation } from '@/hooks/useMessageTranslation'
import { MessageBubble } from '@/components/conversations/MessageBubble'

export default function ConversationsContent() {
  const { toast } = useToast()
  const router = useRouter()

  // WebSocket state for real-time updates
  const [wsConnected, setWsConnected] = useState(false)

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isActionsExpanded, setIsActionsExpanded] = useState(true)
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false)

  // Filter state (single-select for most, multi-select for tags)
  const [filterAssignedToMe, setFilterAssignedToMe] = useState(true) // Checked by default
  const [filterSource, setFilterSource] = useState<string | null>(null)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [tagSearchQuery, setTagSearchQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // API state
  const [apiConversations, setApiConversations] = useState<Conversation[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalConversations, setTotalConversations] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([])
  const [availableTags, setAvailableTags] = useState<Array<{ id: number; name: string; color: string }>>([])
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; name: string; last_name: string; display_name: string; email: string; avatar: string | null }>>([])
  const [isSending, setIsSending] = useState(false)

  // Ref for auto-scrolling to last message
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Ref to track selectedConversationId for WebSocket handler (to avoid stale closure)
  const selectedConversationIdRef = useRef<number | null>(null)
  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId
  }, [selectedConversationId])

  // Get URL search parameters
  const searchParams = useSearchParams()

  // Handle URL parameters (ticket_id for search, id for selected conversation)
  useEffect(() => {
    const ticketId = searchParams.get('ticket_id')
    if (ticketId) {
      setSearchQuery(ticketId)
    }

    const conversationId = searchParams.get('id')
    if (conversationId) {
      const id = parseInt(conversationId, 10)
      if (!isNaN(id)) {
        setSelectedConversationId(id)
      }
    }
  }, [searchParams])

  // Function to select a conversation and update URL
  const selectConversation = useCallback((id: number) => {
    setSelectedConversationId(id)
    // Update URL without full page reload
    const params = new URLSearchParams(searchParams.toString())
    params.set('id', id.toString())
    router.push(`/conversations?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Fetch departments, tags, and users on component mount
  useEffect(() => {
    const fetchDepartmentsTagsAndUsers = async () => {
      try {
        const [depts, tags, users] = await Promise.all([
          conversationService.getDepartments(),
          conversationService.getTags(),
          conversationService.getUsers()
        ])
        setDepartments(depts.map(d => ({ id: d.id, name: d.name })))
        setAvailableTags(tags.map(t => ({ id: t.id, name: t.name, color: t.color })))
        setAvailableUsers(users)
      } catch (err) {
        console.error('Error fetching departments, tags, and users:', err)
      }
    }
    fetchDepartmentsTagsAndUsers()
  }, [])

  // Handle WebSocket messages for real-time updates
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    console.log('WebSocket message received:', message)

    // Handle different event types
    const eventType = message.event || message.type

    switch (eventType) {
      case 'message.created':
      case 'conversation.message':
        // New message received - refresh conversation list and current conversation
        setRefreshTrigger(prev => prev + 1)

        // If this is for the currently selected conversation, fetch new messages
        // Use ref to avoid stale closure issue
        // The backend sends: { event: "message.created", message: { conversation_id, ... }, ... }
        const wsMessage = message as unknown as { message?: { conversation_id?: number } }
        const conversationId = wsMessage.message?.conversation_id
        const currentSelectedId = selectedConversationIdRef.current
        if (conversationId && currentSelectedId && conversationId === currentSelectedId) {
          // Refetch current conversation messages
          conversationService.getConversation(currentSelectedId, 1, 1000, 'asc').then(detailData => {
            const transformedMessages = detailData.messages.map(msg => ({
              id: msg.id,
              message: msg.body,
              language: msg.language,
              isAgent: msg.is_agent,
              time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              author: msg.author.name,
              avatarUrl: getMediaUrl(msg.author.avatar_url),
              attachments: msg.attachments
            }))
            setConversationMessages(transformedMessages)
          }).catch(err => {
            console.error('Error fetching updated messages:', err)
          })
        }
        break

      case 'conversation.created':
      case 'conversation.updated':
        // Conversation created or updated - refresh the list
        setRefreshTrigger(prev => prev + 1)
        break

      default:
        // For any other events, also trigger a refresh
        if (eventType) {
          setRefreshTrigger(prev => prev + 1)
        }
    }
  }, []) // No dependencies - we use selectedConversationIdRef to avoid stale closure

  // Connect to agent WebSocket for real-time updates
  const { isConnected: wsIsConnected } = useAgentWebSocket({
    onMessage: handleWebSocketMessage,
    onConnect: () => {
      console.log('Agent WebSocket connected')
      setWsConnected(true)
    },
    onDisconnect: () => {
      console.log('Agent WebSocket disconnected')
      setWsConnected(false)
    },
    onError: (error) => {
      console.error('Agent WebSocket error:', error)
    },
    autoReconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  })

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setError(null)

        const params: any = {
          page: currentPage,
          limit: 25,
          sort_order: sortOrder,
        }

        // Filter by assigned to me or show all from department
        if (filterAssignedToMe) {
          params.assigned_to_me = true
        }

        if (searchQuery.trim()) {
          params.search = searchQuery.trim()
        }

        if (filterStatus) {
          params.status = filterStatus
        }

        if (filterPriority) {
          params.priority = filterPriority
        }

        if (filterSource) {
          params.channel = filterSource
        }

        if (filterTags.length > 0) {
          params.tags = filterTags.join(',')
        }

        const result = await conversationService.searchConversations(params)

        setApiConversations(result.data)
        setTotalConversations(result.total)
      } catch (err) {
        console.error('Error fetching conversations:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch conversations')
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchConversations()
  }, [searchQuery, filterStatus, filterPriority, filterSource, filterTags, filterAssignedToMe, sortOrder, currentPage, refreshTrigger])

  // Auto-select first conversation on page load
  useEffect(() => {
    if (apiConversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(apiConversations[0].id)
    }
  }, [apiConversations, selectedConversationId])

  // Get currently selected conversation
  const selectedConversation = apiConversations.find(conversation => conversation.id === selectedConversationId)

  // Sync ticketActions and ticketHeader with selected conversation
  useEffect(() => {
    if (selectedConversation) {
      // Update ticket header
      setTicketHeader({
        priority: selectedConversation.priority || 'medium',
        status: selectedConversation.status || 'new',
        department: selectedConversation.department?.name || 'Support Department'
      })

      // Update ticket actions
      setTicketActions({
        priority: selectedConversation.priority || 'medium',
        status: selectedConversation.status || 'new',
        department: selectedConversation.department?.name || 'Support Department',
        assignees: selectedConversation.assigned_agents?.map(u => u.id) || [],
        tags: selectedConversation.tags?.map(t => t.name) || []
      })
    }
  }, [selectedConversation])

  // Handle send reply
  const handleSendReply = async (directMessage?: string) => {
    // Use direct message if provided (from Smart Reply), otherwise use replyText state
    const messageToSend = directMessage || replyText
    if (!selectedConversation || !messageToSend.trim() || isSending) return

    setIsSending(true)
    const conversationId = selectedConversation.id
    try {
      await conversationService.sendMessage(conversationId, messageToSend.trim())

      toast({
        title: "Reply sent",
        description: "Your reply has been sent to the customer"
      })
      setReplyText("")

      // Refresh conversations list
      setRefreshTrigger(prev => prev + 1)

      // Refresh the current conversation details and messages
      try {
        const detailData = await conversationService.getConversation(conversationId, 1, 1000, 'asc')

        // Transform messages to match component format
        const transformedMessages = detailData.messages.map(msg => ({
          id: msg.id,
          message: msg.body,
          language: msg.language,
          isAgent: msg.is_agent,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          author: msg.author.name,
          avatarUrl: getMediaUrl(msg.author.avatar_url),
          attachments: msg.attachments
        }))

        setConversationMessages(transformedMessages)
      } catch (err) {
        console.error('Error refreshing conversation details:', err)
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

  // Handle fast reply - send message and change status to agent_reply
  const handleFastReply = async () => {
    if (!selectedConversation || !replyText.trim() || isSending) return

    setIsSending(true)
    const conversationId = selectedConversation.id
    try {
      // Send the message
      await conversationService.sendMessage(conversationId, replyText.trim())

      // Update conversation status to agent_reply
      await conversationService.updateConversationProperties(conversationId, {
        status: 'agent_reply'
      })

      toast({
        title: "Fast reply sent",
        description: "Your reply has been sent and status changed to Agent Reply"
      })
      setReplyText("")

      // Refresh conversations list
      setRefreshTrigger(prev => prev + 1)

      // Refresh the current conversation details and messages
      try {
        const detailData = await conversationService.getConversation(conversationId, 1, 1000, 'asc')

        // Transform messages to match component format
        const transformedMessages = detailData.messages.map(msg => ({
          id: msg.id,
          message: msg.body,
          language: msg.language,
          isAgent: msg.is_agent,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          author: msg.author.name,
          avatarUrl: getMediaUrl(msg.author.avatar_url),
          attachments: msg.attachments
        }))

        setConversationMessages(transformedMessages)
      } catch (err) {
        console.error('Error refreshing conversation details:', err)
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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'email': return <Mail className="w-3 h-3" />
      case 'webform': return <Globe className="w-3 h-3" />
      case 'whatsapp': return <MessageCircle className="w-3 h-3" />
      case 'phone_call': return <Phone className="w-3 h-3" />
      case 'webchat': return <Monitor className="w-3 h-3" />
      default: return <Mail className="w-3 h-3" />
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
      case 'wait_for_agent': return 'yellow'
      case 'in_progress': return 'blue'
      case 'wait_for_user': return 'green'
      case 'on_hold': return 'yellow'
      case 'resolved': return 'green'
      case 'closed': return 'gray'
      case 'unresolved': return 'red'
      case 'spam': return 'gray'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Circle className="w-3 h-3" />
      case 'wait_for_agent': return <Clock className="w-3 h-3" />
      case 'in_progress': return <Loader className="w-3 h-3" />
      case 'wait_for_user': return <Clock className="w-3 h-3" />
      case 'on_hold': return <Pause className="w-3 h-3" />
      case 'resolved': return <CheckCircle className="w-3 h-3" />
      case 'closed': return <XCircle className="w-3 h-3" />
      case 'unresolved': return <AlertCircle className="w-3 h-3" />
      case 'spam': return <Archive className="w-3 h-3" />
      default: return <Circle className="w-3 h-3" />
    }
  }

  // Conversation actions state
  const [ticketActions, setTicketActions] = useState({
    priority: "high",
    status: "open",
    department: "Sales Department",
    assignees: ["1", "2"],
    tags: ["payment", "urgent", "visa"]
  })

  // Conversation header state (for the currently selected conversation)
  const [ticketHeader, setTicketHeader] = useState({
    priority: "high",
    status: "open",
    department: "Sales Department"
  })

  // Loading states for conversation header changes
  const [loadingStates, setLoadingStates] = useState({
    status: false,
    priority: false,
    department: false,
    handleByBot: false
  })

  // Modal handlers
  const openTicketModal = (ticketId: number) => {
    setSelectedConversationId(ticketId)
    setIsModalOpen(true)
  }

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    // Update conversation status in your state management
    console.log(`Conversation ${ticketId} status changed to ${newStatus}`)
  }

  // Available options
  const availableStatuses = [
    { value: "new", label: "New" },
    { value: "wait_for_agent", label: "Wait for Agent" },
    { value: "in_progress", label: "In Progress" },
    { value: "wait_for_user", label: "Wait for User" },
    { value: "on_hold", label: "On Hold" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
    { value: "unresolved", label: "Unresolved" },
    { value: "spam", label: "Spam" },
  ]

  const availablePriorities = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent Priority" },
  ]

  // Use dynamically fetched departments or fallback to defaults
  const availableDepartments = departments.length > 0
    ? departments.map(d => d.name)
    : [
      "Sales Department",
      "Support Department",
      "Marketing Department",
      "Technical Department",
      "Billing Department"
    ]

  // Handle conversation header changes
  const handleTicketHeaderChange = async (field: 'status' | 'priority' | 'department', value: string) => {
    if (!selectedConversation) return

    setLoadingStates(prev => ({ ...prev, [field]: true }))

    try {
      const updates: any = {}
      if (field === 'priority') updates.priority = value
      if (field === 'status') updates.status = value
      if (field === 'department') {
        // Find department ID from name
        const department = departments.find(d => d.name === value)
        if (department) {
          updates.department_id = department.id
        } else {
          console.error('Department not found:', value)
          setLoadingStates(prev => ({ ...prev, [field]: false }))
          toast({
            variant: "destructive",
            title: "Error",
            description: "Department not found. Please try again.",
          })
          return
        }
      }

      await conversationService.updateConversationProperties(selectedConversation.id, updates)

      setTicketHeader(prev => ({ ...prev, [field]: value }))

      // Refresh conversations list
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Error updating conversation:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update conversation. Please try again.",
      })
    } finally {
      setLoadingStates(prev => ({ ...prev, [field]: false }))
    }
  }

  // Handlers for immediate save on change
  const handleActionsPriorityChange = async (priority: string) => {
    if (!selectedConversation) return

    setTicketActions(prev => ({ ...prev, priority }))

    try {
      await conversationService.updateConversationProperties(selectedConversation.id, { priority })
      toast({
        title: "Success",
        description: "Priority updated successfully!",
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update priority. Please try again.",
      })
    }
  }

  const handleActionsStatusChange = async (status: string) => {
    if (!selectedConversation) return

    setTicketActions(prev => ({ ...prev, status }))

    try {
      await conversationService.updateConversationProperties(selectedConversation.id, { status })
      toast({
        title: "Success",
        description: "Status updated successfully!",
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status. Please try again.",
      })
    }
  }

  const handleActionsDepartmentChange = async (department: string) => {
    if (!selectedConversation) return

    setTicketActions(prev => ({ ...prev, department }))

    try {
      const dept = departments.find(d => d.name === department)
      if (dept) {
        await conversationService.updateConversationProperties(selectedConversation.id, {
          department_id: dept.id
        })
        toast({
          title: "Success",
          description: "Department updated successfully!",
        })
        setRefreshTrigger(prev => prev + 1)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Department not found. Please try again.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update department. Please try again.",
      })
    }
  }

  // Handler for handle_by_bot toggle
  const handleToggleHandleByBot = async () => {
    if (!selectedConversation) return

    const newValue = !selectedConversation.handle_by_bot
    setLoadingStates(prev => ({ ...prev, handleByBot: true }))

    try {
      await conversationService.updateConversationProperties(selectedConversation.id, {
        handle_by_bot: newValue
      })
      toast({
        title: "Success",
        description: newValue ? "Bot will now handle this conversation" : "Bot handling disabled",
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update bot handling. Please try again.",
      })
    } finally {
      setLoadingStates(prev => ({ ...prev, handleByBot: false }))
    }
  }

  const handleActionsAssigneesChange = async (assignees: string[]) => {
    if (!selectedConversation) return

    setTicketActions(prev => ({ ...prev, assignees }))

    try {
      await conversationService.assignUsersToConversation(selectedConversation.id, assignees)
      toast({
        title: "Success",
        description: "Assignees updated successfully!",
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update assignees. Please try again.",
      })
    }
  }

  const handleActionsTagsChange = async (tags: string[]) => {
    if (!selectedConversation) return

    setTicketActions(prev => ({ ...prev, tags }))

    try {
      // Create tags that don't exist yet
      const newTags: Array<{ id: number; name: string; color: string }> = []
      for (const tagName of tags) {
        const existingTag = availableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase())
        if (!existingTag) {
          // Create the tag
          const createdTag = await conversationService.createTag(tagName)
          newTags.push({ id: createdTag.id, name: createdTag.name, color: createdTag.color })
        }
      }

      // Update availableTags if new tags were created
      if (newTags.length > 0) {
        setAvailableTags(prev => [...prev, ...newTags])
      }

      // Convert tag names to tag IDs (including newly created ones)
      const updatedAvailableTags = [...availableTags, ...newTags]
      const tagIds = tags
        .map(tagName => {
          const tag = updatedAvailableTags.find(t => t.name.toLowerCase() === tagName.toLowerCase())
          return tag?.id
        })
        .filter((id): id is number => id !== undefined)

      await conversationService.updateConversationTags(selectedConversation.id, tagIds)
      toast({
        title: "Success",
        description: "Tags updated successfully!",
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tags. Please try again.",
      })
    }
  }

  const handleCloseConversation = async () => {
    if (!selectedConversation) return

    if (!confirm('Are you sure you want to close this conversation?')) return

    try {
      await conversationService.updateConversationProperties(selectedConversation.id, {
        status: 'closed'
      })

      toast({
        title: "Success",
        description: "Conversation closed successfully!",
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Error closing conversation:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to close conversation. Please try again.",
      })
    }
  }

  const handleArchiveConversation = async () => {
    if (!selectedConversation) return

    if (!confirm('Are you sure you want to archive this conversation?')) return

    try {
      await conversationService.updateConversationProperties(selectedConversation.id, {
        status: 'archived'
      })

      toast({
        title: "Success",
        description: "Conversation archived successfully!",
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Error archiving conversation:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to archive conversation. Please try again.",
      })
    }
  }

  const conversations = [
    {
      id: 1,
      author: "Dean Taylor",
      avatar: "/avatars/dean.jpg",
      initials: "DT",
      title: "Help needed for payment failure",
      preview: "Hi, I need help to process the payment vi...",
      time: "2 mins ago",
      status: "Open",
      priority: "High Priority",
      department: "Sales Department",
      date: "23rd of June at 8 am",
      source: "email",
      aiSummary: "Customer experiencing payment failures with VISA card during checkout process. This is a high-priority issue as the customer needs to launch their marketing campaign today. The payment is consistently failing at the checkout stage, specifically with VISA card processing. Customer has expressed urgency due to campaign deadlines. Support agent has offered to schedule a call for tomorrow at 12:00 PM to provide more direct assistance and troubleshoot the payment processing issue in real-time.",
      conversation: [
        {
          id: "1",
          author: "Dean Taylor",
          initials: "DT",
          time: "23rd of June at 8 am",
          message: "Hi,\n\nI need help to process the payment via my VISA card.\n\nIts returning failed payment after the checkout. I need to send out this campaign within today. can you please help ASAP.\n\nThanks",
          attachments: [
            { name: "doc.pdf", size: "29 KB", type: "pdf" },
            { name: "image.jpg", size: "30 KB", type: "image" }
          ]
        },
        {
          id: "2",
          author: "Support Agent",
          initials: "SA",
          time: "23rd of June at 9:15 am",
          message: "Hi Dean,\n\nThank you for reaching out. I can help you with the payment issue.\n\nCould you please provide:\n- The last 4 digits of your VISA card\n- The exact error message you're seeing\n- Your account email for verification\n\nThis will help me investigate the issue quickly.\n\nBest regards,\nSupport Team",
          isAgent: true
        },
        {
          id: "3",
          author: "Dean Taylor",
          initials: "DT",
          time: "23rd of June at 9:30 am",
          message: "Hi,\n\nThanks for the quick response!\n\nHere are the details:\n- VISA ending in 1234\n- Error: 'Transaction failed - insufficient funds'\n- Account: dean.taylor@gmail.com\n\nBut I'm sure there are sufficient funds in my account. I just made a purchase elsewhere.\n\nPlease help!"
        }
      ],
      visitor: {
        name: "Dean Taylor",
        email: "dean.taylor@gmail.com",
        phone: "Unknown",
        location: "Colombo (View on map)",
        localTime: "06:30 am (+5:30 GMT)",
        language: "English",
        ip: "107.116.91.201",
        os: "Windows 10",
        browser: "Mozilla Firefox"
      }
    },
    {
      id: 2,
      author: "Jenny Wilson",
      avatar: "/avatars/jenny.jpg",
      initials: "JW",
      title: "Hi, I have recently come across your web...",
      preview: "Hi, I have recently come across your web...",
      time: "5 mins ago",
      status: "New",
      priority: "High Priority",
      department: "Marketing Department",
      source: "whatsapp",
      aiSummary: "Customer interested in services and pricing. Requesting information about enterprise solutions and pricing plans through WhatsApp conversation.",
      conversation: [
        {
          id: "1",
          author: "Jenny Wilson",
          initials: "JW",
          time: "23rd of June at 7:45 am",
          message: "Hi, I have recently come across your website and I'm very interested in your services.\n\nCould you please send me more information about your pricing plans and features?\n\nI'm particularly interested in the enterprise solution.\n\nThanks!"
        }
      ],
      visitor: {
        name: "Jenny Wilson",
        email: "jenny.wilson@company.com",
        phone: "+1 (555) 123-4567",
        location: "New York, USA",
        localTime: "02:00 am (-5:00 GMT)",
        language: "English",
        ip: "192.168.1.100",
        os: "macOS Ventura",
        browser: "Safari"
      }
    },
    {
      id: 3,
      author: "Blake Gilmore",
      avatar: "/avatars/blake.jpg",
      initials: "BG",
      title: "Hi, I am locked out of my account. It says...",
      preview: "Hi, I am locked out of my account. It says...",
      time: "8 mins ago",
      status: "New",
      priority: "High Priority",
      department: "Support Department",
      source: "webchat",
      aiSummary: "Account lockout issue reported via webchat. Customer unable to access account with verification problems. Support team investigating login system.",
      conversation: [
        {
          id: "1",
          author: "Blake Gilmore",
          initials: "BG",
          time: "23rd of June at 7:00 am",
          message: "Hi, I am locked out of my account. It says my password is incorrect but I'm sure it's right.\n\nCan you please help me reset it?\n\nThanks"
        }
      ],
      visitor: {
        name: "Blake Gilmore",
        email: "blake.gilmore@email.com",
        phone: "+44 20 7123 4567",
        location: "London, UK",
        localTime: "01:30 am (+0:00 GMT)",
        language: "English",
        ip: "85.91.124.203",
        os: "Ubuntu Linux",
        browser: "Chrome"
      }
    },
    {
      id: 4,
      author: "Robert Gulliver",
      avatar: "/avatars/robert.jpg",
      initials: "RG",
      title: "Hi, I need help to upgrade my account. I...",
      preview: "Hi, I need help to upgrade my account. I...",
      time: "10 mins ago",
      status: "Open",
      priority: "Medium Priority",
      department: "Sales Department",
      source: "webform",
      aiSummary: "Customer inquiring about account upgrade from basic to enterprise plan. Sales opportunity for plan migration with pricing questions.",
      conversation: [
        {
          id: "1",
          author: "Robert Gulliver",
          initials: "RG",
          time: "23rd of June at 6:30 am",
          message: "Hi, I need help to upgrade my account. I want to move from the basic plan to enterprise.\n\nWhat's the process and pricing?\n\nThanks"
        }
      ],
      visitor: {
        name: "Robert Gulliver",
        email: "robert.gulliver@business.com",
        phone: "+1 (416) 555-0123",
        location: "Toronto, Canada",
        localTime: "20:30 pm (-5:00 GMT)",
        language: "English",
        ip: "142.58.91.45",
        os: "macOS Monterey",
        browser: "Safari"
      }
    },
    {
      id: 5,
      author: "Lisa Rodriguez",
      avatar: "/avatars/lisa.jpg",
      initials: "LR",
      title: "Quick question about pricing",
      preview: "Hey! Can you tell me about your premium plan pricing?",
      time: "30 mins ago",
      status: "Open",
      priority: "Low Priority",
      department: "Sales Department",
      source: "webchat",
      aiSummary: "Quick pricing inquiry through webchat. Customer asking about premium plan costs. Agent provided initial pricing information of $299/month. Potential sales conversion opportunity.",
      conversation: [
        {
          id: "1",
          author: "Lisa Rodriguez",
          initials: "LR",
          time: "23rd of June at 5:30 am",
          message: "Hey! Can you tell me about your premium plan pricing?"
        },
        {
          id: "2",
          author: "Support Agent",
          initials: "SA",
          time: "23rd of June at 5:32 am",
          message: "Hi Lisa! I'd be happy to help you with pricing information. Our premium plan starts at $299/month.",
          isAgent: true
        }
      ],
      visitor: {
        name: "Lisa Rodriguez",
        email: "lisa.rodriguez@startup.com",
        phone: "+1 (555) 987-6543",
        location: "Miami, FL",
        localTime: "20:30 pm (-5:00 GMT)",
        language: "English",
        ip: "198.51.100.42",
        os: "Windows 11",
        browser: "Chrome"
      }
    },
    {
      id: 6,
      author: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      initials: "MC",
      title: "API documentation request",
      preview: "Could you provide API documentation for integration?",
      time: "1 hour ago",
      status: "Open",
      priority: "Medium Priority",
      department: "Technical Department",
      source: "email",
      aiSummary: "Developer requesting API documentation for system integration. Technical inquiry requiring documentation resources.",
      conversation: [
        {
          id: "1",
          author: "Michael Chen",
          initials: "MC",
          time: "23rd of June at 4:00 am",
          message: "Hi, I'm working on integrating your API into our system. Could you provide the latest API documentation?"
        }
      ],
      visitor: {
        name: "Michael Chen",
        email: "michael.chen@techcorp.com",
        phone: "+1 (650) 555-0199",
        location: "San Francisco, CA",
        localTime: "17:00 pm (-8:00 GMT)",
        language: "English",
        ip: "173.252.74.22",
        os: "Ubuntu 22.04",
        browser: "Firefox"
      }
    },
    {
      id: 7,
      author: "Emma Thompson",
      avatar: "/avatars/emma.jpg",
      initials: "ET",
      title: "Refund request for unused credits",
      preview: "I would like to request a refund for my unused credits...",
      time: "2 hours ago",
      status: "Pending",
      priority: "Low Priority",
      department: "Billing Department",
      source: "webform",
      aiSummary: "Customer requesting refund for unused credits. Billing inquiry requiring review of account usage and credit balance.",
      conversation: [
        {
          id: "1",
          author: "Emma Thompson",
          initials: "ET",
          time: "23rd of June at 3:00 am",
          message: "I would like to request a refund for my unused credits. I have $450 in credits that I won't be using."
        }
      ],
      visitor: {
        name: "Emma Thompson",
        email: "emma.thompson@agency.com",
        phone: "+44 20 7946 0958",
        location: "London, UK",
        localTime: "01:00 am (+0:00 GMT)",
        language: "English",
        ip: "51.142.0.123",
        os: "macOS Sonoma",
        browser: "Safari"
      }
    },
    {
      id: 8,
      author: "Carlos Rodriguez",
      avatar: "/avatars/carlos.jpg",
      initials: "CR",
      title: "Feature suggestion for mobile app",
      preview: "I have a great idea for improving the mobile experience...",
      time: "3 hours ago",
      status: "New",
      priority: "Low Priority",
      department: "Technical Department",
      source: "whatsapp",
      aiSummary: "Customer suggesting mobile app improvements. Product feedback for development team consideration.",
      conversation: [
        {
          id: "1",
          author: "Carlos Rodriguez",
          initials: "CR",
          time: "23rd of June at 2:00 am",
          message: "I have a great idea for improving the mobile experience. Could we add dark mode support?"
        }
      ],
      visitor: {
        name: "Carlos Rodriguez",
        email: "carlos.rodriguez@email.com",
        phone: "+34 91 123 4567",
        location: "Madrid, Spain",
        localTime: "02:00 am (+1:00 GMT)",
        language: "Spanish",
        ip: "89.142.74.135",
        os: "Android 14",
        browser: "Chrome Mobile"
      }
    },
    {
      id: 9,
      author: "Sophie Martin",
      avatar: "/avatars/sophie.jpg",
      initials: "SM",
      title: "Cannot login to account",
      preview: "I'm having trouble logging into my account...",
      time: "4 hours ago",
      status: "Resolved",
      priority: "Medium Priority",
      department: "Support Department",
      source: "phone_call",
      aiSummary: "Login issues resolved through phone support. Password reset completed successfully.",
      conversation: [
        {
          id: "1",
          author: "Sophie Martin",
          initials: "SM",
          time: "23rd of June at 1:00 am",
          message: "I'm having trouble logging into my account. It says my password is incorrect."
        },
        {
          id: "2",
          author: "Support Agent",
          initials: "SA",
          time: "23rd of June at 1:05 am",
          message: "I've sent you a password reset link. Please check your email and follow the instructions.",
          isAgent: true
        }
      ],
      visitor: {
        name: "Sophie Martin",
        email: "sophie.martin@company.fr",
        phone: "+33 1 42 86 83 26",
        location: "Paris, France",
        localTime: "02:00 am (+1:00 GMT)",
        language: "French",
        ip: "92.184.100.47",
        os: "iOS 17",
        browser: "Safari Mobile"
      }
    },
    {
      id: 10,
      author: "David Park",
      avatar: "/avatars/david.jpg",
      initials: "DP",
      title: "Enterprise plan demo request",
      preview: "We're interested in the enterprise plan...",
      time: "5 hours ago",
      status: "Open",
      priority: "High Priority",
      department: "Sales Department",
      source: "webchat",
      aiSummary: "Enterprise prospect requesting demo. High-value sales opportunity requiring demo scheduling and enterprise feature presentation.",
      conversation: [
        {
          id: "1",
          author: "David Park",
          initials: "DP",
          time: "23rd of June at 12:00 am",
          message: "We're interested in the enterprise plan for our team of 500+ users. Can we schedule a demo?"
        },
        {
          id: "2",
          author: "Sales Agent",
          initials: "SA",
          time: "23rd of June at 12:15 am",
          message: "Absolutely! I'd love to show you our enterprise features. What's your availability this week?",
          isAgent: true
        }
      ],
      visitor: {
        name: "David Park",
        email: "david.park@enterprise.com",
        phone: "+82 2 123 4567",
        location: "Seoul, South Korea",
        localTime: "10:00 am (+9:00 GMT)",
        language: "English",
        ip: "211.115.194.77",
        os: "Windows 11",
        browser: "Edge"
      }
    }
  ]

  // Generate additional mock conversations for scroll testing
  const additionalTickets = Array.from({ length: 35 }, (_, i) => {
    const names = [
      "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Edward Norton",
      "Fiona Green", "George Wilson", "Hannah Lee", "Ivan Petrov", "Julia Roberts",
      "Kevin Hart", "Linda Davis", "Mark Anderson", "Nancy Drew", "Oscar Wilde",
      "Paula Abdul", "Quinn Taylor", "Rachel Green", "Steve Jobs", "Tina Turner",
      "Uma Thurman", "Victor Hugo", "Wendy Williams", "Xavier Rudd", "Yolanda Adams",
      "Zachary Quinto", "Amy Adams", "Brian Cox", "Cathy Freeman", "Daniel Craig",
      "Eva Longoria", "Frank Sinatra", "Grace Kelly", "Henry Ford", "Isabella Swan"
    ]

    const sources = ["email", "webform", "whatsapp", "phone_call", "webchat"]
    const statuses = ["New", "Open", "Pending", "Resolved", "Closed"]
    const priorities = ["Low Priority", "Medium Priority", "High Priority", "Urgent"]
    const departments = ["Sales Department", "Support Department", "Technical Department", "Billing Department", "Marketing Department"]

    const name = names[i % names.length]
    const source = sources[i % sources.length]
    const status = statuses[i % statuses.length]
    const priority = priorities[i % priorities.length]
    const department = departments[i % departments.length]

    return {
      id: 11 + i,
      author: name,
      avatar: `/avatars/${name.toLowerCase().replace(' ', '_')}.jpg`,
      initials: getInitials(name),
      title: `Support request #${11 + i} from ${name}`,
      preview: `Support inquiry from ${name} regarding ${source} issue...`,
      time: `${i + 6} hours ago`,
      status,
      priority,
      department,
      source,
      aiSummary: `${source} inquiry from ${name}. ${status} conversation requiring ${department.toLowerCase()} attention.`,
      conversation: [
        {
          id: "1",
          author: name,
          initials: getInitials(name),
          time: `23rd of June at ${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} am`,
          message: `Hi, I need help with ${source} related issue. Please assist me with this matter.`
        }
      ],
      visitor: {
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        location: "Various Location",
        localTime: "Various Time",
        language: "English",
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        os: "Various OS",
        browser: "Various Browser"
      }
    }
  })

  const allTickets = [...conversations, ...additionalTickets]

  // Filter and sort conversations
  const getFilteredAndSortedTickets = () => {
    let filtered = allTickets

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(conversation =>
        conversation.id.toString().includes(query) ||
        conversation.author.toLowerCase().includes(query) ||
        conversation.title.toLowerCase().includes(query) ||
        conversation.preview.toLowerCase().includes(query)
      )
    }

    // Apply source filter
    if (filterSource) {
      filtered = filtered.filter(conversation => conversation.source === filterSource)
    }

    // Apply priority filter
    if (filterPriority) {
      filtered = filtered.filter(conversation => {
        const priority = conversation.priority.toLowerCase().replace(' priority', '')
        return priority === filterPriority
      })
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(conversation => {
        const status = conversation.status.toLowerCase()
        return status === filterStatus
      })
    }

    // Apply tag filter (check if conversation has any of the selected tags)
    if (filterTags.length > 0) {
      filtered = filtered.filter(conversation => {
        // Get conversation tags from the ticketActions (this is mock data, in real app would come from conversation data)
        const ticketTags = ticketActions.tags || []
        return filterTags.some(tag => ticketTags.includes(tag))
      })
    }

    // Sort by date (using time field as proxy for date)
    filtered.sort((a, b) => {
      // Convert time strings to comparable format (rough approximation for demo)
      const getTimeValue = (timeStr: string) => {
        if (timeStr.includes('sec')) return Date.now() - parseInt(timeStr) * 1000
        if (timeStr.includes('min')) return Date.now() - parseInt(timeStr) * 60000
        if (timeStr.includes('hour')) return Date.now() - parseInt(timeStr) * 3600000
        if (timeStr.includes('day')) return Date.now() - parseInt(timeStr) * 86400000
        return Date.now()
      }

      const aTime = getTimeValue(a.time)
      const bTime = getTimeValue(b.time)

      return sortOrder === 'desc' ? bTime - aTime : aTime - bTime
    })

    return filtered
  }

  // Use API conversations directly (filtering is done server-side)
  const filteredTickets = apiConversations

  // Clear all filters function
  const clearAllFilters = () => {
    setFilterAssignedToMe(true) // Reset to default (checked)
    setFilterSource(null)
    setFilterPriority(null)
    setFilterStatus(null)
    setFilterTags([])
    setSortOrder('desc')
    setSearchQuery('')
  }

  // Check if any filters are active (assigned to me is checked by default, so unchecked means filter is "active")
  const hasActiveFilters = filterSource || filterPriority || filterStatus || filterTags.length > 0 || !filterAssignedToMe

  // Get tag names for filtering dropdown
  const availableTagNames = availableTags.map(t => t.name)
  const filteredAvailableTags = availableTagNames
    .filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
    .slice(0, 5)

  // Get selected ticket index
  const selectedTicketIndex = filteredTickets.findIndex(conversation => conversation.id === selectedConversationId)

  // Messages state
  const [conversationMessages, setConversationMessages] = useState<any[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messagesError, setMessagesError] = useState<string | null>(null)

  // Translation hook for multilingual support
  const {
    needsTranslation,
    getTranslation,
    toggleTranslation,
    languageInfo,
    translations, // Need this to trigger re-render when translations are fetched
  } = useMessageTranslation({
    conversationId: selectedConversationId,
    enabled: !!selectedConversationId,
  })

  // Fetch conversation details and messages in a single optimized API call
  useEffect(() => {
    const fetchConversationDetail = async () => {
      if (!selectedConversationId) {
        setConversationMessages([])
        return
      }

      try {
        setMessagesLoading(true)
        setMessagesError(null)
        // Use optimized endpoint that returns both conversation and messages
        // Request 1000 messages to get all messages for most conversations
        const detailData = await conversationService.getConversation(selectedConversationId, 1, 1000, 'asc')

        // Transform messages to match component format
        const transformedMessages = detailData.messages.map(msg => ({
          id: msg.id,
          message: msg.body,
          language: msg.language,
          isAgent: msg.is_agent,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          author: msg.author.name,
          avatarUrl: getMediaUrl(msg.author.avatar_url),
          attachments: msg.attachments
        }))

        setConversationMessages(transformedMessages)
      } catch (err) {
        console.error('Error fetching conversation detail:', err)
        setMessagesError(err instanceof Error ? err.message : 'Failed to fetch conversation detail')
      } finally {
        setMessagesLoading(false)
      }
    }

    fetchConversationDetail()
  }, [selectedConversationId])

  // Get the last user message for smart reply feature
  const lastUserMessage = useMemo(() => {
    // Find the last message from the user (not agent)
    const userMessages = conversationMessages.filter(msg => !msg.isAgent)
    return userMessages.length > 0 ? userMessages[userMessages.length - 1]?.message || '' : ''
  }, [conversationMessages])

  // Auto-scroll to the last message when messages change
  useEffect(() => {
    if (messagesEndRef.current && conversationMessages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversationMessages])


  // Shared files mock data
  const sharedFiles = [
    {
      id: "1",
      name: "image.jpg",
      size: "30 KB",
      type: "image" as const,
      sharedWith: "Agent Lisa",
      sharedDate: "May 25th"
    },
    {
      id: "2",
      name: "doc.pdf",
      size: "29 KB",
      type: "pdf" as const,
      sharedWith: "Agent Lisa",
      sharedDate: "May 25th"
    },
    {
      id: "3",
      name: "error-number.jpg",
      size: "15 KB",
      type: "image" as const,
      sharedWith: "Agent Lisa",
      sharedDate: "May 25th"
    }
  ]



  return (
    <div className="min-h-screen lg:h-screen bg-background">
      {/* Main Content Area with proper spacing */}
      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen">
        {/* Conversation List Sidebar - Mobile Responsive */}
        <div className="w-full lg:w-96 bg-card flex flex-col lg:fixed lg:left-16 lg:top-0 h-auto lg:h-screen z-10 lg:shadow-lg">
          {/* Static Header - No Scroll */}
          <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold">Recent Conversations</h2>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by conversation ID, author, or title"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter & Sort</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Assigned to me filter */}
                  <DropdownMenuCheckboxItem
                    checked={filterAssignedToMe}
                    onCheckedChange={setFilterAssignedToMe}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Assigned to me
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />

                  {/* Filter by Source */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Source</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={filterSource || ''} onValueChange={(value) => setFilterSource(value || null)}>
                        <DropdownMenuRadioItem value="">
                          <Mail className="mr-2 h-4 w-4 opacity-50" />
                          All Sources
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="email">
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="whatsapp">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="webchat">
                          <Monitor className="mr-2 h-4 w-4" />
                          Web Chat
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="webform">
                          <Globe className="mr-2 h-4 w-4" />
                          Web Form
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="phone_call">
                          <Phone className="mr-2 h-4 w-4" />
                          Phone Call
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  {/* Filter by Priority */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      <span>Priority</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={filterPriority || ''} onValueChange={(value) => setFilterPriority(value || null)}>
                        <DropdownMenuRadioItem value="">
                          <AlertCircle className="mr-2 h-4 w-4 opacity-50" />
                          All Priorities
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="low">
                          <Minus className="mr-2 h-4 w-4 text-gray-500" />
                          Low Priority
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="medium">
                          <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                          Medium Priority
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="high">
                          <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                          High Priority
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="urgent">
                          <Zap className="mr-2 h-4 w-4 text-red-600" />
                          Urgent
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  {/* Filter by Status */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <CircleDot className="mr-2 h-4 w-4" />
                      <span>Status</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={filterStatus || ''} onValueChange={(value) => setFilterStatus(value || null)}>
                        <DropdownMenuRadioItem value="">
                          <CircleDot className="mr-2 h-4 w-4 opacity-50" />
                          All Status
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="new">
                          <Circle className="mr-2 h-4 w-4 text-blue-500" />
                          New
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="wait_for_agent">
                          <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                          Wait for Agent
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="in_progress">
                          <Loader className="mr-2 h-4 w-4 text-blue-500" />
                          In Progress
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="wait_for_user">
                          <Clock className="mr-2 h-4 w-4 text-green-500" />
                          Wait for User
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="on_hold">
                          <Pause className="mr-2 h-4 w-4 text-yellow-500" />
                          On Hold
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="resolved">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Resolved
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="closed">
                          <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                          Closed
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="unresolved">
                          <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                          Unresolved
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="spam">
                          <Archive className="mr-2 h-4 w-4 text-gray-500" />
                          Spam
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  {/* Filter by Tags */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Tag className="mr-2 h-4 w-4" />
                      <span>Tags</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-56">
                      <Command>
                        <CommandInput
                          placeholder="Search tags..."
                          value={tagSearchQuery}
                          onValueChange={setTagSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>No tags found.</CommandEmpty>
                          <CommandGroup>
                            {filteredAvailableTags.map((tag) => (
                              <CommandItem key={tag} onSelect={() => {
                                if (filterTags.includes(tag)) {
                                  setFilterTags(filterTags.filter(t => t !== tag))
                                } else {
                                  setFilterTags([...filterTags, tag])
                                }
                              }}>
                                <div className="flex items-center gap-2 w-full">
                                  <div className={`w-4 h-4 border rounded ${filterTags.includes(tag) ? 'bg-primary border-primary' : 'border-input'} flex items-center justify-center`}>
                                    {filterTags.includes(tag) && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <span>{tag}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />

                  {/* Sort by Date */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      <span>Sort by Date</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                        <DropdownMenuRadioItem value="desc">
                          <ArrowDown className="mr-2 h-4 w-4" />
                          Newest First
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="asc">
                          <ArrowUp className="mr-2 h-4 w-4" />
                          Oldest First
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />

                  {/* Clear Filters */}
                  <DropdownMenuItem
                    onClick={() => {
                      setFilterSource(null)
                      setFilterPriority(null)
                      setFilterStatus(null)
                      setFilterTags([])
                      setSortOrder('desc')
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear All Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1 mb-4">
                {/* Source filter */}
                {filterSource && (
                  <CustomBadge variant={getSourceColor(filterSource) as "blue" | "green" | "yellow" | "purple" | "gray"} className="text-xs h-6 px-2 gap-1">
                    {getSourceIcon(filterSource)}
                    <span className="capitalize">{filterSource.replace(/_/g, ' ')}</span>
                    <button
                      onClick={() => setFilterSource(null)}
                      className="text-current hover:opacity-70 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </CustomBadge>
                )}

                {/* Priority filter */}
                {filterPriority && (
                  <CustomBadge variant={getPriorityColor(filterPriority) as "gray" | "yellow" | "red" | "red-dot"} className="text-xs h-6 px-2 gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span className="capitalize">{filterPriority} priority</span>
                    <button
                      onClick={() => setFilterPriority(null)}
                      className="text-current hover:opacity-70 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </CustomBadge>
                )}

                {/* Status filter */}
                {filterStatus && (
                  <CustomBadge variant={getStatusColor(filterStatus) as "blue" | "green" | "yellow" | "gray"} className="text-xs h-6 px-2 gap-1">
                    {getStatusIcon(filterStatus)}
                    <span className="capitalize">{filterStatus.replace(/_/g, ' ')}</span>
                    <button
                      onClick={() => setFilterStatus(null)}
                      className="text-current hover:opacity-70 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </CustomBadge>
                )}

                {/* Tag filters */}
                {filterTags.map(tag => (
                  <div key={`tag-${tag}`} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                    <Tag className="w-3 h-3" />
                    <span className="capitalize">{tag}</span>
                    <button
                      onClick={() => setFilterTags(filterTags.filter(t => t !== tag))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Sort order indicator */}
                {sortOrder !== 'desc' && (
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                    <span>Sort: {sortOrder === 'asc' ? 'Oldest first' : 'Newest first'}</span>
                    <button
                      onClick={() => setSortOrder('desc')}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Clear all filters button - show if multiple filters are active */}
                {((filterSource ? 1 : 0) + (filterPriority ? 1 : 0) + (filterStatus ? 1 : 0) + (filterTags.length > 0 ? 1 : 0)) > 1 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}

            {/* My Open Conversations */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">My Open conversations ({filteredTickets.length}{hasActiveFilters ? `/${totalConversations}` : ''})</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          {/* Conversations List - Mobile Responsive */}
          <div className="flex-1 overflow-y-auto min-h-[50vh] lg:max-h-full">
          {/* Loading State - only show on initial load */}
          {isInitialLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading conversations...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isInitialLoading && (
            <div className="p-4 m-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">Error: {error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isInitialLoading && !error && filteredTickets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-2">No conversations found</p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          )}

          {/* Conversation List */}
          {!isInitialLoading && !error && filteredTickets.map((conversation, index) => (
            <div
              key={conversation.id}
              onClick={() => {
                // Mobile: open modal, Desktop: set selected conversation and update URL
                if (window.innerWidth < 1024) {
                  openTicketModal(conversation.id)
                } else {
                  selectConversation(conversation.id)
                }
              }}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                conversation.id === selectedConversationId ? 'bg-muted' : ''
              }`}
            >
              <div className={`flex items-start gap-3 transition-transform duration-200 ease-in-out ${
                conversation.id === selectedConversationId ? 'translate-x-[5px]' : 'translate-x-0'
              }`}>
                <Avatar className="h-10 w-10">
                  {conversation.customer.avatar_url && (
                    <AvatarImage
                      src={conversation.customer.avatar_url}
                      alt={conversation.customer.name}
                    />
                  )}
                  <AvatarFallback
                    className="text-white text-sm font-medium"
                    style={{ backgroundColor: getAvatarColor(conversation.customer.name) }}
                  >
                    {conversation.customer.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{conversation.customer.name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(conversation.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-foreground mb-2 line-clamp-2">{conversation.last_message_preview || conversation.title}</p>
                  <div className="flex flex-wrap gap-1">
                    <CustomBadge variant={getSourceColor(conversation.channel) as "blue" | "green" | "yellow" | "purple" | "gray"} className="text-[10px] h-4 px-1">
                      {getSourceIcon(conversation.channel)}
                      <span className="ml-1 capitalize">{conversation.channel.replace(/_/g, ' ')}</span>
                    </CustomBadge>
                    <CustomBadge variant={getStatusColor(conversation.status) as "blue" | "green" | "yellow" | "gray"} className="text-[10px] h-4 px-1 gap-0.5">
                      {getStatusIcon(conversation.status)}
                      <span className="capitalize">{conversation.status.replace(/_/g, ' ')}</span>
                    </CustomBadge>
                    <CustomBadge variant={getPriorityColor(conversation.priority) as "gray" | "yellow" | "red" | "red-dot"} className="text-[10px] h-4">
                      {conversation.priority}
                    </CustomBadge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Desktop layout - hidden on mobile */}
        <div className="hidden lg:flex flex-1 flex-col lg:ml-[448px]">
          {selectedConversation && (
            <>
              {/* Conversation Header - Full Row */}
              <div className="p-4 border-b border-border bg-card">
                <h1 className="text-xl font-semibold mb-3">{selectedConversation.title}</h1>
                <div className="flex gap-2">
                  <CustomBadge variant={getSourceColor(selectedConversation.channel) as "blue" | "green" | "yellow" | "purple" | "gray"} className="text-xs h-6 px-3">
                    {getSourceIcon(selectedConversation.channel)}
                    <span className="ml-1 capitalize">{selectedConversation.channel.replace(/_/g, ' ')}</span>
                  </CustomBadge>

                  {/* Clickable Status Badge */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="focus:outline-none" disabled={loadingStates.status}>
                        <CustomBadge variant={getStatusColor(ticketHeader.status) as "blue" | "green" | "yellow" | "gray"} className="text-xs h-6 px-3 gap-1 cursor-pointer hover:opacity-80 disabled:opacity-60">
                          {loadingStates.status ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            getStatusIcon(ticketHeader.status)
                          )}
                          <span className="capitalize">{loadingStates.status ? 'Updating...' : ticketHeader.status.replace(/_/g, ' ')}</span>
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
                          <span className="mr-2">{getStatusIcon(status.value)}</span>
                          {status.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Clickable Priority Badge */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="focus:outline-none" disabled={loadingStates.priority}>
                        <CustomBadge variant={getPriorityColor(ticketHeader.priority) as "gray" | "yellow" | "red" | "red-dot"} className="text-xs h-6 cursor-pointer hover:opacity-80 disabled:opacity-60">
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
                        <CustomBadge variant="gray" className="text-xs h-6 cursor-pointer hover:opacity-80 disabled:opacity-60">
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

                  {/* Handle by Bot Toggle - Only visible when department has AI agent */}
                  {/* Debug: department={JSON.stringify(selectedConversation.department)} */}
                  {selectedConversation.department?.ai_agent_id != null && (
                    <button
                      onClick={handleToggleHandleByBot}
                      disabled={loadingStates.handleByBot}
                      className="focus:outline-none"
                    >
                      <CustomBadge
                        variant={selectedConversation.handle_by_bot ? "green" : "gray"}
                        className="text-xs h-6 px-3 cursor-pointer hover:opacity-80 disabled:opacity-60"
                      >
                        {loadingStates.handleByBot ? (
                          <Loader className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Bot className="w-3 h-3 mr-1" />
                        )}
                        {loadingStates.handleByBot
                          ? 'Updating...'
                          : selectedConversation.handle_by_bot
                            ? 'Bot: On'
                            : 'Bot: Off'}
                      </CustomBadge>
                    </button>
                  )}
                </div>
              </div>

              {/* Content Row: Conversation + Actions - Mobile Responsive */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Conversation Column - Mobile Responsive */}
                <div className="flex-1 flex flex-col p-3 sm:p-4 overflow-hidden">
                  {/* Conversation - Scrollable messages area */}
                  <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-2">
                    {/* AI Summary Component - First item in scrollable area */}
                    <ConversationSummary
                      conversationId={selectedConversation.id}
                      messageCount={selectedConversation.message_count || conversationMessages.length}
                      fallbackText={selectedConversation.last_message_preview || selectedConversation.title || "No summary available"}
                    />
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-sm text-muted-foreground">Loading messages...</div>
                  </div>
                ) : messagesError ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-sm text-red-600">Error: {messagesError}</div>
                  </div>
                ) : conversationMessages.map((message) => {
                  const isChat = selectedConversation?.channel === 'whatsapp' || selectedConversation?.channel === 'telegram'

                  // Get translation for messages not in agent's language
                  // Uses per-message language detection
                  const translation = needsTranslation && message.language
                    ? getTranslation(message.id, message.message, message.language, message.isAgent)
                    : undefined
                  // Use translation.content when translation is available
                  const displayContent = translation?.isTranslated
                    ? translation.content
                    : message.message

                  if (isChat) {
                    return (
                      <div key={message.id} className={`flex ${message.isAgent ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl relative ${
                          message.isAgent
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted dark:bg-slate-700 border border-border rounded-bl-sm'
                        }`}>
                          {/* Translation loading */}
                          {translation?.isLoading ? (
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          ) : (
                            <div className="text-sm font-medium leading-relaxed whitespace-pre-line">
                              {displayContent}
                            </div>
                          )}
                          <div className={`flex items-center gap-2 mt-1 ${message.isAgent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            <span className="text-xs">{message.time}</span>
                            {/* Translation toggle button */}
                            {translation?.isTranslated && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleTranslation(message.id)
                                      }}
                                      className="p-0.5 rounded hover:bg-black/10 transition-colors"
                                    >
                                      <Languages className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    {translation.showOriginal ? "Show translated" : "Show original"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={message.id} className={`rounded-lg border p-3 ${message.isAgent ? 'ml-6 bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        <Avatar className="h-7 w-7">
                          {message.avatarUrl && (
                            <AvatarImage
                              src={message.avatarUrl}
                              alt={message.author}
                            />
                          )}
                          <AvatarFallback
                            className="text-white text-xs font-medium"
                            style={{ backgroundColor: message.isAgent ? '#3b82f6' : getAvatarColor(message.author) }}
                          >
                            {getInitials(message.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <div>
                            <h3 className="text-sm font-medium">{message.author}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              {message.time}
                              {translation?.isTranslated && (
                                <>
                                  <span className="text-muted-foreground/50">•</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleTranslation(message.id)
                                    }}
                                    className="text-blue-500 hover:text-blue-600 hover:underline"
                                  >
                                    {translation.showOriginal ? "Show Translated" : "Translated - Show Original"}
                                  </button>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Message content with translation loading */}
                      {translation?.isLoading ? (
                        <div className="mb-3 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-line font-medium">
                          {displayContent}
                        </p>
                      )}

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">{message.attachments.length} Attachments</h4>
                          <div className="flex gap-4">
                            {message.attachments.map((attachment, attachIdx) => (
                              <div key={attachIdx} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
                                <div className="p-2 bg-red-100 rounded">
                                  {attachment.type === 'pdf' ? (
                                    <FileText className="h-5 w-5 text-red-600" />
                                  ) : (
                                    <ImageIcon className="h-5 w-5 text-gray-600" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{attachment.name}</p>
                                  <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                    {/* Scroll anchor for auto-scroll to bottom */}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply Section - Sticky at bottom */}
                  <div className="bg-card rounded-lg border border-border p-4 flex-shrink-0 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={selectedConversation.customer.avatar_url || undefined}
                          alt={selectedConversation.customer.name}
                        />
                        <AvatarFallback
                          className="text-white text-xs font-medium"
                          style={{ backgroundColor: getAvatarColor(selectedConversation.customer.name) }}
                        >
                          {selectedConversation.customer.initials || getInitials(selectedConversation.customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="text-xs font-medium">Reply to: </span>
                        <span className="text-xs">{selectedConversation.customer.name}</span>
                      </div>
                    </div>

                {/* Reply Text Area */}
                <WysiwygEditor
                  value={replyText}
                  onChange={setReplyText}
                  placeholder="Type your reply..."
                  onSend={handleSendReply}
                  onFastReply={handleFastReply}
                  disabled={isSending}
                  className="mb-4"
                  userLastMessage={lastUserMessage}
                />

                  </div>
                </div>

                {/* Actions Column - Mobile Responsive */}
                <div className="w-full lg:w-96 bg-background p-3 space-y-2 overflow-y-auto order-1 lg:order-2">
            <ConversationActions
              currentPriority={ticketActions.priority}
              currentStatus={ticketActions.status}
              currentDepartment={ticketActions.department}
              currentAssignees={ticketActions.assignees}
              currentTags={ticketActions.tags}
              availableDepartments={availableDepartments}
              availableTags={availableTagNames}
              availableUsers={availableUsers}
              isExpanded={isActionsExpanded}
              onToggle={() => setIsActionsExpanded(!isActionsExpanded)}
              onPriorityChange={handleActionsPriorityChange}
              onStatusChange={handleActionsStatusChange}
              onDepartmentChange={handleActionsDepartmentChange}
              onAssigneesChange={handleActionsAssigneesChange}
              onTagsChange={handleActionsTagsChange}
              customAttributes={selectedConversation?.data || {}}
            />
            {selectedConversation?.customer && (
              <VisitorInformation
                visitor={{
                  name: selectedConversation.customer.name,
                  email: selectedConversation.customer.email,
                  phone: selectedConversation.customer.phone || "N/A",
                  location: "N/A",
                  localTime: "",
                  language: selectedConversation.customer.language || "",
                  ip: selectedConversation.ip || "N/A",
                  os: selectedConversation.operating_system || "N/A",
                  browser: selectedConversation.browser || "N/A",
                  country: undefined,
                  externalIDs: selectedConversation.customer.external_ids || [],
                  timezone: selectedConversation.customer.timezone,
                  clientId: selectedConversation.customer.id,
                  customAttributes: selectedConversation.customer.data || {}
                }}
                currentConversationId={selectedConversation.id}
              />
            )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Conversation Modal */}
        <ConversationModal
          conversation={selectedConversationId ? filteredTickets.find(t => t.id === selectedConversationId) || null : null}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  )
}

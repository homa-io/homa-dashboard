"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CustomBadge } from '@/components/ui/custom-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Search, Filter, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Download, FileText, Image as ImageIcon, ChevronDown, Reply, Mail, Globe, MessageCircle, Phone, Monitor, ChevronUp, Sparkles, Check, ArrowUpDown, ArrowUp, ArrowDown, AlertCircle, CircleDot, X, Tag, Building, Minus, AlertTriangle, Zap, Circle, Clock, CheckCircle, XCircle, Pause, Loader } from 'lucide-react'
import { VisitorInformation } from '@/components/tickets/VisitorInformation'
import { TicketActions } from '@/components/tickets/TicketActions'
import { CannedMessages } from '@/components/tickets/CannedMessages'
import { WysiwygEditor } from '@/components/tickets/WysiwygEditor'
import { TicketModal } from '@/components/tickets/TicketModal'
import { getAvatarColor, getInitials } from '@/lib/avatar-colors'

export default function TicketsContent() {
  const [selectedTicketId, setSelectedTicketId] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [replyText, setReplyText] = useState("Hi Dean,\n\nThank you for contacting us. We sure can help you. Shall we schedule a call tomorrow around 12.00pm. We can help you better if we are on a call.\n\nPlease let us know your availability.")
  const [isActionsExpanded, setIsActionsExpanded] = useState(false)
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false)

  // Filter state (single-select for most, multi-select for tags)
  const [filterSource, setFilterSource] = useState<string | null>(null)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [tagSearchQuery, setTagSearchQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Get URL search parameters
  const searchParams = useSearchParams()

  // Handle ticket_id parameter from URL
  useEffect(() => {
    const ticketId = searchParams.get('ticket_id')
    if (ticketId) {
      setSearchQuery(ticketId)
    }
  }, [searchParams])

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
      case 'open': return 'green'
      case 'pending': return 'yellow'
      case 'resolved': return 'green'
      case 'closed': return 'gray'
      default: return 'gray'
    }
  }

  // Ticket actions state
  const [ticketActions, setTicketActions] = useState({
    priority: "high",
    status: "open",
    department: "Sales Department",
    assignees: ["1", "2"],
    tags: ["payment", "urgent", "visa"]
  })

  // Ticket header state (for the currently selected ticket)
  const [ticketHeader, setTicketHeader] = useState({
    priority: "high",
    status: "open",
    department: "Sales Department"
  })

  // Loading states for ticket header changes
  const [loadingStates, setLoadingStates] = useState({
    status: false,
    priority: false,
    department: false
  })

  // Original ticket actions for change detection
  const [originalTicketActions] = useState({
    priority: "high",
    status: "open",
    department: "Sales Department",
    assignees: ["1", "2"],
    tags: ["payment", "urgent", "visa"]
  })

  // Check if there are unsaved changes
  const hasChanges = JSON.stringify(ticketActions) !== JSON.stringify(originalTicketActions)

  // Modal handlers
  const openTicketModal = (ticketId: number) => {
    setSelectedTicketId(ticketId)
    setIsModalOpen(true)
  }

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    // Update ticket status in your state management
    console.log(`Ticket ${ticketId} status changed to ${newStatus}`)
  }

  // Available options
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

  // Handle ticket header changes
  const handleTicketHeaderChange = async (field: 'status' | 'priority' | 'department', value: string) => {
    setLoadingStates(prev => ({ ...prev, [field]: true }))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setTicketHeader(prev => ({ ...prev, [field]: value }))
    setLoadingStates(prev => ({ ...prev, [field]: false }))
  }

  const handleSaveTicketActions = () => {
    console.log('Saving ticket actions:', ticketActions)
  }

  const tickets = [
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

  // Generate additional mock tickets for scroll testing
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
      aiSummary: `${source} inquiry from ${name}. ${status} ticket requiring ${department.toLowerCase()} attention.`,
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

  const allTickets = [...tickets, ...additionalTickets]

  // Filter and sort tickets
  const getFilteredAndSortedTickets = () => {
    let filtered = allTickets

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(ticket =>
        ticket.id.toString().includes(query) ||
        ticket.author.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query) ||
        ticket.preview.toLowerCase().includes(query)
      )
    }

    // Apply source filter
    if (filterSource) {
      filtered = filtered.filter(ticket => ticket.source === filterSource)
    }

    // Apply priority filter
    if (filterPriority) {
      filtered = filtered.filter(ticket => {
        const priority = ticket.priority.toLowerCase().replace(' priority', '')
        return priority === filterPriority
      })
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(ticket => {
        const status = ticket.status.toLowerCase()
        return status === filterStatus
      })
    }

    // Apply tag filter (check if ticket has any of the selected tags)
    if (filterTags.length > 0) {
      filtered = filtered.filter(ticket => {
        // Get ticket tags from the ticketActions (this is mock data, in real app would come from ticket data)
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

  const filteredTickets = getFilteredAndSortedTickets()

  // Clear all filters function
  const clearAllFilters = () => {
    setFilterSource(null)
    setFilterPriority(null)
    setFilterStatus(null)
    setFilterTags([])
    setSortOrder('desc')
  }

  // Check if any filters are active
  const hasActiveFilters = filterSource || filterPriority || filterStatus || filterTags.length > 0

  // Available tags (last 5 most recent)
  const availableTags = ['payment', 'urgent', 'visa', 'billing', 'technical', 'bug', 'feature', 'refund', 'account', 'mobile']
  const filteredAvailableTags = availableTags
    .filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
    .slice(0, 5)

  // Get currently selected ticket
  const selectedTicket = allTickets.find(ticket => ticket.id === selectedTicketId)
  const selectedTicketIndex = filteredTickets.findIndex(ticket => ticket.id === selectedTicketId)

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

  const handleCannedMessageSelect = (message: string) => {
    setReplyText(message)
  }


  return (
    <div className="min-h-screen lg:h-screen bg-background">
      {/* Main Content Area with proper spacing */}
      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen">
        {/* Ticket List Sidebar - Mobile Responsive */}
        <div className="w-full lg:w-96 bg-card flex flex-col lg:fixed lg:left-16 lg:top-0 h-auto lg:h-screen z-10 lg:shadow-lg">
          {/* Static Header - No Scroll */}
          <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold">Recent Tickets</h2>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ticket ID, author, or title"
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
                        <DropdownMenuRadioItem value="open">
                          <CircleDot className="mr-2 h-4 w-4 text-green-500" />
                          Open
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="closed">
                          <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                          Closed
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="pending">
                          <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                          Pending
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="resolved">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Resolved
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="wait_agent">
                          <Pause className="mr-2 h-4 w-4 text-orange-500" />
                          Wait for Agent Reply
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="wait_user">
                          <Clock className="mr-2 h-4 w-4 text-blue-500" />
                          Wait for User Reply
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
                    <span className="capitalize">{filterSource.replace('_', ' ')}</span>
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
                    <CircleDot className="w-3 h-3" />
                    <span className="capitalize">{filterStatus.replace('_', ' ')}</span>
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

            {/* My Open Tickets */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">My Open tickets ({filteredTickets.length}{hasActiveFilters ? `/${allTickets.length}` : ''})</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          {/* Tickets List - Mobile Responsive */}
          <div className="flex-1 overflow-y-auto min-h-[50vh] lg:max-h-full">
          {filteredTickets.map((ticket, index) => (
            <div
              key={ticket.id}
              onClick={() => {
                // Mobile: open modal, Desktop: set selected ticket
                if (window.innerWidth < 1024) {
                  openTicketModal(ticket.id)
                } else {
                  setSelectedTicketId(ticket.id)
                }
              }}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                ticket.id === selectedTicketId ? 'bg-muted' : ''
              }`}
            >
              <div className={`flex items-start gap-3 transition-transform duration-200 ease-in-out ${
                ticket.id === selectedTicketId ? 'translate-x-[5px]' : 'translate-x-0'
              }`}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className="text-white text-xs font-medium"
                    style={{ backgroundColor: getAvatarColor(ticket.author) }}
                  >
                    {getInitials(ticket.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{ticket.author}</span>
                    <span className="text-xs text-muted-foreground">{ticket.time}</span>
                  </div>
                  <p className="text-sm text-foreground mb-2 line-clamp-2">{ticket.title}</p>
                  <div className="flex flex-wrap gap-1">
                    <CustomBadge variant={getSourceColor(ticket.source) as "blue" | "green" | "yellow" | "purple" | "gray"} className="text-[10px] h-4 px-1">
                      {getSourceIcon(ticket.source)}
                      <span className="ml-1 capitalize">{ticket.source.replace('_', ' ')}</span>
                    </CustomBadge>
                    <CustomBadge variant={ticket.status === 'Open' ? 'green' : 'blue'} className="text-[10px] h-4">
                      {ticket.status}
                    </CustomBadge>
                    <CustomBadge variant="red-dot" className="text-[10px] h-4">
                      {ticket.priority}
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
          {selectedTicket && (
            <>
              {/* Ticket Header - Full Row */}
              <div className="p-4 border-b border-border bg-card">
                <h1 className="text-xl font-semibold mb-3">{selectedTicket.title}</h1>
                <div className="flex gap-2">
                  <CustomBadge variant={getSourceColor(selectedTicket.source) as "blue" | "green" | "yellow" | "purple" | "gray"} className="text-xs h-6 px-3">
                    {getSourceIcon(selectedTicket.source)}
                    <span className="ml-1 capitalize">{selectedTicket.source.replace('_', ' ')}</span>
                  </CustomBadge>

                  {/* Clickable Status Badge */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="focus:outline-none" disabled={loadingStates.status}>
                        <CustomBadge variant={getStatusColor(ticketHeader.status) as "blue" | "green" | "yellow" | "gray"} className="text-xs h-6 cursor-pointer hover:opacity-80 disabled:opacity-60">
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
                </div>
              </div>

              {/* Content Row: Conversation + Actions - Mobile Responsive */}
              <div className="flex-1 flex flex-col lg:flex-row">
                {/* Conversation Column - Mobile Responsive */}
                <div className="flex-1 flex flex-col p-3 sm:p-4">
                  {/* AI Summary Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border border-blue-200 dark:border-slate-600 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Summary</h3>
                          {selectedTicket.aiSummary && selectedTicket.aiSummary.length > 120 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 px-2 text-xs text-blue-600 dark:text-blue-400"
                              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                            >
                              {isSummaryExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                  Collapse
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                  Expand
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        <p className={`text-sm text-blue-800 dark:text-blue-200 leading-relaxed ${
                          !isSummaryExpanded && selectedTicket.aiSummary && selectedTicket.aiSummary.length > 120
                            ? 'line-clamp-2'
                            : ''
                        }`}>
                          {selectedTicket.aiSummary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Conversation */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {selectedTicket.conversation?.map((message) => {
                  const isChat = selectedTicket.source === 'whatsapp' || selectedTicket.source === 'webchat'

                  if (isChat) {
                    return (
                      <div key={message.id} className={`flex ${message.isAgent ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${
                          message.isAgent
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted dark:bg-slate-700 border border-border rounded-bl-sm'
                        }`}>
                          <div className="text-sm font-medium leading-relaxed whitespace-pre-line">
                            {message.message}
                          </div>
                          <div className={`text-xs mt-1 ${message.isAgent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {message.time}
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={message.id} className={`rounded-lg border p-3 ${message.isAgent ? 'ml-6 bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback
                            className="text-white text-xs font-medium"
                            style={{ backgroundColor: message.isAgent ? '#3b82f6' : getAvatarColor(message.author) }}
                          >
                            {getInitials(message.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-medium">{message.author}</h3>
                          <p className="text-xs text-muted-foreground">{message.time}</p>
                        </div>
                      </div>

                      <div className="mb-3 text-sm leading-relaxed whitespace-pre-line font-medium">
                        {message.message}
                      </div>

                      {/* Attachments */}
                      {message.attachments && (
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
                  </div>

                  {/* Reply Section */}
                  <div className="bg-card rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback
                          className="text-white text-xs font-medium"
                          style={{ backgroundColor: getAvatarColor("Support Agent") }}
                        >
                          {getInitials("Support Agent")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="text-xs font-medium">Reply to: </span>
                        <span className="text-xs">{selectedTicket.author} ({selectedTicket.visitor?.email})</span>
                      </div>
                    </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 mb-4 p-2 border border-border rounded-lg">
                  <select className="text-sm border-none bg-transparent">
                    <option>Paragraph</option>
                  </select>
                  <div className="w-px h-6 bg-border mx-2"></div>
                  <Button variant="ghost" size="sm">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Underline className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-border mx-2"></div>
                  <Button variant="ghost" size="sm">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-border mx-2"></div>
                  <Button variant="ghost" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Link className="h-4 w-4" />
                  </Button>
                </div>

                {/* Reply Text Area */}
                <WysiwygEditor
                  value={replyText}
                  onChange={setReplyText}
                  placeholder="Type your reply..."
                  onSend={() => {
                    console.log('Sending reply:', replyText)
                    // Handle send logic here
                  }}
                  onFastReply={() => {
                    console.log('Fast reply sent:', replyText)
                    // Handle fast reply logic here
                  }}
                  className="mb-4"
                />

                <div className="flex justify-start">
                  <CannedMessages onMessageSelect={handleCannedMessageSelect} />
                </div>
                  </div>
                </div>

                {/* Actions Column - Mobile Responsive */}
                <div className="w-full lg:w-96 bg-background p-3 space-y-2 overflow-y-auto order-1 lg:order-2">
            <TicketActions
              currentPriority={ticketActions.priority}
              currentStatus={ticketActions.status}
              currentDepartment={ticketActions.department}
              currentAssignees={ticketActions.assignees}
              currentTags={ticketActions.tags}
              isExpanded={isActionsExpanded}
              onToggle={() => setIsActionsExpanded(!isActionsExpanded)}
              onPriorityChange={(priority) => setTicketActions(prev => ({ ...prev, priority }))}
              onStatusChange={(status) => setTicketActions(prev => ({ ...prev, status }))}
              onDepartmentChange={(department) => setTicketActions(prev => ({ ...prev, department }))}
              onAssigneesChange={(assignees) => setTicketActions(prev => ({ ...prev, assignees }))}
              onTagsChange={(tags) => setTicketActions(prev => ({ ...prev, tags }))}
              hasChanges={hasChanges}
              onSave={handleSaveTicketActions}
            />
            <VisitorInformation visitor={selectedTicket?.visitor} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Ticket Modal */}
        <TicketModal
          ticket={selectedTicketId ? filteredTickets.find(t => t.id === selectedTicketId) || null : null}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  )
}

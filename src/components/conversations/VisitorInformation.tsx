"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CountryFlagBadge } from "@/components/ui/country-flag-badge"
import { ExternalLink, CreditCard, Receipt, Repeat, User, Mail, Phone, MapPin, Clock, Globe, Monitor, ChevronRight, Edit3, Smartphone, Laptop, Flag, Search, ChevronLeft, ChevronRight as ChevronRightIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { conversationService, type PreviousConversation } from "@/services/conversation.service"

interface LineItem {
  description: string
  amount: number
}

interface UsageLimit {
  name: string
  used: number
  total: number
}

interface ExternalID {
  id: number
  type: 'email' | 'phone' | 'whatsapp' | 'slack' | 'telegram' | 'web' | 'chat'
  value: string
}

interface VisitorInfo {
  name: string
  email: string
  phone: string
  location: string
  localTime: string
  language: string
  ip: string
  os: string
  browser: string
  country?: string
  externalIDs?: ExternalID[]
  timezone?: string | null
  clientId?: string
  customAttributes?: Record<string, any>
}

interface VisitorInformationProps {
  visitor: VisitorInfo
  currentConversationId?: number
}

export function VisitorInformation({ visitor, currentConversationId }: VisitorInformationProps) {
  const [showPreviousTickets, setShowPreviousTickets] = useState(false)
  const [ticketSearchQuery, setTicketSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [allConversations, setAllConversations] = useState<PreviousConversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ticketsPerPage = 5

  // Fetch previous conversations when dialog opens
  useEffect(() => {
    if (showPreviousTickets && visitor.clientId) {
      const fetchPreviousConversations = async () => {
        setIsLoading(true)
        setError(null)

        try {
          const response = await conversationService.getClientPreviousConversations(
            visitor.clientId,
            100,
            currentConversationId
          )
          setAllConversations(response.data || [])
        } catch (err) {
          console.error('Error fetching previous conversations:', err)
          setError(err instanceof Error ? err.message : 'Failed to load conversations')
          setAllConversations([])
        } finally {
          setIsLoading(false)
        }
      }

      fetchPreviousConversations()
    }
  }, [showPreviousTickets, visitor.clientId, currentConversationId])
  
  // Filter conversations based on search query
  const getFilteredTickets = () => {
    if (!ticketSearchQuery.trim()) {
      return allConversations
    }

    const query = ticketSearchQuery.toLowerCase().trim()
    return allConversations.filter(conversation =>
      conversation.id.toString().includes(query) ||
      conversation.conversation_number.toLowerCase().includes(query) ||
      conversation.title.toLowerCase().includes(query) ||
      conversation.status.toLowerCase().includes(query) ||
      conversation.priority.toLowerCase().includes(query)
    )
  }

  // Get paginated conversations
  const getPaginatedTickets = () => {
    const filteredTickets = getFilteredTickets()
    const startIndex = (currentPage - 1) * ticketsPerPage
    const endIndex = startIndex + ticketsPerPage
    return {
      conversations: filteredTickets.slice(startIndex, endIndex),
      totalTickets: filteredTickets.length,
      totalPages: Math.ceil(filteredTickets.length / ticketsPerPage)
    }
  }
  const getTimezoneWithOffset = (timezone: string | null | undefined): string => {
    if (!timezone || timezone === "N/A") return "N/A"

    try {
      // Get current time in the specified timezone
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'longOffset'
      })

      const parts = formatter.formatToParts(now)
      const offsetPart = parts.find(part => part.type === 'timeZoneName')

      if (offsetPart && offsetPart.value.includes('GMT')) {
        const offset = offsetPart.value.replace('GMT', 'UTC')
        return `${timezone} (${offset})`
      }

      // Fallback: calculate offset manually
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
      const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
      const offsetMinutes = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60)
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60)
      const offsetMins = Math.abs(offsetMinutes) % 60
      const sign = offsetMinutes >= 0 ? '+' : '-'

      if (offsetMins === 0) {
        return `${timezone} (UTC${sign}${offsetHours})`
      } else {
        return `${timezone} (UTC${sign}${offsetHours}:${offsetMins.toString().padStart(2, '0')})`
      }
    } catch (error) {
      return timezone
    }
  }

  const getLanguageName = (code: string | null | undefined): string => {
    if (!code || code === "N/A") return "N/A"

    const languageMap: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'no': 'Norwegian',
      'da': 'Danish',
      'fi': 'Finnish',
      'pl': 'Polish',
      'tr': 'Turkish',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'id': 'Indonesian',
      'ms': 'Malay',
      'he': 'Hebrew',
      'cs': 'Czech',
      'el': 'Greek',
      'hu': 'Hungarian',
      'ro': 'Romanian',
      'uk': 'Ukrainian'
    }

    return languageMap[code.toLowerCase()] || code.toUpperCase()
  }

  const getBrowserIcon = (browser: string) => {
    // Using Globe icon for all browsers since specific browser icons don't exist in lucide-react
    return Globe
  }

  const getOSIcon = (os: string) => {
    const osLower = os.toLowerCase()
    if (osLower.includes('mobile') || osLower.includes('android') || osLower.includes('ios')) return Smartphone
    return Laptop
  }

  const getCountryIcon = () => Flag


  const userActions = [
    { icon: CreditCard, label: "Invoices", count: 12, color: "text-emerald-600" },
    { icon: Receipt, label: "Payments", count: 8, color: "text-blue-600" },
    { icon: Repeat, label: "Subscriptions", count: 3, color: "text-purple-600" },
    { icon: User, label: "User Profile", count: null, color: "text-gray-600" },
  ]

  const UserActionModal = ({ action }: { action: typeof userActions[0] }) => {
    const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(null)

    const getDetailedData = (item: Record<string, any>, type: string) => {
      const timestamp = new Date().toISOString()
      
      switch(type) {
        case "Invoices":
          return `Invoice Details:
          
ID: ${item.id}
Number: ${item.number}
Amount: ${item.amount}
Status: ${item.status}
Created: ${item.created}
Due Date: ${item.dueDate}
Customer: ${visitor.name} <${visitor.email}>

Line Items:
${item.items.map((item: LineItem) => `  - ${item.description}: $${item.amount}`).join('\n')}

Payment Terms: Net 30
Notes: ${item.notes || 'None'}

Billing Address:
${item.billingAddress.street}
${item.billingAddress.city}, ${item.billingAddress.state} ${item.billingAddress.zip}
${item.billingAddress.country}

Tax Details:
Subtotal: $${item.subtotal}
Tax Rate: ${item.taxRate}%
Tax Amount: $${item.taxAmount}
Total: ${item.amount}

Generated: ${timestamp}`

        case "Payments":
          return `Payment Transaction Details:

Transaction ID: ${item.transactionId}
Amount: ${item.amount}
Status: ${item.status}
Method: ${item.method}
Card: ${item.cardType} ending in ${item.lastFour}
Date: ${item.date}
Reference: ${item.reference}

Customer: ${visitor.name}
Email: ${visitor.email}
IP Address: ${visitor.ip}

Authorization Code: ${item.authCode}
Processor: ${item.processor}
Gateway Response: ${item.gatewayResponse}

Risk Assessment:
Score: ${item.riskScore}/100
Status: ${item.riskStatus}

Merchant Info:
ID: MERCH-${item.merchantId}
Account: ${item.merchantAccount}

Generated: ${timestamp}`

        case "Subscriptions":
          return `Subscription Details:

Subscription ID: ${item.id}
Plan: ${item.plan}
Status: ${item.status}
Price: ${item.price}
Billing Cycle: ${item.billingCycle}
Started: ${item.startDate}
Next Billing: ${item.nextBilling}
End Date: ${item.endDate || 'N/A'}

Customer: ${visitor.name}
Email: ${visitor.email}

Payment Method:
Type: ${item.paymentMethod.type}
Last Four: ${item.paymentMethod.lastFour}
Expires: ${item.paymentMethod.expires}

Features:
${item.features.map((feature: string) => `  - ${feature}`).join('\n')}

Usage Limits:
${item.limits.map((limit: UsageLimit) => `  - ${limit.name}: ${limit.used}/${limit.total}`).join('\n')}

Generated: ${timestamp}`

        default:
          return `User Information:

Name: ${visitor.name}
Email: ${visitor.email}
Phone: ${visitor.phone}
Location: ${visitor.location}
Local Time: ${visitor.localTime}
Language: ${visitor.language}

Device Information:
IP Address: ${visitor.ip}
Operating System: ${visitor.os}
Browser: ${visitor.browser}

Account Status: Active
Member Since: 2023-01-15
Last Login: 2024-06-23 08:00:00
Total Conversations: 15
Resolved Conversations: 12
Average Response Time: 2.5 hours

Generated: ${timestamp}`
      }
    }

    const mockData = {
      "Invoices": [
        { 
          id: "INV-2024-001", 
          number: "INV-2024-001", 
          amount: "$299.00", 
          status: "Paid", 
          created: "2024-06-15", 
          dueDate: "2024-07-15",
          items: [
            { description: "Premium Plan (Monthly)", amount: "299.00" }
          ],
          notes: "Payment received via VISA",
          billingAddress: {
            street: "123 Business St",
            city: "Colombo",
            state: "Western",
            zip: "00100",
            country: "Sri Lanka"
          },
          subtotal: "249.17",
          taxRate: "20",
          taxAmount: "49.83"
        },
        { 
          id: "INV-2024-002", 
          number: "INV-2024-002", 
          amount: "$199.00", 
          status: "Pending", 
          created: "2024-06-20", 
          dueDate: "2024-07-20",
          items: [
            { description: "Additional Storage", amount: "199.00" }
          ],
          notes: "Awaiting payment",
          billingAddress: {
            street: "123 Business St",
            city: "Colombo", 
            state: "Western",
            zip: "00100",
            country: "Sri Lanka"
          },
          subtotal: "165.83",
          taxRate: "20",
          taxAmount: "33.17"
        }
      ],
      "Payments": [
        { 
          transactionId: "TXN-2024-001", 
          amount: "$299.00", 
          status: "Completed", 
          method: "Credit Card",
          cardType: "VISA",
          lastFour: "1234",
          date: "2024-06-15 14:30:00",
          reference: "REF-ABC123",
          authCode: "AUTH789",
          processor: "Stripe",
          gatewayResponse: "Approved",
          riskScore: "15",
          riskStatus: "Low Risk",
          merchantId: "12345",
          merchantAccount: "account@company.com"
        },
        { 
          transactionId: "TXN-2024-002", 
          amount: "$199.00", 
          status: "Failed", 
          method: "Credit Card",
          cardType: "VISA",
          lastFour: "1234",
          date: "2024-06-23 08:15:00",
          reference: "REF-DEF456",
          authCode: "N/A",
          processor: "Stripe",
          gatewayResponse: "Insufficient Funds",
          riskScore: "25",
          riskStatus: "Medium Risk",
          merchantId: "12345",
          merchantAccount: "account@company.com"
        }
      ],
      "Subscriptions": [
        { 
          id: "SUB-2024-001", 
          plan: "Premium Plan", 
          status: "Active", 
          price: "$299/month",
          billingCycle: "Monthly",
          startDate: "2024-01-15",
          nextBilling: "2024-07-15",
          paymentMethod: {
            type: "Credit Card",
            lastFour: "1234",
            expires: "12/2025"
          },
          features: [
            "Unlimited Storage",
            "Priority Support",
            "Advanced Analytics",
            "API Access"
          ],
          limits: [
            { name: "API Calls", used: 1250, total: 10000 },
            { name: "Storage", used: 45, total: 100 }
          ]
        }
      ]
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center justify-between w-full p-2 text-left hover:bg-muted/50 rounded-md transition-colors group">
            <div className="flex items-center gap-2">
              <action.icon className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium">{action.label}</span>
              {action.count && (
                <Badge variant="secondary" className="h-4 px-1.5 text-[10px] font-medium">
                  {action.count}
                </Badge>
              )}
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <action.icon className="w-4 h-4" />
              {action.label} - {visitor.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex h-[60vh]">
            {/* List View */}
            <div className="w-1/3 border-r pr-4 overflow-y-auto">
              {action.label !== "User Info" && mockData[action.label as keyof typeof mockData]?.map((item: Record<string, any>, index: number) => (
                <div 
                  key={index}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 border rounded cursor-pointer mb-2 hover:bg-muted ${selectedItem === item ? 'bg-muted' : ''}`}
                >
                  <div className="text-sm font-medium">
                    {action.label === "Invoices" && item.number}
                    {action.label === "Payments" && item.transactionId}
                    {action.label === "Subscriptions" && item.plan}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {action.label === "Invoices" && `${item.amount} - ${item.status}`}
                    {action.label === "Payments" && `${item.amount} - ${item.status}`}
                    {action.label === "Subscriptions" && `${item.price} - ${item.status}`}
                  </div>
                  {action.label === "Invoices" && (
                    <div className="text-xs text-muted-foreground">{item.created}</div>
                  )}
                  {action.label === "Payments" && (
                    <div className="text-xs text-muted-foreground">{item.date}</div>
                  )}
                </div>
              ))}
              {action.label === "User Info" && (
                <div 
                  onClick={() => setSelectedItem({ info: true })}
                  className="p-3 border rounded cursor-pointer hover:bg-muted"
                >
                  <div className="text-sm font-medium">User Profile</div>
                  <div className="text-xs text-muted-foreground">Complete user information</div>
                </div>
              )}
            </div>
            
            {/* Detail View */}
            <div className="flex-1 pl-4">
              {selectedItem ? (
                <div className="h-full">
                  <h3 className="text-sm font-medium mb-2">Details</h3>
                  <pre className="text-xs font-mono bg-muted p-3 rounded h-full overflow-auto whitespace-pre-wrap">
                    {getDetailedData(selectedItem, action.label)}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-sm">Select an item to view details</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer
          </h3>
          {visitor.clientId && (
            <Link href={`/customers/${visitor.clientId}`}>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Custom Attributes - Only show filled ones */}
        {visitor.customAttributes && Object.keys(visitor.customAttributes).length > 0 && (() => {
          // Flatten nested objects and filter to only non-empty values
          const flattenAttributes = (obj: Record<string, any>, prefix = ''): [string, any][] => {
            const result: [string, any][] = []
            for (const [key, value] of Object.entries(obj)) {
              const newKey = prefix ? `${prefix}_${key}` : key
              if (value && typeof value === 'object' && !Array.isArray(value)) {
                result.push(...flattenAttributes(value, newKey))
              } else {
                result.push([newKey, value])
              }
            }
            return result
          }

          const filledAttributes = flattenAttributes(visitor.customAttributes || {}).filter(([_, value]) => {
            if (value === null || value === undefined) return false
            if (typeof value === 'string' && value.trim() === '') return false
            if (Array.isArray(value) && value.length === 0) return false
            return true
          })

          if (filledAttributes.length === 0) return null

          return (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Contact Information</h4>
              <div className="space-y-3">
                {filledAttributes.map(([key, value]) => {
                  // Format the key as a label (convert snake_case/camelCase to Title Case)
                  const label = key
                    .replace(/_/g, ' ')
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .trim()

                  // Format the value for display
                  let displayValue: string
                  if (Array.isArray(value)) {
                    displayValue = value.join(', ')
                  } else if (typeof value === 'boolean') {
                    displayValue = value ? 'Yes' : 'No'
                  } else if (typeof value === 'object') {
                    displayValue = JSON.stringify(value)
                  } else {
                    displayValue = String(value)
                  }

                  // Check if it looks like an email
                  const isEmail = typeof value === 'string' && value.includes('@') && value.includes('.')
                  // Check if it looks like a URL
                  const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span className="text-xs">{label}</span>
                      </div>
                      {isEmail ? (
                        <a
                          href={`mailto:${displayValue}`}
                          className="text-xs text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 hover:underline font-medium truncate max-w-[150px]"
                          title={displayValue}
                        >
                          {displayValue}
                        </a>
                      ) : isUrl ? (
                        <a
                          href={displayValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 hover:underline font-medium truncate max-w-[150px]"
                          title={displayValue}
                        >
                          {displayValue}
                        </a>
                      ) : (
                        <span className="text-xs font-medium truncate max-w-[150px]" title={displayValue}>
                          {displayValue}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Previous Conversations */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Previous Conversations</h4>
          <Dialog open={showPreviousTickets} onOpenChange={setShowPreviousTickets}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full h-9 text-sm">
                Conversation History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Previous Conversations - {visitor.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search conversations by ID, title, status, or priority..."
                    value={ticketSearchQuery}
                    onChange={(e) => {
                      setTicketSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10"
                  />
                </div>
                
                {/* Conversations List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Loading conversations...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-destructive">
                      <p className="text-sm">Error: {error}</p>
                    </div>
                  ) : (() => {
                    const paginatedData = getPaginatedTickets()

                    return (
                      <>
                        {paginatedData.conversations.map((conversation) => {
                          // Format date
                          const formattedDate = new Date(conversation.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })

                          return (
                            <Link
                              key={conversation.id}
                              href={`/conversations?id=${conversation.id}`}
                              target="_blank"
                              className="flex items-center justify-between w-full p-3 text-left hover:bg-muted/50 rounded-md transition-colors group border border-border block"
                              onClick={() => setShowPreviousTickets(false)}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate mb-2">{conversation.title}</p>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs h-5 px-2 ${
                                      conversation.status === 'resolved' ? 'border-green-200 text-green-700 bg-green-50' :
                                      conversation.status === 'pending' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                                      conversation.status === 'open' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                                      conversation.status === 'closed' ? 'border-gray-200 text-gray-700 bg-gray-50' :
                                      'border-gray-200 text-gray-700 bg-gray-50'
                                    }`}
                                  >
                                    {conversation.status}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs h-5 px-2 ${
                                      conversation.priority === 'urgent' ? 'border-red-200 text-red-700 bg-red-50' :
                                      conversation.priority === 'high' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                                      conversation.priority === 'medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                                      'border-gray-200 text-gray-700 bg-gray-50'
                                    }`}
                                  >
                                    {conversation.priority}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">{formattedDate}</p>
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </Link>
                          )
                        })}

                        {paginatedData.conversations.length === 0 && !isLoading && !error && (
                          <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">
                              {ticketSearchQuery.trim() ? 'No conversations match your search' : 'No previous conversations found'}
                            </p>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
                
                {/* Pagination */}
                {(() => {
                  const paginatedData = getPaginatedTickets()
                  
                  if (paginatedData.totalPages <= 1) return null
                  
                  return (
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-xs text-muted-foreground">
                        Showing {Math.min((currentPage - 1) * ticketsPerPage + 1, paginatedData.totalTickets)} to {Math.min(currentPage * ticketsPerPage, paginatedData.totalTickets)} of {paginatedData.totalTickets} conversations
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                          {currentPage} of {paginatedData.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(paginatedData.totalPages, prev + 1))}
                          disabled={currentPage === paginatedData.totalPages}
                        >
                          <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Device Info - Only show if at least one field has data */}
        {(() => {
          const isEmpty = (val: string | undefined | null) => {
            if (!val) return true
            const v = val.trim().toLowerCase()
            return v === '' || v === 'n/a' || v === 'not available' || v === 'unknown' || v === 'not provided'
          }
          const hasIp = !isEmpty(visitor.ip)
          const hasOs = !isEmpty(visitor.os)
          const hasBrowser = !isEmpty(visitor.browser)

          if (!hasIp && !hasOs && !hasBrowser) return null

          return (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Device Information</h4>
              <div className="space-y-3">
                {hasIp && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Monitor className="w-3 h-3" />
                      <span className="text-xs">IP Address</span>
                    </div>
                    <CountryFlagBadge ip={visitor.ip} />
                  </div>
                )}
                {hasOs && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {React.createElement(getOSIcon(visitor.os), { className: "w-3 h-3" })}
                      <span className="text-xs">Operating System</span>
                    </div>
                    <span className="text-xs font-medium">{visitor.os}</span>
                  </div>
                )}
                {hasBrowser && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {React.createElement(getBrowserIcon(visitor.browser), { className: "w-3 h-3" })}
                      <span className="text-xs">Browser</span>
                    </div>
                    <span className="text-xs font-medium">{visitor.browser}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
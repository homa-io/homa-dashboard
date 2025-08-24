"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CountryFlagBadge } from "@/components/ui/country-flag-badge"
import { ExternalLink, CreditCard, Receipt, Repeat, User, Mail, Phone, MapPin, Clock, Globe, Monitor, ChevronRight, Edit3, Smartphone, Laptop, Flag, Search, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react"
import Link from "next/link"

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
}

interface VisitorInformationProps {
  visitor: VisitorInfo
}

export function VisitorInformation({ visitor }: VisitorInformationProps) {
  const [showPreviousTickets, setShowPreviousTickets] = useState(false)
  const [ticketSearchQuery, setTicketSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ticketsPerPage = 5
  
  // Mock function to get previous tickets for the same user
  const getPreviousTickets = (email: string) => {
    const mockPreviousTickets = [
      { id: 12345, title: "Account verification issue", status: "resolved", priority: "medium", date: "2024-06-15" },
      { id: 12340, title: "Password reset request", status: "resolved", priority: "low", date: "2024-06-10" },
      { id: 12335, title: "Billing inquiry", status: "closed", priority: "low", date: "2024-06-05" },
      { id: 12330, title: "Feature request", status: "pending", priority: "medium", date: "2024-06-01" },
      { id: 12325, title: "Technical support", status: "resolved", priority: "high", date: "2024-05-28" },
      { id: 12320, title: "Mobile app bug report", status: "resolved", priority: "high", date: "2024-05-20" },
      { id: 12315, title: "API integration help", status: "closed", priority: "medium", date: "2024-05-15" },
      { id: 12310, title: "Account suspension appeal", status: "resolved", priority: "urgent", date: "2024-05-10" },
      { id: 12305, title: "Data export request", status: "closed", priority: "low", date: "2024-05-05" },
      { id: 12300, title: "Payment method update", status: "resolved", priority: "medium", date: "2024-05-01" },
    ]
    
    // Filter tickets for the specific user (in real app, this would be an API call)
    return mockPreviousTickets
  }
  
  // Filter tickets based on search query
  const getFilteredTickets = () => {
    const allTickets = getPreviousTickets(visitor.email)
    if (!ticketSearchQuery.trim()) {
      return allTickets
    }
    
    const query = ticketSearchQuery.toLowerCase().trim()
    return allTickets.filter(ticket => 
      ticket.id.toString().includes(query) ||
      ticket.title.toLowerCase().includes(query) ||
      ticket.status.toLowerCase().includes(query) ||
      ticket.priority.toLowerCase().includes(query)
    )
  }
  
  // Get paginated tickets
  const getPaginatedTickets = () => {
    const filteredTickets = getFilteredTickets()
    const startIndex = (currentPage - 1) * ticketsPerPage
    const endIndex = startIndex + ticketsPerPage
    return {
      tickets: filteredTickets.slice(startIndex, endIndex),
      totalTickets: filteredTickets.length,
      totalPages: Math.ceil(filteredTickets.length / ticketsPerPage)
    }
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
${item.items.map((item: any) => `  - ${item.description}: $${item.amount}`).join('\n')}

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
${item.limits.map((limit: any) => `  - ${limit.name}: ${limit.used}/${limit.total}`).join('\n')}

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
Total Tickets: 15
Resolved Tickets: 12
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
            Visitor Information
          </h3>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Basic Details */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Contact Information</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span className="text-xs">Email</span>
              </div>
              <button className="text-xs text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 hover:underline font-medium">
                {visitor.email}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span className="text-xs">Phone</span>
              </div>
              <span className="text-xs font-medium">{visitor.phone || "Unknown"}</span>
            </div>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">Location</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">{visitor.location}</span>
                <button className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs">Local time</span>
              </div>
              <span className="text-xs font-medium">{visitor.localTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-3 h-3" />
                <span className="text-xs">Language</span>
              </div>
              <button className="text-xs text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 hover:underline font-medium">
                {visitor.language}
              </button>
            </div>
            {visitor.country && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Flag className="w-3 h-3" />
                  <span className="text-xs">Country</span>
                </div>
                <span className="text-xs font-medium">{visitor.country}</span>
              </div>
            )}
          </div>
        </div>

        {/* Previous Tickets */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Previous Tickets</h4>
          <Dialog open={showPreviousTickets} onOpenChange={setShowPreviousTickets}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full h-9 text-sm">
                View Previous Tickets ({getPreviousTickets(visitor.email).length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Previous Tickets - {visitor.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search tickets by ID, title, status, or priority..."
                    value={ticketSearchQuery}
                    onChange={(e) => {
                      setTicketSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10"
                  />
                </div>
                
                {/* Tickets List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {(() => {
                    const paginatedData = getPaginatedTickets()
                    
                    return (
                      <>
                        {paginatedData.tickets.map((ticket) => (
                          <Link
                            key={ticket.id}
                            href={`/tickets?ticket_id=${ticket.id}`}
                            target="_blank"
                            className="flex items-center justify-between w-full p-3 text-left hover:bg-muted/50 rounded-md transition-colors group border border-border block"
                            onClick={() => setShowPreviousTickets(false)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-muted-foreground">#{ticket.id}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs h-5 px-2 ${
                                    ticket.status === 'resolved' ? 'border-green-200 text-green-700 bg-green-50' :
                                    ticket.status === 'pending' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                                    ticket.status === 'open' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                                    ticket.status === 'closed' ? 'border-gray-200 text-gray-700 bg-gray-50' :
                                    'border-gray-200 text-gray-700 bg-gray-50'
                                  }`}
                                >
                                  {ticket.status}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs h-5 px-2 ${
                                    ticket.priority === 'urgent' ? 'border-red-200 text-red-700 bg-red-50' :
                                    ticket.priority === 'high' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                                    ticket.priority === 'medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                                    'border-gray-200 text-gray-700 bg-gray-50'
                                  }`}
                                >
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium truncate">{ticket.title}</p>
                              <p className="text-xs text-muted-foreground">{ticket.date}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </Link>
                        ))}
                        
                        {paginatedData.tickets.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">
                              {ticketSearchQuery.trim() ? 'No tickets match your search' : 'No previous tickets found'}
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
                        Showing {Math.min((currentPage - 1) * ticketsPerPage + 1, paginatedData.totalTickets)} to {Math.min(currentPage * ticketsPerPage, paginatedData.totalTickets)} of {paginatedData.totalTickets} tickets
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

        {/* Quick Actions */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {userActions.map((action) => (
              <UserActionModal key={action.label} action={action} />
            ))}
          </div>
        </div>

        {/* Device Info */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Device Information</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Monitor className="w-3 h-3" />
                <span className="text-xs">IP Address</span>
              </div>
              <CountryFlagBadge ip={visitor.ip} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                {React.createElement(getOSIcon(visitor.os), { className: "w-3 h-3" })}
                <span className="text-xs">Operating System</span>
              </div>
              <span className="text-xs font-medium">{visitor.os}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                {React.createElement(getBrowserIcon(visitor.browser), { className: "w-3 h-3" })}
                <span className="text-xs">Browser</span>
              </div>
              <span className="text-xs font-medium">{visitor.browser}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
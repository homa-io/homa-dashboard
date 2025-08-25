"use client"

import React, { useState } from "react"
import { CustomBadge } from "@/components/ui/custom-badge"
import { TicketModal } from "@/components/tickets/TicketModal"
import { 
  Circle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail
} from "lucide-react"

// Creative Ticket Card Component - Modern card design
interface Ticket {
  id: number;
  title: string;
  customer: string;
  email: string;
  priority: string;
  status: string;
  time: string;
  preview?: string;
  tags?: string[];
  department?: string;
  assignees?: string[];
  source?: string;
}

function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'email': return <Mail className="w-3 h-3" />
      case 'phone': return '📞'
      case 'chat': return '💬'
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

  return (
    <div 
      className="group relative bg-card rounded-lg border border-border p-2 sm:p-3 cursor-pointer hover:shadow-lg hover:border-accent transition-all duration-200 hover:-translate-y-0.5"
      onClick={onClick}
    >
      {/* Priority indicator stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getPriorityColor(ticket.priority)}`}></div>
      
      {/* Header row */}
      <div className="flex items-start justify-between mb-2 ml-2">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <CustomBadge 
            variant={
              ticket.priority === "urgent" ? "red-dot" : 
              ticket.priority === "high" ? "red" :
              ticket.priority === "medium" ? "yellow" : "gray"
            }
            className="text-[10px] sm:text-xs font-medium"
          >
            {ticket.priority.toUpperCase()}
          </CustomBadge>
          <CustomBadge variant="outline" className="text-[10px] sm:text-xs hidden sm:inline-flex">
            {ticket.department || "Support"}
          </CustomBadge>
        </div>
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">{getSourceIcon(ticket.source || 'email')}</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">{ticket.time}</span>
        </div>
      </div>
      
      {/* Sender name */}
      <h4 className="text-xs sm:text-sm font-semibold text-card-foreground leading-tight line-clamp-1 sm:line-clamp-2 mb-2 ml-2">
        {ticket.customer}
      </h4>
      
      {/* Preview with subtle background */}
      <div className="bg-muted rounded-md p-1.5 sm:p-2 mb-2 ml-2 mr-0">
        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {ticket.preview || "Customer needs assistance with account-related issues..."}
        </p>
      </div>
      
      {/* Footer - Tags */}
      <div className="ml-2">
        {/* Tags */}
        {ticket.tags && ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ticket.tags.slice(0, 1).map((tag: string, index: number) => (
              <span key={index} className="inline-flex items-center px-1 py-0.5 rounded text-[9px] sm:text-[10px] bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                #{tag}
              </span>
            ))}
            {ticket.tags.length > 1 && (
              <span className="inline-flex items-center px-1 py-0.5 rounded text-[9px] sm:text-[10px] bg-muted text-muted-foreground border border-border">
                +{ticket.tags.length - 1}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {

  // State management
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Helper function for priority colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 dark:bg-red-600'
      case 'high': return 'bg-orange-500 dark:bg-orange-600'
      case 'medium': return 'bg-yellow-500 dark:bg-yellow-600'
      case 'low': return 'bg-green-500 dark:bg-green-600'
      default: return 'bg-gray-500 dark:bg-gray-600'
    }
  }

  // Mock ticket data with additional fields
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, title: "Payment gateway not working", customer: "John Doe", email: "john@example.com", priority: "high", status: "new", time: "2 min ago", preview: "Customer unable to complete checkout process. Error occurs at payment step.", tags: ["payment", "urgent"], department: "Technical", assignees: ["JD", "MS"], source: "email" },
    { id: 2, title: "Unable to reset password", customer: "Jane Smith", email: "jane@example.com", priority: "medium", status: "new", time: "5 min ago", preview: "Password reset link not working. Customer tried multiple times.", tags: ["account", "password"], department: "Support", assignees: ["AB"], source: "chat" },
    { id: 10, title: "Login form not responsive", customer: "Alex Rodriguez", email: "alex@example.com", priority: "low", status: "new", time: "8 min ago", preview: "Login page doesn't display properly on mobile devices.", tags: ["ui", "mobile"], department: "Development", assignees: [], source: "email" },
    { id: 11, title: "Subscription cancellation", customer: "Maria Garcia", email: "maria@example.com", priority: "medium", status: "new", time: "12 min ago", preview: "Customer wants to cancel subscription and get refund.", tags: ["billing", "cancellation"], department: "Billing", assignees: [], source: "phone" },
    { id: 12, title: "Account locked after failed attempts", customer: "Chris Johnson", email: "chris@example.com", priority: "high", status: "new", time: "15 min ago", preview: "Multiple failed login attempts locked the account.", tags: ["security", "locked"], department: "Support", assignees: [], source: "chat" },
    { id: 13, title: "Data export request", customer: "Amanda White", email: "amanda@example.com", priority: "low", status: "new", time: "20 min ago", preview: "Customer requesting export of all their data.", tags: ["data", "export"], department: "Technical", assignees: [], source: "email" },
    { id: 3, title: "Account billing inquiry", customer: "Mike Johnson", email: "mike@example.com", priority: "low", status: "open", time: "1 hour ago", preview: "Questions about recent charges on account statement.", tags: ["billing", "inquiry"], department: "Billing", assignees: ["CD", "EF"], source: "phone" },
    { id: 4, title: "Feature request - API limits", customer: "Sarah Wilson", email: "sarah@example.com", priority: "medium", status: "open", time: "2 hours ago", preview: "Requesting increase in API rate limits for enterprise plan.", tags: ["feature", "api"], department: "Product", assignees: ["GH"], source: "email" },
    { id: 5, title: "Database connection timeout", customer: "Robert Davis", email: "robert@example.com", priority: "urgent", status: "pending", time: "30 min ago", preview: "Server experiencing intermittent database connectivity issues.", tags: ["technical", "database"], department: "Technical", assignees: ["IJ", "KL"], source: "email" },
    { id: 6, title: "Mobile app crashing", customer: "Lisa Brown", email: "lisa@example.com", priority: "high", status: "pending", time: "45 min ago", preview: "App crashes when trying to upload files on iOS devices.", tags: ["mobile", "bug"], department: "Development", assignees: ["MN"], source: "chat" },
    { id: 7, title: "Invoice download issue", customer: "David Miller", email: "david@example.com", priority: "low", status: "resolved", time: "1 day ago", preview: "PDF generation fixed for invoice downloads.", tags: ["resolved", "billing"], department: "Support", assignees: ["OP"], source: "email" },
    { id: 8, title: "SSL certificate expired", customer: "Emma Wilson", email: "emma@example.com", priority: "urgent", status: "resolved", time: "2 days ago", preview: "Certificate renewed and deployed successfully.", tags: ["security", "resolved"], department: "Technical", assignees: ["QR", "ST"], source: "phone" },
    { id: 9, title: "Data export functionality", customer: "Tom Anderson", email: "tom@example.com", priority: "medium", status: "closed", time: "3 days ago", preview: "Export feature implemented and tested successfully.", tags: ["feature", "closed"], department: "Product", assignees: ["UV"], source: "email" },
    { id: 14, title: "Server maintenance notification", customer: "Kevin Thompson", email: "kevin@example.com", priority: "low", status: "closed", time: "4 days ago", preview: "Scheduled maintenance completed successfully.", tags: ["maintenance", "server"], department: "Technical", assignees: ["XY"], source: "email" },
    { id: 15, title: "Account upgrade confirmation", customer: "Rachel Green", email: "rachel@example.com", priority: "low", status: "closed", time: "5 days ago", preview: "Premium account upgrade processed and confirmed.", tags: ["upgrade", "billing"], department: "Billing", assignees: ["ZA"], source: "phone" },
    { id: 16, title: "Bug report - search function", customer: "Daniel Park", email: "daniel@example.com", priority: "medium", status: "closed", time: "6 days ago", preview: "Search functionality bug fixed and deployed.", tags: ["bug", "search"], department: "Development", assignees: ["BC"], source: "chat" },
    { id: 17, title: "Integration setup complete", customer: "Sophie Turner", email: "sophie@example.com", priority: "low", status: "closed", time: "1 week ago", preview: "Third-party integration successfully configured.", tags: ["integration", "setup"], department: "Technical", assignees: ["DE"], source: "email" },
  ])


  // Modal handlers
  const openTicketModal = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus }
          : ticket
      )
    )
  }

  const statuses = [
    { key: "new", label: "New", icon: Circle },
    { key: "open", label: "Open", icon: AlertCircle },
    { key: "pending", label: "Pending", icon: Clock },
    { key: "resolved", label: "Resolved", icon: CheckCircle },
    { key: "closed", label: "Closed", icon: XCircle },
  ]

  const priorityColors = {
    low: "text-green-600 dark:text-green-400",
    medium: "text-yellow-600 dark:text-yellow-400", 
    high: "text-red-600 dark:text-red-400",
    urgent: "text-purple-600 dark:text-purple-400"
  }

  const getTicketsByStatus = (status: string) => tickets.filter(ticket => ticket.status === status)

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-8 pt-4 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage customer support requests by status</p>
        </div>
      </div>

      {/* Mobile-Responsive Kanban Board */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {statuses.map((status) => {
          const statusTickets = getTicketsByStatus(status.key)
          const StatusIcon = status.icon
          
          return (
            <div key={status.key} className="space-y-3">
              {/* Kanban Header */}
              <div className="bg-muted rounded-lg p-3 flex items-center justify-center h-14">
                <div className="flex items-center gap-2 w-full justify-center">
                  <StatusIcon className={`h-4 w-4 ${
                    status.key === 'new' ? 'text-blue-600' :
                    status.key === 'open' ? 'text-orange-600' :
                    status.key === 'pending' ? 'text-yellow-600' :
                    status.key === 'resolved' ? 'text-green-600' :
                    'text-gray-600'
                  }`} />
                  <h3 className="text-base font-semibold text-foreground flex-1 text-center">{status.label}</h3>
                  <CustomBadge variant="secondary" className="text-xs">
                    {statusTickets.length}
                  </CustomBadge>
                </div>
              </div>
              
              {/* Tickets */}
              <div className="space-y-3">
                {statusTickets.map((ticket) => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    onClick={() => openTicketModal(ticket)}
                  />
                ))}
                
                {statusTickets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <StatusIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No {status.label.toLowerCase()} tickets</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>


      {/* Ticket Modal */}
      <TicketModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
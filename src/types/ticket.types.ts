export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Customer {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Agent {
  id: string
  name: string
  avatar?: string
}

export interface Ticket {
  id: string
  title: string
  description?: string
  customer: Customer
  status: TicketStatus
  priority: TicketPriority
  assignedTo?: Agent[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
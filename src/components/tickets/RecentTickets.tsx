'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TicketProps {
  id: string
  customer: {
    name: string
    avatar: string
  }
  message: string
  timeAgo: string
  status: 'Open' | 'New' | 'Closed'
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority'
  department: 'Sales Department' | 'Marketing Department' | 'Support Department'
}

const mockTickets: TicketProps[] = [
  {
    id: '1',
    customer: {
      name: 'Dean Taylor',
      avatar: 'DT'
    },
    message: 'Hi, I need help to process the payment via...',
    timeAgo: '2 mins ago',
    status: 'Open',
    priority: 'High Priority',
    department: 'Sales Department'
  },
  {
    id: '2',
    customer: {
      name: 'Jenny Wilson',
      avatar: 'JW'
    },
    message: 'Hi, I have recently come across your web...',
    timeAgo: '5 mins ago',
    status: 'New',
    priority: 'High Priority',
    department: 'Marketing Department'
  },
  {
    id: '3',
    customer: {
      name: 'Blake Gilmore',
      avatar: 'BG'
    },
    message: 'Hi, I am locked out of my account. It says...',
    timeAgo: '8 mins ago',
    status: 'New',
    priority: 'High Priority',
    department: 'Support Department'
  },
  {
    id: '4',
    customer: {
      name: 'Robert Gulliver',
      avatar: 'RG'
    },
    message: 'Hi, I need help to upgrade my account. I...',
    timeAgo: '10 mins ago',
    status: 'Open',
    priority: 'Medium Priority',
    department: 'Sales Department'
  }
]

function TicketItem({ ticket }: { ticket: TicketProps }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800'
      case 'New': return 'bg-green-100 text-green-800'
      case 'Closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High Priority': return 'text-red-600'
      case 'Medium Priority': return 'text-orange-600'
      case 'Low Priority': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Sales Department': return 'text-purple-600'
      case 'Marketing Department': return 'text-blue-600'
      case 'Support Department': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-purple-600 font-medium text-sm">{ticket.customer.avatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{ticket.customer.name}</span>
          <span className="text-xs text-muted-foreground">{ticket.timeAgo}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2 truncate">{ticket.message}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('px-2 py-1 rounded text-xs font-medium', getStatusColor(ticket.status))}>
            {ticket.status}
          </span>
          <span className={cn('text-xs font-medium', getPriorityColor(ticket.priority))}>
            • {ticket.priority}
          </span>
          <span className={cn('text-xs', getDepartmentColor(ticket.department))}>
            {ticket.department}
          </span>
        </div>
      </div>
    </div>
  )
}

export function RecentTickets() {
  return (
    <div className="flex-1 flex flex-col border-r bg-card">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-4">Recent Tickets</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search" 
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Ticket Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm">My Open tickets (6)</h3>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-0">
            {mockTickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
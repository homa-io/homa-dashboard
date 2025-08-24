'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Ticket } from '@/types/ticket.types'
import { KanbanColumn } from './KanbanColumn'
import { TicketCard } from './TicketCard'
import { Search, Filter, ChevronDown } from 'lucide-react'

interface TicketListProps {
  tickets: Ticket[]
  className?: string
}

export function TicketList({ tickets, className }: TicketListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Group tickets by status for kanban columns
  const groupedTickets = {
    'Submitted applications': tickets.slice(0, 3), // First 3 tickets
    'Shortlisted': tickets.slice(3, 5), // Next 2 tickets  
    'Interview scheduled': tickets.slice(5, 8), // Next 3 tickets
    'Decision made': tickets.slice(8, 10) // Last 2 tickets
  }

  const convertToCardData = (ticket: Ticket) => ({
    id: ticket.id,
    title: ticket.title,
    customer: ticket.customer,
    priority: ticket.priority,
    status: ticket.status === 'Open' ? 'New' : ticket.status === 'In Progress' ? 'Open' : ticket.status,
    assignedTo: ticket.assignedTo,
    score: Math.floor(Math.random() * 10) + '/10',
    comments: Math.floor(Math.random() * 5) + 1,
    attachments: Math.floor(Math.random() * 3) + 1
  })

  return (
    <div className={cn('flex flex-col h-full bg-blue-50', className)}>
      {/* Header */}
      <div className="p-6 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">All Tickets</h1>
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for tickets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 h-11 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          <button className="flex items-center gap-2 px-6 h-11 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200">
            <span>+</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-4 gap-6 h-full p-6">
          {Object.entries(groupedTickets).map(([columnTitle, columnTickets]) => (
            <div key={columnTitle} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <KanbanColumn 
                title={columnTitle}
                count={columnTickets.length}
              >
                {columnTickets.map((ticket) => (
                  <TicketCard 
                    key={ticket.id}
                    ticket={convertToCardData(ticket)}
                  />
                ))}
              </KanbanColumn>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
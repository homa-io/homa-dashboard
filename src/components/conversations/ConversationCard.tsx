'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { MoreHorizontal, MessageSquare, PaperclipIcon } from 'lucide-react'

interface TicketCardProps {
  conversation: {
    id: string
    title: string
    customer: {
      name: string
      avatar?: string
    }
    priority: 'Low' | 'Medium' | 'High' | 'Critical'
    status: string
    assignedTo?: Array<{
      id: string
      name: string
      avatar?: string
    }>
    score?: string
    comments?: number
    attachments?: number
  }
  className?: string
}

const priorityColors = {
  'Low': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-red-100 text-red-800',
  'Critical': 'bg-red-200 text-red-900',
}

export function TicketCard({ conversation, className }: TicketCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer',
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            'px-2 py-1 text-xs rounded-full font-medium',
            conversation.status === 'New' ? 'bg-green-100 text-green-700' :
            conversation.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          )}>
            {conversation.status}
          </span>
          {conversation.priority !== 'Low' && (
            <span className={cn('text-xs font-medium', 
              conversation.priority === 'High' ? 'text-red-600' : 
              conversation.priority === 'Medium' ? 'text-orange-600' : 'text-red-800'
            )}>
              • {conversation.priority} Priority
            </span>
          )}
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {getInitials(conversation.customer.name)}
          </span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{conversation.customer.name}</p>
          <p className="text-gray-500 text-xs">{conversation.id}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          {conversation.score && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{conversation.score}</span>
            </div>
          )}
          {conversation.attachments && (
            <div className="flex items-center gap-1">
              <PaperclipIcon className="w-4 h-4" />
              <span>{conversation.attachments}</span>
            </div>
          )}
          {conversation.comments && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{conversation.comments}</span>
            </div>
          )}
        </div>

        {/* Assigned Users */}
        {conversation.assignedTo && conversation.assignedTo.length > 0 && (
          <div className="flex -space-x-2">
            {conversation.assignedTo.map((user, index) => (
              <div
                key={user.id}
                className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center"
              >
                <span className="text-xs text-gray-600">{getInitials(user.name)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
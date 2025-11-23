'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Conversation } from '@/types/conversation.types'
import { MoreVertical } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { PriorityIndicator } from './PriorityIndicator'
import { formatDistanceToNow } from '@/lib/dateUtils'

interface TicketRowProps {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
}

export function TicketRow({ conversation, isSelected, onSelect }: TicketRowProps) {
  return (
    <tr className={cn(
      'border-b border-border hover:bg-surface-hover transition-all duration-200 group',
      isSelected && 'bg-surface-active'
    )}>
      {/* Active indicator on hover */}
      <td className="relative">
        <div className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-accent-purple rounded-r-full transition-all duration-200',
          'group-hover:h-8'
        )} />
        <div className="px-4 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 rounded border-border text-accent-purple focus:ring-accent-purple"
          />
        </div>
      </td>

      {/* ID */}
      <td className="px-2 py-4">
        <span className="text-text-secondary font-mono text-sm">#{conversation.id}</span>
      </td>

      {/* Title & Tags */}
      <td className="px-2 py-4">
        <div>
          <p className="text-text-primary font-medium">{conversation.title}</p>
          <div className="flex gap-1 mt-1">
            {conversation.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-background-elevated text-text-secondary rounded-full"
              >
                {tag}
              </span>
            ))}
            {conversation.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-text-tertiary">
                +{conversation.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Customer */}
      <td className="px-2 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center">
            <span className="text-xs text-accent-purple font-medium">
              {conversation.customer.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-text-primary text-sm">{conversation.customer.name}</p>
            <p className="text-text-tertiary text-xs">{conversation.customer.email}</p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-2 py-4">
        <StatusBadge status={conversation.status} />
      </td>

      {/* Priority */}
      <td className="px-2 py-4">
        <PriorityIndicator priority={conversation.priority} />
      </td>

      {/* Assigned */}
      <td className="px-2 py-4">
        {conversation.assignedTo && conversation.assignedTo.length > 0 ? (
          <div className="flex -space-x-2">
            {conversation.assignedTo.slice(0, 2).map((agent) => (
              <div
                key={agent.id}
                className="w-8 h-8 rounded-full bg-background-elevated border-2 border-background flex items-center justify-center"
              >
                <span className="text-xs text-text-secondary">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            ))}
            {conversation.assignedTo.length > 2 && (
              <div className="w-8 h-8 rounded-full bg-background-elevated border-2 border-background flex items-center justify-center">
                <span className="text-xs text-text-secondary">
                  +{conversation.assignedTo.length - 2}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-border flex items-center justify-center">
            <span className="text-xs text-text-tertiary">--</span>
          </div>
        )}
      </td>

      {/* Updated */}
      <td className="px-2 py-4">
        <span className="text-text-tertiary text-sm">
          {formatDistanceToNow(conversation.updatedAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-2 py-4">
        <button className="p-1 rounded hover:bg-surface-hover transition-colors">
          <MoreVertical className="w-4 h-4 text-text-tertiary" />
        </button>
      </td>
    </tr>
  )
}
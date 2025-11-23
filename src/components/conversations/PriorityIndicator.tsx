import React from 'react'
import { cn } from '@/lib/utils'
import { TicketPriority } from '@/types/conversation.types'

interface PriorityIndicatorProps {
  priority: TicketPriority
}

const priorityConfig = {
  low: {
    label: 'Low',
    color: 'bg-text-tertiary',
    textColor: 'text-text-tertiary'
  },
  medium: {
    label: 'Medium',
    color: 'bg-status-warning',
    textColor: 'text-status-warning'
  },
  high: {
    label: 'High',
    color: 'bg-accent-orange',
    textColor: 'text-accent-orange'
  },
  critical: {
    label: 'Critical',
    color: 'bg-status-danger',
    textColor: 'text-status-danger'
  }
}

export function PriorityIndicator({ priority }: PriorityIndicatorProps) {
  const config = priorityConfig[priority]

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-1 h-3 rounded-full transition-colors',
              i <= ['low', 'medium', 'high', 'critical'].indexOf(priority)
                ? config.color
                : 'bg-border'
            )}
          />
        ))}
      </div>
      <span className={cn('text-xs font-medium', config.textColor)}>
        {config.label}
      </span>
    </div>
  )
}
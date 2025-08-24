import React from 'react'
import { cn } from '@/lib/utils'
import { TicketStatus } from '@/types/ticket.types'
import { Circle, Clock, CheckCircle, XCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: TicketStatus
}

const statusConfig = {
  open: {
    label: 'Open',
    icon: Circle,
    className: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    className: 'bg-status-warning/10 text-status-warning border-status-warning/20'
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle,
    className: 'bg-status-success/10 text-status-success border-status-success/20'
  },
  closed: {
    label: 'Closed',
    icon: XCircle,
    className: 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20'
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
      config.className
    )}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}
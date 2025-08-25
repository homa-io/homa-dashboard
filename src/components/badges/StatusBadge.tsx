import React from 'react'
import { CustomBadge } from '@/components/ui/custom-badge'
import { 
  getCustomerStatusVariant, 
  getTicketStatusVariant, 
  getStatusLabel 
} from '@/lib/badge-utils'
import type { BadgeVariant } from '@/lib/badge-utils'

export interface StatusBadgeProps {
  status: string
  type: 'customer' | 'ticket'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const StatusBadge = React.memo<StatusBadgeProps>(({ 
  status, 
  type, 
  size = 'md', 
  className 
}) => {
  const variant: BadgeVariant = type === 'customer' 
    ? getCustomerStatusVariant(status)
    : getTicketStatusVariant(status)
  
  const label = getStatusLabel(status)
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  }
  
  return (
    <CustomBadge 
      variant={variant} 
      className={`${sizeClasses[size]} ${className || ''}`}
    >
      {label}
    </CustomBadge>
  )
})

StatusBadge.displayName = 'StatusBadge'
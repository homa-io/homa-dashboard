import React from 'react'
import { CustomBadge } from '@/components/ui/custom-badge'
import { getPriorityVariant, getPriorityLabel } from '@/lib/badge-utils'
import { 
  Minus, 
  AlertCircle, 
  AlertTriangle, 
  Zap 
} from 'lucide-react'

export interface PriorityBadgeProps {
  priority: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const PriorityIcon = React.memo<{ priority: string; className?: string }>(({ 
  priority, 
  className = "w-3 h-3" 
}) => {
  const iconProps = { className }
  
  switch (priority.toLowerCase()) {
    case 'low':
      return <Minus {...iconProps} />
    case 'medium':
      return <AlertCircle {...iconProps} />
    case 'high':
      return <AlertTriangle {...iconProps} />
    case 'urgent':
      return <Zap {...iconProps} />
    default:
      return <AlertCircle {...iconProps} />
  }
})

PriorityIcon.displayName = 'PriorityIcon'

export const PriorityBadge = React.memo<PriorityBadgeProps>(({ 
  priority, 
  showIcon = true, 
  size = 'md', 
  className 
}) => {
  const variant = getPriorityVariant(priority)
  const label = getPriorityLabel(priority)
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }
  
  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5'
  }
  
  return (
    <CustomBadge 
      variant={variant} 
      className={`flex items-center ${sizeClasses[size]} ${className || ''}`}
    >
      {showIcon && (
        <PriorityIcon 
          priority={priority} 
          className={`${iconSizes[size]} flex-shrink-0`} 
        />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </CustomBadge>
  )
})

PriorityBadge.displayName = 'PriorityBadge'
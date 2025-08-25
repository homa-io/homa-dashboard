import React from 'react'
import { CustomBadge } from '@/components/ui/custom-badge'
import { getSourceVariant, getSourceLabel } from '@/lib/badge-utils'
import { 
  Mail, 
  Globe, 
  MessageCircle, 
  Phone, 
  Monitor,
  Users,
  Share
} from 'lucide-react'

export interface SourceBadgeProps {
  source: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SourceIcon = React.memo<{ source: string; className?: string }>(({ 
  source, 
  className = "w-3 h-3" 
}) => {
  const iconProps = { className }
  
  switch (source.toLowerCase()) {
    case 'email':
      return <Mail {...iconProps} />
    case 'webform':
    case 'website':
      return <Globe {...iconProps} />
    case 'whatsapp':
    case 'webchat':
      return <MessageCircle {...iconProps} />
    case 'phone_call':
      return <Phone {...iconProps} />
    case 'monitor':
      return <Monitor {...iconProps} />
    case 'referral':
      return <Users {...iconProps} />
    case 'social':
      return <Share {...iconProps} />
    default:
      return <Globe {...iconProps} />
  }
})

SourceIcon.displayName = 'SourceIcon'

export const SourceBadge = React.memo<SourceBadgeProps>(({ 
  source, 
  showIcon = true, 
  size = 'md', 
  className 
}) => {
  const variant = getSourceVariant(source)
  const label = getSourceLabel(source)
  
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
        <SourceIcon 
          source={source} 
          className={`${iconSizes[size]} flex-shrink-0`} 
        />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </CustomBadge>
  )
})

SourceBadge.displayName = 'SourceBadge'
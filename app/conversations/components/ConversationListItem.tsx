"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CustomBadge } from '@/components/ui/custom-badge'
import { getAvatarColor } from '@/lib/avatar-colors'
import { getMediaUrl } from '@/services/api-client'
import type { Conversation } from '@/types/conversation.types'
import {
  Mail,
  Globe,
  MessageCircle,
  Phone,
  Monitor,
  ArrowUp,
  ArrowDown,
  Circle,
  Clock,
  XCircle,
  Loader,
  Archive,
  CircleDot,
} from 'lucide-react'

interface ConversationListItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

// Helper functions
export const getSourceIcon = (source: string) => {
  switch (source) {
    case 'email': return <Mail className="w-3 h-3" />
    case 'whatsapp': return <MessageCircle className="w-3 h-3" />
    case 'webchat': case 'web': return <Monitor className="w-3 h-3" />
    case 'webform': return <Globe className="w-3 h-3" />
    case 'phone_call': return <Phone className="w-3 h-3" />
    case 'telegram': return <MessageCircle className="w-3 h-3" />
    default: return <Mail className="w-3 h-3" />
  }
}

export const getSourceColor = (source: string): "blue" | "green" | "yellow" | "purple" | "gray" => {
  switch (source) {
    case 'email': return 'blue'
    case 'whatsapp': return 'green'
    case 'webchat': case 'web': return 'purple'
    case 'webform': return 'yellow'
    case 'phone_call': return 'gray'
    case 'telegram': return 'blue'
    default: return 'gray'
  }
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return <Circle className="w-3 h-3" />
    case 'user_reply': return <ArrowUp className="w-3 h-3" />
    case 'agent_reply': return <ArrowDown className="w-3 h-3" />
    case 'processing': return <Loader className="w-3 h-3" />
    case 'closed': return <XCircle className="w-3 h-3" />
    case 'archived': return <Archive className="w-3 h-3" />
    case 'postponed': return <Clock className="w-3 h-3" />
    default: return <CircleDot className="w-3 h-3" />
  }
}

export const getStatusColor = (status: string): "blue" | "green" | "yellow" | "gray" => {
  switch (status) {
    case 'new': return 'blue'
    case 'user_reply': return 'green'
    case 'agent_reply': return 'blue'
    case 'processing': return 'yellow'
    case 'closed': return 'gray'
    case 'archived': return 'gray'
    case 'postponed': return 'yellow'
    default: return 'gray'
  }
}

export const getPriorityColor = (priority: string): "gray" | "yellow" | "red" | "red-dot" => {
  switch (priority) {
    case 'low': return 'gray'
    case 'medium': return 'yellow'
    case 'high': return 'red'
    case 'urgent': return 'red-dot'
    default: return 'gray'
  }
}

export function ConversationListItem({ conversation, isSelected, onClick }: ConversationListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
        isSelected ? 'bg-muted' : ''
      }`}
    >
      <div className={`flex items-start gap-3 transition-transform duration-200 ease-in-out ${
        isSelected ? 'translate-x-[5px]' : 'translate-x-0'
      }`}>
        <Avatar className="h-10 w-10">
          {conversation.customer.avatar_url && (
            <AvatarImage
              src={getMediaUrl(conversation.customer.avatar_url)}
              alt={conversation.customer.name}
            />
          )}
          <AvatarFallback
            className="text-white text-sm font-medium"
            style={{ backgroundColor: getAvatarColor(conversation.customer.name) }}
          >
            {conversation.customer.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{conversation.customer.name}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(conversation.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-sm text-foreground mb-2 line-clamp-2">
            {conversation.last_message_preview || conversation.title}
          </p>
          <div className="flex flex-wrap gap-1">
            <CustomBadge
              variant={getSourceColor(conversation.channel)}
              className="text-[10px] h-4 px-1"
            >
              {getSourceIcon(conversation.channel)}
              <span className="ml-1 capitalize">{conversation.channel.replace(/_/g, ' ')}</span>
            </CustomBadge>
            <CustomBadge
              variant={getStatusColor(conversation.status)}
              className="text-[10px] h-4 px-1 gap-0.5"
            >
              {getStatusIcon(conversation.status)}
              <span className="capitalize">{conversation.status.replace(/_/g, ' ')}</span>
            </CustomBadge>
            <CustomBadge
              variant={getPriorityColor(conversation.priority)}
              className="text-[10px] h-4"
            >
              {conversation.priority}
            </CustomBadge>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, MessageSquare, CheckCircle, Plus, User } from 'lucide-react'

interface Activity {
  id: string
  type: string
  message: string
  time: string
}

interface ActivityPanelProps {
  activities: Activity[]
  className?: string
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'reply':
      return MessageSquare
    case 'status':
      return CheckCircle
    case 'new':
      return Plus
    case 'assign':
      return User
    default:
      return MessageSquare
  }
}

export function ActivityPanel({ activities, className }: ActivityPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      'bg-background-secondary rounded-lg shadow-sm border border-border overflow-hidden',
      className
    )}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-border"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-text-primary font-semibold">Recent Activity</h3>
        <ChevronDown className={cn(
          'w-4 h-4 text-text-tertiary transition-transform duration-200',
          isCollapsed && 'rotate-180'
        )} />
      </div>

      <div className={cn(
        'transition-all duration-300 overflow-hidden',
        isCollapsed ? 'max-h-0' : 'max-h-96'
      )}>
        <div className="px-4 pb-4">
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div key={activity.id} className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center flex-shrink-0 group-hover:bg-accent-purple/10 transition-colors">
                    <Icon className="w-4 h-4 text-text-tertiary group-hover:text-accent-purple transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-secondary text-sm group-hover:text-text-primary transition-colors">
                      {activity.message}
                    </p>
                    <p className="text-text-tertiary text-xs mt-0.5">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
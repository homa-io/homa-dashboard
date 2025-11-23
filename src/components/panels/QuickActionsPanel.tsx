'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Plus, BarChart3, Users, Tag } from 'lucide-react'

interface QuickActionsPanelProps {
  className?: string
}

export function QuickActionsPanel({ className }: QuickActionsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const actions = [
    { icon: Plus, label: 'New Conversation', color: 'hover:bg-accent-purple/10 hover:text-accent-purple' },
    { icon: BarChart3, label: 'Reports', color: 'hover:bg-accent-blue/10 hover:text-accent-blue' },
    { icon: Users, label: 'Assign', color: 'hover:bg-accent-violet/10 hover:text-accent-violet' },
    { icon: Tag, label: 'Bulk Tag', color: 'hover:bg-accent-cyan/10 hover:text-accent-cyan' },
  ]

  return (
    <div className={cn(
      'bg-background-secondary rounded-lg shadow-sm border border-border overflow-hidden',
      className
    )}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer border-b border-border"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-text-primary font-semibold">Quick Actions</h3>
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
          <div className="grid grid-cols-2 gap-2">
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  className={cn(
                    'flex flex-col items-center justify-center p-4 rounded-lg',
                    'bg-background-elevated border border-border',
                    'text-text-secondary transition-all duration-200',
                    action.color
                  )}
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
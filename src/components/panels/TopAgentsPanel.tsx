'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Trophy } from 'lucide-react'

interface Agent {
  id: string
  name: string
  resolved: number
  avatar?: string
}

interface TopAgentsPanelProps {
  agents: Agent[]
  className?: string
}

export function TopAgentsPanel({ agents, className }: TopAgentsPanelProps) {
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
        <h3 className="text-text-primary font-semibold">Top Agents</h3>
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
            {agents.map((agent, index) => (
              <div key={agent.id} className="flex items-center gap-3 group">
                <div className="relative">
                  {index === 0 && (
                    <Trophy className="absolute -top-1 -right-1 w-3 h-3 text-status-warning" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center">
                    <span className="text-xs text-accent-purple font-medium">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-text-primary text-sm font-medium">{agent.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm">{agent.resolved}</p>
                  <p className="text-text-tertiary text-xs">resolved</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
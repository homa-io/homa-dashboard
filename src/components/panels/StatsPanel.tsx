'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsPanelProps {
  stats: {
    openTickets: number
    avgResponseTime: string
    resolutionRate: number
    satisfaction: number
  }
  className?: string
}

export function StatsPanel({ stats, className }: StatsPanelProps) {
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
        <h3 className="text-text-primary font-semibold">Overview</h3>
        <ChevronDown className={cn(
          'w-4 h-4 text-text-tertiary transition-transform duration-200',
          isCollapsed && 'rotate-180'
        )} />
      </div>

      <div className={cn(
        'transition-all duration-300 overflow-hidden',
        isCollapsed ? 'max-h-0' : 'max-h-96'
      )}>
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary text-sm">Open Conversations</span>
            <div className="flex items-center gap-2">
              <span className="text-text-primary font-medium">{stats.openTickets}</span>
              <TrendingUp className="w-4 h-4 text-status-success" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary text-sm">Avg Response</span>
            <div className="flex items-center gap-2">
              <span className="text-text-primary font-medium">{stats.avgResponseTime}</span>
              <TrendingDown className="w-4 h-4 text-status-danger" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary text-sm">Resolution</span>
            <div className="flex items-center gap-2">
              <span className="text-text-primary font-medium">{stats.resolutionRate}%</span>
              <Minus className="w-4 h-4 text-text-tertiary" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-text-secondary text-sm">Satisfaction</span>
            <div className="flex items-center gap-2">
              <span className="text-text-primary font-medium">{stats.satisfaction}</span>
              <span className="text-status-warning">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
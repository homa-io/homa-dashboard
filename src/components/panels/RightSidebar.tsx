'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { StatsPanel } from './StatsPanel'
import { ActivityPanel } from './ActivityPanel'
import { QuickActionsPanel } from './QuickActionsPanel'
import { TopAgentsPanel } from './TopAgentsPanel'
import { mockStats, mockActivities, mockTopAgents } from '@/lib/mockData'

interface RightSidebarProps {
  className?: string
}

export function RightSidebar({ className }: RightSidebarProps) {
  return (
    <div className={cn('p-4 space-y-4', className)}>
      <StatsPanel stats={mockStats} />
      <ActivityPanel activities={mockActivities} />
      <QuickActionsPanel />
      <TopAgentsPanel agents={mockTopAgents} />
    </div>
  )
}
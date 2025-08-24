import React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarSectionProps {
  children: React.ReactNode
  className?: string
}

export function SidebarSection({ children, className }: SidebarSectionProps) {
  return (
    <div className={cn('px-3 space-y-1', className)}>
      {children}
    </div>
  )
}
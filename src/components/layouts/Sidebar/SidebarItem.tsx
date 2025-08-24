'use client'

import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SidebarItemProps {
  item: {
    id: string
    label: string
    icon: LucideIcon
    href: string
  }
  isExpanded: boolean
  isActive?: boolean
  onClick?: () => void
}

export function SidebarItem({ item, isExpanded, isActive, onClick }: SidebarItemProps) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative mx-2',
        'hover:bg-sidebar-accent-hover/20',
        isActive && 'bg-sidebar-accent text-white shadow-sm',
        !isActive && 'text-sidebar-muted hover:text-sidebar-foreground'
      )}
    >
      <Icon className={cn(
        'w-5 h-5 transition-colors duration-200',
        isActive ? 'text-white' : 'text-sidebar-muted group-hover:text-sidebar-foreground',
        !isExpanded && 'mx-auto'
      )} />
      
      <span className={cn(
        'whitespace-nowrap transition-all duration-200',
        isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
      )}>
        {item.label}
      </span>

      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-background-elevated text-text-primary text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200 shadow-lg border border-border">
          {item.label}
        </div>
      )}
    </Link>
  )
}
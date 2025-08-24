'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Ticket, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  Menu
} from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { SidebarSection } from './SidebarSection'

export interface SidebarProps {
  className?: string
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/',
    section: 'main'
  },
  {
    id: 'tickets',
    label: 'Tickets',
    icon: Ticket,
    href: '/tickets',
    section: 'main'
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    href: '/customers',
    section: 'main'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    section: 'main'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    section: 'support'
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: HelpCircle,
    href: '/help',
    section: 'support'
  }
]

export function Sidebar({ className }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeItem, setActiveItem] = useState('tickets')

  const mainItems = menuItems.filter(item => item.section === 'main')
  const supportItems = menuItems.filter(item => item.section === 'support')

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
        'bg-sidebar border-r border-sidebar-border shadow-sm',
        isExpanded ? 'w-64' : 'w-16',
        className
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Overlay shadow when expanded */}
      <div 
        className={cn(
          'absolute inset-0 transition-opacity duration-300 pointer-events-none',
          isExpanded ? 'shadow-xl-dark opacity-100' : 'opacity-0'
        )}
      />
      
      <div className="relative flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className={cn(
              'text-sidebar-foreground font-semibold transition-opacity duration-200',
              isExpanded ? 'opacity-100' : 'opacity-0 w-0'
            )}>
              Homa
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <SidebarSection>
            {mainItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                isActive={activeItem === item.id}
                onClick={() => setActiveItem(item.id)}
              />
            ))}
          </SidebarSection>

          <SidebarSection className="mt-4 pt-4 border-t border-sidebar-border">
            {supportItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                isActive={activeItem === item.id}
                onClick={() => setActiveItem(item.id)}
              />
            ))}
          </SidebarSection>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-surface flex items-center justify-center border border-sidebar-border">
              <span className="text-sidebar-foreground text-xs font-medium">JD</span>
            </div>
            <div className={cn(
              'transition-opacity duration-200',
              isExpanded ? 'opacity-100' : 'opacity-0 w-0'
            )}>
              <p className="text-sidebar-foreground text-sm font-medium">John Doe</p>
              <p className="text-sidebar-muted text-xs">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
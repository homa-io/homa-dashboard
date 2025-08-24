'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { 
  LayoutGrid, 
  Search, 
  MessageSquare, 
  Home, 
  Clock, 
  Settings,
  Bell
} from 'lucide-react'

export interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Dark Sidebar */}
      <div className="w-16 bg-slate-800 flex flex-col items-center py-4 space-y-6">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        
        <nav className="flex flex-col space-y-4">
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-white bg-blue-500 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <Clock className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </nav>
        
        <div className="flex-1"></div>
        
        <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className={cn('flex-1 flex', className)}>
        {children}
      </div>
    </div>
  )
}
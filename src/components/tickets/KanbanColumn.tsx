'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface KanbanColumnProps {
  title: string
  count: number
  children: React.ReactNode
  className?: string
}

export function KanbanColumn({ title, count, children, className }: KanbanColumnProps) {
  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
            {count.toString().padStart(2, '0')}
          </span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      {/* Column Content */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
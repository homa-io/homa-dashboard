import React from 'react'
import { cn } from '@/lib/utils'

interface TicketListHeaderProps {
  onSelectAll: () => void
  isAllSelected: boolean
  isIndeterminate: boolean
}

export function TicketListHeader({ onSelectAll, isAllSelected, isIndeterminate }: TicketListHeaderProps) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="bg-background-tertiary border-b border-border">
        <th className="w-10 px-4 py-4 text-left">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isIndeterminate
            }}
            onChange={onSelectAll}
            className="w-4 h-4 rounded border-border text-accent-blue focus:ring-accent-blue/30"
          />
        </th>
        <th className="w-24 px-2 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          ID
        </th>
        <th className="px-2 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Title
        </th>
        <th className="w-48 px-2 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Customer
        </th>
        <th className="w-32 px-2 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Status
        </th>
        <th className="w-28 px-2 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Priority
        </th>
        <th className="w-36 px-2 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Assigned
        </th>
        <th className="w-32 px-2 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Updated
        </th>
        <th className="w-20 px-2 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  )
}
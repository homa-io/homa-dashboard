"use client"

import { ReactNode } from "react"
import { SettingsSidebar, SettingsTab } from "./SettingsSidebar"

interface SettingsPageWrapperProps {
  children: ReactNode
  activeTab?: SettingsTab
  title?: string
  description?: string
  showHeader?: boolean
}

export function SettingsPageWrapper({
  children,
  activeTab,
  title = "Settings",
  description = "Configure your dashboard preferences and system settings.",
  showHeader = true
}: SettingsPageWrapperProps) {
  return (
    <div className="flex-1 pl-3 sm:pl-4 pr-4 sm:pr-6 py-3 sm:py-4">
      {showHeader && (
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-3 lg:gap-3">
        <SettingsSidebar activeTab={activeTab} />

        {/* Content Area */}
        <div className="flex-1 min-w-0 lg:max-w-none">
          {children}
        </div>
      </div>
    </div>
  )
}

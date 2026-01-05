"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  Settings,
  Users,
  Building2,
  Bot,
  MessageCircle,
  Zap,
  Plug,
  MessageSquare,
  Webhook,
  Activity,
  Brain,
  Code,
  Timer,
} from "lucide-react"

export type SettingsTab = 'general' | 'users' | 'departments' | 'bot' | 'customer-attributes' | 'conversation-attributes' | 'integrations' | 'webhooks' | 'plugins' | 'canned-messages' | 'activity' | 'rag' | 'sdk' | 'jobs'

const tabs = [
  {
    id: 'general' as SettingsTab,
    label: 'General',
    icon: Settings,
    path: '/settings/general',
  },
  {
    id: 'users' as SettingsTab,
    label: 'Users',
    icon: Users,
    path: '/settings/users',
  },
  {
    id: 'departments' as SettingsTab,
    label: 'Departments',
    icon: Building2,
    path: '/settings/departments',
  },
  {
    id: 'bot' as SettingsTab,
    label: 'AI Agents',
    icon: Bot,
    path: '/settings/bot',
  },
  {
    id: 'customer-attributes' as SettingsTab,
    label: 'Customer Attrs',
    icon: Users,
    path: '/settings/customer-attributes',
  },
  {
    id: 'conversation-attributes' as SettingsTab,
    label: 'Conv. Attrs',
    icon: MessageCircle,
    path: '/settings/conversation-attributes',
  },
  {
    id: 'integrations' as SettingsTab,
    label: 'Integrations',
    icon: Plug,
    path: '/settings/integrations',
  },
  {
    id: 'webhooks' as SettingsTab,
    label: 'Webhooks',
    icon: Webhook,
    path: '/settings/webhooks',
  },
  {
    id: 'plugins' as SettingsTab,
    label: 'Plugins',
    icon: Zap,
    path: '/settings/plugins',
  },
  {
    id: 'canned-messages' as SettingsTab,
    label: 'Canned Messages',
    icon: MessageSquare,
    path: '/settings/canned-messages',
  },
  {
    id: 'activity' as SettingsTab,
    label: 'Activity Log',
    icon: Activity,
    path: '/settings/activity',
  },
  {
    id: 'rag' as SettingsTab,
    label: 'RAG',
    icon: Brain,
    path: '/settings/rag',
  },
  {
    id: 'sdk' as SettingsTab,
    label: 'SDK',
    icon: Code,
    path: '/settings/sdk',
  },
  {
    id: 'jobs' as SettingsTab,
    label: 'Background Jobs',
    icon: Timer,
    path: '/settings/jobs',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
  activeTab?: SettingsTab
}

export function SettingsLayout({ children, activeTab }: SettingsLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Determine active tab from pathname if not provided
  const currentTab = activeTab || tabs.find(tab => pathname.startsWith(tab.path))?.id || 'general'

  const handleTabChange = (tabId: SettingsTab) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab) {
      router.push(tab.path)
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-4 space-y-3 sm:space-y-4 md:space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure your dashboard preferences and system settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:gap-3">
        {/* Horizontal Navigation on Mobile, Vertical on Desktop */}
        <div className="lg:w-44 lg:flex-shrink-0">
          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <select
              value={currentTab}
              onChange={(e) => handleTabChange(e.target.value as SettingsTab)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = currentTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded text-left transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 lg:max-w-none">
          {children}
        </div>
      </div>
    </div>
  )
}

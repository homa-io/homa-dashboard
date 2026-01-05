"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  Settings,
  User,
  MessageCircle,
  Zap,
  Plug,
  MessageSquare,
  Webhook,
  Activity,
  Building2,
  Users,
  Brain,
  Bot,
  Code,
  Timer
} from "lucide-react"

export type SettingsTab = 'general' | 'users' | 'departments' | 'bot' | 'customer-attributes' | 'conversation-attributes' | 'integrations' | 'webhooks' | 'plugins' | 'canned-messages' | 'activity' | 'rag' | 'sdk' | 'jobs'

const tabs = [
  {
    id: 'bot' as SettingsTab,
    label: 'AI Agents',
    icon: Bot,
    path: '/settings/bot'
  },
  {
    id: 'departments' as SettingsTab,
    label: 'Departments',
    icon: Building2,
    path: '/settings/departments'
  },
  {
    id: 'users' as SettingsTab,
    label: 'Users',
    icon: Users,
    path: '/settings/users'
  },
  {
    id: 'integrations' as SettingsTab,
    label: 'Integrations',
    icon: Zap,
    path: '/settings/integrations'
  },
  {
    id: 'sdk' as SettingsTab,
    label: 'SDK',
    icon: Code,
    path: '/settings/sdk'
  },
  {
    id: 'rag' as SettingsTab,
    label: 'RAG',
    icon: Brain,
    path: '/settings/rag'
  },
  {
    id: 'canned-messages' as SettingsTab,
    label: 'Canned Messages',
    icon: MessageSquare,
    path: '/settings/canned-messages'
  },
  {
    id: 'webhooks' as SettingsTab,
    label: 'Webhooks',
    icon: Webhook,
    path: '/settings/webhooks'
  },
  {
    id: 'general' as SettingsTab,
    label: 'General',
    icon: Settings,
    path: '/settings/general'
  },
  {
    id: 'customer-attributes' as SettingsTab,
    label: 'Customer Attributes',
    icon: User,
    path: '/settings/customer-attributes'
  },
  {
    id: 'conversation-attributes' as SettingsTab,
    label: 'Conversation Attributes',
    icon: MessageCircle,
    path: '/settings/conversation-attributes'
  },
  {
    id: 'activity' as SettingsTab,
    label: 'Activity Log',
    icon: Activity,
    path: '/settings/activity'
  },
  {
    id: 'plugins' as SettingsTab,
    label: 'Plugins',
    icon: Plug,
    path: '/settings/plugins'
  },
  {
    id: 'jobs' as SettingsTab,
    label: 'Jobs',
    icon: Timer,
    path: '/settings/jobs'
  }
]

interface SettingsSidebarProps {
  activeTab?: SettingsTab
}

export function SettingsSidebar({ activeTab }: SettingsSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleTabChange = (path: string) => {
    router.push(path)
  }

  // Determine active tab from pathname if not provided
  const getActiveTab = (): SettingsTab | null => {
    if (activeTab) return activeTab

    // Check for exact matches first
    for (const tab of tabs) {
      if (pathname === tab.path) return tab.id
    }

    // Check for nested routes (e.g., /settings/bot/edit/1 -> bot)
    for (const tab of tabs) {
      if (pathname.startsWith(tab.path + '/') || pathname.startsWith(`/settings/${tab.id}`)) {
        return tab.id
      }
    }

    return null
  }

  const currentTab = getActiveTab()

  return (
    <div className="lg:w-44 lg:flex-shrink-0">
      {/* Mobile Tabs */}
      <div className="lg:hidden">
        <select
          value={currentTab || 'general'}
          onChange={(e) => {
            const tab = tabs.find(t => t.id === e.target.value)
            if (tab) handleTabChange(tab.path)
          }}
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
              onClick={() => handleTabChange(tab.path)}
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
  )
}

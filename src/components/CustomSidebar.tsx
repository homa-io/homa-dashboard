"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Settings, Users, BarChart3, Calendar, Archive, HelpCircle, Bell, Type } from 'lucide-react'
import { Logo } from './Logo'

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
}

interface CustomSidebarProps {
  className?: string
}

export function CustomSidebar({ className }: CustomSidebarProps) {
  const pathname = usePathname()

  const mainNavItems: MenuItem[] = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: MessageSquare, label: "Tickets", href: "/tickets" },
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Archive, label: "Archive", href: "/archive" },
    { icon: Type, label: "Typography", href: "/typography" },
  ]

  const bottomNavItems: MenuItem[] = [
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: HelpCircle, label: "Help", href: "/help" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <div className={`fixed left-0 top-0 h-full w-16 hover:w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-50 group shadow-lg ${className}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <Logo variant="primary" size="md" />
          </div>
          <span className="ml-3 text-sidebar-foreground font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-poppins">
            Homa
          </span>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {mainNavItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                } [&]:!text-sidebar-foreground hover:[&]:!text-sidebar-foreground`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-poppins font-medium">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
        
        {/* Bottom Items */}
        <div className="px-2 py-4 border-t border-sidebar-border space-y-2">
          {bottomNavItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                } [&]:!text-sidebar-foreground hover:[&]:!text-sidebar-foreground`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-poppins font-medium">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
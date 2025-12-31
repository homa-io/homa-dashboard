"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, MessageSquare, Settings, Users, BarChart3, Calendar, Archive, HelpCircle, Type, User, LogOut, BookOpen, Shield, Building2 } from 'lucide-react'
import { Logo } from './Logo'

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href?: string
  onClick?: () => void
}

interface DashboardSidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Track mouse position to only expand when mouse is within 64px of left edge
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const collapsedWidth = 64
      const expandedWidth = 256

      if (isExpanded) {
        // When expanded, collapse if mouse is beyond expanded width
        if (e.clientX > expandedWidth) {
          setIsExpanded(false)
        }
      } else {
        // When collapsed, expand only if mouse is within collapsed width
        if (e.clientX <= collapsedWidth) {
          setIsExpanded(true)
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [isExpanded])

  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })

    // Clear localStorage
    localStorage.removeItem("userSession")
    localStorage.removeItem("authToken")

    // Clear sessionStorage
    sessionStorage.clear()

    // Redirect to login page
    router.push("/login")
  }

  const mainNavItems: MenuItem[] = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: MessageSquare, label: "Conversations", href: "/conversations" },
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: Shield, label: "User Management", href: "/users" },
    { icon: Building2, label: "Departments", href: "/settings/departments" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: BookOpen, label: "Knowledge Base", href: "/knowledge-base/manage" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Archive, label: "Archive", href: "/archive" },
    { icon: Type, label: "Typography", href: "/typography" },
  ]

  const bottomNavItems: MenuItem[] = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: HelpCircle, label: "Help", href: "/help" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ]

  return (
    <div
      ref={sidebarRef}
      className={`fixed left-0 top-0 h-full ${isExpanded ? 'w-64' : 'w-16'} bg-sidebar border-r border-sidebar-border transition-[width] duration-300 ease-in-out z-50 shadow-lg overflow-hidden ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <Logo variant="primary" size="md" />
          </div>
          <span className={`ml-3 text-sidebar-foreground font-semibold whitespace-nowrap font-poppins transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Homa
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
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
                <span className={`ml-3 whitespace-nowrap font-poppins font-medium transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
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
            const itemKey = item.href || item.label

            if (item.onClick) {
              return (
                <button
                  key={itemKey}
                  onClick={item.onClick}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer text-left hover:bg-sidebar-accent text-sidebar-foreground [&]:!text-sidebar-foreground hover:[&]:!text-sidebar-foreground`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span className={`ml-3 whitespace-nowrap font-poppins font-medium transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <Link
                key={itemKey}
                href={item.href!}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                } [&]:!text-sidebar-foreground hover:[&]:!text-sidebar-foreground`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 whitespace-nowrap font-poppins font-medium transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
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

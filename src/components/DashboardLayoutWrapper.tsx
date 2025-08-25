"use client"

import { usePathname } from 'next/navigation'
import { DashboardSidebar } from './DashboardSidebar'

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show sidebar and topbar on login and lock pages
  const isAuthPage = pathname === '/login' || pathname === '/lock'
  
  return (
    <>
      {!isAuthPage && <DashboardSidebar />}
      <main className={!isAuthPage ? "ml-16" : ""}>
        {children}
      </main>
    </>
  )
}
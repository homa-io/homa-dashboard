"use client"

import { usePathname } from 'next/navigation'
import { CustomSidebar } from './CustomSidebar'
import { TopBar } from './TopBar'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show sidebar and topbar on login and lock pages
  const isAuthPage = pathname === '/login' || pathname === '/lock'
  
  return (
    <>
      {!isAuthPage && <CustomSidebar />}
      {!isAuthPage && <TopBar />}
      <main className={!isAuthPage ? "ml-16" : ""}>
        {children}
      </main>
    </>
  )
}
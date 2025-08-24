"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  LogOut, 
  User, 
  Lock, 
  Languages, 
  Sun, 
  Moon 
} from "lucide-react"
import { useDarkMode } from "@/hooks/useDarkMode"

export function TopBar() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const router = useRouter()

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

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 p-2">
        <TooltipProvider>
          {/* Profile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0"
                onClick={() => router.push("/profile")}
              >
                <User className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              className="bg-black text-white border-black"
              sideOffset={4}
              style={{
                '--radix-tooltip-content-background-color': 'black',
                '--radix-tooltip-content-color': 'white'
              } as any}
            >
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>

          {/* Lock */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0"
                onClick={() => router.push("/lock")}
              >
                <Lock className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white border-black" sideOffset={4}>
              <p>Lock Screen</p>
            </TooltipContent>
          </Tooltip>

          {/* Language */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Languages className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white border-black" sideOffset={4}>
              <p>Language</p>
            </TooltipContent>
          </Tooltip>

          {/* Dark/Light Mode */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white border-black" sideOffset={4}>
              <p>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Logout */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 p-0"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white border-black" sideOffset={4}>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
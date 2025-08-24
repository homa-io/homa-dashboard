"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CountryFlagBadgeProps {
  ip: string
  className?: string
}

interface CountryInfo {
  code: string
  name: string
}

const getCountryInfo = (ip: string): CountryInfo => {
  const ipToCountry: { [key: string]: CountryInfo } = {
    "107.116.91.201": { code: "lk", name: "Sri Lanka" },
    "192.168.1.100": { code: "us", name: "United States" },
    "192.168.1.101": { code: "gb", name: "United Kingdom" },
    "10.0.0.1": { code: "ca", name: "Canada" },
    "172.16.0.1": { code: "au", name: "Australia" },
    "203.0.113.1": { code: "jp", name: "Japan" },
    "198.51.100.1": { code: "de", name: "Germany" },
    "203.0.113.5": { code: "fr", name: "France" },
    "203.0.113.10": { code: "it", name: "Italy" },
    "203.0.113.15": { code: "es", name: "Spain" },
    "203.0.113.20": { code: "nl", name: "Netherlands" },
    "203.0.113.25": { code: "se", name: "Sweden" },
    "203.0.113.30": { code: "br", name: "Brazil" },
    "203.0.113.35": { code: "in", name: "India" },
    "203.0.113.40": { code: "cn", name: "China" },
  }
  
  return ipToCountry[ip] || { code: "un", name: "Unknown Country" }
}

export function CountryFlagBadge({ ip, className }: CountryFlagBadgeProps) {
  const countryInfo = getCountryInfo(ip)
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn("flex items-center gap-2 text-xs", className)}
          >
            <span className="font-mono font-medium">{ip}</span>
            <span className={`fi fi-${countryInfo.code} w-4 h-3 rounded-sm overflow-hidden bg-gray-200`}></span>
            <span className="uppercase font-medium">{countryInfo.code}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{countryInfo.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
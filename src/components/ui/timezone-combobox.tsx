"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Common timezones grouped by region
const TIMEZONES = [
  // Americas
  { value: "America/New_York", label: "Eastern Time (US & Canada)", region: "Americas" },
  { value: "America/Chicago", label: "Central Time (US & Canada)", region: "Americas" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)", region: "Americas" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)", region: "Americas" },
  { value: "America/Anchorage", label: "Alaska", region: "Americas" },
  { value: "Pacific/Honolulu", label: "Hawaii", region: "Americas" },
  { value: "America/Toronto", label: "Toronto", region: "Americas" },
  { value: "America/Vancouver", label: "Vancouver", region: "Americas" },
  { value: "America/Mexico_City", label: "Mexico City", region: "Americas" },
  { value: "America/Bogota", label: "Bogota", region: "Americas" },
  { value: "America/Lima", label: "Lima", region: "Americas" },
  { value: "America/Santiago", label: "Santiago", region: "Americas" },
  { value: "America/Buenos_Aires", label: "Buenos Aires", region: "Americas" },
  { value: "America/Sao_Paulo", label: "Sao Paulo", region: "Americas" },

  // Europe
  { value: "Europe/London", label: "London", region: "Europe" },
  { value: "Europe/Dublin", label: "Dublin", region: "Europe" },
  { value: "Europe/Paris", label: "Paris", region: "Europe" },
  { value: "Europe/Berlin", label: "Berlin", region: "Europe" },
  { value: "Europe/Amsterdam", label: "Amsterdam", region: "Europe" },
  { value: "Europe/Brussels", label: "Brussels", region: "Europe" },
  { value: "Europe/Rome", label: "Rome", region: "Europe" },
  { value: "Europe/Madrid", label: "Madrid", region: "Europe" },
  { value: "Europe/Lisbon", label: "Lisbon", region: "Europe" },
  { value: "Europe/Vienna", label: "Vienna", region: "Europe" },
  { value: "Europe/Zurich", label: "Zurich", region: "Europe" },
  { value: "Europe/Stockholm", label: "Stockholm", region: "Europe" },
  { value: "Europe/Oslo", label: "Oslo", region: "Europe" },
  { value: "Europe/Copenhagen", label: "Copenhagen", region: "Europe" },
  { value: "Europe/Helsinki", label: "Helsinki", region: "Europe" },
  { value: "Europe/Warsaw", label: "Warsaw", region: "Europe" },
  { value: "Europe/Prague", label: "Prague", region: "Europe" },
  { value: "Europe/Athens", label: "Athens", region: "Europe" },
  { value: "Europe/Istanbul", label: "Istanbul", region: "Europe" },
  { value: "Europe/Moscow", label: "Moscow", region: "Europe" },

  // Asia & Pacific
  { value: "Asia/Dubai", label: "Dubai", region: "Asia & Pacific" },
  { value: "Asia/Karachi", label: "Karachi", region: "Asia & Pacific" },
  { value: "Asia/Kolkata", label: "Mumbai, Kolkata, New Delhi", region: "Asia & Pacific" },
  { value: "Asia/Dhaka", label: "Dhaka", region: "Asia & Pacific" },
  { value: "Asia/Bangkok", label: "Bangkok", region: "Asia & Pacific" },
  { value: "Asia/Jakarta", label: "Jakarta", region: "Asia & Pacific" },
  { value: "Asia/Singapore", label: "Singapore", region: "Asia & Pacific" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", region: "Asia & Pacific" },
  { value: "Asia/Shanghai", label: "Beijing, Shanghai", region: "Asia & Pacific" },
  { value: "Asia/Taipei", label: "Taipei", region: "Asia & Pacific" },
  { value: "Asia/Seoul", label: "Seoul", region: "Asia & Pacific" },
  { value: "Asia/Tokyo", label: "Tokyo", region: "Asia & Pacific" },
  { value: "Australia/Perth", label: "Perth", region: "Asia & Pacific" },
  { value: "Australia/Sydney", label: "Sydney", region: "Asia & Pacific" },
  { value: "Australia/Melbourne", label: "Melbourne", region: "Asia & Pacific" },
  { value: "Australia/Brisbane", label: "Brisbane", region: "Asia & Pacific" },
  { value: "Pacific/Auckland", label: "Auckland", region: "Asia & Pacific" },

  // Africa & Middle East
  { value: "Africa/Cairo", label: "Cairo", region: "Africa & Middle East" },
  { value: "Africa/Johannesburg", label: "Johannesburg", region: "Africa & Middle East" },
  { value: "Africa/Lagos", label: "Lagos", region: "Africa & Middle East" },
  { value: "Africa/Nairobi", label: "Nairobi", region: "Africa & Middle East" },
  { value: "Asia/Jerusalem", label: "Jerusalem", region: "Africa & Middle East" },
  { value: "Asia/Riyadh", label: "Riyadh", region: "Africa & Middle East" },
  { value: "Asia/Tehran", label: "Tehran", region: "Africa & Middle East" },

  // UTC
  { value: "UTC", label: "UTC (Coordinated Universal Time)", region: "UTC" },
]

// Group timezones by region
const groupedTimezones = TIMEZONES.reduce((acc, tz) => {
  if (!acc[tz.region]) {
    acc[tz.region] = []
  }
  acc[tz.region].push(tz)
  return acc
}, {} as Record<string, typeof TIMEZONES>)

interface TimezoneComboboxProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function TimezoneCombobox({
  value,
  onValueChange,
  placeholder = "Select timezone...",
  disabled = false,
}: TimezoneComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedTimezone = TIMEZONES.find((tz) => tz.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 truncate">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {selectedTimezone ? selectedTimezone.label : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search timezone..." />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>
            {Object.entries(groupedTimezones).map(([region, timezones]) => (
              <CommandGroup key={region} heading={region}>
                {timezones.map((timezone) => (
                  <CommandItem
                    key={timezone.value}
                    value={`${timezone.label} ${timezone.value}`}
                    onSelect={() => {
                      onValueChange(timezone.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === timezone.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1">{timezone.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {timezone.value.split('/').pop()?.replace(/_/g, ' ')}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

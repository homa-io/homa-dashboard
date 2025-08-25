"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  Activity,
  Award
} from "lucide-react"

// Dynamically import recharts components with no SSR
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)
const LineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { ssr: false }
)
const Line = dynamic(
  () => import('recharts').then((mod) => mod.Line),
  { ssr: false }
)
const Area = dynamic(
  () => import('recharts').then((mod) => mod.Area),
  { ssr: false }
)
const AreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { ssr: false }
)
const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
)
const Bar = dynamic(
  () => import('recharts').then((mod) => mod.Bar),
  { ssr: false }
)
const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
)
const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
)
const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
)
const Legend = dynamic(
  () => import('recharts').then((mod) => mod.Legend),
  { ssr: false }
)
const ReferenceLine = dynamic(
  () => import('recharts').then((mod) => mod.ReferenceLine),
  { ssr: false }
)

// Generate mock data for different months
const generateMonthData = (month: string) => {
  const daysInMonth = month === "February" ? 28 : 
                      ["April", "June", "September", "November"].includes(month) ? 30 : 31
  
  const data = []
  for (let i = 1; i <= daysInMonth; i++) {
    const isActive = Math.random() > 0.2
    data.push({
      day: i,
      hours: Math.floor(Math.random() * 8) + 2,
      tickets: Math.floor(Math.random() * 20) + 5,
      active: isActive ? 1 : 0,
      activityLevel: isActive ? Math.floor(Math.random() * 8) + 2 : 0 // Activity level from 0-10
    })
  }
  return data
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

// Custom hook for counting animation
const useCountAnimation = (targetValue: number, duration: number = 1500) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    setCount(0)
    
    let startTime: number | null = null
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      const currentCount = Math.floor(progress * targetValue)
      setCount(currentCount)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [targetValue])
  
  return count
}

export default function StatisticsPage() {
  const currentMonth = months[new Date().getMonth()]
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [monthData, setMonthData] = useState(generateMonthData(currentMonth))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    setMonthData(generateMonthData(month))
  }

  // Calculate totals
  const totalHours = monthData.reduce((sum, day) => sum + day.hours, 0)
  const totalTickets = monthData.reduce((sum, day) => sum + day.tickets, 0)
  const activeDays = monthData.filter(day => day.active === 1).length
  const avgHoursPerDay = totalHours / monthData.length
  const avgTicketsPerDay = totalTickets / monthData.length

  // Animated counters
  const animatedHours = useCountAnimation(totalHours)
  const animatedTickets = useCountAnimation(totalTickets)
  const animatedDays = useCountAnimation(activeDays)
  const animatedAvgHours = useCountAnimation(Math.round(avgHoursPerDay * 10)) / 10
  const animatedAvgTickets = useCountAnimation(Math.round(avgTicketsPerDay * 10)) / 10

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = '/profile'}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Performance Statistics</h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-1">Track your activity and productivity metrics</p>
          </div>
        </div>
        
        {/* Month Selector */}
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {months.map(month => (
              <SelectItem key={month} value={month}>
                {month} 2024
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Online Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 px-6 text-xl font-semibold text-gray-900 dark:text-white">
              <Clock className="h-5 w-5 text-blue-600" />
              Online Hours per Day
            </CardTitle>
            <CardDescription className="px-6 text-sm text-gray-600 dark:text-gray-400 mt-1">Daily working hours in {selectedMonth}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div style={{ width: '100%', height: 300 }}>
              {mounted && (
                <ResponsiveContainer>
                  <AreaChart 
                    data={monthData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                      height={0}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                      width={0}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone" 
                      dataKey="hours"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#hoursGradient)"
                      dot={false}
                      activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tickets Response Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 px-6 text-xl font-semibold text-gray-900 dark:text-white">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Tickets Responded per Day
            </CardTitle>
            <CardDescription className="px-6 text-sm text-gray-600 dark:text-gray-400 mt-1">Daily ticket responses in {selectedMonth}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div style={{ width: '100%', height: 300 }}>
              {mounted && (
                <ResponsiveContainer>
                  <AreaChart 
                    data={monthData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                      height={0}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                      width={0}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone" 
                      dataKey="tickets"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#ticketsGradient)"
                      dot={false}
                      activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            {selectedMonth} Summary
          </CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">Overall performance metrics for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Hours</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{animatedHours}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">hours worked</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Tickets</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{animatedTickets}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">tickets resolved</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Days</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{animatedDays}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">of {monthData.length} days</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Hours/Day</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{animatedAvgHours.toFixed(1)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">hours average</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Tickets/Day</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{animatedAvgTickets.toFixed(1)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">tickets average</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
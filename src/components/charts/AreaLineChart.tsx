"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'

interface ChartData {
  name: string
  value: number
}

interface AreaLineChartProps {
  data: ChartData[]
  title: string
  subtitle?: string
  color?: string
  height?: number
  showGrid?: boolean
}

export function AreaLineChart({ 
  data, 
  title, 
  subtitle, 
  color = "#3B82F6", 
  height = 300,
  showGrid = true 
}: AreaLineChartProps) {
  // Create gradient for the fill area
  const gradientId = `gradient-${color.replace('#', '')}`

  return (
    <div className="w-full">
      {/* Chart Header */}
      <div className="mb-4">
        <h3 className="heading-4 mb-1">{title}</h3>
        {subtitle && (
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <span className="caption-large">{subtitle}</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                opacity={0.5}
              />
            )}
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280', fontFamily: 'var(--font-inter)' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280', fontFamily: 'var(--font-inter)' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
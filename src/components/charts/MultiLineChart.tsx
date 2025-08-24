"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'

interface ChartData {
  name: string
  [key: string]: string | number
}

interface LineItem {
  key: string
  label: string
  color: string
  strokeDasharray?: string
}

interface MultiLineChartProps {
  data: ChartData[]
  title: string
  lines: LineItem[]
  height?: number
  showGrid?: boolean
}

export function MultiLineChart({ 
  data, 
  title, 
  lines, 
  height = 200,
  showGrid = false 
}: MultiLineChartProps) {

  return (
    <div className="w-full">
      {/* Chart Header with Legend */}
      <div className="mb-4">
        <h3 className="heading-5 mb-3">{title}</h3>
        <div className="flex flex-wrap gap-4">
          {lines.map((line) => (
            <div key={line.key} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: line.color }}
              />
              <span className="caption-large" style={{ fontFamily: 'var(--font-inter)' }}>
                {line.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
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
              tick={{ fontSize: 11, fill: '#6B7280', fontFamily: 'var(--font-inter)' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6B7280', fontFamily: 'var(--font-inter)' }}
            />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                strokeDasharray={line.strokeDasharray || "0"}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
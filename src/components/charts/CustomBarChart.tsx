"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

interface ChartData {
  name: string
  [key: string]: string | number
}

interface LegendItem {
  key: string
  label: string
  color: string
}

interface CustomBarChartProps {
  data: ChartData[]
  title: string
  legends: LegendItem[]
  height?: number
  showGrid?: boolean
}

export function CustomBarChart({ 
  data, 
  title, 
  legends, 
  height = 300,
  showGrid = true 
}: CustomBarChartProps) {
  
  const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => (
    <div className="flex flex-wrap gap-4 justify-center mt-4">
      {legends.map((legend, index) => (
        <div key={legend.key} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: legend.color }}
          />
          <span className="caption-large" style={{ fontFamily: 'var(--font-inter)' }}>
            {legend.label}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="w-full">
      {/* Chart Header */}
      <div className="mb-4">
        <h3 className="heading-4">{title}</h3>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
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
            <Legend content={<CustomLegend />} />
            {legends.map((legend) => (
              <Bar
                key={legend.key}
                dataKey={legend.key}
                fill={legend.color}
                radius={[2, 2, 0, 0]}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
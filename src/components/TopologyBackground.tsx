"use client"

import { useEffect, useRef } from 'react'

interface TopologyBackgroundProps {
  children?: React.ReactNode
  className?: string
}

interface Point {
  x: number
  y: number
  vx: number
  vy: number
}

export function TopologyBackground({ children, className = "" }: TopologyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const pointsRef = useRef<Point[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize points
    const numPoints = 50
    const points: Point[] = []
    
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      })
    }
    pointsRef.current = points

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)' // Dark slate background with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw points
      pointsRef.current.forEach(point => {
        // Update position
        point.x += point.vx
        point.y += point.vy

        // Bounce off walls
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1

        // Keep points in bounds
        point.x = Math.max(0, Math.min(canvas.width, point.x))
        point.y = Math.max(0, Math.min(canvas.height, point.y))

        // Draw point
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)' // Blue color
        ctx.fill()
      })

      // Draw connections
      const maxDistance = 150
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)' // Blue color with low opacity
      ctx.lineWidth = 1

      for (let i = 0; i < pointsRef.current.length; i++) {
        for (let j = i + 1; j < pointsRef.current.length; j++) {
          const p1 = pointsRef.current[i]
          const p2 = pointsRef.current[j]
          const distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          )

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.globalAlpha = 1 - distance / maxDistance
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }

        // Connect to mouse
        const mouseDistance = Math.sqrt(
          Math.pow(pointsRef.current[i].x - mouseX, 2) + 
          Math.pow(pointsRef.current[i].y - mouseY, 2)
        )
        if (mouseDistance < maxDistance) {
          ctx.beginPath()
          ctx.moveTo(pointsRef.current[i].x, pointsRef.current[i].y)
          ctx.lineTo(mouseX, mouseY)
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
          ctx.globalAlpha = 1 - mouseDistance / maxDistance
          ctx.stroke()
          ctx.globalAlpha = 1
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)'
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className={`relative min-h-screen bg-slate-900 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
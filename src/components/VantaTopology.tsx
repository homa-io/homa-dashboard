"use client"

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    VANTA: any
    THREE: any
  }
}

interface VantaTopologyProps {
  children?: React.ReactNode
  className?: string
}

export function VantaTopology({ children, className = "" }: VantaTopologyProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const [vantaLoaded, setVantaLoaded] = useState(false)

  useEffect(() => {
    if (!vantaLoaded && typeof window !== 'undefined') {
      // Create script tags to load libraries properly
      const loadScripts = async () => {
        try {
          // Load Three.js
          const THREE = await import('three')
          window.THREE = THREE
          
          // Load Vanta
          await import('vanta/dist/vanta.topology.min')
          
          setVantaLoaded(true)
        } catch (error) {
          console.error('Failed to load Vanta scripts:', error)
        }
      }
      
      loadScripts()
    }
  }, [vantaLoaded])

  useEffect(() => {
    if (vantaLoaded && window.VANTA && vantaRef.current && !vantaEffect.current) {
      try {
        vantaEffect.current = window.VANTA.TOPOLOGY({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x3b82f6, // Blue color
          backgroundColor: 0x0f172a, // Dark blue/slate background
          points: 10.0,
          maxDistance: 20.0,
          spacing: 15.0
        })
      } catch (error) {
        console.error('Failed to initialize Vanta effect:', error)
      }
    }

  }, [vantaLoaded])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy()
        } catch (error) {
          console.error('Error destroying Vanta effect:', error)
        }
        vantaEffect.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={vantaRef}
      className={`relative min-h-screen ${className}`}
    >
      {children}
    </div>
  )
}
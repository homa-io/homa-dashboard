"use client"

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface VantaTopologyBackgroundProps {
  children?: React.ReactNode
  className?: string
}

declare global {
  interface Window {
    VANTA: any
    p5: any
  }
}

export function VantaTopologyBackground({ children, className = "" }: VantaTopologyBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  const initVanta = () => {
    if (vantaEffect.current) return
    
    if (window.VANTA && vantaRef.current) {
      try {
        vantaEffect.current = window.VANTA.TOPOLOGY({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x3b82f6, // Blue color
          backgroundColor: 0x0f172a, // Dark slate background
          points: 10.00,
          maxDistance: 20.00,
          spacing: 15.00
        })
      } catch (error) {
        console.error('Failed to initialize Vanta effect:', error)
      }
    }
  }

  useEffect(() => {
    // Cleanup function
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
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // p5.js is loaded, now load Vanta
        }}
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js"
        strategy="afterInteractive"
        onLoad={initVanta}
      />
      <div 
        ref={vantaRef}
        className={`relative min-h-screen ${className}`}
        style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)' }}
      >
        {children}
      </div>
    </>
  )
}
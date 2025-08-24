"use client"

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

interface RandomVantaBackgroundProps {
  children?: React.ReactNode
  className?: string
}

declare global {
  interface Window {
    VANTA: any
    p5: any
    THREE: any
  }
}

const vantaEffects = [
  {
    name: 'topology',
    script: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js',
    init: (el: HTMLElement) => window.VANTA.TOPOLOGY({
      el,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x3b82f6,
      backgroundColor: 0x0f172a
    })
  },
  {
    name: 'waves',
    script: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js',
    init: (el: HTMLElement) => window.VANTA.WAVES({
      el,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x1e40af,
      shininess: 30.00,
      waveHeight: 15.00,
      waveSpeed: 1.00,
      zoom: 0.75
    })
  },
  {
    name: 'net',
    script: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js',
    init: (el: HTMLElement) => window.VANTA.NET({
      el,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x3b82f6,
      backgroundColor: 0x0f172a,
      points: 10.00,
      maxDistance: 20.00,
      spacing: 15.00
    })
  },
  {
    name: 'dots',
    script: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js',
    init: (el: HTMLElement) => window.VANTA.DOTS({
      el,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x3b82f6,
      color2: 0x1e40af,
      backgroundColor: 0x0f172a,
      size: 3.00,
      spacing: 30.00
    })
  },
  {
    name: 'cells',
    script: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js',
    init: (el: HTMLElement) => window.VANTA.CELLS({
      el,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color1: 0x1e40af,
      color2: 0x3b82f6,
      size: 1.50,
      speed: 1.00
    })
  }
]

export function RandomVantaBackground({ children, className = "" }: RandomVantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const [selectedEffect, setSelectedEffect] = useState(vantaEffects[0])
  const [scriptsLoaded, setScriptsLoaded] = useState({ p5: false, three: false, effect: false })

  // Select random effect on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * vantaEffects.length)
    setSelectedEffect(vantaEffects[randomIndex])
  }, [])

  const initVanta = () => {
    if (vantaEffect.current) return
    
    if (window.VANTA && window.VANTA.TOPOLOGY && vantaRef.current && scriptsLoaded.p5 && scriptsLoaded.three && scriptsLoaded.effect) {
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
          color: 0x3b82f6,
          backgroundColor: 0x0f172a
        })
        console.log('Initialized Vanta topology effect')
      } catch (error) {
        console.error('Failed to initialize Vanta effect:', error)
      }
    }
  }

  useEffect(() => {
    if (scriptsLoaded.p5 && scriptsLoaded.three && scriptsLoaded.effect) {
      initVanta()
    }
  }, [scriptsLoaded, selectedEffect])

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
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, p5: true }))}
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, three: true }))}
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, effect: true }))}
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
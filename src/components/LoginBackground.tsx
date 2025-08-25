"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

interface LoginBackgroundProps {
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
      color: 0x006994,
      backgroundColor: 0x001f3f
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

export function LoginBackground({ children, className = "" }: LoginBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const [selectedEffect, setSelectedEffect] = useState<typeof vantaEffects[0] | null>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState({ p5: false, three: false, effect: false })
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  // Select TOPOLOGY effect specifically
  useEffect(() => {
    const topologyEffect = vantaEffects.find(effect => effect.name === 'topology')
    setSelectedEffect(topologyEffect || vantaEffects[0])
    
    console.log('LoginBackground: Selected effect:', topologyEffect?.name || 'fallback')
    
    // Mark that we've been on login page
    sessionStorage.setItem('loginBackgroundActive', 'true')
    
    return () => {
      // Clean up when component unmounts
      destroyVantaEffect()
      sessionStorage.removeItem('loginBackgroundActive')
      console.log('LoginBackground: Cleanup completed')
    }
  }, [])

  // Detect navigation away from login page
  useEffect(() => {
    const handleRouteChange = () => {
      console.log('LoginBackground: Route change detected, cleaning up...')
      destroyVantaEffect()
    }

    // Listen for navigation
    const originalPush = router.push
    const originalReplace = router.replace
    
    router.push = (...args) => {
      handleRouteChange()
      return originalPush.apply(router, args)
    }
    
    router.replace = (...args) => {
      handleRouteChange()
      return originalReplace.apply(router, args)
    }

    return () => {
      router.push = originalPush
      router.replace = originalReplace
    }
  }, [router])

  const destroyVantaEffect = () => {
    if (vantaEffect.current) {
      try {
        console.log('LoginBackground: Destroying Vanta effect for memory cleanup')
        vantaEffect.current.destroy()
      } catch (error) {
        console.error('LoginBackground: Error destroying Vanta effect:', error)
      } finally {
        vantaEffect.current = null
        setIsInitialized(false)
      }
    }
  }

  const initVanta = () => {
    if (!selectedEffect || vantaEffect.current || isInitialized || !vantaRef.current) {
      return
    }
    
    if (scriptsLoaded.p5 && scriptsLoaded.three && scriptsLoaded.effect) {
      try {
        console.log('LoginBackground: Initializing Vanta effect:', selectedEffect.name)
        vantaEffect.current = selectedEffect.init(vantaRef.current)
        setIsInitialized(true)
        console.log('LoginBackground: Vanta effect initialized successfully')
      } catch (error) {
        console.error('LoginBackground: Failed to initialize Vanta effect:', error)
      }
    }
  }

  // Initialize effect when everything is ready
  useEffect(() => {
    if (selectedEffect && scriptsLoaded.p5 && scriptsLoaded.three && scriptsLoaded.effect && !isInitialized) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(initVanta, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [scriptsLoaded, selectedEffect, isInitialized])

  // Load the selected effect's script dynamically
  const loadEffectScript = () => {
    if (!selectedEffect) return null

    return (
      <Script 
        key={selectedEffect.name}
        src={selectedEffect.script}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('LoginBackground: Effect script loaded:', selectedEffect.name)
          setScriptsLoaded(prev => ({ ...prev, effect: true }))
        }}
        onError={(e) => {
          console.error('LoginBackground: Failed to load effect script:', e)
        }}
      />
    )
  }

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('LoginBackground: p5.js loaded')
          setScriptsLoaded(prev => ({ ...prev, p5: true }))
        }}
        onError={(e) => {
          console.error('LoginBackground: Failed to load p5.js:', e)
        }}
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('LoginBackground: three.js loaded')
          setScriptsLoaded(prev => ({ ...prev, three: true }))
        }}
        onError={(e) => {
          console.error('LoginBackground: Failed to load three.js:', e)
        }}
      />
      {loadEffectScript()}
      <div 
        ref={vantaRef}
        className={`relative min-h-screen ${className}`}
        style={{ backgroundColor: '#001f3f' }}
      >
        {children}
      </div>
    </>
  )
}
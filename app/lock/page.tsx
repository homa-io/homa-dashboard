"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, User } from "lucide-react"
import { RandomVantaBackground } from "@/components/RandomVantaBackground"

export default function LockScreen() {
  const [pin, setPin] = useState(["", "", "", "", "", ""])
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [error, setError] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handlePinChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (value && index === 5 && newPin.every(digit => digit)) {
      handleUnlock(newPin.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const digits = pastedData.split("").filter(char => /^\d$/.test(char))
    
    const newPin = [...pin]
    digits.forEach((digit, i) => {
      if (i < 6) newPin[i] = digit
    })
    setPin(newPin)
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newPin.findIndex(digit => !digit)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
      if (newPin.every(digit => digit)) {
        handleUnlock(newPin.join(""))
      }
    }
  }

  const handleUnlock = async (pinCode: string) => {
    setIsUnlocking(true)
    setError("")
    
    // Simulate unlock process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (pinCode === "123456" || pinCode === "000000") {
      window.location.href = "/"
    } else {
      setError("Incorrect PIN")
      setIsUnlocking(false)
      // Clear PIN on error
      setPin(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <RandomVantaBackground className="flex items-center justify-center p-4 overflow-hidden">
      
      <Card className="w-full max-w-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-0 shadow-2xl relative">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            
            {/* User Info */}
            <div>
              <h2 className="text-xl font-semibold text-foreground">Admin User</h2>
              <p className="text-sm text-muted-foreground">admin@homa.com</p>
            </div>
            
            {/* Lock Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            </div>
            
            {/* PIN Input */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Enter your 6-digit PIN</p>
              
              <div className="flex justify-center gap-2">
                {pin.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    disabled={isUnlocking}
                  />
                ))}
              </div>
              
              {error && (
                <p className="text-xs text-red-500 text-center animate-shake">{error}</p>
              )}
              
              {isUnlocking && (
                <p className="text-sm text-muted-foreground text-center">Unlocking...</p>
              )}
            </div>
            
            {/* Footer */}
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleString()}
              </p>
              <Button variant="link" size="sm" className="text-xs">
                Switch User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </RandomVantaBackground>
  )
}
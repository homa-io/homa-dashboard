"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Check } from "lucide-react"

interface PinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (pin: string) => void
}

export function PinModal({ open, onOpenChange, onSave }: PinModalProps) {
  const [step, setStep] = useState<"enter" | "confirm">("enter")
  const [firstPin, setFirstPin] = useState(["", "", "", "", "", ""])
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  
  const firstInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (open) {
      // Reset state when modal opens
      setStep("enter")
      setFirstPin(["", "", "", "", "", ""])
      setConfirmPin(["", "", "", "", "", ""])
      setError("")
      // Focus first input after a small delay
      setTimeout(() => {
        firstInputRefs.current[0]?.focus()
      }, 100)
    }
  }, [open])

  const handlePinChange = (
    index: number,
    value: string,
    isConfirm: boolean = false
  ) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const pin = isConfirm ? [...confirmPin] : [...firstPin]
    const setPinFunc = isConfirm ? setConfirmPin : setFirstPin
    const refs = isConfirm ? confirmInputRefs : firstInputRefs
    
    pin[index] = value
    setPinFunc(pin)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      refs.current[index + 1]?.focus()
    }

    // Check if all digits are entered
    if (value && index === 5 && pin.every(digit => digit)) {
      if (!isConfirm) {
        // Move to confirm step
        setTimeout(() => {
          setStep("confirm")
          confirmInputRefs.current[0]?.focus()
        }, 300)
      } else {
        // Verify PINs match
        handleConfirm(pin.join(""))
      }
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    isConfirm: boolean = false
  ) => {
    const pin = isConfirm ? confirmPin : firstPin
    const refs = isConfirm ? confirmInputRefs : firstInputRefs
    
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (
    e: React.ClipboardEvent,
    isConfirm: boolean = false
  ) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const digits = pastedData.split("").filter(char => /^\d$/.test(char))
    
    const pin = isConfirm ? [...confirmPin] : [...firstPin]
    const setPinFunc = isConfirm ? setConfirmPin : setFirstPin
    const refs = isConfirm ? confirmInputRefs : firstInputRefs
    
    digits.forEach((digit, i) => {
      if (i < 6) pin[i] = digit
    })
    setPinFunc(pin)
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = pin.findIndex(digit => !digit)
    if (nextEmptyIndex !== -1) {
      refs.current[nextEmptyIndex]?.focus()
    } else {
      refs.current[5]?.focus()
      if (pin.every(digit => digit)) {
        if (!isConfirm) {
          setTimeout(() => {
            setStep("confirm")
            confirmInputRefs.current[0]?.focus()
          }, 300)
        } else {
          handleConfirm(pin.join(""))
        }
      }
    }
  }

  const handleConfirm = async (confirmedPin: string) => {
    const firstPinString = firstPin.join("")
    
    if (firstPinString !== confirmedPin) {
      setError("PINs do not match")
      setConfirmPin(["", "", "", "", "", ""])
      confirmInputRefs.current[0]?.focus()
      return
    }

    setIsSaving(true)
    // Simulate save process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onSave(firstPinString)
    setIsSaving(false)
    onOpenChange(false)
  }

  const renderPinInputs = (isConfirm: boolean = false) => {
    const pin = isConfirm ? confirmPin : firstPin
    const refs = isConfirm ? confirmInputRefs : firstInputRefs

    return (
      <div className="flex justify-center gap-2">
        {pin.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (refs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handlePinChange(index, e.target.value, isConfirm)}
            onKeyDown={(e) => handleKeyDown(index, e, isConfirm)}
            onPaste={index === 0 ? (e) => handlePaste(e, isConfirm) : undefined}
            className="w-12 h-12 text-center text-lg font-semibold"
            disabled={isSaving}
          />
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "enter" ? "Set Your PIN" : "Confirm Your PIN"}
          </DialogTitle>
          <DialogDescription>
            {step === "enter" 
              ? "Enter a 6-digit PIN for additional security"
              : "Please re-enter your PIN to confirm"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {step === "enter" ? (
            <>
              {renderPinInputs(false)}
              {firstPin.every(digit => digit) && (
                <div className="flex items-center justify-center text-sm text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4 mr-1" />
                  PIN entered successfully
                </div>
              )}
            </>
          ) : (
            <>
              {renderPinInputs(true)}
              {error && (
                <div className="flex items-center justify-center text-sm text-red-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}
              {isSaving && (
                <p className="text-sm text-muted-foreground text-center">
                  Saving PIN...
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          {step === "enter" && (
            <Button
              onClick={() => {
                setStep("confirm")
                setTimeout(() => confirmInputRefs.current[0]?.focus(), 100)
              }}
              disabled={!firstPin.every(digit => digit)}
            >
              Continue
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, Eye, EyeOff, Lock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (password: string) => void
}

export function PasswordModal({ open, onOpenChange, onSave }: PasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{
    current?: string
    new?: string
    confirm?: string
  }>({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setErrors({})
      setPasswordStrength(0)
    }
  }, [open])

  // Calculate password strength
  useEffect(() => {
    const calculateStrength = (password: string) => {
      let strength = 0
      
      if (password.length >= 6) strength += 20
      if (password.length >= 8) strength += 20
      if (password.length >= 12) strength += 20
      if (/[a-z]/.test(password)) strength += 10
      if (/[A-Z]/.test(password)) strength += 10
      if (/[0-9]/.test(password)) strength += 10
      if (/[^a-zA-Z0-9]/.test(password)) strength += 10
      
      return Math.min(strength, 100)
    }
    
    setPasswordStrength(calculateStrength(newPassword))
  }, [newPassword])

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500"
    if (passwordStrength < 60) return "bg-amber-500"
    if (passwordStrength < 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak"
    if (passwordStrength < 60) return "Fair"
    if (passwordStrength < 80) return "Good"
    return "Strong"
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    // Validate current password
    if (!currentPassword) {
      newErrors.current = "Current password is required"
    }
    
    // Validate new password
    if (!newPassword) {
      newErrors.new = "New password is required"
    } else if (newPassword.length < 6) {
      newErrors.new = "Password must be at least 6 characters"
    } else if (newPassword === currentPassword) {
      newErrors.new = "New password must be different from current password"
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirm = "Please confirm your new password"
    } else if (confirmPassword !== newPassword) {
      newErrors.confirm = "Passwords do not match"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSaving(true)
    
    // Simulate password verification and save
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real app, you'd verify the current password here
    // For demo, we'll accept "admin" or "password" as valid current passwords
    if (currentPassword === "admin" || currentPassword === "password") {
      onSave(newPassword)
      onOpenChange(false)
    } else {
      setErrors({ current: "Current password is incorrect" })
    }
    
    setIsSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  setErrors({ ...errors, current: undefined })
                }}
                placeholder="Enter current password"
                className={errors.current ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.current && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.current}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setErrors({ ...errors, new: undefined })
                }}
                placeholder="Enter new password"
                className={errors.new ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className={`font-medium ${
                    passwordStrength < 30 ? "text-red-500" :
                    passwordStrength < 60 ? "text-amber-500" :
                    passwordStrength < 80 ? "text-yellow-500" :
                    "text-green-500"
                  }`}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}
            
            {errors.new && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.new}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setErrors({ ...errors, confirm: undefined })
                }}
                placeholder="Confirm new password"
                className={errors.confirm ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            
            {/* Match Indicator */}
            {confirmPassword && (
              <div className="flex items-center gap-1 text-xs">
                {confirmPassword === newPassword ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-red-500">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
            
            {errors.confirm && !confirmPassword && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirm}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Password requirements:</p>
            <ul className="space-y-0.5 ml-4">
              <li className={newPassword.length >= 6 ? "text-green-600 dark:text-green-400" : ""}>
                • At least 6 characters
              </li>
              <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? "text-green-600 dark:text-green-400" : ""}>
                • Mix of uppercase and lowercase letters
              </li>
              <li className={/[0-9]/.test(newPassword) ? "text-green-600 dark:text-green-400" : ""}>
                • At least one number
              </li>
              <li className={/[^a-zA-Z0-9]/.test(newPassword) ? "text-green-600 dark:text-green-400" : ""}>
                • Special characters recommended
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
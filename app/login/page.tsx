"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { LoginBackground } from "@/components/LoginBackground"
import { Logo } from "@/components/Logo"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirect to dashboard
    window.location.href = "/"
  }

  return (
    <LoginBackground className="flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10 bg-white/10 dark:bg-gray-900/10 backdrop-blur-3xl backdrop-saturate-150 relative overflow-hidden animate-fadeIn">
        {/* Multiple glossy overlay effects for ultra-glossy look */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/30 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-white/20 to-transparent blur-xl pointer-events-none" />
        
        <CardHeader className="relative space-y-1 text-center pb-4 pt-6">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/90 to-primary/70 rounded-xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform backdrop-blur-sm">
              <Logo variant="white" size="lg" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Welcome back
              </CardTitle>
              <CardDescription className="text-white/80 text-sm">
                Sign in to your Homa Dashboard
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative px-8 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white/40 backdrop-blur-xl border-white/30 focus:border-primary/50 hover:bg-white/50 transition-all placeholder:text-gray-500 text-gray-900"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-white/40 backdrop-blur-xl border-white/30 focus:border-primary/50 hover:bg-white/50 transition-all placeholder:text-gray-500 text-gray-900"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-600" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <Button variant="link" className="text-xs text-muted-foreground">
              Forgot your password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </LoginBackground>
  )
}
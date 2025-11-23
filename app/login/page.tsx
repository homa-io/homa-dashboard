"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { LoginBackground } from "@/components/LoginBackground"
import { Logo } from "@/components/Logo"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithOAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(formData)
      // Redirect to dashboard on success
      router.push("/")
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: 'google' | 'microsoft') => {
    loginWithOAuth(provider)
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
            <div className="w-20 h-20 bg-gradient-to-br from-primary/90 to-primary/70 rounded-xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform backdrop-blur-sm">
              <Logo variant="dark" size="xl" className="scale-[1.9]" />
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
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-black" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white/40 backdrop-blur-xl border-white/30 focus:border-primary/50 hover:bg-white/50 transition-all placeholder:text-gray-500 text-gray-900"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-black" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 bg-white/40 backdrop-blur-xl border-white/30 focus:border-primary/50 hover:bg-white/50 transition-all placeholder:text-gray-500 text-gray-900"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
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

          <div className="flex items-center gap-4 my-6">
            <Separator className="flex-1 bg-white/20" />
            <span className="text-xs uppercase text-white/80">Or continue with</span>
            <Separator className="flex-1 bg-white/20" />
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white/40 backdrop-blur-xl border-white/30 hover:bg-white/50 text-gray-900 hover:text-black font-semibold"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-white/40 backdrop-blur-xl border-white/30 hover:bg-white/50 text-gray-900 hover:text-black font-semibold"
              onClick={() => handleOAuthLogin('microsoft')}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Continue with Microsoft
            </Button>
          </div>

          <div className="text-center mt-4">
            <Button variant="link" className="text-xs text-white/70 hover:text-white">
              Forgot your password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </LoginBackground>
  )
}
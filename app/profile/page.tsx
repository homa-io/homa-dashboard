"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CustomBadge } from "@/components/ui/custom-badge"
import { PinModal } from "@/components/PinModal"
import { PasswordModal } from "@/components/PasswordModal"
import { ImageCropModal } from "@/components/ImageCropModal"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Settings, 
  Camera,
  Save,
  Edit3,
  KeyRound,
  Clock,
  MessageSquare,
  TrendingUp,
  Sun,
  Moon
} from "lucide-react"
import { useDarkMode } from "@/hooks/useDarkMode"

export default function ProfilePage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showImageCropModal, setShowImageCropModal] = useState(false)
  const [hasPin, setHasPin] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  
  // Original data to compare against
  const [originalData] = useState({
    name: "Admin User",
    email: "admin@homa.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    role: "Administrator",
    department: "IT",
    joinDate: "January 2023"
  })
  
  // Current profile data
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@homa.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    role: "Administrator",
    department: "IT",
    joinDate: "January 2023"
  })

  // Check if data has changed
  useEffect(() => {
    const changed = JSON.stringify(originalData) !== JSON.stringify(profileData)
    setHasChanges(changed)
  }, [profileData, originalData])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save process
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
  }

  const handlePinSave = (pin: string) => {
    // Save PIN to localStorage (in real app, this would be encrypted and sent to backend)
    localStorage.setItem('userPin', pin)
    setHasPin(true)
  }

  const handlePasswordSave = (password: string) => {
    // Save password (in real app, this would be sent to backend)
    console.log('Password changed successfully')
  }

  const handleImageCropped = (croppedImageUrl: string) => {
    setAvatarUrl(croppedImageUrl)
    // In a real app, you would upload this to your backend
    console.log('Image cropped and set as avatar')
  }

  // Check if user has PIN on mount
  useEffect(() => {
    const savedPin = localStorage.getItem('userPin')
    setHasPin(!!savedPin)
  }, [])

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-8 pt-4 sm:pt-6">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  Full Name
                </label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="text-sm h-9 sm:h-10"
                />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  Email
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="text-sm h-9 sm:h-10"
                />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  Phone
                </label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="text-sm h-9 sm:h-10"
                />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  Location
                </label>
                <Input
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="text-sm h-9 sm:h-10"
                />
              </div>
            </div>
            
            {/* Save Button */}
            <div className="flex justify-end pt-3 sm:pt-4">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Information & Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Account Information</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your profile and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-lg sm:text-xl font-semibold bg-primary text-primary-foreground">
                  AU
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowImageCropModal(true)}
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Change Photo
              </Button>
            </div>
            
            <Separator />
            
            {/* Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  Role
                </label>
                <CustomBadge variant="blue" className="w-fit text-xs sm:text-sm">
                  {profileData.role}
                </CustomBadge>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <Settings className="w-3 h-3" />
                  Department
                </label>
                <CustomBadge variant="gray" className="w-fit text-xs sm:text-sm">
                  {profileData.department}
                </CustomBadge>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Join Date
                </label>
                <p className="text-xs sm:text-sm text-gray-900 dark:text-white">{profileData.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Security Settings</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <h4 className="font-medium text-sm sm:text-base">Password</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Last changed 30 days ago</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPasswordModal(true)}
                className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
              >
                Change Password
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <h4 className="font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                  <KeyRound className="w-3 h-3 sm:w-4 sm:h-4" />
                  Security PIN
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {hasPin ? "PIN is set for quick access" : "Set a 6-digit PIN for quick access"}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPinModal(true)}
                className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
              >
                {hasPin ? "Change PIN" : "Set PIN"}
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <h4 className="font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                  {isDarkMode ? <Moon className="w-3 h-3 sm:w-4 sm:h-4" /> : <Sun className="w-3 h-3 sm:w-4 sm:h-4" />}
                  Theme
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Currently using {isDarkMode ? 'dark' : 'light'} mode
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleDarkMode}
                className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
              >
                {isDarkMode ? <Sun className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> : <Moon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <h4 className="font-medium text-sm sm:text-base">Active Sessions</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage your active sessions</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto">
                View Sessions
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div>
                  <h4 className="font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    My Performance
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Your activity metrics</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/profile/statistic'}
                  className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                >
                  Statistics
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium">Active Hours</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg sm:text-xl font-bold">142</p>
                    <p className="text-xs text-muted-foreground">hours</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium">Responded Conversations</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg sm:text-xl font-bold">287</p>
                    <p className="text-xs text-muted-foreground">conversations</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* PIN Modal */}
      <PinModal 
        open={showPinModal}
        onOpenChange={setShowPinModal}
        onSave={handlePinSave}
      />
      
      {/* Password Modal */}
      <PasswordModal
        open={showPasswordModal}
        onOpenChange={setShowPasswordModal}
        onSave={handlePasswordSave}
      />
      
      {/* Image Crop Modal */}
      <ImageCropModal
        open={showImageCropModal}
        onOpenChange={setShowImageCropModal}
        onImageCropped={handleImageCropped}
      />
    </div>
  )
}
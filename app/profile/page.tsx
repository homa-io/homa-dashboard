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
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <Input
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
              </div>
            </div>
            
            {/* Save Button */}
            <div className="flex justify-end pt-4">
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
            <CardTitle className="text-lg">Account Information</CardTitle>
            <CardDescription>Your profile and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                  AU
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowImageCropModal(true)}
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>
            
            <Separator />
            
            {/* Account Details */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Role
                </label>
                <CustomBadge variant="blue" className="w-fit">
                  {profileData.role}
                </CustomBadge>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Settings className="w-3 h-3" />
                  Department
                </label>
                <CustomBadge variant="gray" className="w-fit">
                  {profileData.department}
                </CustomBadge>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Join Date
                </label>
                <p className="text-sm text-muted-foreground">{profileData.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  Security PIN
                </h4>
                <p className="text-sm text-muted-foreground">
                  {hasPin ? "PIN is set for quick access" : "Set a 6-digit PIN for quick access"}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPinModal(true)}
              >
                {hasPin ? "Change PIN" : "Set PIN"}
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Theme
                </h4>
                <p className="text-sm text-muted-foreground">
                  Currently using {isDarkMode ? 'dark' : 'light'} mode
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Active Sessions</h4>
                <p className="text-sm text-muted-foreground">Manage your active sessions</p>
              </div>
              <Button variant="outline" size="sm">
                View Sessions
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    My Performance
                  </h4>
                  <p className="text-sm text-muted-foreground">Your activity metrics</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/profile/statistic'}
                >
                  Statistics
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Active Hours</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">142</p>
                    <p className="text-xs text-muted-foreground">hours</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Responded Tickets</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">287</p>
                    <p className="text-xs text-muted-foreground">tickets</p>
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
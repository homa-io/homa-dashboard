"use client"

import { useState, useRef, useCallback } from "react"
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { uploadAvatar } from "@/services/users"
import { toast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (avatarUrl: string) => void
  disabled?: boolean
  userName?: string
}

export function AvatarUpload({ currentAvatar, onAvatarChange, disabled, userName }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>("")
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "")
        setIsOpen(true)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      return null
    }

    const image = imgRef.current
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      return null
    }

    // Set canvas size to 256x256
    const targetSize = 256
    canvas.width = targetSize
    canvas.height = targetSize

    // Calculate scale
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Draw cropped and resized image
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetSize,
      targetSize
    )

    return new Promise<string>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve("")
            return
          }
          const reader = new FileReader()
          reader.addEventListener("load", () => {
            resolve(reader.result?.toString() || "")
          })
          reader.readAsDataURL(blob)
        },
        "image/jpeg",
        0.85
      )
    })
  }, [completedCrop])

  const handleCropComplete = async () => {
    setIsProcessing(true)
    try {
      const croppedImageBase64 = await getCroppedImg()
      if (croppedImageBase64) {
        // Upload the cropped image to the backend
        const response = await uploadAvatar(croppedImageBase64)
        if (response.success && response.data) {
          onAvatarChange(response.data.url)
          setIsOpen(false)
          setImageSrc("")
          toast({
            title: "Success",
            description: "Avatar uploaded successfully",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to upload avatar",
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Error",
        description: error?.message || "Failed to upload avatar",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setImageSrc("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveAvatar = () => {
    onAvatarChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getInitials = () => {
    if (!userName) return "?"
    const parts = userName.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return userName.substring(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-3">
      <Label>Avatar</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          {currentAvatar && <AvatarImage src={currentAvatar} alt={userName || "User"} />}
          <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          {currentAvatar && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={disabled}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Click to upload an image. It will be cropped and resized to 256x256 pixels.
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
        disabled={disabled}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crop Avatar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {imageSrc && (
              <div className="flex justify-center max-h-[400px] overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop preview"
                    style={{ maxHeight: "400px" }}
                  />
                </ReactCrop>
              </div>
            )}
            <p className="text-sm text-gray-600 text-center">
              Drag to reposition and resize the crop area. The image will be compressed to 256x256 pixels.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCropComplete}
              disabled={isProcessing || !completedCrop}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Apply Crop"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

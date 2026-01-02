"use client"

import { useState, useRef, useCallback } from "react"
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Camera, X } from "lucide-react"
import { uploadUserAvatar, deleteUserAvatar } from "@/services/users"
import { toast } from "@/hooks/use-toast"

interface ProfileAvatarUploadProps {
  currentAvatar?: string | null
  onAvatarChange: (avatarUrl: string) => void
  disabled?: boolean
  userName?: string
}

export function ProfileAvatarUpload({ currentAvatar, onAvatarChange, disabled }: ProfileAvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>("")
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const cropSize = Math.min(width, height, 300)
    const crop = centerCrop(
      makeAspectCrop(
        { unit: "px", width: cropSize },
        1,
        width,
        height
      ),
      width,
      height
    )
    setCrop(crop)
  }, [])

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "")
        setCrop(undefined)
        setIsOpen(true)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return null

    const image = imgRef.current
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    const targetSize = 256
    canvas.width = targetSize
    canvas.height = targetSize

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

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
        const response = await uploadUserAvatar(croppedImageBase64)
        if (response.success && response.data) {
          onAvatarChange(response.data.avatar)
          setIsOpen(false)
          setImageSrc("")
          toast({ title: "Avatar updated successfully" })
        } else {
          toast({ title: "Failed to upload avatar", variant: "destructive" })
        }
      }
    } catch (error: any) {
      toast({
        title: "Failed to upload avatar",
        description: error?.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setImageSrc("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleRemoveAvatar = async () => {
    setIsRemoving(true)
    try {
      const response = await deleteUserAvatar()
      if (response.success) {
        onAvatarChange("")
        toast({ title: "Avatar removed successfully" })
      } else {
        toast({ title: "Failed to remove avatar", variant: "destructive" })
      }
    } catch (error: any) {
      toast({
        title: "Failed to remove avatar",
        description: error?.message,
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
      {/* Floating action buttons - positioned absolutely */}
      <div className="absolute -bottom-1 -right-1 flex gap-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isRemoving}
          className="p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
        </button>
        {currentAvatar && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            disabled={disabled || isRemoving}
            className="p-2 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
        disabled={disabled}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crop Your Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {imageSrc && (
              <div className="flex justify-center max-h-[350px] overflow-auto rounded-lg">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop preview"
                    style={{ maxHeight: "350px" }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              Drag to adjust the crop area
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleCropComplete} disabled={isProcessing || !completedCrop}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Save Photo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProfileAvatarUpload

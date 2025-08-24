"use client"

import { useState, useRef, useCallback } from "react"
import ReactCrop, { 
  centerCrop, 
  convertToPixelCrop, 
  makeAspectCrop, 
  type Crop 
} from 'react-image-crop'
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
import { Camera, Upload, X } from "lucide-react"
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageCropped: (croppedImageUrl: string) => void
}

export function ImageCropModal({ open, onOpenChange, onImageCropped }: ImageCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string>("")
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop>()
  const [isProcessing, setIsProcessing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '')
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    
    // Create a square crop centered in the image
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
          height: 50,
        },
        1, // aspect ratio 1:1 for square
        width,
        height
      ),
      width,
      height
    )

    setCrop(crop)
    setCompletedCrop(crop)
  }, [])

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: Crop): Promise<string> => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      // Get the displayed dimensions and natural dimensions
      const displayedWidth = image.width
      const displayedHeight = image.height
      const naturalWidth = image.naturalWidth
      const naturalHeight = image.naturalHeight
      
      // Calculate scale factors
      const scaleX = naturalWidth / displayedWidth
      const scaleY = naturalHeight / displayedHeight
      
      // Convert percentage crop to pixel crop based on displayed image size first
      const displayPixelCrop = convertToPixelCrop(crop, displayedWidth, displayedHeight)
      
      // Then scale up to natural image coordinates
      const naturalPixelCrop = {
        x: displayPixelCrop.x * scaleX,
        y: displayPixelCrop.y * scaleY,
        width: displayPixelCrop.width * scaleX,
        height: displayPixelCrop.height * scaleY
      }

      // Set canvas size to 256x256 (final avatar size)
      canvas.width = 256
      canvas.height = 256

      // Draw the cropped image onto the canvas, scaling to 256x256
      ctx.drawImage(
        image,
        naturalPixelCrop.x, naturalPixelCrop.y, naturalPixelCrop.width, naturalPixelCrop.height,
        0, 0, 256, 256
      )

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            resolve(url)
          }
        }, 'image/jpeg', 0.9)
      })
    },
    []
  )

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return

    setIsProcessing(true)
    try {
      const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop)
      onImageCropped(croppedImageUrl)
      onOpenChange(false)
      // Reset state
      setImageSrc("")
      setCrop(undefined)
      setCompletedCrop(undefined)
    } catch (error) {
      console.error('Error cropping image:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setImageSrc("")
    setCrop(undefined)
    setCompletedCrop(undefined)
    onOpenChange(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Upload & Crop Photo
          </DialogTitle>
          <DialogDescription>
            Choose an image and crop it to create your profile picture
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!imageSrc ? (
            // File selection area
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Image</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                  className="hidden"
                />
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Choose an image</p>
                  <p className="text-sm text-muted-foreground">
                    Click here to select an image file from your computer
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports: JPG, PNG, GIF (max 10MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Image cropping area
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Drag to adjust the crop area. The image will be resized to 256x256 pixels.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImageSrc("")}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop={false}
                  keepSelection
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    ref={imgRef}
                    alt="Crop preview"
                    src={imageSrc}
                    style={{ maxHeight: '400px', width: 'auto' }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isProcessing}>
            Cancel
          </Button>
          {imageSrc && (
            <Button 
              onClick={handleCropComplete} 
              disabled={!completedCrop || isProcessing}
            >
              {isProcessing ? "Processing..." : "Apply Photo"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import { useState, useRef, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  currentAvatar?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onUpload: (base64Data: string) => Promise<void>
  onDelete?: () => Promise<void>
  disabled?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'size-12',
  md: 'size-16',
  lg: 'size-24',
  xl: 'size-32',
}

const iconSizeClasses = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
}

export function AvatarUpload({
  currentAvatar,
  name = '',
  size = 'lg',
  onUpload,
  onDelete,
  disabled = false,
  className,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (name: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string
        setPreviewUrl(base64Data) // Show preview immediately

        try {
          await onUpload(base64Data)
        } catch (error) {
          console.error('Upload failed:', error)
          setPreviewUrl(null) // Revert preview on error
          alert('Failed to upload avatar. Please try again.')
        } finally {
          setIsUploading(false)
        }
      }
      reader.onerror = () => {
        setIsUploading(false)
        alert('Failed to read file')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIsUploading(false)
      console.error('Error reading file:', error)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onUpload])

  const handleDelete = useCallback(async () => {
    if (!onDelete) return

    if (!confirm('Are you sure you want to remove the avatar?')) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete()
      setPreviewUrl(null)
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete avatar. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }, [onDelete])

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const displayUrl = previewUrl || currentAvatar
  const isLoading = isUploading || isDeleting

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative group">
        <Avatar className={cn(sizeClasses[size], 'border-2 border-muted')}>
          {displayUrl ? (
            <AvatarImage src={displayUrl} alt={name} />
          ) : null}
          <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {/* Overlay on hover */}
        {!disabled && !isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={triggerFileSelect}
          >
            <Camera className={cn(iconSizeClasses[size], 'text-white')} />
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className={cn(iconSizeClasses[size], 'text-white animate-spin')} />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileSelect}
          disabled={disabled || isLoading}
        >
          <Camera className="size-4 mr-1" />
          {displayUrl ? 'Change' : 'Upload'}
        </Button>

        {displayUrl && onDelete && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={disabled || isLoading}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isLoading}
      />
    </div>
  )
}

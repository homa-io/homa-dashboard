"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, X, File, Image, Video, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useUppy } from "@/hooks/useUppy"

interface FileUploaderProps {
  prefix?: string
  maxFileSize?: number
  allowedFileTypes?: string[]
  multiple?: boolean
  accept?: string
  onUploadComplete?: (files: Array<{ key: string; url: string; name: string; type: string; size: number }>) => void
  onUploadError?: (error: Error) => void
  className?: string
  disabled?: boolean
  showPreview?: boolean
  compact?: boolean
}

interface SelectedFile {
  id: string
  file: File
  preview?: string
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  key?: string
  url?: string
  error?: string
}

export function FileUploader({
  prefix = "uploads",
  maxFileSize = 500 * 1024 * 1024,
  allowedFileTypes,
  multiple = true,
  accept,
  onUploadComplete,
  onUploadError,
  className,
  disabled = false,
  showPreview = true,
  compact = false,
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { uppy, uploading, progress, uploadedFiles, addFiles, reset } = useUppy({
    prefix,
    maxFileSize,
    allowedFileTypes,
    autoProceed: false,
    onUploadSuccess: (file) => {
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.file.name === file.key.split("/").pop()
            ? { ...f, status: "completed", progress: 100, key: file.key, url: file.url }
            : f
        )
      )
    },
    onUploadError: (error) => {
      onUploadError?.(error)
    },
    onUploadProgress: (p) => {
      setSelectedFiles((prev) => prev.map((f) => (f.status === "uploading" ? { ...f, progress: p } : f)))
    },
  })

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const fileArray = Array.from(files)
      const newFiles: SelectedFile[] = fileArray.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        status: "pending" as const,
        progress: 0,
      }))

      setSelectedFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles))
      addFiles(fileArray)
    },
    [multiple, addFiles]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      handleFileSelect(e.dataTransfer.files)
    },
    [disabled, handleFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      const file = selectedFiles.find((f) => f.id === fileId)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId))
    },
    [selectedFiles]
  )

  const handleUpload = useCallback(async () => {
    if (!uppy || selectedFiles.length === 0) return

    setSelectedFiles((prev) => prev.map((f) => (f.status === "pending" ? { ...f, status: "uploading" } : f)))

    try {
      const result = await uppy.upload()
      if (result && result.successful) {
        const completedFiles = selectedFiles
          .filter((f) => f.status === "completed" || f.status === "uploading")
          .map((f) => ({
            key: f.key || "",
            url: f.url || "",
            name: f.file.name,
            type: f.file.type,
            size: f.file.size,
          }))
        onUploadComplete?.(completedFiles)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      onUploadError?.(error as Error)
    }
  }, [uppy, selectedFiles, onUploadComplete, onUploadError])

  const handleClear = useCallback(() => {
    selectedFiles.forEach((f) => {
      if (f.preview) {
        URL.revokeObjectURL(f.preview)
      }
    })
    setSelectedFiles([])
    reset()
  }, [selectedFiles, reset])

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-6 h-6" />
    if (type.startsWith("video/")) return <Video className="w-6 h-6" />
    if (type.includes("pdf")) return <FileText className="w-6 h-6" />
    return <File className="w-6 h-6" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          compact ? "p-4" : "p-8"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={disabled}
        />
        <div className={cn("flex flex-col items-center justify-center text-center", compact ? "gap-2" : "gap-4")}>
          <div className={cn("p-3 rounded-full bg-muted", compact && "p-2")}>
            <Upload className={cn("text-muted-foreground", compact ? "w-5 h-5" : "w-8 h-8")} />
          </div>
          <div>
            <p className={cn("font-medium", compact ? "text-sm" : "text-base")}>
              Drop files here or click to browse
            </p>
            <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
              Max file size: {formatFileSize(maxFileSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{selectedFiles.length} file(s) selected</span>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear all
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-background"
              >
                {/* Preview or icon */}
                {showPreview && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                    {getFileIcon(file.file.type)}
                  </div>
                )}

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.file.size)}</p>
                  {file.status === "uploading" && (
                    <Progress value={file.progress} className="h-1 mt-1" />
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {file.status === "uploading" && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                  {file.status === "completed" && (
                    <span className="text-xs text-green-600">Uploaded</span>
                  )}
                  {file.status === "error" && (
                    <span className="text-xs text-red-600">{file.error || "Failed"}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveFile(file.id)}
                    disabled={file.status === "uploading"}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload button */}
          <Button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.every((f) => f.status !== "pending")}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading... {Math.round(progress)}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {selectedFiles.filter((f) => f.status === "pending").length} file(s)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

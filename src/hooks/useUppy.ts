"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Uppy from "@uppy/core"
import AwsS3 from "@uppy/aws-s3"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8033"

// Debug logging helper
const DEBUG = true
const debugLog = (context: string, ...args: unknown[]) => {
  if (DEBUG) {
    console.log(`[Uppy:${context}]`, ...args)
  }
}

interface UseUppyOptions {
  prefix?: string
  maxFileSize?: number
  allowedFileTypes?: string[]
  autoProceed?: boolean
  onUploadSuccess?: (file: { key: string; url: string; name: string; type: string; size: number }) => void
  onUploadError?: (error: Error) => void
  onUploadProgress?: (progress: number) => void
}

interface UploadedFile {
  key: string
  url: string
  name: string
  type: string
  size: number
}

export function useUppy(options: UseUppyOptions = {}) {
  const {
    prefix = "uploads",
    maxFileSize = 500 * 1024 * 1024, // 500MB default
    allowedFileTypes,
    autoProceed = true,
    onUploadSuccess,
    onUploadError,
    onUploadProgress,
  } = options

  const [uppy, setUppy] = useState<Uppy | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  // Memoize allowedFileTypes to prevent infinite loops from array reference changes
  const allowedFileTypesKey = JSON.stringify(allowedFileTypes || null)
  const stableAllowedFileTypes = useMemo(
    () => allowedFileTypes || null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allowedFileTypesKey]
  )

  // Use refs to avoid stale closure issues and prevent infinite loops
  const uppyRef = useRef<Uppy | null>(null)
  const prefixRef = useRef(prefix)
  const onUploadSuccessRef = useRef(onUploadSuccess)
  const onUploadErrorRef = useRef(onUploadError)
  const onUploadProgressRef = useRef(onUploadProgress)

  // Keep prefix ref up to date
  useEffect(() => {
    prefixRef.current = prefix
  }, [prefix])

  // Keep refs up to date without triggering effect re-runs
  useEffect(() => {
    onUploadSuccessRef.current = onUploadSuccess
  }, [onUploadSuccess])

  useEffect(() => {
    onUploadErrorRef.current = onUploadError
  }, [onUploadError])

  useEffect(() => {
    onUploadProgressRef.current = onUploadProgress
  }, [onUploadProgress])

  useEffect(() => {
    const uppyInstance = new Uppy({
      autoProceed,
      restrictions: {
        maxFileSize,
        allowedFileTypes: stableAllowedFileTypes,
      },
    })

    // Configure AWS S3 with custom endpoints for our backend
    uppyInstance.use(AwsS3, {
      shouldUseMultipart: (file) => (file.size ?? 0) > 5 * 1024 * 1024, // Use multipart for files > 5MB

      // For simple uploads (< 5MB)
      async getUploadParameters(file) {
        debugLog("getUploadParameters", "Starting simple upload for:", file.name, "size:", file.size, "type:", file.type)
        const token = localStorage.getItem("token")
        debugLog("getUploadParameters", "Token present:", !!token)

        const requestBody = {
          filename: file.name,
          contentType: file.type,
          prefix,
        }
        debugLog("getUploadParameters", "Request body:", requestBody)
        debugLog("getUploadParameters", "API URL:", `${API_BASE_URL}/api/admin/storage/presign/upload`)

        const response = await fetch(`${API_BASE_URL}/api/admin/storage/presign/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        })

        debugLog("getUploadParameters", "Response status:", response.status, response.statusText)

        if (!response.ok) {
          const errorText = await response.text()
          debugLog("getUploadParameters", "Error response:", errorText)
          throw new Error(`Failed to get presigned URL: ${response.status} ${errorText}`)
        }

        const data = await response.json()
        debugLog("getUploadParameters", "Presigned URL received:", data.url?.substring(0, 100) + "...", "key:", data.key)

        // Store the S3 key in file meta so we can access it in upload-success
        uppyInstance.setFileMeta(file.id, { s3Key: data.key })

        return {
          method: "PUT",
          url: data.url,
          fields: {},
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
        }
      },

      // For multipart uploads (>= 5MB)
      async createMultipartUpload(file) {
        debugLog("createMultipartUpload", "Starting multipart upload for:", file.name, "size:", file.size)
        const token = localStorage.getItem("token")

        const requestBody = {
          filename: file.name,
          contentType: file.type,
          prefix,
        }
        debugLog("createMultipartUpload", "Request body:", requestBody)

        const response = await fetch(`${API_BASE_URL}/api/admin/storage/multipart/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        })

        debugLog("createMultipartUpload", "Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          debugLog("createMultipartUpload", "Error:", errorText)
          throw new Error(`Failed to create multipart upload: ${response.status} ${errorText}`)
        }

        const data = await response.json()
        debugLog("createMultipartUpload", "Created multipart upload - uploadId:", data.uploadId, "key:", data.key)

        // Store the S3 key in file meta so we can access it in upload-success
        uppyInstance.setFileMeta(file.id, { s3Key: data.key })

        return {
          uploadId: data.uploadId,
          key: data.key,
        }
      },

      async signPart(file, opts) {
        debugLog("signPart", "Signing part:", opts.partNumber, "for key:", opts.key, "uploadId:", opts.uploadId)
        const token = localStorage.getItem("token")
        const response = await fetch(`${API_BASE_URL}/api/admin/storage/multipart/sign-part`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            key: opts.key,
            uploadId: opts.uploadId,
            partNumber: opts.partNumber,
          }),
        })

        debugLog("signPart", "Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          debugLog("signPart", "Error:", errorText)
          throw new Error(`Failed to sign part: ${response.status} ${errorText}`)
        }

        const data = await response.json()
        debugLog("signPart", "Part signed, URL received for part:", opts.partNumber)
        return { url: data.url }
      },

      async completeMultipartUpload(file, opts) {
        debugLog("completeMultipartUpload", "Completing upload for key:", opts.key, "parts:", opts.parts.length)
        const token = localStorage.getItem("token")
        const response = await fetch(`${API_BASE_URL}/api/admin/storage/multipart/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            key: opts.key,
            uploadId: opts.uploadId,
            parts: opts.parts,
          }),
        })

        debugLog("completeMultipartUpload", "Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          debugLog("completeMultipartUpload", "Error:", errorText)
          throw new Error(`Failed to complete multipart upload: ${response.status} ${errorText}`)
        }

        debugLog("completeMultipartUpload", "Upload completed successfully for:", opts.key)
        return {}
      },

      async abortMultipartUpload(file, opts) {
        debugLog("abortMultipartUpload", "Aborting upload for key:", opts.key)
        const token = localStorage.getItem("token")
        await fetch(`${API_BASE_URL}/api/admin/storage/multipart/abort`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            key: opts.key,
            uploadId: opts.uploadId,
          }),
        })
        debugLog("abortMultipartUpload", "Upload aborted")
      },
    })

    // Event handlers
    uppyInstance.on("upload", () => {
      debugLog("event:upload", "Upload started")
      setUploading(true)
      setProgress(0)
    })

    uppyInstance.on("progress", (p) => {
      debugLog("event:progress", "Progress:", p + "%")
      setProgress(p)
      onUploadProgressRef.current?.(p)
    })

    uppyInstance.on("upload-success", (file, response) => {
      debugLog("event:upload-success", "File uploaded:", file?.name, "Response:", response, "Meta:", file?.meta)
      if (file) {
        // Get the S3 key from file meta (set during getUploadParameters) or response body
        const s3Key = (file.meta as { s3Key?: string })?.s3Key ||
                      (response?.body as { key?: string })?.key ||
                      file.name
        debugLog("event:upload-success", "S3 Key:", s3Key)

        const uploadedFile: UploadedFile = {
          key: s3Key,
          url: s3Key, // Just store the key, getMediaUrl will handle the full URL
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size || 0,
        }
        debugLog("event:upload-success", "Created uploadedFile:", uploadedFile)
        setUploadedFiles((prev) => [...prev, uploadedFile])
        onUploadSuccessRef.current?.(uploadedFile)
      }
    })

    uppyInstance.on("upload-error", (file, error) => {
      debugLog("event:upload-error", "Upload failed for:", file?.name, "Error:", error)
      console.error("Upload error:", error)
      onUploadErrorRef.current?.(error)
    })

    uppyInstance.on("complete", (result) => {
      debugLog("event:complete", "All uploads complete. Successful:", result?.successful?.length, "Failed:", result?.failed?.length)
      setUploading(false)
      setProgress(100)
    })

    debugLog("init", "Uppy instance created for prefix:", prefix)
    uppyRef.current = uppyInstance
    setUppy(uppyInstance)

    return () => {
      debugLog("init", "Destroying Uppy instance for prefix:", prefix)
      uppyRef.current = null
      uppyInstance.destroy()
    }
  }, [prefix, maxFileSize, stableAllowedFileTypes, autoProceed])

  const addFiles = useCallback(
    (files: File[]) => {
      const currentPrefix = prefixRef.current
      debugLog(`addFiles:${currentPrefix}`, "Adding", files.length, "file(s)")
      debugLog(`addFiles:${currentPrefix}`, "uppyRef.current:", !!uppyRef.current)

      // Use the ref to avoid stale closure issues
      const uppyInstance = uppyRef.current
      if (uppyInstance) {
        files.forEach((file) => {
          debugLog(`addFiles:${currentPrefix}`, "Adding file:", file.name, "type:", file.type, "size:", file.size)
          try {
            uppyInstance.addFile({
              name: file.name,
              type: file.type,
              data: file,
            })
            debugLog(`addFiles:${currentPrefix}`, "File added successfully:", file.name)
          } catch (err) {
            debugLog(`addFiles:${currentPrefix}`, "Error adding file:", file.name, err)
          }
        })
      } else {
        debugLog(`addFiles:${currentPrefix}`, "Uppy instance not available! (ref is null)")
      }
    },
    [] // No dependencies needed since we use ref
  )

  const removeFile = useCallback(
    (fileId: string) => {
      const uppyInstance = uppyRef.current
      if (uppyInstance) {
        uppyInstance.removeFile(fileId)
      }
    },
    []
  )

  const upload = useCallback(() => {
    const uppyInstance = uppyRef.current
    if (uppyInstance) {
      return uppyInstance.upload()
    }
    return Promise.resolve(null)
  }, [])

  const reset = useCallback(() => {
    const uppyInstance = uppyRef.current
    if (uppyInstance) {
      uppyInstance.cancelAll()
      setUploadedFiles([])
      setProgress(0)
    }
  }, [])

  return {
    uppy,
    uploading,
    progress,
    uploadedFiles,
    addFiles,
    removeFile,
    upload,
    reset,
  }
}

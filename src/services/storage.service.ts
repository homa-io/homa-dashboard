import { api } from "./api"

export interface MultipartUploadSession {
  uploadId: string
  key: string
}

export interface PartInfo {
  partNumber: number
  etag: string
}

export interface CacheStats {
  total_files: number
  total_size: number
  oldest_file: string
  newest_file: string
}

export const storageService = {
  // Create a multipart upload session
  createMultipartUpload: async (
    filename: string,
    contentType: string,
    prefix: string = "uploads"
  ): Promise<MultipartUploadSession> => {
    const response = await api.post("/api/admin/storage/multipart/create", {
      filename,
      contentType,
      prefix,
    })
    return response.data
  },

  // Sign a part for upload
  signPart: async (
    key: string,
    uploadId: string,
    partNumber: number
  ): Promise<{ url: string }> => {
    const response = await api.post("/api/admin/storage/multipart/sign-part", {
      key,
      uploadId,
      partNumber,
    })
    return response.data
  },

  // Complete a multipart upload
  completeMultipartUpload: async (
    key: string,
    uploadId: string,
    parts: PartInfo[]
  ): Promise<void> => {
    await api.post("/api/admin/storage/multipart/complete", {
      key,
      uploadId,
      parts,
    })
  },

  // Abort a multipart upload
  abortMultipartUpload: async (key: string, uploadId: string): Promise<void> => {
    await api.post("/api/admin/storage/multipart/abort", {
      key,
      uploadId,
    })
  },

  // Get presigned URL for simple upload
  getPresignedUploadUrl: async (
    filename: string,
    contentType: string,
    prefix: string = "uploads"
  ): Promise<{ url: string; key: string }> => {
    const response = await api.post("/api/admin/storage/presign/upload", {
      filename,
      contentType,
      prefix,
    })
    return response.data
  },

  // Get cache statistics
  getCacheStats: async (): Promise<CacheStats> => {
    const response = await api.get("/api/admin/storage/cache/stats")
    return response.data
  },

  // Clear the media cache
  clearCache: async (): Promise<void> => {
    await api.delete("/api/admin/storage/cache")
  },

  // Helper to get media URL from key
  getMediaUrl: (key: string, options?: { size?: string; format?: string; quality?: number }): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8033"
    let url = `${baseUrl}/media/${key}`

    const params = new URLSearchParams()
    if (options?.size) params.append("size", options.size)
    if (options?.format) params.append("fmt", options.format)
    if (options?.quality) params.append("q", options.quality.toString())

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    return url
  },

  // Helper to get thumbnail URL
  getThumbnailUrl: (key: string, size: number = 256): string => {
    return storageService.getMediaUrl(key, { size: `${size}x-` })
  },
}

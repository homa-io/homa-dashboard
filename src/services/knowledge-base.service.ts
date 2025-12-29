/**
 * Knowledge Base Service
 * Handles all KB-related API calls
 */

import { apiClient, ApiResponse } from './api-client'

// Types matching backend API
export interface KBCategory {
  id: string
  name: string
  slug: string
  description: string
  parent_id: string | null
  icon: string
  color: string
  sort_order: number
  created_at: string
  updated_at: string
  article_count?: number
}

export interface KBTag {
  id: string
  name: string
  slug: string
  color: string
  created_at: string
  usage_count?: number
}

export interface KBMedia {
  id: string
  article_id: string
  type: 'image' | 'video' | 'document'
  url: string
  title: string
  description: string
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface KBArticle {
  id: string
  title: string
  slug: string
  content: string
  summary: string
  featured_image: string
  category_id: string | null
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  view_count: number
  helpful_yes: number
  helpful_no: number
  published_at: string | null
  created_at: string
  updated_at: string
  category?: KBCategory
  tags?: KBTag[]
  media?: KBMedia[]
}

export interface KBArticlesResponse {
  articles: KBArticle[]
  total: number
  page: number
  total_pages: number
}

export interface CreateArticleRequest {
  title: string
  content: string
  summary?: string
  featured_image?: string
  category_id?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  tag_ids?: string[]
  media?: Array<{
    type: string
    url: string
    title: string
    description?: string
    sort_order?: number
    is_primary?: boolean
  }>
}

export interface UpdateArticleRequest {
  title?: string
  content?: string
  summary?: string
  featured_image?: string
  category_id?: string | null
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  tag_ids?: string[]
  media?: Array<{
    id?: string
    type: string
    url: string
    title: string
    description?: string
    sort_order?: number
    is_primary?: boolean
  }>
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  icon?: string
  color?: string
  parent_id?: string
  sort_order?: number
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  icon?: string
  color?: string
  parent_id?: string | null
  sort_order?: number
}

export interface CreateTagRequest {
  name: string
  color?: string
}

export interface UpdateTagRequest {
  name?: string
  color?: string
}

export interface MediaUploadResponse {
  url: string
  type: string
}

// ========================
// ARTICLE API
// ========================

export async function getKBArticles(params?: {
  page?: number
  page_size?: number
  search?: string
  status?: string
  category_id?: string
  featured?: boolean
}): Promise<ApiResponse<KBArticle[]>> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString())
  if (params?.search) queryParams.append('search', params.search)
  if (params?.status) queryParams.append('status', params.status)
  if (params?.category_id) queryParams.append('category_id', params.category_id)
  if (params?.featured) queryParams.append('featured', 'true')

  const query = queryParams.toString()
  return apiClient.get<KBArticle[]>(`/api/admin/kb/articles${query ? `?${query}` : ''}`)
}

export async function getKBArticle(id: string): Promise<ApiResponse<KBArticle>> {
  return apiClient.get<KBArticle>(`/api/admin/kb/articles/${id}`)
}

export async function createKBArticle(data: CreateArticleRequest): Promise<ApiResponse<KBArticle>> {
  return apiClient.post<KBArticle>('/api/admin/kb/articles', data)
}

export async function updateKBArticle(id: string, data: UpdateArticleRequest): Promise<ApiResponse<KBArticle>> {
  return apiClient.put<KBArticle>(`/api/admin/kb/articles/${id}`, data)
}

export async function deleteKBArticle(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`/api/admin/kb/articles/${id}`)
}

// ========================
// CATEGORY API
// ========================

export async function getKBCategories(): Promise<ApiResponse<KBCategory[]>> {
  return apiClient.get<KBCategory[]>('/api/admin/kb/categories')
}

export async function getKBCategory(id: string): Promise<ApiResponse<KBCategory>> {
  return apiClient.get<KBCategory>(`/api/admin/kb/categories/${id}`)
}

export async function createKBCategory(data: CreateCategoryRequest): Promise<ApiResponse<KBCategory>> {
  return apiClient.post<KBCategory>('/api/admin/kb/categories', data)
}

export async function updateKBCategory(id: string, data: UpdateCategoryRequest): Promise<ApiResponse<KBCategory>> {
  return apiClient.put<KBCategory>(`/api/admin/kb/categories/${id}`, data)
}

export async function deleteKBCategory(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`/api/admin/kb/categories/${id}`)
}

// ========================
// TAG API
// ========================

export async function getKBTags(): Promise<ApiResponse<KBTag[]>> {
  return apiClient.get<KBTag[]>('/api/admin/kb/tags')
}

export async function getKBTag(id: string): Promise<ApiResponse<KBTag>> {
  return apiClient.get<KBTag>(`/api/admin/kb/tags/${id}`)
}

export async function createKBTag(data: CreateTagRequest): Promise<ApiResponse<KBTag>> {
  return apiClient.post<KBTag>('/api/admin/kb/tags', data)
}

export async function updateKBTag(id: string, data: UpdateTagRequest): Promise<ApiResponse<KBTag>> {
  return apiClient.put<KBTag>(`/api/admin/kb/tags/${id}`, data)
}

export async function deleteKBTag(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`/api/admin/kb/tags/${id}`)
}

// ========================
// MEDIA UPLOAD API
// ========================

export async function uploadKBMedia(data: string, type: 'image' | 'video' = 'image'): Promise<ApiResponse<MediaUploadResponse>> {
  return apiClient.post<MediaUploadResponse>('/api/admin/kb/upload', { data, type })
}

// ========================
// AI SUMMARY API
// ========================

export interface GenerateSummaryRequest {
  title: string
  content: string
}

export interface GenerateSummaryResponse {
  summary: string
}

export async function generateArticleSummary(data: GenerateSummaryRequest): Promise<ApiResponse<GenerateSummaryResponse>> {
  return apiClient.post<GenerateSummaryResponse>('/api/ai/generate-summary', data)
}

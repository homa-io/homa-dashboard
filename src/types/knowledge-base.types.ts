/**
 * Knowledge Base types following industry best practices
 */

export interface KnowledgeBaseCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  slug: string
  parentId?: string
  order: number
  isPublished: boolean
  articleCount: number
  createdAt: Date
  updatedAt: Date
}

export interface KnowledgeBaseTag {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  usageCount: number
  createdAt: Date
}

export interface ArticleAuthor {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export interface ArticleMedia {
  id: string
  type: 'image' | 'video' | 'document'
  url: string
  title: string
  alt?: string
  description?: string
  size: number
  mimeType: string
  thumbnail?: string
  duration?: number // for videos
  createdAt: Date
}

export interface ArticleVersion {
  id: string
  version: string
  content: string
  summary: string
  authorId: string
  createdAt: Date
  isPublished: boolean
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  categoryId: string
  tags: KnowledgeBaseTag[]
  author: ArticleAuthor
  status: 'draft' | 'published' | 'archived' | 'under-review'
  visibility: 'public' | 'internal' | 'restricted'
  featured: boolean
  sticky: boolean
  
  // SEO & Metadata
  metaTitle?: string
  metaDescription?: string
  keywords: string[]
  
  // Engagement
  views: number
  likes: number
  helpful: number
  notHelpful: number
  shares: number
  
  // Media
  featuredImage?: ArticleMedia
  media: ArticleMedia[]
  
  // Navigation
  relatedArticles: string[]
  prerequisites: string[]
  
  // Version control
  version: string
  versions: ArticleVersion[]
  
  // Publishing
  publishedAt?: Date
  scheduledAt?: Date
  expiresAt?: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastViewedAt?: Date
}

export interface ArticleSearchFilters {
  query?: string
  categoryId?: string
  tags?: string[]
  status?: KnowledgeBaseArticle['status']
  visibility?: KnowledgeBaseArticle['visibility']
  authorId?: string
  dateRange?: {
    start: Date
    end: Date
  }
  featured?: boolean
  hasMedia?: boolean
  sortBy: 'relevance' | 'newest' | 'oldest' | 'updated' | 'popular' | 'title'
  sortOrder: 'asc' | 'desc'
}

export interface KnowledgeBaseStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalViews: number
  totalCategories: number
  totalTags: number
  popularArticles: KnowledgeBaseArticle[]
  recentArticles: KnowledgeBaseArticle[]
  topCategories: (KnowledgeBaseCategory & { viewCount: number })[]
  searchQueries: { query: string; count: number; lastSearched: Date }[]
}

export interface ArticleComment {
  id: string
  articleId: string
  author: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  content: string
  parentId?: string
  isInternal: boolean
  status: 'approved' | 'pending' | 'rejected'
  helpful: number
  createdAt: Date
  updatedAt: Date
}

export interface ArticleFeedback {
  id: string
  articleId: string
  userId?: string
  userEmail?: string
  rating: 1 | 2 | 3 | 4 | 5
  isHelpful: boolean
  feedback: string
  suggestedImprovements?: string
  category: 'content' | 'accuracy' | 'clarity' | 'completeness' | 'other'
  status: 'new' | 'reviewed' | 'addressed'
  createdAt: Date
}

export interface KnowledgeBaseConfig {
  branding: {
    title: string
    description: string
    logo?: string
    primaryColor: string
    accentColor: string
  }
  features: {
    enableComments: boolean
    enableRatings: boolean
    enableSharing: boolean
    enablePrint: boolean
    enableDownload: boolean
    enableSearch: boolean
    enableSuggestions: boolean
    requireLogin: boolean
    moderateComments: boolean
  }
  seo: {
    sitemap: boolean
    robots: string
    canonicalUrl: string
  }
  integrations: {
    analytics?: string
    chatbot?: boolean
    helpdesk?: string
  }
}

export type BreadcrumbItem = {
  label: string
  href?: string
  active?: boolean
}
export interface KnowledgeBaseCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  slug: string
  articleCount: number
}

export interface KnowledgeBaseTag {
  id: string
  name: string
  color: string
  usageCount: number
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  categoryId: string
  tags: KnowledgeBaseTag[]
  author: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
  status: 'draft' | 'published' | 'archived' | 'under-review'
  featured: boolean
  views: number
  likes: number
  helpful: number
  notHelpful: number
  shares: number
  featuredImage?: {
    url: string
    alt?: string
    description?: string
  }
  media: Array<{
    id: string
    type: 'image' | 'video' | 'document'
    url: string
    title: string
    description?: string
  }>
  relatedArticles: string[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
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
  searchQueries: { query: string; count: number; lastSearched: string }[]
}
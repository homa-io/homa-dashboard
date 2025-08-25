"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  ThumbsUp, 
  Clock, 
  User, 
  ArrowRight,
  Star,
  Play,
  Image as ImageIcon,
  Calendar
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { KnowledgeBaseArticle, KnowledgeBaseCategory } from "@/types/knowledge-base.simple.types"

interface ArticleCardProps {
  article: KnowledgeBaseArticle
  category?: KnowledgeBaseCategory
  showAuthor?: boolean
  showStats?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

export function ArticleCard({ 
  article, 
  category, 
  showAuthor = true, 
  showStats = true,
  variant = 'default'
}: ArticleCardProps) {
  const renderMediaIndicators = () => {
    const hasVideo = article.media.some(m => m.type === 'video')
    const hasImages = article.media.some(m => m.type === 'image')
    
    return (
      <div className="flex items-center gap-1">
        {hasVideo && (
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <Play className="w-3 h-3 text-red-600" />
          </div>
        )}
        {hasImages && (
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <ImageIcon className="w-3 h-3 text-blue-600" />
          </div>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
        {article.featuredImage && (
          <Image
            src={article.featuredImage.thumbnail || article.featuredImage.url}
            alt={article.title}
            width={60}
            height={40}
            className="rounded object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <Link 
            href={`/knowledge-base/articles/${article.slug}`}
            className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
          >
            {article.title}
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {category && (
              <span className="flex items-center gap-1">
                {category.icon} {category.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden">
        {article.featuredImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={article.featuredImage.url}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {article.featured && (
                <Badge className="bg-yellow-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {category && (
                <Badge style={{ backgroundColor: category.color, color: 'white' }}>
                  {category.icon} {category.name}
                </Badge>
              )}
            </div>
            <div className="absolute bottom-4 right-4">
              {renderMediaIndicators()}
            </div>
          </div>
        )}
        <CardHeader className="pb-3">
          <CardTitle className="text-xl leading-tight">
            <Link 
              href={`/knowledge-base/articles/${article.slug}`}
              className="hover:text-primary transition-colors"
            >
              {article.title}
            </Link>
          </CardTitle>
          <CardDescription className="text-base">
            {article.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {showAuthor && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.author.name}
                </div>
              )}
              {showStats && (
                <>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {article.helpful}
                  </div>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/knowledge-base/articles/${article.slug}`}>
                Read More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <Badge 
                variant="secondary" 
                style={{ backgroundColor: `${category.color}15`, borderColor: category.color }}
              >
                {category.icon} {category.name}
              </Badge>
            )}
            {article.featured && (
              <Badge variant="outline">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {article.sticky && (
              <Badge variant="outline">
                Pinned
              </Badge>
            )}
          </div>
          {renderMediaIndicators()}
        </div>
        
        <CardTitle className="text-lg leading-snug">
          <Link 
            href={`/knowledge-base/articles/${article.slug}`}
            className="hover:text-primary transition-colors"
          >
            {article.title}
          </Link>
        </CardTitle>
        
        <CardDescription>
          {article.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag.id} 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: tag.color, color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {showAuthor && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {article.author.name}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.updatedAt).toLocaleDateString()}
            </div>
          </div>
          
          {showStats && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.views}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {article.helpful}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
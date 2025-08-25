"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Share2,
  BookmarkPlus,
  Clock,
  User,
  Calendar,
  Tag,
  ChevronRight,
  Play,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  MessageCircle,
  Star
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockKnowledgeBaseArticles, mockKnowledgeBaseCategories, mockKnowledgeBaseTags } from "@/data/mockKnowledgeBase.working"
// Simple breadcrumb type
type BreadcrumbItem = {
  label: string
  href?: string
  active?: boolean
}

interface ArticlePageProps {
  params: { slug: string }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Find the article by slug
  const article = mockKnowledgeBaseArticles.find(a => a.slug === slug)
  
  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Article Not Found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/knowledge-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const category = mockKnowledgeBaseCategories.find(cat => cat.id === article.categoryId)
  const relatedArticles = mockKnowledgeBaseArticles.filter(a => 
    article.relatedArticles.includes(a.id) || a.categoryId === article.categoryId
  ).slice(0, 3)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Knowledge Base", href: "/knowledge-base" },
    { label: category?.name || "Category", href: `/knowledge-base?category=${category?.id}` },
    { label: article.title, active: true }
  ]

  const handleFeedback = (helpful: boolean) => {
    setIsHelpful(helpful)
    // Here you would typically send this feedback to your backend
    console.log(`Article ${article.id} marked as ${helpful ? 'helpful' : 'not helpful'}`)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    // Show toast notification
    console.log('Article URL copied to clipboard')
  }

  // Convert markdown-style content to JSX (simplified)
  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{paragraph.slice(4)}</h3>
      }
      if (paragraph.startsWith('```')) {
        return (
          <pre key={index} className="bg-muted p-4 rounded-lg my-4 overflow-x-auto">
            <code>{paragraph.replace(/```\w*\n?/g, '')}</code>
          </pre>
        )
      }
      if (paragraph.trim() === '') {
        return <br key={index} />
      }
      return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
    })
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
            {item.active ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link href={item.href || '#'} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {category && (
                <Badge variant="secondary" className="text-sm">
                  {category.icon} {category.name}
                </Badge>
              )}
              {article.featured && (
                <Badge variant="outline" className="text-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                {article.status}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold leading-tight">{article.title}</h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {article.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views} views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 py-2">
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <BookmarkPlus className="w-4 h-4 mr-2" />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments
              </Button>
            </div>
          </div>

          <Separator />

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="space-y-2">
              <Image
                src={article.featuredImage.url}
                alt={article.featuredImage.alt || article.title}
                width={800}
                height={400}
                className="w-full rounded-lg"
              />
              {article.featuredImage.description && (
                <p className="text-sm text-muted-foreground italic">
                  {article.featuredImage.description}
                </p>
              )}
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {renderContent(article.content)}
          </div>

          {/* Media Gallery */}
          {article.media.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Media & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {article.media.map((media) => (
                    <div key={media.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        {media.type === 'video' ? (
                          <Play className="w-5 h-5 text-blue-500" />
                        ) : media.type === 'image' ? (
                          <ImageIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <FileText className="w-5 h-5 text-purple-500" />
                        )}
                        <h4 className="font-medium">{media.title}</h4>
                      </div>
                      {media.description && (
                        <p className="text-sm text-muted-foreground">{media.description}</p>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <a href={media.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open {media.type}
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    style={{ backgroundColor: `${tag.color}15`, borderColor: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle>Was this article helpful?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant={isHelpful === true ? "default" : "outline"}
                  onClick={() => handleFeedback(true)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes ({article.helpful})
                </Button>
                <Button
                  variant={isHelpful === false ? "destructive" : "outline"}
                  onClick={() => handleFeedback(false)}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  No ({article.notHelpful})
                </Button>
              </div>
              {isHelpful !== null && (
                <p className="text-sm text-muted-foreground">
                  Thank you for your feedback! This helps us improve our documentation.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Table of Contents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <nav className="space-y-1 text-sm">
                <a href="#quick-diagnostics" className="block py-1 text-muted-foreground hover:text-primary transition-colors">
                  Quick Diagnostics
                </a>
                <a href="#common-issues" className="block py-1 text-muted-foreground hover:text-primary transition-colors">
                  Common Issues and Solutions
                </a>
                <a href="#network-requirements" className="block py-1 text-muted-foreground hover:text-primary transition-colors">
                  Network Requirements
                </a>
                <a href="#still-having-issues" className="block py-1 text-muted-foreground hover:text-primary transition-colors">
                  Still Having Issues?
                </a>
              </nav>
            </CardContent>
          </Card>

          {/* Author Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About the Author</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src={article.author.avatar || '/placeholder-avatar.png'}
                  alt={article.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-medium">{article.author.name}</h4>
                  <p className="text-sm text-muted-foreground">{article.author.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <div key={relatedArticle.id} className="space-y-2">
                    <Link 
                      href={`/knowledge-base/articles/${relatedArticle.slug}`}
                      className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                    >
                      {relatedArticle.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {relatedArticle.views} views
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Article Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Article Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Views:</span>
                <span className="font-medium">{article.views}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Likes:</span>
                <span className="font-medium">{article.likes}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shares:</span>
                <span className="font-medium">{article.shares}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{new Date(article.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
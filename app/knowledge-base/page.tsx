"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  Users,
  Star,
  Eye,
  ThumbsUp,
  ArrowRight,
  FileText,
  Tag,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { mockKnowledgeBaseCategories, mockKnowledgeBaseArticles, mockKnowledgeBaseTags, mockKnowledgeBaseStats } from "@/data/mockKnowledgeBase"

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredArticles = mockKnowledgeBaseArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || article.categoryId === selectedCategory
    
    return matchesSearch && matchesCategory && article.status === 'published'
  })

  const featuredArticles = mockKnowledgeBaseArticles.filter(article => article.featured)
  const popularArticles = mockKnowledgeBaseStats.popularArticles.slice(0, 3)

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-6 lg:p-8">
      {/* Header Section - Mobile Responsive */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
        <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Knowledge Base</h1>
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-4 sm:px-0">
          Find answers, learn new features, and get the most out of our platform
        </p>
        
        {/* Search Bar - Mobile Responsive */}
        <div className="relative max-w-xl mx-auto px-4 sm:px-0">
          <Search className="absolute left-7 sm:left-4 top-2.5 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base lg:text-lg"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockKnowledgeBaseStats.totalArticles}</div>
            <div className="text-sm text-muted-foreground">Articles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Tag className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockKnowledgeBaseStats.totalCategories}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockKnowledgeBaseStats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{mockKnowledgeBaseStats.recentArticles.length}</div>
            <div className="text-sm text-muted-foreground">Updated</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Articles</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => {
              const category = mockKnowledgeBaseCategories.find(cat => cat.id === article.categoryId)
              return (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {category?.icon} {category?.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-snug">
                      <Link href={`/knowledge-base/articles/${article.slug}`} className="hover:text-primary transition-colors">
                        {article.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {article.helpful}
                        </span>
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
            })}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Categories - Mobile Responsive */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6 order-2 lg:order-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            {selectedCategory && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCategory(null)}
              >
                View All Categories
              </Button>
            )}
          </div>
          
          {!selectedCategory ? (
            <div className="grid md:grid-cols-2 gap-6">
              {mockKnowledgeBaseCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${category.color}15` }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.articleCount} articles
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Explore Category
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                     style={{ backgroundColor: `${mockKnowledgeBaseCategories.find(c => c.id === selectedCategory)?.color}15` }}>
                  {mockKnowledgeBaseCategories.find(c => c.id === selectedCategory)?.icon}
                </div>
                <h3 className="text-xl font-bold">
                  {mockKnowledgeBaseCategories.find(c => c.id === selectedCategory)?.name}
                </h3>
              </div>
              
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-snug mb-2">
                            <Link href={`/knowledge-base/articles/${article.slug}`} className="hover:text-primary transition-colors">
                              {article.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="text-sm mb-3">
                            {article.excerpt}
                          </CardDescription>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {article.author.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(article.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {article.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Mobile Responsive */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          {/* Popular Articles */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Most Popular
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularArticles.map((article, index) => (
                <div key={article.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link 
                      href={`/knowledge-base/articles/${article.slug}`}
                      className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {article.views} views
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockKnowledgeBaseStats.recentArticles.slice(0, 3).map((article) => (
                <div key={article.id} className="space-y-2">
                  <Link 
                    href={`/knowledge-base/articles/${article.slug}`}
                    className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                  >
                    {article.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date(article.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockKnowledgeBaseTags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    style={{ backgroundColor: `${tag.color}15`, borderColor: tag.color }}
                  >
                    {tag.name} ({tag.usageCount})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
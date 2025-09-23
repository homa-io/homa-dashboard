"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  FileText,
  FolderOpen,
  Tag,
  Calendar,
  User,
  TrendingUp,
  Image as ImageIcon,
  Video,
  Save,
  X,
  Check,
  BookOpen
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockKnowledgeBaseArticles, mockKnowledgeBaseCategories, mockKnowledgeBaseTags } from "@/data/mockKnowledgeBase.working"
import { CategoryManager } from "@/components/knowledge-base/CategoryManager"
import { ArticleEditor } from "@/components/knowledge-base/ArticleEditor"
import { TagManager } from "@/components/knowledge-base/TagManager"

export default function KnowledgeBaseManagePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTab, setSelectedTab] = useState('articles')
  const [editingArticle, setEditingArticle] = useState<string | null>(null)
  const [creatingNew, setCreatingNew] = useState(false)
  const [previewArticle, setPreviewArticle] = useState<string | null>(null)

  const filteredArticles = mockKnowledgeBaseArticles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || article.categoryId === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleCreateNew = () => {
    setCreatingNew(true)
    setEditingArticle(null)
  }

  const handleEditArticle = (articleId: string) => {
    setEditingArticle(articleId)
    setCreatingNew(false)
  }

  const handleCloseEditor = () => {
    setEditingArticle(null)
    setCreatingNew(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (editingArticle || creatingNew) {
    const article = editingArticle 
      ? mockKnowledgeBaseArticles.find(a => a.id === editingArticle)
      : null

    return (
      <ArticleEditor 
        article={article}
        onClose={handleCloseEditor}
        onSave={(data) => {
          console.log('Saving article:', data)
          handleCloseEditor()
        }}
      />
    )
  }

  return (
    <div className="space-y-4 sm:space-y-8 p-3 sm:p-6 lg:p-8">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 sm:gap-3">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="line-clamp-1">Knowledge Base</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
            Create and manage articles, categories, and tags
          </p>
        </div>
        <Button onClick={handleCreateNew} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold">{mockKnowledgeBaseArticles.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{mockKnowledgeBaseCategories.length}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tags</p>
                <p className="text-2xl font-bold">{mockKnowledgeBaseTags.length}</p>
              </div>
              <Tag className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockKnowledgeBaseArticles.filter(a => a.status === 'published').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs - Mobile Responsive */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="articles" className="text-xs sm:text-sm py-2 sm:py-3">Articles</TabsTrigger>
          <TabsTrigger value="categories" className="text-xs sm:text-sm py-2 sm:py-3">Categories</TabsTrigger>
          <TabsTrigger value="tags" className="text-xs sm:text-sm py-2 sm:py-3">Tags</TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Articles Management</CardTitle>
              <CardDescription>
                Create, edit, and manage knowledge base articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 sm:h-10 text-sm"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md h-9 sm:h-10 text-sm w-full sm:w-auto"
                >
                  <option value="all">All Categories</option>
                  {mockKnowledgeBaseCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Articles Table - Mobile Responsive */}
              <div className="overflow-x-auto -mx-3 sm:-mx-6 px-3 sm:px-6">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map((article) => {
                    const category = mockKnowledgeBaseCategories.find(cat => cat.id === article.categoryId)
                    return (
                      <TableRow key={article.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium line-clamp-1">{article.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {article.excerpt}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {category?.icon} {category?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{article.author.name}</p>
                            <p className="text-xs text-muted-foreground">{article.author.role}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag.id} variant="outline" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                            {article.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{article.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {article.featuredImage && (
                              <ImageIcon className="w-4 h-4 text-blue-500" />
                            )}
                            {article.media.some(m => m.type === 'video') && (
                              <Video className="w-4 h-4 text-red-500" />
                            )}
                            {article.media.length > 0 && (
                              <span className="text-xs text-muted-foreground">
                                ({article.media.length})
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{new Date(article.updatedAt).toLocaleDateString()}</p>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditArticle(article.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setPreviewArticle(article.id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No articles found.</p>
                  <Button className="mt-4" onClick={handleCreateNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Article
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags">
          <TagManager />
        </TabsContent>
      </Tabs>

      {/* Preview Modal - Mobile Responsive */}
      {previewArticle && (() => {
        const article = mockKnowledgeBaseArticles.find(a => a.id === previewArticle)
        if (!article) return null
        
        return (
          <Dialog open={!!previewArticle} onOpenChange={() => setPreviewArticle(null)}>
            <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Article Preview</DialogTitle>
              </DialogHeader>
              <div className="mt-3 sm:mt-4">
                {/* Article Header */}
                <div className="mb-4 sm:mb-6">
                  {article.featuredImage && (
                    <img 
                      src={article.featuredImage.url} 
                      alt={article.title}
                      className="w-full h-40 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
                    />
                  )}
                  <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">
                    {article.title}
                  </h1>
                  {article.excerpt && (
                    <p className="text-sm sm:text-lg text-muted-foreground mb-3 sm:mb-4">{article.excerpt}</p>
                  )}
                  
                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{article.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {article.tags.map(tag => (
                      <Badge key={tag.id} variant="secondary" className="text-xs sm:text-sm">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Category */}
                  {article.categoryId && (
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Category: {mockKnowledgeBaseCategories.find(c => c.id === article.categoryId)?.name}
                    </div>
                  )}
                </div>
                
                {/* Article Content - Mobile Responsive */}
                <div 
                  className="prose prose-sm sm:prose-base max-w-none 
                    prose-headings:text-base sm:prose-headings:text-xl
                    prose-p:text-sm sm:prose-p:text-base
                    prose-li:text-sm sm:prose-li:text-base
                    prose-img:rounded-lg prose-img:max-w-full
                    prose-pre:text-xs sm:prose-pre:text-sm
                    prose-code:text-xs sm:prose-code:text-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: article.content
                  }}
                />
                
                {/* Related Articles */}
                {article.relatedArticles && article.relatedArticles.length > 0 && (
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Related Articles</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {article.relatedArticles.map(relatedId => {
                        const related = mockKnowledgeBaseArticles.find(a => a.id === relatedId)
                        return related ? (
                          <div 
                            key={relatedId} 
                            className="flex items-center gap-2 group cursor-pointer"
                            onClick={() => {
                              setPreviewArticle(relatedId)
                            }}
                          >
                            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm sm:text-base group-hover:underline group-hover:text-primary transition-colors">
                              {related.title}
                            </span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )
      })()}
    </div>
  )
}
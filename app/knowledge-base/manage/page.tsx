"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  Image as ImageIcon,
  Video,
  BookOpen,
  Loader2
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
import { CategoryManager } from "@/components/knowledge-base/CategoryManager"
import { ArticleEditor } from "@/components/knowledge-base/ArticleEditor"
import { TagManager } from "@/components/knowledge-base/TagManager"
import { toast } from "@/hooks/use-toast"
import { getMediaUrl } from "@/services/api-client"
import {
  getKBArticles,
  getKBArticle,
  getKBCategories,
  getKBTags,
  deleteKBArticle,
  type KBArticle,
  type KBCategory,
  type KBTag,
} from "@/services/knowledge-base.service"

export default function KnowledgeBaseManagePage() {
  // Data state
  const [articles, setArticles] = useState<KBArticle[]>([])
  const [categories, setCategories] = useState<KBCategory[]>([])
  const [tags, setTags] = useState<KBTag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTab, setSelectedTab] = useState('articles')

  // Editor state
  const [editingArticle, setEditingArticle] = useState<KBArticle | null>(null)
  const [creatingNew, setCreatingNew] = useState(false)
  const [previewArticle, setPreviewArticle] = useState<KBArticle | null>(null)

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
        getKBArticles({
          search: debouncedSearchTerm || undefined,
          category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
        }),
        getKBCategories(),
        getKBTags(),
      ])

      if (articlesRes.success && articlesRes.data) {
        setArticles(articlesRes.data)
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data)
      }
      if (tagsRes.success && tagsRes.data) {
        setTags(tagsRes.data)
      }
    } catch (error) {
      console.error('Error fetching KB data:', error)
      toast({
        title: "Error",
        description: "Failed to load knowledge base data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearchTerm, selectedCategory])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleCreateNew = () => {
    setCreatingNew(true)
    setEditingArticle(null)
  }

  const handleEditArticle = async (articleId: string) => {
    try {
      const response = await getKBArticle(articleId)
      if (response.success && response.data) {
        setEditingArticle(response.data)
        setCreatingNew(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load article",
        variant: "destructive",
      })
    }
  }

  const handlePreviewArticle = async (articleId: string) => {
    try {
      const response = await getKBArticle(articleId)
      if (response.success && response.data) {
        setPreviewArticle(response.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load article preview",
        variant: "destructive",
      })
    }
  }

  const handleCloseEditor = () => {
    setEditingArticle(null)
    setCreatingNew(false)
    fetchData()
  }

  const handleDeleteClick = (id: string, title: string) => {
    setArticleToDelete({ id, title })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!articleToDelete) return

    setIsDeleting(true)
    try {
      const response = await deleteKBArticle(articleToDelete.id)
      if (response.success) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        })
        setDeleteDialogOpen(false)
        setArticleToDelete(null)
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Article Editor view
  if (editingArticle || creatingNew) {
    return (
      <ArticleEditor
        article={editingArticle}
        categories={categories}
        tags={tags}
        onClose={handleCloseEditor}
        onSave={handleCloseEditor}
      />
    )
  }

  const publishedCount = articles.filter(a => a.status === 'published').length

  return (
    <div className="space-y-4 sm:space-y-8 p-3 sm:p-6 lg:p-8">
      {/* Header */}
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
                <p className="text-2xl font-bold">{articles.length}</p>
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
                <p className="text-2xl font-bold">{categories.length}</p>
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
                <p className="text-2xl font-bold">{tags.length}</p>
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
                <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
              </div>
              <Eye className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
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
              {/* Filters */}
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Articles Table */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No articles found.</p>
                  <Button className="mt-4" onClick={handleCreateNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Article
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-3 sm:-mx-6 px-3 sm:px-6">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Media</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <button
                                onClick={() => handleEditArticle(article.id)}
                                className="font-medium line-clamp-1 text-left hover:text-primary hover:underline cursor-pointer transition-colors"
                              >
                                {article.title}
                              </button>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {article.excerpt}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {article.category ? (
                              <Badge variant="secondary">
                                {article.category.icon} {article.category.name}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(article.status)}>
                              {article.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {article.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag.id} variant="outline" className="text-xs">
                                  {tag.name}
                                </Badge>
                              ))}
                              {(article.tags?.length || 0) > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(article.tags?.length || 0) - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {article.featured_image && (
                                <ImageIcon className="w-4 h-4 text-blue-500" />
                              )}
                              {article.media?.some(m => m.type === 'video') && (
                                <Video className="w-4 h-4 text-red-500" />
                              )}
                              {(article.media?.length || 0) > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  ({article.media?.length})
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{new Date(article.updated_at).toLocaleDateString()}</p>
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
                                <DropdownMenuItem onClick={() => handlePreviewArticle(article.id)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteClick(article.id, article.title)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategoryManager onDataChange={fetchData} />
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags">
          <TagManager onDataChange={fetchData} />
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {previewArticle && (
        <Dialog open={!!previewArticle} onOpenChange={() => setPreviewArticle(null)}>
          <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Article Preview</DialogTitle>
            </DialogHeader>
            <div className="mt-3 sm:mt-4">
              {/* Article Header */}
              <div className="mb-4 sm:mb-6">
                {previewArticle.featured_image && (
                  <img
                    src={getMediaUrl(previewArticle.featured_image)}
                    alt={previewArticle.title}
                    className="w-full h-40 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
                  />
                )}
                <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">
                  {previewArticle.title}
                </h1>
                {previewArticle.excerpt && (
                  <p className="text-sm sm:text-lg text-muted-foreground mb-3 sm:mb-4">{previewArticle.excerpt}</p>
                )}

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{new Date(previewArticle.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{previewArticle.view_count.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Tags */}
                {previewArticle.tags && previewArticle.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {previewArticle.tags.map(tag => (
                      <Badge key={tag.id} variant="secondary" className="text-xs sm:text-sm">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Category */}
                {previewArticle.category && (
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Category: {previewArticle.category.icon} {previewArticle.category.name}
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div
                className="prose prose-sm sm:prose-base max-w-none
                  prose-headings:text-base sm:prose-headings:text-xl
                  prose-p:text-sm sm:prose-p:text-base
                  prose-li:text-sm sm:prose-li:text-base
                  prose-img:rounded-lg prose-img:max-w-full
                  prose-pre:text-xs sm:prose-pre:text-sm
                  prose-code:text-xs sm:prose-code:text-sm"
                dangerouslySetInnerHTML={{
                  __html: previewArticle.content
                }}
              />

              {/* Media Gallery */}
              {previewArticle.media && previewArticle.media.length > 0 && (
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Media</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previewArticle.media.map(media => (
                      <div key={media.id} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {media.type === 'image' ? (
                          <img
                            src={getMediaUrl(media.url)}
                            alt={media.title}
                            className="w-full h-full object-cover"
                          />
                        ) : media.type === 'video' ? (
                          <video
                            src={getMediaUrl(media.url)}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the article "{articleToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

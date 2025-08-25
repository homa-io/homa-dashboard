"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FolderOpen,
  Palette,
  Hash
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockKnowledgeBaseCategories, mockKnowledgeBaseArticles } from "@/data/mockKnowledgeBase.working"
import { KnowledgeBaseCategory } from "@/types/knowledge-base.simple.types"

export function CategoryManager() {
  const [categories, setCategories] = useState(mockKnowledgeBaseCategories)
  const [editingCategory, setEditingCategory] = useState<KnowledgeBaseCategory | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    slug: ''
  })

  const handleEdit = (category: KnowledgeBaseCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      slug: category.slug
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      description: '',
      icon: '📁',
      color: '#3B82F6',
      slug: ''
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ))
    } else {
      // Create new category
      const newCategory: KnowledgeBaseCategory = {
        id: `cat-${Date.now()}`,
        ...formData,
        articleCount: 0
      }
      setCategories(prev => [...prev, newCategory])
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '#3B82F6',
      slug: ''
    })
    setEditingCategory(null)
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: !editingCategory ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : prev.slug
    }))
  }

  const getArticleCount = (categoryId: string) => {
    return mockKnowledgeBaseArticles.filter(a => a.categoryId === categoryId).length
  }

  const commonIcons = ['📚', '📖', '📝', '💡', '🔧', '⚡', '🚀', '🎯', '🔗', '📊', '🛠️', '📁', '🏷️', '⭐']
  const commonColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6',
    '#F97316', '#84CC16', '#06B6D4', '#0EA5E9'
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categories Management</CardTitle>
              <CardDescription>
                Organize articles into categories for better navigation
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getArticleCount(category.id)} articles
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: category.color }}
                      />
                      <code className="text-xs">{category.color}</code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {categories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No categories found.</p>
              <Button className="mt-4" onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription>
              Categories help organize your knowledge base articles
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Getting Started"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="getting-started"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Everything you need to know to get started..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Icon</Label>
                <div className="mt-1 space-y-2">
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="Enter emoji or text"
                  />
                  <div className="flex flex-wrap gap-1">
                    {commonIcons.map((icon) => (
                      <Button
                        key={icon}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 p-0 text-lg"
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Color</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-20 h-10"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {commonColors.map((color) => (
                      <Button
                        key={color}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 p-0"
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label>Preview</Label>
              <div className="mt-2 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${formData.color}20` }}
                  >
                    {formData.icon || '📁'}
                  </div>
                  <div>
                    <h3 className="font-semibold">{formData.name || 'Category Name'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || 'Category description will appear here'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
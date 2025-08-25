"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Tag,
  Hash,
  Palette,
  Search
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
import { mockKnowledgeBaseTags, mockKnowledgeBaseArticles } from "@/data/mockKnowledgeBase.working"
import { KnowledgeBaseTag } from "@/types/knowledge-base.simple.types"

export function TagManager() {
  const [tags, setTags] = useState(mockKnowledgeBaseTags)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingTag, setEditingTag] = useState<KnowledgeBaseTag | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    color: '#10B981'
  })

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (tag: KnowledgeBaseTag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      color: tag.color
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingTag(null)
    setFormData({
      name: '',
      color: '#10B981'
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingTag) {
      // Update existing tag
      setTags(prev => prev.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, ...formData }
          : tag
      ))
    } else {
      // Create new tag
      const newTag: KnowledgeBaseTag = {
        id: `tag-${Date.now()}`,
        ...formData,
        usageCount: 0
      }
      setTags(prev => [...prev, newTag])
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (tagId: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      setTags(prev => prev.filter(tag => tag.id !== tagId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#10B981'
    })
    setEditingTag(null)
  }

  const getUsageCount = (tagId: string) => {
    return mockKnowledgeBaseArticles.filter(article => 
      article.tags.some(tag => tag.id === tagId)
    ).length
  }

  const predefinedColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6',
    '#F97316', '#84CC16', '#06B6D4', '#0EA5E9',
    '#DC2626', '#E11D48', '#7C3AED', '#059669'
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tags Management</CardTitle>
              <CardDescription>
                Create and manage tags to help categorize and find articles
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              New Tag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tags Grid View */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="group relative bg-muted/30 rounded-lg p-3 border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-medium">{tag.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {getUsageCount(tag.id)}
                      </Badge>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(tag)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tag.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTags.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{searchTerm ? 'No tags found matching your search.' : 'No tags found.'}</p>
                <Button className="mt-4" onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create {searchTerm ? 'First' : 'New'} Tag
                </Button>
              </div>
            )}
          </div>

          {/* Tags Table View (Alternative) */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Detailed View</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="font-medium">{tag.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {tag.color}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getUsageCount(tag.id)} articles
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(tag)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tag.id)}
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
          </div>
        </CardContent>
      </Card>

      {/* Tag Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Edit Tag' : 'Create New Tag'}
            </DialogTitle>
            <DialogDescription>
              Tags help users find related articles quickly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Getting Started"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="mt-2 space-y-3">
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
                    placeholder="#10B981"
                    className="flex-1"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0 border-2"
                      style={{ 
                        backgroundColor: color,
                        borderColor: formData.color === color ? '#000' : 'transparent'
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label>Preview</Label>
              <div className="mt-2 flex gap-2">
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: `${formData.color}20`, 
                    borderColor: formData.color,
                    color: formData.color
                  }}
                >
                  {formData.name || 'Tag Name'}
                </Badge>
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: formData.color,
                    color: formData.color
                  }}
                >
                  {formData.name || 'Tag Name'}
                </Badge>
                <Badge 
                  style={{ 
                    backgroundColor: formData.color,
                    color: 'white'
                  }}
                >
                  {formData.name || 'Tag Name'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              <Save className="w-4 h-4 mr-2" />
              {editingTag ? 'Update' : 'Create'} Tag
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
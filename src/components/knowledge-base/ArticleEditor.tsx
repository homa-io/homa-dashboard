"use client"

import { useState, useCallback } from "react"
import "@/styles/editor.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  ArrowLeft,
  Save,
  Eye,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Video,
  Link,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo
} from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Youtube from "@tiptap/extension-youtube"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import UnderlineExtension from "@tiptap/extension-underline"
import { mockKnowledgeBaseCategories, mockKnowledgeBaseTags } from "@/data/mockKnowledgeBase.working"
import { KnowledgeBaseArticle } from "@/types/knowledge-base.simple.types"

interface ArticleEditorProps {
  article?: KnowledgeBaseArticle | null
  onClose: () => void
  onSave: (data: any) => void
}

export function ArticleEditor({ article, onClose, onSave }: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [categoryId, setCategoryId] = useState(article?.categoryId || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(
    article?.tags.map(t => t.id) || []
  )
  const [status, setStatus] = useState(article?.status || 'draft')
  const [featured, setFeatured] = useState(article?.featured || false)
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article?.featuredImage?.url || '')
  const [showPreview, setShowPreview] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        controls: true,
      }),
      Placeholder.configure({
        placeholder: 'Write your article content here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: article?.content || '',
    immediatelyRender: false,
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Auto-generate slug from title
    if (!article) {
      const newSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(newSlug)
    }
  }

  const handleSave = () => {
    const content = editor?.getHTML() || ''
    const data = {
      title,
      slug,
      excerpt,
      content,
      categoryId,
      tags: selectedTags,
      status,
      featured,
      featuredImage: featuredImageUrl ? { url: featuredImageUrl } : null,
    }
    onSave(data)
  }

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addYoutubeVideo = useCallback(() => {
    const url = window.prompt('Enter YouTube URL:')
    if (url && editor) {
      editor.commands.setYoutubeVideo({
        src: url,
      })
    }
  }, [editor])

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '' && editor) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    if (editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  if (!editor) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile Responsive */}
      <div className="border-b sticky top-0 bg-background z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 sm:px-3">
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
              {article ? 'Edit' : 'New'} Article
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 sm:flex-none"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} size="sm" className="flex-1 sm:flex-none">
              <Save className="w-4 h-4 mr-1 sm:mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Editor - Mobile Responsive */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-1">
            {/* Title and Slug */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter article title..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-url-slug"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of the article..."
                    className="mt-1 resize-none"
                    rows={3}
                    style={{ minHeight: '80px' }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Editor Toolbar - Mobile Responsive */}
            <Card>
              <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
                <div className="flex flex-wrap gap-0.5 sm:gap-1 pb-2 sm:pb-3 mb-2 sm:mb-3 border-b overflow-x-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'bg-muted' : ''}
                  >
                    <UnderlineIcon className="w-4 h-4" />
                  </Button>
                  <div className="w-px bg-border mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                  >
                    <Heading1 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                  >
                    <Heading2 className="w-4 h-4" />
                  </Button>
                  <div className="w-px bg-border mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <div className="w-px bg-border mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                  <div className="w-px bg-border mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
                  >
                    <Code className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                  >
                    <Quote className="w-4 h-4" />
                  </Button>
                  <div className="w-px bg-border mx-1" />
                  <Button variant="ghost" size="sm" onClick={addLink}>
                    <Link className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={addImage}>
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={addYoutubeVideo}>
                    <Video className="w-4 h-4" />
                  </Button>
                  <div className="w-px bg-border mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content Editor - Mobile Responsive */}
                <div className="min-h-[300px] sm:min-h-[400px] prose prose-sm max-w-none overflow-x-auto">
                  <EditorContent 
                    editor={editor} 
                    className="focus:outline-none px-2 sm:px-0"
                  />
                </div>
                
                {/* Content Stats - Mobile Responsive */}
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-muted-foreground pt-2 border-t gap-1">
                  <span className="hidden sm:inline">Use the toolbar above to format your content</span>
                  <span className="text-center sm:text-right">
                    {editor?.storage.characterCount?.characters() || 0} characters
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Mobile Responsive */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* Status and Settings - Mobile Responsive */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Category</option>
                    {mockKnowledgeBaseCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Featured Article</Label>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image - Mobile Responsive */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featuredImageUrl ? (
                    <div className="relative">
                      <img
                        src={featuredImageUrl}
                        alt="Featured"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setFeaturedImageUrl('')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No image selected</p>
                    </div>
                  )}
                  <Input
                    placeholder="Enter image URL..."
                    value={featuredImageUrl}
                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags - Mobile Responsive */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockKnowledgeBaseTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal - Mobile Responsive */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Article Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-3 sm:mt-4">
            {/* Article Header */}
            <div className="mb-4 sm:mb-6">
              {featuredImageUrl && (
                <img 
                  src={featuredImageUrl} 
                  alt={title}
                  className="w-full h-40 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
                />
              )}
              <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">
                {title || 'Untitled Article'}
              </h1>
              {excerpt && (
                <p className="text-sm sm:text-lg text-muted-foreground mb-3 sm:mb-4">{excerpt}</p>
              )}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {selectedTags.map(tagId => {
                  const tag = mockKnowledgeBaseTags.find(t => t.id === tagId)
                  return tag ? (
                    <Badge key={tagId} variant="secondary" className="text-xs sm:text-sm">
                      {tag.name}
                    </Badge>
                  ) : null
                })}
              </div>
              {categoryId && (
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Category: {mockKnowledgeBaseCategories.find(c => c.id === categoryId)?.name}
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
                __html: editor?.getHTML() || '<p>No content yet...</p>' 
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
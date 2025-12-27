"use client"

import { useState, useCallback, useRef } from "react"
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
  Redo,
  Loader2,
  Trash2,
  GripVertical,
  Sparkles,
  Star
} from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Youtube from "@tiptap/extension-youtube"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import UnderlineExtension from "@tiptap/extension-underline"
import { toast } from "@/hooks/use-toast"
import { getMediaUrl } from "@/services/api-client"
import {
  createKBArticle,
  updateKBArticle,
  uploadKBMedia,
  generateArticleSummary,
  type KBArticle,
  type KBCategory,
  type KBTag,
  type KBMedia,
} from "@/services/knowledge-base.service"

interface MediaItem {
  id?: string
  type: 'image' | 'video'
  url: string
  title: string
  description?: string
  sort_order: number
  is_primary?: boolean
  isNew?: boolean
  file?: File
}

interface ArticleEditorProps {
  article?: KBArticle | null
  categories: KBCategory[]
  tags: KBTag[]
  onClose: () => void
  onSave: () => void
}

export function ArticleEditor({ article, categories, tags, onClose, onSave }: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [summary, setSummary] = useState(article?.summary || '')
  const [categoryId, setCategoryId] = useState(article?.category_id || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(
    article?.tags?.map(t => t.id) || []
  )
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(article?.status || 'draft')
  const [featured, setFeatured] = useState(article?.featured || false)
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article?.featured_image || '')
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false)
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  // Media gallery state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(
    article?.media?.map(m => ({
      id: m.id,
      type: m.type as 'image' | 'video',
      url: m.url,
      title: m.title,
      description: m.description,
      sort_order: m.sort_order,
      is_primary: m.is_primary,
    })) || []
  )

  const featuredImageRef = useRef<HTMLInputElement>(null)
  const mediaUploadRef = useRef<HTMLInputElement>(null)

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

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Article title is required",
        variant: "destructive",
      })
      return
    }

    const content = editor?.getHTML() || ''

    setIsSaving(true)
    try {
      const data = {
        title,
        content,
        summary,
        featured_image: featuredImageUrl || undefined,
        category_id: categoryId || undefined,
        status,
        featured,
        tag_ids: selectedTags,
        media: mediaItems.map((item, index) => ({
          id: item.id,
          type: item.type,
          url: item.url,
          title: item.title || `Media ${index + 1}`,
          description: item.description,
          sort_order: index,
          is_primary: item.is_primary || false,
        })),
      }

      if (article) {
        const response = await updateKBArticle(article.id, data)
        if (response.success) {
          toast({
            title: "Success",
            description: "Article updated successfully",
          })
        }
      } else {
        const response = await createKBArticle(data)
        if (response.success) {
          toast({
            title: "Success",
            description: "Article created successfully",
          })
        }
      }
      onSave()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save article",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingFeatured(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string
        const response = await uploadKBMedia(base64, 'image')
        if (response.success && response.data) {
          setFeaturedImageUrl(response.data.url)
          toast({
            title: "Success",
            description: "Featured image uploaded",
          })
        }
        setIsUploadingFeatured(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
      setIsUploadingFeatured(false)
    }
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingMedia(true)
    try {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith('video/')
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64 = reader.result as string
          const response = await uploadKBMedia(base64, isVideo ? 'video' : 'image')
          if (response.success && response.data) {
            setMediaItems(prev => [...prev, {
              type: isVideo ? 'video' : 'image',
              url: response.data!.url,
              title: file.name,
              sort_order: prev.length,
              isNew: true,
            }])
          }
        }
        reader.readAsDataURL(file)
      }
      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive",
      })
    } finally {
      setIsUploadingMedia(false)
    }
  }

  const removeMediaItem = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index))
  }

  const togglePrimaryMedia = (index: number) => {
    setMediaItems(prev => prev.map((item, i) => ({
      ...item,
      is_primary: i === index ? !item.is_primary : false
    })))
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

  const handleGenerateSummary = async () => {
    const content = editor?.getHTML() || ''

    if (!content || content === '<p></p>') {
      toast({
        title: "Error",
        description: "Please add some content before generating a summary",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingSummary(true)
    try {
      const response = await generateArticleSummary({
        title: title || 'Untitled Article',
        content,
      })

      if (response.success && response.data) {
        setSummary(response.data.summary)
        toast({
          title: "Success",
          description: "Summary generated successfully",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate summary",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSummary(false)
    }
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
            <Button onClick={handleSave} size="sm" className="flex-1 sm:flex-none" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 sm:mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1 sm:mr-2" />
                  Save
                </>
              )}
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="summary">Summary</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      className="h-7 px-2 text-xs"
                    >
                      {isGeneratingSummary ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Auto Generate
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
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
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
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
                        src={getMediaUrl(featuredImageUrl)}
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
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => featuredImageRef.current?.click()}
                    >
                      {isUploadingFeatured ? (
                        <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      )}
                      <p className="text-sm text-muted-foreground">
                        {isUploadingFeatured ? 'Uploading...' : 'Click to upload image'}
                      </p>
                    </div>
                  )}
                  <input
                    ref={featuredImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFeaturedImageUpload}
                  />
                  <Input
                    placeholder="Or enter image URL..."
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
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : undefined}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">No tags available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Media Gallery - Mobile Responsive */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Media Gallery</CardTitle>
                <CardDescription>Add images and videos to this article</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Upload Button */}
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => mediaUploadRef.current?.click()}
                  >
                    {isUploadingMedia ? (
                      <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
                    ) : (
                      <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {isUploadingMedia ? 'Uploading...' : 'Click to add images or videos'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports multiple files
                    </p>
                  </div>
                  <input
                    ref={mediaUploadRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaUpload}
                  />

                  {/* Media Items */}
                  {mediaItems.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {mediaItems.map((item, index) => (
                        <div
                          key={item.id || index}
                          className={`relative group aspect-video bg-muted rounded-lg overflow-hidden ${item.is_primary ? 'ring-2 ring-yellow-500' : ''}`}
                        >
                          {item.type === 'image' ? (
                            <img
                              src={getMediaUrl(item.url)}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={getMediaUrl(item.url)}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              variant={item.is_primary ? "default" : "secondary"}
                              size="sm"
                              onClick={() => togglePrimaryMedia(index)}
                              title={item.is_primary ? "Remove as primary" : "Set as primary"}
                            >
                              <Star className={`w-4 h-4 ${item.is_primary ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeMediaItem(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {/* Primary indicator */}
                          {item.is_primary && (
                            <div className="absolute top-1 right-1">
                              <Badge className="bg-yellow-500 text-white text-xs">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Primary
                              </Badge>
                            </div>
                          )}
                          <div className="absolute bottom-1 left-1">
                            {item.type === 'video' ? (
                              <Badge variant="secondary" className="text-xs">
                                <Video className="w-3 h-3 mr-1" />
                                Video
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                <ImageIcon className="w-3 h-3 mr-1" />
                                Image
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {mediaItems.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-2">
                      No media added yet
                    </p>
                  )}
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
                  src={getMediaUrl(featuredImageUrl)}
                  alt={title}
                  className="w-full h-40 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
                />
              )}
              <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">
                {title || 'Untitled Article'}
              </h1>
              {summary && (
                <p className="text-sm sm:text-lg text-muted-foreground mb-3 sm:mb-4">{summary}</p>
              )}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {selectedTags.map(tagId => {
                  const tag = tags.find(t => t.id === tagId)
                  return tag ? (
                    <Badge
                      key={tagId}
                      variant="secondary"
                      className="text-xs sm:text-sm text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ) : null
                })}
              </div>
              {categoryId && (
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Category: {categories.find(c => c.id === categoryId)?.icon} {categories.find(c => c.id === categoryId)?.name}
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
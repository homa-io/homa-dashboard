"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArticleEditor } from "@/components/knowledge-base/ArticleEditor"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {
  getKBArticle,
  getKBCategories,
  getKBTags,
  type KBArticle,
  type KBCategory,
  type KBTag,
} from "@/services/knowledge-base.service"

export default function EditArticlePage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string

  const [article, setArticle] = useState<KBArticle | null>(null)
  const [categories, setCategories] = useState<KBCategory[]>([])
  const [tags, setTags] = useState<KBTag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [articleRes, categoriesRes, tagsRes] = await Promise.all([
          getKBArticle(articleId),
          getKBCategories(),
          getKBTags(),
        ])

        if (articleRes.success && articleRes.data) {
          setArticle(articleRes.data)
        } else {
          setError("Article not found")
        }

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data)
        }

        if (tagsRes.success && tagsRes.data) {
          setTags(tagsRes.data)
        }
      } catch (error) {
        console.error("Error fetching article:", error)
        setError("Failed to load article")
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (articleId) {
      fetchData()
    }
  }, [articleId])

  const handleClose = () => {
    router.push("/knowledge-base/manage")
  }

  const handleSave = () => {
    router.push("/knowledge-base/manage")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive mb-2">
            {error || "Article not found"}
          </p>
          <button
            onClick={() => router.push("/knowledge-base/manage")}
            className="text-primary hover:underline"
          >
            Back to Knowledge Base
          </button>
        </div>
      </div>
    )
  }

  return (
    <ArticleEditor
      article={article}
      categories={categories}
      tags={tags}
      onClose={handleClose}
      onSave={handleSave}
    />
  )
}

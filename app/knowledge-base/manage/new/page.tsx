"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArticleEditor } from "@/components/knowledge-base/ArticleEditor"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {
  getKBCategories,
  getKBTags,
  type KBCategory,
  type KBTag,
} from "@/services/knowledge-base.service"

export default function NewArticlePage() {
  const router = useRouter()

  const [categories, setCategories] = useState<KBCategory[]>([])
  const [tags, setTags] = useState<KBTag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          getKBCategories(),
          getKBTags(),
        ])

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data)
        }

        if (tagsRes.success && tagsRes.data) {
          setTags(tagsRes.data)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load categories and tags",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ArticleEditor
      article={null}
      categories={categories}
      tags={tags}
      onClose={handleClose}
      onSave={handleSave}
    />
  )
}

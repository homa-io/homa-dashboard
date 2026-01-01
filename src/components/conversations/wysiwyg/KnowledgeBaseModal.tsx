"use client"

import React, { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, ExternalLink } from "lucide-react"
import type { KnowledgeBaseModalProps, KnowledgeBaseArticle } from "./types"

// Mock knowledge base articles
const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    id: "1",
    title: "How to Reset Your Password",
    summary: "Step-by-step guide to reset your account password",
    category: "Account Management",
    tags: ["password", "reset", "security"],
    url: "/kb/password-reset"
  },
  {
    id: "2",
    title: "Payment Failed - Troubleshooting Guide",
    summary: "Common reasons why payments fail and how to resolve them",
    category: "Billing",
    tags: ["payment", "billing", "failed", "troubleshooting"],
    url: "/kb/payment-failed"
  },
  {
    id: "3",
    title: "Understanding Your Invoice",
    summary: "Explanation of invoice details and billing cycles",
    category: "Billing",
    tags: ["invoice", "billing", "charges"],
    url: "/kb/invoice-explanation"
  },
  {
    id: "4",
    title: "Setting Up Two-Factor Authentication",
    summary: "Enable 2FA for enhanced account security",
    category: "Security",
    tags: ["2fa", "security", "authentication"],
    url: "/kb/two-factor-setup"
  },
  {
    id: "5",
    title: "API Rate Limits and Best Practices",
    summary: "Understanding API limits and optimization techniques",
    category: "Developer",
    tags: ["api", "rate-limits", "optimization"],
    url: "/kb/api-rate-limits"
  }
]

export function KnowledgeBaseModal({
  open,
  onOpenChange,
  onInsertArticle,
}: KnowledgeBaseModalProps) {
  const [search, setSearch] = useState('')

  const filteredArticles = useMemo(() => {
    return knowledgeBaseArticles.filter(article =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.summary.toLowerCase().includes(search.toLowerCase()) ||
      article.category.toLowerCase().includes(search.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    )
  }, [search])

  const handleInsert = (article: KnowledgeBaseArticle) => {
    onInsertArticle(article)
    setSearch('')
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (!isOpen) setSearch('')
    }}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Knowledge Base
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Articles List */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No articles found</p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleInsert(article)}
                  className="p-3 border border-border rounded-md hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {article.summary}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <div className="flex gap-1">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{article.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

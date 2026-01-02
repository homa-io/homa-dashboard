"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Save,
  Loader2,
  Database,
  RefreshCw,
  Trash2,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Search,
  FileText,
  Bug
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { apiClient } from "@/services/api-client"

interface RAGConfig {
  enabled: boolean
  embedding_model: string
  vector_size: number
  chunk_size: number
  chunk_overlap: number
  min_chunk_size: number
  score_threshold: number
  top_k: number
}

interface CollectionInfo {
  name: string
  exists: boolean
  vector_size: number
  points_count: number
  status: string
  distance: string
}

interface HealthResponse {
  healthy: boolean
  message: string
  collection?: CollectionInfo
}

interface StatsResponse {
  enabled: boolean
  indexed_article_count: number
  vector_count: number
  embedding_model: string
  vector_size: number
  chunk_size: number
  chunk_overlap: number
}

interface IndexedArticle {
  article_id: string
  title: string
  chunk_count: number
  total_tokens: number
}

interface SearchResult {
  article_id: string
  article_title: string
  chunk_content: string
  chunk_index: number
  score: number
}

const EMBEDDING_MODELS = [
  { value: "text-embedding-3-small", label: "text-embedding-3-small (1536 dims)", vectorSize: 1536 },
  { value: "text-embedding-3-large", label: "text-embedding-3-large (3072 dims)", vectorSize: 3072 },
  { value: "text-embedding-ada-002", label: "text-embedding-ada-002 (1536 dims)", vectorSize: 1536 },
  { value: "custom", label: "Custom Model", vectorSize: 0 },
]

export function RAGSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [reindexing, setReindexing] = useState(false)
  const [creatingCollection, setCreatingCollection] = useState(false)
  const [droppingCollection, setDroppingCollection] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isCustomModel, setIsCustomModel] = useState(false)

  const [config, setConfig] = useState<RAGConfig>({
    enabled: true,
    embedding_model: "text-embedding-3-small",
    vector_size: 1536,
    chunk_size: 500,
    chunk_overlap: 50,
    min_chunk_size: 100,
    score_threshold: 0.25,
    top_k: 5,
  })

  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [stats, setStats] = useState<StatsResponse | null>(null)

  // Debug tools state
  const [debugModalOpen, setDebugModalOpen] = useState(false)
  const [indexedArticles, setIndexedArticles] = useState<IndexedArticle[]>([])
  const [loadingArticles, setLoadingArticles] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [settingsRes, healthRes, statsRes] = await Promise.all([
        apiClient.get<RAGConfig>("/api/rag/settings"),
        apiClient.get<HealthResponse>("/api/rag/health"),
        apiClient.get<StatsResponse>("/api/rag/stats"),
      ])

      if (settingsRes.data) {
        setConfig(settingsRes.data)
        // Check if the model is a predefined one or custom
        const predefinedModel = EMBEDDING_MODELS.find(m => m.value === settingsRes.data.embedding_model && m.value !== "custom")
        setIsCustomModel(!predefinedModel)
      }
      if (healthRes.data) {
        setHealth(healthRes.data)
      }
      if (statsRes.data) {
        setStats(statsRes.data)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load RAG settings")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleModelChange = (value: string) => {
    if (value === "custom") {
      setIsCustomModel(true)
      // Keep current values or set defaults for custom
      setConfig(prev => ({
        ...prev,
        embedding_model: prev.embedding_model === "text-embedding-3-small" ||
                         prev.embedding_model === "text-embedding-3-large" ||
                         prev.embedding_model === "text-embedding-ada-002"
                         ? "" : prev.embedding_model,
        vector_size: prev.vector_size || 1536,
      }))
    } else {
      setIsCustomModel(false)
      const model = EMBEDDING_MODELS.find(m => m.value === value)
      setConfig(prev => ({
        ...prev,
        embedding_model: value,
        vector_size: model?.vectorSize || 1536,
      }))
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      await apiClient.post("/api/rag/settings", config)
      setSuccess("Settings saved successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleReindex = async () => {
    if (!confirm("This will reindex all published articles. This may take a while depending on the number of articles. Continue?")) {
      return
    }

    try {
      setReindexing(true)
      setError(null)
      setSuccess(null)

      const res = await apiClient.post<{ article_count: number }>("/api/rag/reindex")
      setSuccess(`Reindexing complete! ${res.data?.article_count || 0} articles indexed.`)
      await loadData()
    } catch (err: any) {
      setError(err.message || "Failed to reindex articles")
    } finally {
      setReindexing(false)
    }
  }

  const handleCreateCollection = async () => {
    try {
      setCreatingCollection(true)
      setError(null)
      setSuccess(null)

      await apiClient.post("/api/rag/create-collection")
      setSuccess("Collection created successfully!")
      await loadData()
    } catch (err: any) {
      setError(err.message || "Failed to create collection")
    } finally {
      setCreatingCollection(false)
    }
  }

  const handleDropCollection = async () => {
    if (!confirm("This will delete all indexed vectors. You will need to reindex all articles. Continue?")) {
      return
    }

    try {
      setDroppingCollection(true)
      setError(null)
      setSuccess(null)

      await apiClient.post("/api/rag/drop-collection")
      setSuccess("Collection dropped successfully!")
      await loadData()
    } catch (err: any) {
      setError(err.message || "Failed to drop collection")
    } finally {
      setDroppingCollection(false)
    }
  }

  const loadIndexedArticles = async () => {
    try {
      setLoadingArticles(true)
      const res = await apiClient.get<IndexedArticle[]>("/api/rag/indexed-articles")
      setIndexedArticles(res.data || [])
    } catch (err: any) {
      console.error("Failed to load indexed articles:", err)
    } finally {
      setLoadingArticles(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setSearching(true)
      setSearchError(null)
      setSearchResults(null)

      const res = await apiClient.post<SearchResult[]>("/api/rag/search", {
        query: searchQuery.trim(),
        limit: config.top_k || 5,
        score_threshold: config.score_threshold || 0.25,
      })
      setSearchResults(res.data || [])
    } catch (err: any) {
      setSearchError(err.message || "Search failed")
    } finally {
      setSearching(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <CardTitle className="text-base sm:text-lg">Vector Database Status</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Status */}
          <div className="flex items-center gap-2">
            {health?.healthy ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm">{health?.message || "Unknown status"}</span>
          </div>

          {/* Collection Info */}
          {health?.collection && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Collection</p>
                <p className="text-sm font-medium">{health.collection.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={health.collection.exists ? "default" : "secondary"}>
                  {health.collection.exists ? "Active" : "Not Created"}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vector Count</p>
                <p className="text-sm font-medium">{stats?.vector_count || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Indexed Articles</p>
                <p className="text-sm font-medium">{stats?.indexed_article_count || 0}</p>
              </div>
            </div>
          )}

          {/* Collection Actions */}
          <div className="flex gap-2 pt-2">
            {!health?.collection?.exists && (
              <Button
                size="sm"
                onClick={handleCreateCollection}
                disabled={creatingCollection}
              >
                {creatingCollection ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Create Collection
              </Button>
            )}
            {health?.collection?.exists && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReindex}
                  disabled={reindexing}
                >
                  {reindexing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Reindex All
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDropCollection}
                  disabled={droppingCollection}
                >
                  {droppingCollection ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Drop Collection
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">RAG Configuration</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Configure Retrieval-Augmented Generation for the knowledge base.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Enable Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Enable RAG</Label>
              <p className="text-xs text-muted-foreground">
                Enable vector search for the knowledge base. Articles will be automatically indexed when published.
              </p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          <Separator />

          {/* Embedding Model */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Embedding Model</Label>
            <Select
              value={isCustomModel ? "custom" : config.embedding_model}
              onValueChange={handleModelChange}
            >
              <SelectTrigger className="text-sm h-9 sm:h-10">
                <SelectValue placeholder="Select embedding model..." />
              </SelectTrigger>
              <SelectContent>
                {EMBEDDING_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              The model used to generate vector embeddings for articles. Changing this requires reindexing and recreating the collection.
            </p>
          </div>

          {/* Custom Model Name (only when custom is selected) */}
          {isCustomModel && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Custom Model Name</Label>
              <Input
                type="text"
                value={config.embedding_model}
                onChange={(e) => setConfig(prev => ({ ...prev, embedding_model: e.target.value }))}
                placeholder="e.g., text-embedding-3-small"
                className="text-sm h-9 sm:h-10"
              />
              <p className="text-xs text-muted-foreground flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                Enter the exact model name as used by the OpenAI API or your custom embedding provider.
              </p>
            </div>
          )}

          {/* Vector Size */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vector Size</Label>
            <Input
              type="number"
              min={1}
              max={10000}
              value={config.vector_size}
              disabled={!isCustomModel}
              onChange={(e) => setConfig(prev => ({ ...prev, vector_size: parseInt(e.target.value) || 1536 }))}
              className="text-sm h-9 sm:h-10 w-32"
            />
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {isCustomModel
                ? "The dimension size of the embedding vectors. Must match your custom model's output dimensions."
                : "The dimension size of the embedding vectors. Automatically set based on the selected model."
              }
            </p>
          </div>

          <Separator />

          {/* Chunk Size */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Chunk Size</Label>
            <Input
              type="number"
              min={100}
              max={4000}
              value={config.chunk_size}
              onChange={(e) => setConfig(prev => ({ ...prev, chunk_size: parseInt(e.target.value) || 500 }))}
              className="text-sm h-9 sm:h-10 w-32"
            />
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Maximum number of characters per chunk. Larger chunks provide more context but may reduce search precision. (100-4000)
            </p>
          </div>

          {/* Chunk Overlap */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Chunk Overlap</Label>
            <Input
              type="number"
              min={0}
              max={config.chunk_size - 1}
              value={config.chunk_overlap}
              onChange={(e) => setConfig(prev => ({ ...prev, chunk_overlap: parseInt(e.target.value) || 50 }))}
              className="text-sm h-9 sm:h-10 w-32"
            />
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Number of characters to overlap between chunks. Helps preserve context across chunk boundaries.
            </p>
          </div>

          {/* Min Chunk Size */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Minimum Chunk Size</Label>
            <Input
              type="number"
              min={10}
              max={config.chunk_size}
              value={config.min_chunk_size}
              onChange={(e) => setConfig(prev => ({ ...prev, min_chunk_size: parseInt(e.target.value) || 100 }))}
              className="text-sm h-9 sm:h-10 w-32"
            />
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Minimum characters required for a chunk to be indexed. Chunks smaller than this are skipped.
            </p>
          </div>

          <Separator />

          {/* Score Threshold */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Score Threshold</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={config.score_threshold}
              onChange={(e) => setConfig(prev => ({ ...prev, score_threshold: parseFloat(e.target.value) || 0.25 }))}
              className="text-sm h-9 sm:h-10 w-32"
            />
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Minimum similarity score (0-1) for a result to be included. Lower values (0.2-0.3) allow better multilingual matching.
            </p>
          </div>

          {/* Top K */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Top K Results</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={config.top_k}
              onChange={(e) => setConfig(prev => ({ ...prev, top_k: parseInt(e.target.value) || 5 }))}
              className="text-sm h-9 sm:h-10 w-32"
            />
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Maximum number of search results to return. Higher values provide more context but may include less relevant results.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {/* Debug Tools Button and Modal */}
            <Dialog open={debugModalOpen} onOpenChange={setDebugModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-sm h-9 sm:h-10">
                  <Bug className="w-4 h-4 mr-2" />
                  Debug Tools
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bug className="w-5 h-5" />
                    Debug Tools
                  </DialogTitle>
                  <DialogDescription>
                    Test and debug the RAG system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  {/* Search Test */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Test Search
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter a search query..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="text-sm h-9 sm:h-10"
                      />
                      <Button
                        size="sm"
                        onClick={handleSearch}
                        disabled={searching || !searchQuery.trim()}
                        className="h-9 sm:h-10"
                      >
                        {searching ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {searchError && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {searchError}
                      </div>
                    )}

                    {searchResults !== null && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                        </p>
                        {searchResults.length > 0 ? (
                          <ScrollArea className="h-64 rounded-md border">
                            <div className="p-3 space-y-3">
                              {searchResults.map((result, idx) => (
                                <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{result.article_title}</span>
                                    <Badge variant="outline" className="text-xs">
                                      Score: {(result.score * 100).toFixed(1)}%
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-3">
                                    {result.chunk_content}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Chunk #{result.chunk_index + 1}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground bg-muted/50 rounded-md">
                            No matching articles found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Indexed Articles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Indexed Articles
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadIndexedArticles}
                        disabled={loadingArticles}
                      >
                        {loadingArticles ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {indexedArticles.length > 0 ? (
                      <ScrollArea className="h-48 rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs">Title</TableHead>
                              <TableHead className="text-xs text-right w-20">Chunks</TableHead>
                              <TableHead className="text-xs text-right w-24">Tokens</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {indexedArticles.map((article) => (
                              <TableRow key={article.article_id}>
                                <TableCell className="text-xs font-medium">{article.title}</TableCell>
                                <TableCell className="text-xs text-right">{article.chunk_count}</TableCell>
                                <TableCell className="text-xs text-right">{article.total_tokens}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground bg-muted/50 rounded-md">
                        Click refresh to load indexed articles
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSave} disabled={saving} className="text-sm h-9 sm:h-10">
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

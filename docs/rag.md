# Retrieval-Augmented Generation (RAG) System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Current Implementation Status](#current-implementation-status)
4. [System Components](#system-components)
5. [Data Flow](#data-flow)
6. [Implementation Guide](#implementation-guide)
7. [Configuration](#configuration)
8. [API Reference](#api-reference)
9. [Best Practices](#best-practices)
10. [Roadmap](#roadmap)

---

## Overview

The RAG (Retrieval-Augmented Generation) system is a core feature that enables intelligent conversation support by:

1. **Indexing** knowledge base articles into a vector database (Qdrant)
2. **Retrieving** contextually relevant information when customers ask questions
3. **Augmenting** LLM responses with accurate KB content
4. **Reducing** hallucinations and improving response quality

This system transforms the knowledge base from passive documentation into an active intelligence layer that enhances agent responses and customer self-service.

### Strategic Value

- **Faster Resolutions:** Agents get instant KB article suggestions
- **Consistent Quality:** Responses grounded in verified information
- **Self-Service:** Customers find answers without agent intervention
- **Knowledge Leverage:** Every KB article actively helps multiple conversations
- **Product Insight:** Track which KB articles help most with what issues

---

## Architecture

### High-Level Flow

```
Frontend KB Editor
        ↓
REST API POST /api/admin/kb/articles
        ↓
Backend Article Processing
        ├─ GORM AfterCreate Hook
        ├─ Article Chunking (500 chars, 50 char overlap)
        ├─ Embedding Generation (OpenAI text-embedding-3-small)
        └─ Vector Storage in Qdrant
        ↓
Qdrant Vector Database (Port 6333)
        ├─ Collection: knowledge_base
        ├─ Vector Size: 1536 dimensions
        └─ Metadata: article_id, title, chunk content

Customer Message in Conversation
        ↓
Backend Question Processing
        ├─ Generate Query Embedding
        ├─ Vector Search in Qdrant
        ├─ Retrieve Top-K Relevant Chunks
        └─ Rank by Similarity Score
        ↓
LLM Context Augmentation
        ├─ Inject KB Context into System Prompt
        ├─ Send to LLM (GPT-4, Claude, etc.)
        └─ Generate Context-Aware Response
        ↓
Frontend
        ├─ Display Response
        ├─ Show KB Article Suggestions
        └─ Allow Agent to Reference KB
```

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Knowledge Base Manager (/knowledge-base/manage)  │  │
│  │ ├─ Article Editor (TipTap Rich Text)            │  │
│  │ ├─ Category Management (Hierarchical)           │  │
│  │ ├─ Tag Management                               │  │
│  │ ├─ Media Manager (Images, Videos, Documents)    │  │
│  │ └─ Publishing Workflow (Draft→Published)        │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓ REST API                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   BACKEND LAYER (Go)                    │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         API Controllers & Handlers               │  │
│  │  ├─ POST /api/admin/kb/articles (Create)         │  │
│  │  ├─ PUT /api/admin/kb/articles/{id} (Update)     │  │
│  │  ├─ DELETE /api/admin/kb/articles/{id} (Delete)  │  │
│  │  ├─ POST /api/rag/search (Search KB)             │  │
│  │  ├─ GET /api/rag/settings (Get config)           │  │
│  │  ├─ POST /api/rag/settings (Update config)       │  │
│  │  ├─ GET /api/rag/health (Health check)           │  │
│  │  └─ POST /api/rag/reindex (Reindex KB)           │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │           RAG Processing Package                  │  │
│  │  ├─ Chunker: Split articles into semantic chunks│  │
│  │  ├─ Embedder: Generate vectors via OpenAI API   │  │
│  │  ├─ Qdrant Client: Vector DB operations         │  │
│  │  ├─ Search: Semantic + Keyword search           │  │
│  │  └─ Indexer: GORM hooks for auto-indexing       │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Database Models (MySQL)                    │  │
│  │  ├─ KnowledgeBaseArticle                         │  │
│  │  ├─ KnowledgeBaseChunk (embeddings)              │  │
│  │  ├─ KnowledgeBaseCategory                        │  │
│  │  ├─ KnowledgeBaseTag                             │  │
│  │  └─ KnowledgeBaseMedia                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
        ↓ Embeddings API        ↓ Vector Operations
┌─────────────────────────┐  ┌──────────────────────────┐
│   OpenAI API            │  │  Qdrant Vector DB        │
│ (text-embedding-3-small)│  │  Port: 6333/6334         │
│ Vector Dim: 1536        │  │  Data: /data/qdrant      │
└─────────────────────────┘  └──────────────────────────┘
```

---

## Current Implementation Status

### ✅ Completed

1. **Database Models**
   - `KnowledgeBaseArticle` with GORM hooks
   - `KnowledgeBaseChunk` for storing text chunks
   - Proper relationships and indexing
   - Status: Draft/Published/Archived states

2. **Frontend KB Editor**
   - Rich text editor (TipTap)
   - Media management (Uppy)
   - Category hierarchy
   - Tag management
   - Publishing workflow

3. **Infrastructure**
   - Qdrant running on port 6333
   - Collection exists: `knowledge_base`
   - Vector size: 1536 (text-embedding-3-small)
   - Data persistence: `/data/qdrant`

4. **Logging & Observability**
   - Structured logging in GORM hooks (lib/log.Error)
   - Proper error context (article ID, error message)

### 🚧 Partial Implementation

1. **RAG Package** (apps/rag/)
   - Basic structure exists
   - Config management done
   - Health check endpoint exists
   - Missing: Chunking, embedding, search logic

2. **Search Functionality**
   - Score threshold fixed (0.25 from config)
   - Missing: Hybrid search (keyword + semantic)
   - Missing: Advanced filtering

### ❌ Not Yet Implemented

1. **Batch Indexing**
   - Bulk KB import with progress tracking
   - Batch embedding generation

2. **Search Analytics**
   - Track search queries
   - Track which KB articles help with what issues
   - Identify gaps in KB coverage

3. **KB Intelligence Features**
   - Auto-suggest KB articles in conversations
   - KB article recommendations for agents
   - Article freshness tracking
   - Article usage metrics

4. **Advanced RAG**
   - Hybrid search (BM25 + vector)
   - Multi-language embeddings
   - Custom embedding models
   - Re-ranking for better relevance

---

## System Components

### 1. Knowledge Base Articles (MySQL)

```sql
CREATE TABLE knowledge_base_articles (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    summary TEXT,
    featured_image VARCHAR(500),
    category_id CHAR(36),
    author_id CHAR(36),
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
    featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    helpful_yes INT DEFAULT 0,
    helpful_no INT DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Key Fields:**
- `slug`: Unique identifier for URLs
- `status`: Controls indexing (only published articles indexed)
- `view_count`: Analytics on article utility
- `helpful_yes/no`: Customer satisfaction feedback

### 2. Article Chunks (MySQL)

```sql
CREATE TABLE knowledge_base_chunks (
    id CHAR(36) PRIMARY KEY,
    article_id CHAR(36) NOT NULL,
    content TEXT NOT NULL, -- 500-char chunks
    chunk_index INT NOT NULL, -- 0-based index
    token_count INT DEFAULT 0, -- For cost tracking
    embedding BLOB, -- Binary vector (1536 floats)
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Purpose:**
- Store semantic chunks of articles (not full articles)
- Each chunk embeddings independently in Qdrant
- Allows granular search results (exact relevant section)

### 3. Qdrant Vector Database

**Collection Schema:**
```
Collection: knowledge_base
├─ Vector Size: 1536 (text-embedding-3-small)
├─ Vector Index: HNSW (Hierarchical Navigable Small World)
├─ Distance Metric: Cosine Similarity
└─ Payload:
    ├─ article_id (UUID)
    ├─ article_title (string)
    ├─ chunk_index (int)
    ├─ chunk_content (string)
    └─ created_at (timestamp)
```

**Example Point:**
```json
{
    "id": "chunk_uuid_123",
    "vector": [0.123, 0.456, ..., 0.789], // 1536 dimensions
    "payload": {
        "article_id": "article_uuid_456",
        "article_title": "How to Reset Password",
        "chunk_index": 2,
        "chunk_content": "To reset your password: 1) Click 'Forgot Password'...",
        "created_at": "2024-01-02T10:30:00Z"
    }
}
```

### 4. RAG Package Structure

```
apps/rag/
├─ app.go           # Initialization and setup
├─ config.go        # Configuration management
├─ controller.go    # HTTP handlers
├─ search.go        # Search logic (partial)
├─ indexer.go       # Indexing logic (needs work)
├─ chunker.go       # Chunking logic (needs implementation)
└─ qdrant.go        # Qdrant client (skeleton)
```

---

## Data Flow

### 1. Article Creation/Update Flow

```
Editor creates article in UI
        ↓
POST /api/admin/kb/articles
{
    "title": "How to Reset Password",
    "content": "Long article content...",
    "category_id": "...",
    "status": "published",  // Triggers indexing
    "tags": ["password", "account"]
}
        ↓
Backend validates and saves to MySQL
        ↓
GORM AfterCreate Hook Triggered
        ├─ Check: article.Status == "published" ?
        ├─ If true: Queue for indexing
        └─ If false: Skip (draft/archived don't index)
        ↓
RAG Indexing Process
├─ Chunking: Split into ~500 char chunks
│   Input: "Long article content..."
│   Output: [chunk_1, chunk_2, chunk_3]
│
├─ Token Counting: Count tokens for each chunk
│   Uses: tiktoken library
│   Purpose: Cost tracking & UI info
│
├─ Embedding Generation: Call OpenAI API
│   For each chunk:
│   - POST to https://api.openai.com/v1/embeddings
│   - Model: text-embedding-3-small
│   - Response: 1536-dim vector
│
├─ Store in MySQL: Save chunk + embedding
│   INSERT into knowledge_base_chunks (
│       article_id, content, chunk_index,
│       token_count, embedding
│   )
│
└─ Store in Qdrant: Index vector + metadata
    POST http://qdrant:6333/collections/knowledge_base/points
    {
        "points": [{
            "id": "chunk_uuid",
            "vector": [0.123, ...],
            "payload": {
                "article_id": "article_uuid",
                "article_title": "How to Reset Password",
                "chunk_content": "First 500 chars of chunk...",
                "chunk_index": 0
            }
        }]
    }
        ↓
Frontend receives confirmation
✓ Article published and indexed
```

### 2. Article Update Flow

```
Editor edits existing article
        ↓
PUT /api/admin/kb/articles/{id}
        ↓
Backend updates MySQL record
        ↓
GORM AfterUpdate Hook Triggered
├─ If status changed to "published":
│   └─ Re-index entire article
│       ├─ Delete old chunks from MySQL + Qdrant
│       └─ Chunk, embed, and store new content
│
└─ If status changed away from "published":
    └─ Delete from Qdrant index
        (Keep in MySQL for history)
```

### 3. Article Deletion Flow

```
Editor deletes article
        ↓
DELETE /api/admin/kb/articles/{id}
        ↓
Backend soft-deletes in MySQL (if soft-delete enabled)
        ↓
GORM AfterDelete Hook Triggered
├─ Delete all chunks from MySQL
├─ Delete all vectors from Qdrant
└─ Log deletion for audit trail
        ↓
Article removed from search results
```

### 4. Search Query Flow

```
Customer/Agent asks: "How do I reset my password?"
        ↓
Frontend sends search query
        ↓
POST /api/rag/search
{
    "query": "How do I reset my password?",
    "limit": 5,
    "score_threshold": 0.25  // From config
}
        ↓
Backend processes
├─ Generate embedding for query
│   POST to OpenAI API
│   Input: "How do I reset my password?"
│   Output: 1536-dim vector
│
├─ Search in Qdrant
│   POST http://qdrant:6333/collections/knowledge_base/search
│   {
│       "vector": [query_vector],
│       "limit": 5,
│       "score_threshold": 0.25
│   }
│
└─ Result: Top 5 chunks with scores
    [
        {
            "article_id": "uuid1",
            "article_title": "How to Reset Password",
            "chunk_content": "To reset your password...",
            "chunk_index": 0,
            "score": 0.87  // Cosine similarity
        },
        ...
    ]
        ↓
Return to Frontend
├─ Display KB article suggestions
├─ Show relevance scores
└─ Allow agent to view full article
        ↓
AI Context Augmentation (Optional)
├─ If using AI for response:
│   ├─ Inject KB chunks into system prompt
│   ├─ Send to LLM
│   └─ Generate context-grounded response
```

---

## Implementation Guide

### Phase 1: Complete Core RAG Package

#### 1.1 Implement Chunker (`apps/rag/chunker.go`)

```go
package rag

import (
    "strings"
)

type ChunkerConfig struct {
    ChunkSize   int // Default: 500
    ChunkOverlap int // Default: 50
    MinChunkSize int // Default: 100
}

type Chunk struct {
    Index    int
    Content  string
    Tokens   int
}

// ChunkArticle splits article content into semantic chunks
func ChunkArticle(content string, config ChunkerConfig) ([]Chunk, error) {
    // Algorithm:
    // 1. Split by sentences
    // 2. Group sentences into chunks of ChunkSize
    // 3. Add overlap (last ChunkOverlap chars of previous chunk)
    // 4. Filter out chunks smaller than MinChunkSize
    // 5. Trim whitespace

    chunks := []Chunk{}

    // TODO: Implement semantic sentence splitting
    // Consider: Use split by ". ", "\n", etc.

    return chunks, nil
}

// EstimateTokens estimates token count using tiktoken
func EstimateTokens(text string) int {
    // Rough estimation: ~4 chars = 1 token
    // For accuracy: Use tiktoken library
    return len(text) / 4
}
```

#### 1.2 Implement Embedder

```go
// EmbedChunk generates vector embedding for a chunk
func EmbedChunk(content string) ([]float32, error) {
    // 1. Validate OpenAI API is configured
    // 2. Make API request to OpenAI
    // 3. Extract vector from response
    // 4. Return 1536-dim vector

    client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))

    resp, err := client.CreateEmbeddings(context.Background(), openai.EmbeddingRequest{
        Input: []string{content},
        Model: openai.SmallEmbedding3,
    })

    if err != nil {
        log.Error("Failed to create embedding: %v", err)
        return nil, err
    }

    // Convert []float32 from response
    return resp.Data[0].Embedding, nil
}

// EmbedBatch generates embeddings for multiple chunks
func EmbedBatch(chunks []string) ([][]float32, error) {
    // Call OpenAI API with multiple inputs
    // More efficient than single calls
    // Respects rate limits
}
```

#### 1.3 Implement Qdrant Client (`apps/rag/qdrant.go`)

```go
package rag

import (
    "github.com/qdrant/go-client/qdrant"
)

type QdrantClient struct {
    client *qdrant.Client
}

// NewQdrantClient creates connection to Qdrant
func NewQdrantClient(host string, port int) (*QdrantClient, error) {
    client, err := qdrant.NewClient(&qdrant.Config{
        Host: host,
        Port: port,
    })
    return &QdrantClient{client: client}, err
}

// IndexChunks stores chunks in Qdrant
func (q *QdrantClient) IndexChunks(articleID string, chunks []Chunk, embeddings [][]float32) error {
    // For each chunk:
    // 1. Create point with vector + payload
    // 2. Batch upload to Qdrant
    // 3. Handle errors gracefully

    points := []qdrant.PointStruct{}

    for i, chunk := range chunks {
        point := qdrant.PointStruct{
            Id: generateID(), // UUID
            Vector: embeddings[i],
            Payload: map[string]interface{}{
                "article_id": articleID,
                "chunk_index": i,
                "chunk_content": chunk.Content,
                // Add more metadata
            },
        }
        points = append(points, point)
    }

    _, err := q.client.Upsert(context.Background(), &qdrant.UpsertPoints{
        CollectionName: "knowledge_base",
        Points: points,
    })

    return err
}

// Search finds relevant chunks for a query
func (q *QdrantClient) Search(queryVector []float32, limit int, scoreThreshold float32) ([]SearchResult, error) {
    // 1. Make search request to Qdrant
    // 2. Filter by score_threshold
    // 3. Return top-K results with payloads
    // 4. Handle errors
}

// DeleteArticleChunks removes all chunks for an article
func (q *QdrantClient) DeleteArticleChunks(articleID string) error {
    // Delete by filter: article_id == articleID
}

// Health checks Qdrant connectivity
func (q *QdrantClient) Health() (bool, error) {
    // Make health check request
}
```

#### 1.4 Implement Search Logic (`apps/rag/search.go`)

```go
// Search implements semantic search with filters
func Search(query string, limit int, scoreThreshold float32) ([]ArticleSearchResult, error) {
    // 1. Generate query embedding
    queryEmbedding, err := EmbedChunk(query)
    if err != nil {
        return nil, fmt.Errorf("failed to embed query: %w", err)
    }

    // 2. Search in Qdrant
    qdrant := GetQdrantClient()
    results, err := qdrant.Search(queryEmbedding, limit, scoreThreshold)
    if err != nil {
        return nil, fmt.Errorf("failed to search: %w", err)
    }

    // 3. Convert results to domain model
    var searchResults []ArticleSearchResult
    for _, r := range results {
        searchResults = append(searchResults, ArticleSearchResult{
            ArticleID: r.Payload["article_id"].(string),
            ArticleTitle: r.Payload["article_title"].(string),
            ChunkContent: r.Payload["chunk_content"].(string),
            ChunkIndex: r.Payload["chunk_index"].(int),
            Score: r.Score,
        })
    }

    return searchResults, nil
}

// HybridSearch combines keyword + semantic search
func HybridSearch(query string, limit int) ([]ArticleSearchResult, error) {
    // 1. Semantic search (vector)
    semanticResults, err := Search(query, limit, 0.25)
    if err != nil {
        return nil, err
    }

    // 2. Keyword search (BM25) in MySQL
    keywordResults, err := KeywordSearch(query, limit)
    if err != nil {
        return nil, err
    }

    // 3. Merge and re-rank
    merged := MergeResults(semanticResults, keywordResults)
    return merged, nil
}
```

### Phase 2: Add Advanced Features

#### 2.1 Batch Indexing with Progress

```go
// ReindexAllArticles reindexes all published articles
func ReindexAllArticles(ctx context.Context) error {
    // 1. Fetch all published articles
    // 2. For each article:
    //    a. Chunk content
    //    b. Generate embeddings
    //    c. Store in Qdrant
    // 3. Track progress for UI

    articles, err := models.GetPublishedArticles()
    if err != nil {
        return err
    }

    total := len(articles)
    processed := 0

    for _, article := range articles {
        // Process article
        chunks, err := ChunkArticle(article.Content, GetConfig())
        embeddings, err := EmbedBatch(ChunkToStrings(chunks))
        err = GetQdrantClient().IndexChunks(article.ID, chunks, embeddings)

        processed++
        // Update progress: processed/total

        if err != nil {
            log.Error("Failed to index article %s: %v", article.ID, err)
            continue
        }
    }

    return nil
}
```

#### 2.2 Search Analytics

```go
// TrackSearch logs search queries for analytics
func TrackSearch(query string, results []ArticleSearchResult) error {
    searchLog := &models.RAGSearchLog{
        ID: uuid.New(),
        Query: query,
        ResultCount: len(results),
        TopArticleID: results[0].ArticleID if len(results) > 0,
        CreatedAt: time.Now(),
    }

    return db.Create(searchLog).Error
}

// GetSearchAnalytics returns insights on KB usage
func GetSearchAnalytics(timeRange string) (*RAGAnalytics, error) {
    // Query search logs
    // Calculate: most searched queries, top articles, search volume trends

    analytics := &RAGAnalytics{
        TotalSearches: 0,
        AverageResults: 0.0,
        MostSearchedTopics: []string{},
        TopArticles: []ArticleMetric{},
    }

    return analytics, nil
}
```

#### 2.3 Article Suggestions in Conversations

```go
// SuggestArticles returns KB articles relevant to conversation
func SuggestArticles(conversationID string, limit int) ([]ArticleSearchResult, error) {
    // 1. Get last message in conversation
    lastMessage, err := models.GetLastMessage(conversationID)
    if err != nil {
        return nil, err
    }

    // 2. Search KB for relevant articles
    results, err := Search(lastMessage.Content, limit, 0.5)
    if err != nil {
        return nil, err
    }

    return results, nil
}
```

---

## Configuration

### Backend Config (`config.yml`)

```yaml
rag:
  enabled: true
  embedding_model: "text-embedding-3-small"
  vector_size: 1536
  chunk_size: 500        # Characters per chunk
  chunk_overlap: 50      # Overlap for context
  min_chunk_size: 100    # Minimum chunk size
  score_threshold: 0.25  # Minimum relevance score
  top_k: 5               # Default search results

qdrant:
  host: localhost
  port: 6333
  collection: knowledge_base
  recreate_collection: false

openai:
  api_key: ${OPENAI_API_KEY}
  embedding_model: text-embedding-3-small
```

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...

# Optional (defaults provided)
QDRANT_HOST=localhost
QDRANT_PORT=6333
RAG_CHUNK_SIZE=500
RAG_CHUNK_OVERLAP=50
RAG_SCORE_THRESHOLD=0.25
```

---

## API Reference

### Search Endpoint

**POST `/api/rag/search`**

Request:
```json
{
    "query": "How do I reset my password?",
    "limit": 5,
    "score_threshold": 0.25
}
```

Response:
```json
{
    "results": [
        {
            "article_id": "uuid-1",
            "article_title": "How to Reset Password",
            "chunk_content": "First 500 chars of relevant chunk...",
            "chunk_index": 0,
            "score": 0.87
        },
        ...
    ]
}
```

### Settings Endpoints

**GET `/api/rag/settings`**

Returns current RAG configuration:
```json
{
    "enabled": true,
    "embedding_model": "text-embedding-3-small",
    "vector_size": 1536,
    "chunk_size": 500,
    "chunk_overlap": 50,
    "score_threshold": 0.25,
    "top_k": 5
}
```

**POST `/api/rag/settings`**

Update RAG configuration.

### Health Check

**GET `/api/rag/health`**

Returns system health:
```json
{
    "healthy": true,
    "message": "RAG system is healthy",
    "collection": {
        "exists": true,
        "count": 1250,
        "created_at": "2024-01-02T10:00:00Z"
    }
}
```

### Reindex

**POST `/api/rag/reindex`**

Triggers background reindexing of all published articles.

**GET `/api/rag/reindex-status`**

Get reindex job status:
```json
{
    "in_progress": false,
    "total_articles": 45,
    "processed_articles": 45,
    "failed_articles": 0,
    "started_at": "2024-01-02T10:00:00Z",
    "completed_at": "2024-01-02T10:15:30Z"
}
```

---

## Best Practices

### 1. Article Writing for RAG

**Do:**
- Write self-contained chunks (each chunk should make sense alone)
- Use clear section headers
- Include examples and code snippets
- Keep paragraphs short
- Use lists for procedures
- Add metadata tags for categorization

**Don't:**
- Write articles that depend on previous context
- Use vague pronouns without antecedents
- Include sensitive information
- Write extremely long articles without headers

**Example Structure:**
```markdown
# How to Reset Your Password

## Step-by-step guide

1. Click "Forgot Password" on the login page
2. Enter your email address
3. Check your email for the reset link
4. Click the link and set a new password
5. Log in with your new password

## Common issues

### I didn't receive the email
- Check spam folder
- Try resending after 5 minutes
- Contact support if still missing
```

### 2. Chunking Strategy

**Goal:** Each chunk should be:
- **Semantically complete** - make sense on its own
- **Similar in length** - consistent context window
- **Non-overlapping in information** - no redundant chunks
- **Retrievable** - size for relevant results

**Config Tuning:**
```
Small chunks (100-300 chars):
  ✓ Very specific results
  ✗ Might miss context
  ✗ More API calls

Large chunks (800-1000 chars):
  ✓ Full context
  ✗ Less precise
  ✗ Slower search

Sweet spot: 500 chars, 50 overlap
```

### 3. Embedding Model Selection

**text-embedding-3-small** (current):
- 1536 dimensions
- Fast inference
- Good for English
- ~10x cheaper than large

**text-embedding-3-large**:
- 3072 dimensions
- Better accuracy
- Higher cost
- Use if quality is critical

**Custom embeddings**:
- Fine-tune for your domain
- Expensive but worth for specialized KB
- Examples: medical, legal, technical

### 4. Search Quality Optimization

**Score Threshold Tuning:**
```
Threshold 0.75: Very strict, only exact matches
Threshold 0.50: Balanced (recommended for most)
Threshold 0.25: Loose, might include irrelevant results
Threshold 0.10: Very permissive, low quality results
```

**Test & Measure:**
- Track which searches return useful results
- Measure agent satisfaction with suggestions
- Adjust threshold based on metrics
- Log all searches for analysis

### 5. Performance Considerations

**Indexing:**
- Run reindexing during off-peak hours
- Use batch embedding (more efficient)
- Monitor OpenAI API quota
- Estimate costs upfront

**Search:**
- Cache popular queries (Redis)
- Use pagination for large result sets
- Implement search timeouts (5s max)
- Monitor search latency

---

## Roadmap

### Phase 1: Core Implementation (Weeks 1-3)
- [ ] Complete Chunker implementation
- [ ] Implement Embedder with batching
- [ ] Finish Qdrant client
- [ ] Implement Search endpoint
- [ ] Add unit tests
- [ ] Test end-to-end flow

### Phase 2: Advanced Search (Weeks 4-5)
- [ ] Implement Hybrid search (semantic + keyword)
- [ ] Add filtering by category/tags
- [ ] Implement ranking/reranking
- [ ] Add search caching

### Phase 3: Intelligence (Weeks 6-8)
- [ ] Batch indexing with progress tracking
- [ ] Search analytics dashboard
- [ ] Article suggestion widget
- [ ] Track which articles help most

### Phase 4: Production Readiness (Weeks 9-10)
- [ ] Error handling & retries
- [ ] Rate limiting
- [ ] Monitoring & alerts
- [ ] Documentation
- [ ] Performance testing

### Phase 5: Advanced Features (Future)
- [ ] Multi-language support
- [ ] Custom embedding models
- [ ] Article versioning & rollback
- [ ] KB health scoring
- [ ] Automated article generation from support tickets

---

## Troubleshooting

### Issue: "Qdrant connection refused"
**Solution:**
- Check Qdrant is running: `curl localhost:6333/health`
- Verify port in config matches: `qdrant.port: 6333`
- Check firewall rules

### Issue: "Embedding API rate limit"
**Solution:**
- Implement batch embedding (up to 2048 chunks)
- Add retry logic with exponential backoff
- Use cheaper embedding model temporarily
- Monitor quota at api.openai.com

### Issue: "Search results not relevant"
**Solution:**
- Lower score_threshold (0.25 → 0.20)
- Check article content is good
- Verify embeddings were created
- Check search query is clear

### Issue: "Articles not indexing"
**Solution:**
- Check GORM hooks are registered
- Verify article.status == "published"
- Check MySQL/Qdrant connectivity
- Review logs for errors

---

## References

- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [RAG Implementation Best Practices](https://www.langchain.com/)
- [Vector Databases Overview](https://www.pinecone.io/)

---

**Last Updated:** January 2, 2024
**Maintainer:** Engineering Team
**Status:** In Development (Phase 1)

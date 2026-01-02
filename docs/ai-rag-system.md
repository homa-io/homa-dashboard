# AI RAG System - Implementation Guide

## Overview

This document outlines the implementation of a Retrieval-Augmented Generation (RAG) system for the Homa knowledge base. The system enables AI agents to search and retrieve relevant knowledge base articles to answer user questions.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Dashboard (Frontend)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Settings > RAG  │  │ Knowledge Base  │  │   Bot Designer  │  │
│  │  - Config       │  │  - Articles     │  │   (Future)      │  │
│  │  - Health       │  │  - CRUD Ops     │  │                 │  │
│  │  - Reindex      │  │                 │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ REST API
┌────────────────────────────────┴────────────────────────────────┐
│                        Backend (Go)                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   RAG Package   │  │   AI Package    │  │  Models Package │  │
│  │  - Chunking     │  │  - OpenAI       │  │  - Article      │  │
│  │  - Embedding    │  │  - Embedding    │  │  - Chunks       │  │
│  │  - Qdrant       │  │  - Chat         │  │  - GORM Hooks   │  │
│  │  - Search       │  │                 │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────┴────────────────────────────────┐
│                      External Services                           │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │     Qdrant      │  │     OpenAI      │                       │
│  │  Vector DB      │  │   Embeddings    │                       │
│  │  Port: 6333     │  │   API           │                       │
│  │  /data/qdrant   │  │                 │                       │
│  └─────────────────┘  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Current State

### Already Implemented

1. **Qdrant Docker Service**
   - Running on port 6333/6334
   - Data stored at `/data/qdrant`
   - Status: Running (no collections yet)

2. **Knowledge Base Models** (`/home/evo/homa-backend/apps/models/knowledge_base.go`)
   - `KnowledgeBaseArticle` - Main article model with GORM hooks
   - `KnowledgeBaseChunk` - Stores text chunks with embedding blob
   - `KnowledgeBaseIndexer` interface - For dependency injection
   - GORM hooks: `AfterCreate`, `AfterUpdate`, `AfterDelete` - Trigger indexing

3. **Config.yml** (`/home/evo/config/homa-backend/config.yml`)
   - Has `ASSISTANT` section with OpenAI API key
   - Has `EMBEDDING_MODEL: "text-embedding-3-small"`

### Needs Implementation

1. **RAG Package** (`/home/evo/homa-backend/apps/rag/`)
   - Qdrant client wrapper
   - Chunking logic
   - Embedding generation
   - Vector search
   - Indexer implementation

2. **RAG Settings API**
   - GET/POST settings for chunk size, overlap, etc.
   - Health check endpoint
   - Reindex endpoint

3. **Dashboard UI** (`/home/evo/homa-dashboard/`)
   - RAG Settings page under Settings
   - Collection health display
   - Reindex button

---

## Implementation Steps

### Phase 1: Backend RAG Package

#### Step 1.1: Add Qdrant Config to config.yml

```yaml
QDRANT:
  URL: "http://localhost:6333"
  COLLECTION_NAME: "knowledge_base"
  API_KEY: ""  # Optional, for Qdrant Cloud

RAG:
  ENABLED: true
  EMBEDDING_MODEL: "text-embedding-3-small"
  VECTOR_SIZE: 1536              # Depends on embedding model
  CHUNK_SIZE: 500                # Characters per chunk
  CHUNK_OVERLAP: 50              # Overlap between chunks
  MIN_CHUNK_SIZE: 100            # Minimum chunk size
```

#### Step 1.2: Create RAG Package Structure

```
/home/evo/homa-backend/apps/rag/
├── app.go           # Package init, routes
├── config.go        # Load config from settings
├── qdrant.go        # Qdrant client wrapper
├── chunker.go       # Text chunking logic
├── embedder.go      # Generate embeddings via OpenAI
├── indexer.go       # Implements KnowledgeBaseIndexer
├── search.go        # Vector search functions
└── handlers.go      # HTTP handlers for API
```

#### Step 1.3: Implement Core Functions

**Chunker** - Split article content into chunks:
```go
type Chunk struct {
    Content    string
    Index      int
    TokenCount int
}

func ChunkText(content string, chunkSize, overlap int) []Chunk
```

**Embedder** - Generate embeddings:
```go
func GetEmbedding(text string) ([]float32, error)
func GetEmbeddings(texts []string) ([][]float32, error)
```

**Qdrant Client**:
```go
func InitCollection(name string, vectorSize int) error
func UpsertPoints(collectionName string, points []QdrantPoint) error
func DeletePoints(collectionName string, articleID string) error
func Search(collectionName string, vector []float32, limit int) ([]SearchResult, error)
func GetCollectionInfo(name string) (*CollectionInfo, error)
func DropCollection(name string) error
```

**Indexer** (implements `models.KnowledgeBaseIndexer`):
```go
type ArticleIndexer struct{}

func (i *ArticleIndexer) IndexArticle(articleID uuid.UUID) error {
    // 1. Fetch article from DB
    // 2. Strip HTML from content
    // 3. Chunk the content
    // 4. Generate embeddings for each chunk
    // 5. Store chunks in DB (knowledge_base_chunks)
    // 6. Upsert vectors to Qdrant
}

func (i *ArticleIndexer) DeleteArticleIndex(articleID uuid.UUID) error {
    // 1. Delete chunks from DB
    // 2. Delete vectors from Qdrant
}
```

#### Step 1.4: Create API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rag/settings` | Get current RAG settings |
| POST | `/api/rag/settings` | Update RAG settings |
| GET | `/api/rag/health` | Get Qdrant connection and collection status |
| POST | `/api/rag/reindex` | Reindex all published articles |
| POST | `/api/rag/search` | Search vector database |

**Settings Response**:
```json
{
  "enabled": true,
  "embedding_model": "text-embedding-3-small",
  "vector_size": 1536,
  "chunk_size": 500,
  "chunk_overlap": 50,
  "min_chunk_size": 100
}
```

**Health Response**:
```json
{
  "qdrant_connected": true,
  "collection_exists": true,
  "collection_name": "knowledge_base",
  "configured_vector_size": 1536,
  "actual_vector_size": 1536,
  "vector_size_match": true,
  "points_count": 1234,
  "indexed_articles_count": 45,
  "status": "healthy"
}
```

**Search Request**:
```json
{
  "query": "How do I reset my password?",
  "limit": 5,
  "score_threshold": 0.7
}
```

**Search Response**:
```json
{
  "results": [
    {
      "article_id": "uuid",
      "article_title": "Password Reset Guide",
      "chunk_content": "To reset your password...",
      "score": 0.92
    }
  ]
}
```

---

### Phase 2: Dashboard UI

#### Step 2.1: Create RAG Settings Component

Location: `/home/evo/homa-dashboard/src/components/settings/general/RAGSettings.tsx`

**UI Elements**:

1. **Enable RAG** (Toggle)
   - Description: "Enable AI-powered search for knowledge base articles"

2. **Embedding Model** (Select)
   - Options: `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`
   - Description: "The OpenAI model used to convert text into vectors. Smaller models are faster and cheaper."

3. **Vector Size** (Input, read-only)
   - Description: "Automatically set based on the embedding model. text-embedding-3-small = 1536 dimensions."

4. **Chunk Size** (Input, number)
   - Default: 500
   - Description: "Maximum characters per chunk. Larger chunks provide more context but may be less precise."

5. **Chunk Overlap** (Input, number)
   - Default: 50
   - Description: "Characters of overlap between chunks. Helps maintain context across chunk boundaries."

6. **Min Chunk Size** (Input, number)
   - Default: 100
   - Description: "Minimum characters for a chunk. Chunks smaller than this are merged with previous."

#### Step 2.2: Qdrant Health Section

**UI Elements**:

1. **Connection Status** (Badge: green/red)
   - Shows if Qdrant is reachable

2. **Collection Status** (Badge: exists/missing/misconfigured)
   - Shows if collection exists and matches config

3. **Vector Size Match** (Badge: match/mismatch)
   - Warning if configured size differs from actual

4. **Indexed Points** (Number)
   - Total vectors in collection

5. **Indexed Articles** (Number)
   - Count of articles in index

6. **Actions**:
   - **Create Collection** button (if missing)
   - **Drop & Recreate** button (if misconfigured or to reset)
   - **Reindex All Articles** button (with progress indicator)

---

### Phase 3: Integration & Testing

#### Step 3.1: Wire Up GORM Hooks

In `main.go` or app initialization:
```go
import "github.com/iesreza/homa-backend/apps/rag"

func init() {
    // Initialize RAG package
    rag.Setup()

    // Set the indexer on models package
    models.SetKnowledgeBaseIndexer(rag.GetIndexer())
}
```

#### Step 3.2: Test Flow

1. Create/publish an article
2. Verify chunks are created in `knowledge_base_chunks` table
3. Verify vectors are stored in Qdrant
4. Test search API with relevant query
5. Test edit/delete propagation

---

## Configuration Reference

### Embedding Models

| Model | Vector Size | Notes |
|-------|-------------|-------|
| text-embedding-3-small | 1536 | Recommended - good balance |
| text-embedding-3-large | 3072 | Higher quality, more storage |
| text-embedding-ada-002 | 1536 | Legacy model |

### Chunk Size Guidelines

| Content Type | Recommended Chunk Size |
|--------------|----------------------|
| Short Q&A articles | 300-400 |
| Tutorial articles | 500-600 |
| Technical docs | 600-800 |

### Default Settings

```yaml
RAG:
  ENABLED: true
  EMBEDDING_MODEL: "text-embedding-3-small"
  VECTOR_SIZE: 1536
  CHUNK_SIZE: 500
  CHUNK_OVERLAP: 50
  MIN_CHUNK_SIZE: 100
```

---

## Database Schema

### knowledge_base_chunks

| Column | Type | Description |
|--------|------|-------------|
| id | CHAR(36) | Primary key |
| article_id | CHAR(36) | FK to knowledge_base_articles |
| content | TEXT | Chunk text content |
| chunk_index | INT | Order within article |
| token_count | INT | Approx token count |
| embedding | BLOB | Raw embedding bytes (optional backup) |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Update timestamp |

### Settings Keys

| Key | Default | Description |
|-----|---------|-------------|
| `rag.enabled` | `true` | Enable/disable RAG |
| `rag.embedding_model` | `text-embedding-3-small` | OpenAI embedding model |
| `rag.vector_size` | `1536` | Vector dimensions |
| `rag.chunk_size` | `500` | Max chars per chunk |
| `rag.chunk_overlap` | `50` | Overlap between chunks |
| `rag.min_chunk_size` | `100` | Min chars for chunk |

---

## API Quick Reference

### Backend APIs

```bash
# Get RAG settings
GET /api/rag/settings

# Update RAG settings
POST /api/rag/settings
Content-Type: application/json
{"chunk_size": 600, "chunk_overlap": 75}

# Check Qdrant health
GET /api/rag/health

# Reindex all articles
POST /api/rag/reindex

# Search knowledge base
POST /api/rag/search
Content-Type: application/json
{"query": "password reset", "limit": 5}
```

### Internal Go Functions

```go
// Search for relevant chunks
results, err := rag.Search("user question here", 5)

// Index a specific article
err := rag.IndexArticle(articleID)

// Delete article from index
err := rag.DeleteArticleIndex(articleID)

// Get collection info
info, err := rag.GetCollectionInfo()

// Recreate collection
err := rag.RecreateCollection()
```

---

## Progress Log

### Session 1 - Initial Setup (Current)

**Status**: Documentation created

**Findings**:
- Qdrant already running on ports 6333-6334
- Data mounted at `/data/qdrant`
- No collections exist yet
- Knowledge base models have chunk support built in
- GORM hooks ready but indexer not implemented
- OpenAI API key configured
- Embedding model configured: `text-embedding-3-small`

**Next Steps**:
1. Add QDRANT and RAG sections to config.yml
2. Create `/home/evo/homa-backend/apps/rag/` package
3. Implement Qdrant client
4. Implement chunker
5. Implement embedder
6. Implement indexer
7. Create API handlers
8. Create dashboard UI

---

## Notes

- Vector embeddings are stored in Qdrant, not MySQL (BLOB field in chunks table is optional backup)
- Each chunk gets a unique UUID that maps to Qdrant point ID
- Article deletion cascades to chunk deletion via GORM hooks
- Reindexing drops all vectors for an article before re-adding
- Search returns top-k chunks with relevance scores

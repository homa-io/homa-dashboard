# Backend API Exploration Summary

Complete exploration and analysis of the Homa backend API structure.

**Date:** November 21, 2025
**Explorer:** Claude Code
**Thoroughness Level:** Very Thorough

---

## Executive Summary

The Homa backend is a comprehensive intelligent support system API built with the Evo v2 framework in Go. It provides a complete RESTful API with JWT-based authentication, OAuth support (Google/Microsoft), and full CRUD operations for tickets, users, departments, clients, messages, tags, and channels.

---

## API Specification

### OpenAPI/Swagger
- **Format:** OpenAPI 3.0.3
- **File Location:** `/home/evo/homa-backend/swagger.json`
- **Total Endpoints:** 60+
- **Size:** 82KB

### Version Information
- **API Version:** 1.0.0
- **Framework:** Evo v2
- **Language:** Go
- **Database:** MySQL

---

## Server Configuration

### Development
```yaml
Base URL: http://localhost:8000
Port: 8000
Host: 0.0.0.0
```

### Database
```yaml
Type: MySQL
Default Host: 127.0.0.1:3306
Default Database: homa
Default User: username
Default Password: password
Connection Pool: 10-100 connections
```

### Authentication
```yaml
JWT Secret: CHANGE-THIS-IN-PRODUCTION-USE-STRONG-SECRET-AT-LEAST-32-CHARS
Token Expiry: 86400 seconds (24 hours)
Bearer Token Format: HTTP Bearer scheme
```

---

## Authentication Mechanisms

### 1. JWT Bearer Token Authentication
- **Type:** HTTP Bearer
- **Format:** JWT (JSON Web Tokens)
- **Expiration:** 24 hours
- **Refresh Token:** Supported
- **Header:** `Authorization: Bearer {token}`

### 2. OAuth 2.0 Integration
Supports two OAuth providers with configurable enablement:

#### Google OAuth
- **Endpoint:** `GET /auth/oauth/google?redirect_url={url}`
- **Configuration:** Client ID and Secret required
- **User Info:** Email, Name, Picture

#### Microsoft OAuth  
- **Endpoint:** `GET /auth/oauth/microsoft?redirect_url={url}`
- **Configuration:** Client ID and Secret required
- **User Info:** Mail, Display Name, UPN

### 3. Login Methods
- **Email/Password:** `POST /auth/login`
- **OAuth:** Redirect-based flow with base64-encoded callback
- **Token Refresh:** `POST /auth/refresh`

---

## Core Data Models

### Users (UUID-based)
- ID: UUID (Primary Key)
- Email: Unique identifier
- Type: `administrator` or `agent`
- Name, Last Name, Display Name
- Avatar URL
- Timestamps: created_at, updated_at
- Department assignments (many-to-many)

### Clients (UUID-based)
- ID: UUID (Primary Key)
- Name: String
- Custom Data: JSONB (flexible fields)
- Timestamps: created_at, updated_at

### Tickets (Integer ID)
- ID: Integer (Primary Key)
- Title: String
- Status: Enum (9 values)
- Priority: String (low, medium, high, urgent, etc.)
- Channel: Foreign key (string ID)
- Client: Foreign key (UUID)
- Department: Foreign key (optional)
- Secret: 32-character hex (auto-generated for client access)
- Custom Fields: JSONB
- Timestamps: created_at, updated_at, closed_at

### Messages (Integer ID)
- ID: Integer (Primary Key)
- Ticket: Foreign key
- User: Foreign key (optional, UUID)
- Client: Foreign key (optional, UUID)
- Body: Text content
- System Message: Boolean flag
- Timestamp: created_at

### Departments (Integer ID)
- ID: Integer (Primary Key)
- Name: Unique string
- Description: Text
- Timestamp: created_at

### Tags (Integer ID)
- ID: Integer (Primary Key)
- Name: Unique string

### Channels (String ID)
- ID: String (e.g., "web", "whatsapp")
- Name: String
- Logo: URL
- Enabled: Boolean
- Configuration: JSONB (flexible settings)
- Timestamps: created_at, updated_at

---

## API Endpoint Categories

### System Endpoints (2)
1. `GET /health` - Health check
2. `GET /uptime` - Server uptime

### Authentication Endpoints (4)
1. `POST /auth/login` - Email/password login
2. `POST /auth/refresh` - Token refresh
3. `GET /auth/profile` - Get current user
4. `GET /auth/oauth/providers` - List available OAuth providers

### Ticket Endpoints (10 total)

#### Public/Admin (5)
1. `GET /api/tickets` - List all
2. `GET /api/tickets/{id}` - Get one
3. `POST /api/tickets` - Create
4. `PUT /api/tickets/{id}` - Update
5. `DELETE /api/tickets/{id}` - Delete

#### Agent-Specific (5)
1. `GET /api/agent/tickets` - List accessible
2. `GET /api/agent/tickets/unread` - Get unread
3. `GET /api/agent/tickets/unread/count` - Count unread
4. `PUT /api/agent/tickets/{id}/status` - Change status
5. `PUT /api/agent/tickets/{id}/department` - Change department
6. `PUT /api/agent/tickets/{id}/assign` - Assign ticket
7. `POST /api/agent/tickets/{id}/reply` - Reply
8. `PUT /api/agent/tickets/{id}/tags` - Tag

### Tag Endpoints (7)
1. `GET /api/tags` - List all
2. `GET /api/tags/{id}` - Get one
3. `POST /api/tags` - Create
4. `POST /api/agent/tags` - Create (agent)
5. `PUT /api/tags/{id}` - Update
6. `DELETE /api/tags/{id}` - Delete

### Client Endpoints (5)
1. `GET /api/clients` - List all
2. `GET /api/clients/{id}` - Get one
3. `POST /api/clients` - Create
4. `PUT /api/clients/{id}` - Update
5. `DELETE /api/clients/{id}` - Delete

### Department Endpoints (5)
1. `GET /api/departments` - List all
2. `GET /api/departments/{id}` - Get one
3. `POST /api/departments` - Create
4. `PUT /api/departments/{id}` - Update
5. `DELETE /api/departments/{id}` - Delete

### User Endpoints (5)
1. `GET /api/users` - List all
2. `GET /api/users/{id}` - Get one
3. `POST /api/users` - Create
4. `PUT /api/users/{id}` - Update
5. `DELETE /api/users/{id}` - Delete

### Message Endpoints (5)
1. `GET /api/messages` - List all
2. `GET /api/messages/{id}` - Get one
3. `POST /api/messages` - Create
4. `PUT /api/messages/{id}` - Update
5. `DELETE /api/messages/{id}` - Delete

### Channel Endpoints (5)
1. `GET /api/channels` - List all
2. `GET /api/channels/{id}` - Get one
3. `POST /api/channels` - Create
4. `PUT /api/channels/{id}` - Update
5. `DELETE /api/channels/{id}` - Delete

---

## Response Format

### Standard Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "data": [ ... ]
  }
}
```

### Error Response
```json
{
  "success": false,
  "data": {
    "error": "error_code",
    "message": "Human-readable message"
  }
}
```

---

## Ticket Status Values

Nine distinct status states:
1. `new` - Newly created
2. `wait_for_agent` - Awaiting agent response
3. `in_progress` - Being handled
4. `wait_for_user` - Awaiting user response
5. `on_hold` - Temporarily suspended
6. `resolved` - Issue resolved
7. `closed` - Closed/completed
8. `unresolved` - Could not resolve
9. `spam` - Marked as spam

---

## User Types & Permissions

### Administrator
- Full system access
- All CRUD operations
- Department management
- User management
- Configuration access

### Agent
- Limited access based on assigned departments
- Can only view/manage tickets in their departments
- Cannot access user/department management
- Can reply, assign, and update tickets

---

## Key Features & Mechanisms

### 1. Ticket Secret System
- Auto-generated 32-character hex string per ticket
- Enables unauthenticated client access to add messages
- Only returned during ticket creation
- Hidden from subsequent ticket queries for security

### 2. Custom Fields
- Both tickets and clients support flexible JSONB custom_fields
- Allows dynamic schema without code changes
- Type-safe validation with configurable rules
- Stored as JSON in database

### 3. OAuth Flow
1. Get available providers: `GET /auth/oauth/providers`
2. Initiate flow: `GET /auth/oauth/{provider}?redirect_url={url}`
3. Provider authentication
4. Redirect with base64-encoded JWT response
5. Automatic token storage

### 4. Department-Based Access Control
- Users assigned to departments via many-to-many junction table
- Agents can only access tickets in their departments
- Administrators bypass department restrictions

### 5. Tag Management
- Can create tags on-the-fly during ticket tagging
- Automatic tag creation if name provided
- Many-to-many relationship with tickets

### 6. Multi-Channel Support
- Channels are flexible configuration containers
- String-based IDs (e.g., "web", "whatsapp", "email")
- JSONB configuration for channel-specific settings
- Enables integration with external communication platforms

---

## Pagination Details

### Parameters
- `page` (integer, default: 1): Page number (1-indexed)
- `limit` (integer, default: 20, max: 100): Items per page

### Calculation
- Total pages = `Math.ceil(total / limit)`
- Offset = `(page - 1) * limit`

---

## Configuration Files

### Primary Config
**Location:** `/home/evo/homa-backend/config.yml`

```yaml
# Database Configuration
Database:
  Type: mysql
  Server: 127.0.0.1:3306
  Database: homa
  Username: username
  Password: password
  ConnMaxLifTime: 1h
  MaxOpenConns: 100
  MaxIdleConns: 10

# HTTP Server Configuration
HTTP:
  Host: 0.0.0.0
  Port: 8000
  BodyLimit: 25mb
  ReadTimeout: 1s
  WriteTimeout: 5s
  Concurrency: 1024

# JWT Configuration
JWT:
  SECRET: "CHANGE-THIS-IN-PRODUCTION-USE-STRONG-SECRET-AT-LEAST-32-CHARS"

# OAuth Configuration
OAUTH:
  GOOGLE:
    ENABLED: false
    CLIENT_ID: ""
    SECRET: ""
  MICROSOFT:
    ENABLED: false
    CLIENT_ID: ""
    SECRET: ""

# Application Configuration
APP:
  BASE_PATH: "http://localhost:8000"
```

---

## Documentation Files Found

1. **OAuth Documentation** (`docs/oauth.md`)
   - Complete OAuth setup guide
   - Google and Microsoft integration
   - Frontend implementation examples
   - Production considerations

2. **Models Documentation** (`docs/models.md`)
   - Database schema
   - Table definitions
   - Relationships
   - Junction tables

3. **CLAUDE.md** (Backend)
   - Project overview
   - Architecture explanation
   - Custom attributes system
   - Ticket secret system
   - Development guidelines

---

## Important Implementation Notes

### 1. Bearer Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. OAuth Redirect Flow
After OAuth completion, redirects to:
```
{redirect_url}?oauth=success&data={base64_encoded_json}
```

Decode `data` parameter to get tokens and user info.

### 3. Ticket Creation Returns Secret
The secret is only returned once (during creation). Store it client-side for later use:
```json
{
  "id": 1,
  "title": "...",
  "secret": "a1b2c3d4e5f6789012345678901234ef",
  ...
}
```

### 4. Agent Role Restrictions
- Agent endpoints require authentication
- Agents automatically see only their assigned departments
- Department assignment happens at user creation/management

### 5. Flexible Custom Fields
Both tickets and clients accept any JSON in custom_fields:
```json
{
  "custom_fields": {
    "account_number": "ACC-123",
    "region": "US-WEST",
    "subscription_tier": "premium"
  }
}
```

---

## API Client Implementation Strategy

### 1. Create Typed Client
```typescript
interface ApiClient {
  baseUrl: string;
  accessToken?: string;
  refreshToken?: string;
  makeRequest(method, endpoint, data?): Promise<Response>;
  setTokens(access, refresh): void;
  clearTokens(): void;
}
```

### 2. Handle Token Refresh
- Intercept 401 responses
- Call `POST /auth/refresh`
- Store new tokens
- Retry original request

### 3. Pagination Helper
```typescript
interface PaginationState {
  page: number;
  limit: number;
  total: number;
}
```

### 4. Error Handling
- Check `success` field
- Parse `error` and `message` from `data`
- Implement retry logic for transient failures

---

## Files Located

### Documentation
- `/home/evo/homa-backend/README.md` - Project overview
- `/home/evo/homa-backend/docs/oauth.md` - OAuth setup
- `/home/evo/homa-backend/docs/models.md` - Database schema
- `/home/evo/homa-backend/docs/guideline.md` - Development standards
- `/home/evo/homa-backend/CLAUDE.md` - Project instructions

### Configuration
- `/home/evo/homa-backend/config.yml` - Main configuration
- `/home/evo/homa-backend/swagger.json` - OpenAPI specification

### Source Code
- `/home/evo/homa-backend/apps/auth/` - Authentication logic
- `/home/evo/homa-backend/apps/agent/` - Agent-specific endpoints
- `/home/evo/homa-backend/apps/models/` - Data models
- `/home/evo/homa-backend/main.go` - Application entry point

---

## Integration Recommendations

### For Next.js Dashboard

1. **Authentication Layer**
   - Implement JWT token storage
   - Create token refresh interceptor
   - Handle OAuth flow in login page
   - Implement logout

2. **API Client**
   - Centralized fetch wrapper
   - Automatic Bearer token injection
   - Error handling and logging
   - Request/response transformation

3. **State Management**
   - Store user authentication state
   - Cache agent's accessible tickets
   - Store current user profile
   - Manage form state for submissions

4. **Components**
   - Ticket list with pagination
   - Ticket detail with messages
   - Ticket creation/editing
   - User management
   - Department management
   - Tag management

5. **Features Priority**
   - Login and OAuth integration
   - Ticket viewing and management
   - Unread count with polling
   - Message replies
   - Status/assignment changes

---

## Summary Statistics

| Category | Count |
| --- | --- |
| Total Endpoints | 60+ |
| Authentication Methods | 3 (Email/Password, Google OAuth, Microsoft OAuth) |
| Data Models | 7 core models |
| Ticket Statuses | 9 |
| User Types | 2 (Administrator, Agent) |
| Configuration Settings | 20+ |
| API Endpoints by Type | 5 categories (System, Auth, Tickets, Management) |

---

## References

- **Homa Backend:** `/home/evo/homa-backend`
- **Homa Dashboard:** `/home/evo/homa-dashboard`
- **Complete API Docs:** `/home/evo/homa-dashboard/docs/homa-api-documentation.md`
- **Quick Reference:** `/home/evo/homa-dashboard/docs/API-QUICK-REFERENCE.md`
- **Swagger Spec:** `/home/evo/homa-backend/swagger.json`

---

**Created:** November 21, 2025
**Updated:** November 21, 2025
**Status:** Complete and Ready for Integration

# Homa API Documentation

Complete API reference for integrating the Homa backend into the Next.js dashboard.

**Last Updated:** November 21, 2025
**API Version:** 1.0.0
**Specification:** OpenAPI 3.0.3

---

## Table of Contents

1. [Base API Configuration](#base-api-configuration)
2. [Authentication](#authentication)
3. [API Endpoints by Category](#api-endpoints-by-category)
4. [Data Models & Schemas](#data-models--schemas)
5. [Request/Response Examples](#requestresponse-examples)
6. [Error Handling](#error-handling)
7. [Pagination](#pagination)

---

## Base API Configuration

### Server Information

```yaml
Base URL (Development): http://localhost:8000
Base URL (Production):  http://yourdomain.com  # Configure as needed
API Prefix: /api/ or /auth/
```

### Configuration Files

**Location:** `/home/evo/homa-backend/config.yml`

```yaml
Database:
  Type: mysql
  Server: 127.0.0.1:3306
  Database: homa
  Username: username
  Password: password
  
HTTP:
  Host: 0.0.0.0
  Port: 8000
  
JWT:
  SECRET: "CHANGE-THIS-IN-PRODUCTION-USE-STRONG-SECRET-AT-LEAST-32-CHARS"

OAUTH:
  GOOGLE:
    ENABLED: false
    CLIENT_ID: ""
    SECRET: ""
  MICROSOFT:
    ENABLED: false
    CLIENT_ID: ""
    SECRET: ""

APP:
  BASE_PATH: "http://localhost:8000"
```

### Default Ports

- **HTTP Server:** 8000
- **Database:** 3306 (MySQL)

---

## Authentication

### Authentication Method

The API uses **JWT Bearer Token authentication** for protected endpoints.

**Security Scheme:**
```
Type: HTTP
Scheme: Bearer
Format: JWT
Description: JWT Bearer token authentication
```

### 1. Login (Email/Password)

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user with email and password

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

**Response (200 - Success):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400,
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Admin",
      "last_name": "User",
      "email": "admin@example.com",
      "display_name": "Admin User",
      "type": "administrator",
      "avatar": null,
      "created_at": "2025-01-01T12:00:00Z",
      "updated_at": "2025-01-01T12:00:00Z"
    }
  }
}
```

**Response (401 - Invalid Credentials):**
```json
{
  "success": false,
  "data": {
    "error": "invalid_credentials",
    "message": "Invalid email or password"
  }
}
```

### 2. Refresh Token

**Endpoint:** `POST /auth/refresh`

**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400,
    "user": { ... }
  }
}
```

### 3. OAuth Login

**Endpoints:**
- `GET /auth/oauth/google?redirect_url={encoded_url}`
- `GET /auth/oauth/microsoft?redirect_url={encoded_url}`

**Description:** Initiates OAuth login flow

**Required Parameters:**
- `redirect_url` (URL-encoded): The URL to redirect to after OAuth completion

**OAuth Callback Parameters:**
- `oauth=success|error`
- `data` (base64-encoded JSON): Contains access_token, refresh_token, and user info
- `message` (if error): Error description

**OAuth Configuration:**

```yaml
OAUTH:
  GOOGLE:
    ENABLED: true
    CLIENT_ID: "your-google-client-id"
    SECRET: "your-google-client-secret"
  MICROSOFT:
    ENABLED: true
    CLIENT_ID: "your-azure-app-id"
    SECRET: "your-azure-client-secret"
```

**Frontend Implementation Example:**

```javascript
// Get available providers
async function getOAuthProviders() {
  const response = await fetch('http://localhost:8000/auth/oauth/providers');
  return response.json();
}

// Initiate OAuth login
function loginWithGoogle() {
  const redirectUrl = encodeURIComponent(window.location.href);
  window.location.href = `/auth/oauth/google?redirect_url=${redirectUrl}`;
}

// Handle OAuth callback
function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('oauth') === 'success') {
    const data = JSON.parse(atob(decodeURIComponent(params.get('data'))));
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
  }
}
```

### 4. Get Current User Profile

**Endpoint:** `GET /auth/profile`

**Description:** Get the current authenticated user's profile

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "display_name": "John Doe",
    "type": "agent",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z",
    "departments": [
      {
        "id": 1,
        "name": "Support",
        "description": "Customer Support Department"
      }
    ]
  }
}
```

---

## API Endpoints by Category

### System Endpoints

#### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the API is healthy and running

**Response (200):**
```json
{
  "success": true,
  "data": "ok"
}
```

#### 2. Get Uptime

**Endpoint:** `GET /uptime`

**Description:** Get server uptime in seconds

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uptime": 3600
  }
}
```

---

### Tickets Management

#### 1. List All Tickets

**Endpoint:** `GET /api/tickets`

**Description:** Get paginated list of all tickets

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20, max: 100): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Sample Ticket",
      "client_id": "123e4567-e89b-12d3-a456-426614174000",
      "channel_id": "web",
      "department_id": 1,
      "status": "new",
      "priority": "medium",
      "external_id": "ext-123",
      "custom_fields": { "priority_level": 3 },
      "created_at": "2025-01-01T12:00:00Z",
      "updated_at": "2025-01-01T12:00:00Z",
      "closed_at": null
    }
  ]
}
```

#### 2. Get Ticket by ID

**Endpoint:** `GET /api/tickets/{id}`

**Description:** Get a specific ticket by ID

**Response (200):** Same as above (single ticket)

**Response (404):** Ticket not found

#### 3. Create Ticket

**Endpoint:** `POST /api/tickets`

**Description:** Create a new ticket

**Request Body:**
```json
{
  "title": "Support Request",
  "client_id": "123e4567-e89b-12d3-a456-426614174000",
  "channel_id": "web",
  "status": "new",
  "priority": "medium",
  "department_id": 1,
  "custom_fields": {
    "priority_level": 3
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Support Request",
    "client_id": "123e4567-e89b-12d3-a456-426614174000",
    "channel_id": "web",
    "status": "new",
    "priority": "medium",
    "department_id": 1,
    "secret": "a1b2c3d4e5f6789012345678901234ef",
    "custom_fields": { "priority_level": 3 },
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z",
    "closed_at": null
  }
}
```

#### 4. Update Ticket

**Endpoint:** `PUT /api/tickets/{id}`

**Description:** Update a specific ticket

**Request Body:** Same fields as create (optional)

**Response (200):** Updated ticket object

#### 5. Delete Ticket

**Endpoint:** `DELETE /api/tickets/{id}`

**Description:** Delete a specific ticket

**Response (200):**
```json
{
  "success": true,
  "data": "deleted"
}
```

---

### Agent-Specific Ticket Operations

**Note:** These endpoints require authentication and role-based access (agents/administrators)

#### 1. Get Agent's Ticket List

**Endpoint:** `GET /api/agent/tickets`

**Description:** Get paginated list of tickets accessible to the authenticated agent

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20, max: 100): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "data": [
      {
        "id": 1,
        "title": "Sample Ticket",
        "client_id": "123e4567-e89b-12d3-a456-426614174000",
        "channel_id": "web",
        "status": "new",
        "priority": "medium",
        "created_at": "2025-01-01T12:00:00Z",
        "updated_at": "2025-01-01T12:00:00Z",
        "closed_at": null
      }
    ]
  }
}
```

#### 2. Get Unread Tickets

**Endpoint:** `GET /api/agent/tickets/unread`

**Description:** Get tickets with unread status (new, wait_for_agent, in_progress)

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Sample Ticket",
        "status": "new",
        "priority": "high",
        "created_at": "2025-01-01T12:00:00Z"
      }
    ]
  }
}
```

#### 3. Get Unread Tickets Count

**Endpoint:** `GET /api/agent/tickets/unread/count`

**Description:** Get count of unread tickets

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

#### 4. Change Ticket Status

**Endpoint:** `PUT /api/agent/tickets/{id}/status`

**Description:** Update the status of a specific ticket

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Valid Status Values:**
- `new`
- `wait_for_agent`
- `in_progress`
- `wait_for_user`
- `on_hold`
- `resolved`
- `closed`
- `unresolved`
- `spam`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Ticket status updated successfully",
    "ticket": { ... }
  }
}
```

#### 5. Change Ticket Department

**Endpoint:** `PUT /api/agent/tickets/{id}/department`

**Description:** Move a ticket to a different department

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "department_id": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Ticket department updated successfully",
    "ticket": { ... }
  }
}
```

#### 6. Assign Ticket

**Endpoint:** `PUT /api/agent/tickets/{id}/assign`

**Description:** Assign a ticket to a user or department

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body (choose one):**
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

Or:

```json
{
  "department_id": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Ticket assigned successfully",
    "data": { }
  }
}
```

#### 7. Reply to Ticket

**Endpoint:** `POST /api/agent/tickets/{id}/reply`

**Description:** Add a message reply to a ticket

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "message": "Hello! I can help you with this issue."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Reply sent successfully",
    "data": {
      "id": 123,
      "ticket_id": 1,
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "body": "Hello! I can help you with this issue.",
      "is_system_message": false,
      "created_at": "2025-01-01T12:00:00Z"
    }
  }
}
```

#### 8. Tag Ticket

**Endpoint:** `PUT /api/agent/tickets/{id}/tags`

**Description:** Add/remove tags from a ticket. Can use existing tag IDs or tag names (creates if not exists)

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "tag_ids": [1, 2, 3],
  "tag_names": ["bug", "urgent", "new-feature"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Ticket tags updated successfully",
    "total_tags": 3,
    "created_tags": [
      {
        "id": 4,
        "name": "new-feature"
      }
    ]
  }
}
```

---

### Tags Management

#### 1. List All Tags

**Endpoint:** `GET /api/tags`

**Description:** Get paginated list of all tags

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "bug"
    },
    {
      "id": 2,
      "name": "feature-request"
    }
  ]
}
```

#### 2. Get Tag by ID

**Endpoint:** `GET /api/tags/{id}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "bug"
  }
}
```

#### 3. Create Tag

**Endpoint:** `POST /api/tags`

**Request Body:**
```json
{
  "name": "urgent"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "urgent"
  }
}
```

#### 4. Agent-Specific Create Tag

**Endpoint:** `POST /api/agent/tags`

**Description:** Create a tag (agent-specific endpoint)

**Required Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "urgent"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "data": {
      "id": 5,
      "name": "urgent"
    },
    "message": "Tag created successfully"
  }
}
```

#### 5. Update Tag

**Endpoint:** `PUT /api/tags/{id}`

**Request Body:**
```json
{
  "name": "updated-name"
}
```

**Response (200):** Updated tag object

#### 6. Delete Tag

**Endpoint:** `DELETE /api/tags/{id}`

**Response (200):**
```json
{
  "success": true,
  "data": "deleted"
}
```

---

### Clients Management

#### 1. List All Clients

**Endpoint:** `GET /api/clients`

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "data": {
        "company": "Acme Corp",
        "phone": "+1-555-0123"
      },
      "created_at": "2025-01-01T12:00:00Z",
      "updated_at": "2025-01-01T12:00:00Z"
    }
  ]
}
```

#### 2. Get Client by ID

**Endpoint:** `GET /api/clients/{id}`

**Response (200):** Single client object

#### 3. Create Client

**Endpoint:** `POST /api/clients`

**Request Body:**
```json
{
  "name": "John Doe",
  "data": {
    "company": "Acme Corp",
    "phone": "+1-555-0123",
    "website": "https://example.com"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "data": { ... },
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z"
  }
}
```

#### 4. Update Client

**Endpoint:** `PUT /api/clients/{id}`

**Request Body:** Same as create (optional fields)

**Response (200):** Updated client object

#### 5. Delete Client

**Endpoint:** `DELETE /api/clients/{id}`

**Response (200):**
```json
{
  "success": true,
  "data": "deleted"
}
```

---

### Departments Management

#### 1. List All Departments

**Endpoint:** `GET /api/departments`

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Support",
      "description": "Customer Support Department",
      "created_at": "2025-01-01T12:00:00Z"
    }
  ]
}
```

#### 2. Get Department by ID

**Endpoint:** `GET /api/departments/{id}`

**Response (200):** Single department object

#### 3. Create Department

**Endpoint:** `POST /api/departments`

**Request Body:**
```json
{
  "name": "Sales",
  "description": "Sales Department"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Sales",
    "description": "Sales Department",
    "created_at": "2025-01-01T12:00:00Z"
  }
}
```

#### 4. Update Department

**Endpoint:** `PUT /api/departments/{id}`

**Request Body:** Same as create (optional)

**Response (200):** Updated department object

#### 5. Delete Department

**Endpoint:** `DELETE /api/departments/{id}`

**Response (200):**
```json
{
  "success": true,
  "data": "deleted"
}
```

---

### Users Management

#### 1. List All Users

**Endpoint:** `GET /api/users`

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "display_name": "John Doe",
      "type": "agent",
      "avatar": null,
      "created_at": "2025-01-01T12:00:00Z",
      "updated_at": "2025-01-01T12:00:00Z"
    }
  ]
}
```

#### 2. Get User by ID

**Endpoint:** `GET /api/users/{id}`

**Response (200):** Single user object

#### 3. Create User

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "type": "agent",
  "display_name": "Jane Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Valid User Types:**
- `administrator` - Full system access
- `agent` - Support agent with department-based access

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "type": "agent",
    "display_name": "Jane Smith",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z"
  }
}
```

#### 4. Update User

**Endpoint:** `PUT /api/users/{id}`

**Request Body:**
```json
{
  "name": "Jane",
  "last_name": "Smith",
  "display_name": "Jane S.",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response (200):** Updated user object

#### 5. Delete User

**Endpoint:** `DELETE /api/users/{id}`

**Response (200):**
```json
{
  "success": true,
  "data": "deleted"
}
```

---

### Messages Management

#### 1. List All Messages

**Endpoint:** `GET /api/messages`

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ticket_id": 1,
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "client_id": null,
      "body": "Thank you for your issue. We will help you.",
      "is_system_message": false,
      "created_at": "2025-01-01T12:00:00Z"
    }
  ]
}
```

#### 2. Get Message by ID

**Endpoint:** `GET /api/messages/{id}`

**Response (200):** Single message object

#### 3. Create Message

**Endpoint:** `POST /api/messages`

**Request Body:**
```json
{
  "ticket_id": 1,
  "body": "Thank you for contacting us."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "ticket_id": 1,
    "user_id": null,
    "client_id": null,
    "body": "Thank you for contacting us.",
    "is_system_message": true,
    "created_at": "2025-01-01T12:00:00Z"
  }
}
```

#### 4. Update Message

**Endpoint:** `PUT /api/messages/{id}`

**Request Body:**
```json
{
  "body": "Updated message content"
}
```

**Response (200):** Updated message object

#### 5. Delete Message

**Endpoint:** `DELETE /api/messages/{id}`

**Response (200):**
```json
{
  "success": true,
  "data": "deleted"
}
```

---

### Channels Management

#### 1. List All Channels

**Endpoint:** `GET /api/channels`

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "web",
      "name": "Web Form",
      "logo": "https://example.com/web-icon.png",
      "enabled": true,
      "configuration": {
        "url": "https://example.com/support"
      },
      "created_at": "2025-01-01T12:00:00Z",
      "updated_at": "2025-01-01T12:00:00Z"
    }
  ]
}
```

#### 2. Get Channel by ID

**Endpoint:** `GET /api/channels/{id}`

**Response (200):** Single channel object

#### 3. Create Channel

**Endpoint:** `POST /api/channels`

**Request Body:**
```json
{
  "name": "WhatsApp",
  "logo": "https://example.com/whatsapp-icon.png",
  "enabled": true,
  "configuration": {
    "phone": "+1-555-0123",
    "api_token": "token123"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "whatsapp",
    "name": "WhatsApp",
    "logo": "https://example.com/whatsapp-icon.png",
    "enabled": true,
    "configuration": { ... },
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:00:00Z"
  }
}
```

#### 4. Update Channel

**Endpoint:** `PUT /api/channels/{id}`

**Request Body:** Same as create (optional)

**Response (200):** Updated channel object

#### 5. Delete Channel

**Endpoint:** `DELETE /api/channels/{id}`

**Response (200):**
```json
{
  "success": true,
  "data": "deleted"
}
```

---

## Data Models & Schemas

### User Schema

```typescript
interface User {
  id: string;              // UUID
  name: string;
  last_name: string;
  email: string;
  display_name?: string;
  type: "administrator" | "agent";
  avatar?: string;
  created_at: string;      // ISO 8601
  updated_at: string;      // ISO 8601
}
```

### Client Schema

```typescript
interface Client {
  id: string;              // UUID
  name: string;
  data: Record<string, any>;  // Custom fields (flexible JSON)
  created_at: string;      // ISO 8601
  updated_at: string;      // ISO 8601
}
```

### Ticket Schema

```typescript
interface Ticket {
  id: number;
  title: string;
  client_id: string;       // UUID
  channel_id: string;
  department_id?: number;
  status: "new" | "wait_for_agent" | "in_progress" | "wait_for_user" | "on_hold" | "resolved" | "closed" | "unresolved" | "spam";
  priority: string;        // e.g., "low", "medium", "high", "urgent"
  external_id?: string;    // For integration with external systems
  custom_fields: Record<string, any>;  // Flexible JSON
  created_at: string;      // ISO 8601
  updated_at: string;      // ISO 8601
  closed_at?: string;      // ISO 8601
}
```

### Message Schema

```typescript
interface Message {
  id: number;
  ticket_id: number;
  user_id?: string;        // UUID of agent/user
  client_id?: string;      // UUID of client
  body: string;
  is_system_message: boolean;
  created_at: string;      // ISO 8601
}
```

### Department Schema

```typescript
interface Department {
  id: number;
  name: string;
  description?: string;
  created_at: string;      // ISO 8601
}
```

### Tag Schema

```typescript
interface Tag {
  id: number;
  name: string;
}
```

### Channel Schema

```typescript
interface Channel {
  id: string;
  name: string;
  logo?: string;
  enabled: boolean;
  configuration: Record<string, any>;  // Flexible JSON
  created_at: string;      // ISO 8601
  updated_at: string;      // ISO 8601
}
```

---

## Request/Response Examples

### Complete Login & API Usage Flow

```javascript
// Step 1: Login
const loginResponse = await fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'secret123'
  })
});

const loginData = await loginResponse.json();
const accessToken = loginData.data.access_token;
const refreshToken = loginData.data.refresh_token;

// Step 2: Use access token for authenticated requests
const ticketsResponse = await fetch('http://localhost:8000/api/agent/tickets', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

const ticketsData = await ticketsResponse.json();
console.log('Tickets:', ticketsData.data);

// Step 3: Refresh token when expired
const refreshResponse = await fetch('http://localhost:8000/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refresh_token: refreshToken
  })
});

const newTokenData = await refreshResponse.json();
const newAccessToken = newTokenData.data.access_token;
```

### Create Ticket with Custom Fields

```javascript
const createTicketResponse = await fetch('http://localhost:8000/api/tickets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Customer billing inquiry",
    client_id: "123e4567-e89b-12d3-a456-426614174000",
    channel_id: "web",
    status: "new",
    priority: "high",
    department_id: 2,
    custom_fields: {
      account_number: "ACC-12345",
      invoice_id: "INV-98765",
      priority_level: 5
    }
  })
});

const ticketData = await createTicketResponse.json();
console.log('Created ticket with secret:', ticketData.data.secret);
```

### Update Ticket Status with Agent Authentication

```javascript
const updateStatusResponse = await fetch(
  'http://localhost:8000/api/agent/tickets/1/status',
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'in_progress'
    })
  }
);

const updateData = await updateStatusResponse.json();
console.log('Updated ticket:', updateData.data.ticket);
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "data": {
    "error": "error_code",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
| --- | --- | --- |
| 400 | `invalid_input` | Request validation failed |
| 401 | `unauthorized` | Missing or invalid authentication token |
| 403 | `forbidden` | Insufficient permissions for this action |
| 404 | `not_found` | Resource not found |
| 500 | `internal_error` | Server error |

### Example Error Response (401 - Unauthorized)

```json
{
  "success": false,
  "data": {
    "error": "unauthorized",
    "message": "Authentication required - Invalid or expired token"
  }
}
```

---

## Pagination

### Pagination Parameters

All list endpoints support pagination:

```
GET /api/tickets?page=1&limit=20
```

### Pagination Response Format

Standard paginated response includes:

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

### Pagination Details

| Parameter | Type | Default | Max | Description |
| --- | --- | --- | --- | --- |
| `page` | integer | 1 | N/A | Page number (1-indexed) |
| `limit` | integer | 20 | 100 | Items per page |

**Total Pages Calculation:** `Math.ceil(total / limit)`

---

## Important Implementation Notes

### 1. Ticket Secret System

Every ticket created includes an auto-generated `secret` (32-character hex string) that allows unauthenticated client access for adding messages to their ticket:

```javascript
// Client can add messages using ticket ID and secret without authentication
POST /api/tickets/1/messages
{
  "secret": "a1b2c3d4e5f6789012345678901234ef",
  "message": "Updated information about my issue"
}
```

The secret is only returned during ticket creation. It's not included in subsequent ticket queries for security.

### 2. Custom Fields

Both tickets and clients support flexible `custom_fields` (JSON object):

```json
{
  "custom_fields": {
    "account_number": "ACC-12345",
    "priority_level": 5,
    "region": "US-WEST",
    "subscription_tier": "premium"
  }
}
```

### 3. JWT Token Expiration

- **Access Token:** Expires in 86400 seconds (24 hours)
- **Refresh Token:** Used to obtain new access tokens
- Always implement token refresh logic in your frontend

### 4. Role-Based Access Control

- **Administrator:** Full system access to all endpoints
- **Agent:** Limited access based on assigned departments
  - Can only view/manage tickets in their departments
  - Cannot access user/department management endpoints

### 5. OAuth Redirect URL Parameter

OAuth endpoints require the `redirect_url` parameter:

```
GET /auth/oauth/google?redirect_url=https%3A%2F%2Fapp.example.com%2Flogin
```

After successful OAuth flow, the user is redirected with:

```
https://app.example.com/login?oauth=success&data={base64_encoded_response}
```

---

## API Versioning & Stability

- **Current Version:** 1.0.0
- **API Server:** Evo v2 Framework
- **Database:** MySQL 5.7+
- **ORM:** GORM

All endpoints are RESTful and follow REST conventions for HTTP methods and status codes.

---

## Environment Variables

### Development

```bash
# Run with development config
go run main.go -c config.dev.yml

# With database migration
go run main.go -c config.dev.yml --migration-do

# Create admin user
go run main.go -c config.dev.yml --create-admin \
  -email admin@example.com \
  -password secure123 \
  -name Admin \
  -lastname User
```

### Production Configuration

```yaml
Database:
  Server: "prod-db.example.com:3306"
  Database: "homa_prod"
  Username: "${DB_USER}"
  Password: "${DB_PASSWORD}"
  
HTTP:
  Host: "0.0.0.0"
  Port: 8000
  
JWT:
  SECRET: "${JWT_SECRET}"  # Use strong 32+ character secret
  
OAUTH:
  GOOGLE:
    ENABLED: true
    CLIENT_ID: "${GOOGLE_CLIENT_ID}"
    SECRET: "${GOOGLE_SECRET}"
  MICROSOFT:
    ENABLED: true
    CLIENT_ID: "${MICROSOFT_CLIENT_ID}"
    SECRET: "${MICROSOFT_SECRET}"

APP:
  BASE_PATH: "https://yourdomain.com"
```

---

## Quick Integration Checklist for Next.js Dashboard

- [ ] Install JWT/Bearer token authentication middleware
- [ ] Implement login form with email/password
- [ ] Implement OAuth login buttons (Google/Microsoft)
- [ ] Set up token storage (localStorage/sessionStorage or secure cookies)
- [ ] Implement token refresh logic (handle 401 responses)
- [ ] Create API client with automatic Bearer token injection
- [ ] Build ticket list component with pagination
- [ ] Build ticket detail component with message history
- [ ] Implement agent-specific ticket operations (status, assignment, tags)
- [ ] Set up unread tickets count with polling/WebSocket
- [ ] Build departments and users management pages
- [ ] Implement error handling and user feedback
- [ ] Add logout functionality
- [ ] Set up routing guards for authenticated pages

---

**Documentation Generated:** November 21, 2025
**For Backend Source:** /home/evo/homa-backend
**For Frontend Integration:** /home/evo/homa-dashboard

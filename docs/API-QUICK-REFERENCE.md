# Homa API Quick Reference Guide

A condensed guide for rapid integration of the Homa backend into the Next.js dashboard.

## Base URL
```
Development: http://localhost:8000
Production: http://yourdomain.com
```

## Authentication

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "success": true,
  "data": {
    "access_token": "jwt...",
    "refresh_token": "jwt...",
    "expires_in": 86400,
    "user": { ... }
  }
}
```

### Refresh Token
```bash
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "jwt..."
}
```

### Get Profile
```bash
GET /auth/profile
Authorization: Bearer {access_token}
```

### OAuth Providers
```bash
GET /auth/oauth/providers
GET /auth/oauth/google?redirect_url={url}
GET /auth/oauth/microsoft?redirect_url={url}
```

---

## All Available Endpoints

### System
- `GET /health` - Health check
- `GET /uptime` - Server uptime

### Tickets (Admin/Public)
- `GET /api/tickets` - List all
- `GET /api/tickets/{id}` - Get one
- `POST /api/tickets` - Create
- `PUT /api/tickets/{id}` - Update
- `DELETE /api/tickets/{id}` - Delete

### Agent Tickets (Authenticated Only)
- `GET /api/agent/tickets` - List agent's tickets
- `GET /api/agent/tickets/unread` - Unread tickets
- `GET /api/agent/tickets/unread/count` - Unread count
- `PUT /api/agent/tickets/{id}/status` - Change status
- `PUT /api/agent/tickets/{id}/department` - Change department
- `PUT /api/agent/tickets/{id}/assign` - Assign ticket
- `POST /api/agent/tickets/{id}/reply` - Reply to ticket
- `PUT /api/agent/tickets/{id}/tags` - Tag ticket

### Tags
- `GET /api/tags` - List all
- `GET /api/tags/{id}` - Get one
- `POST /api/tags` - Create
- `POST /api/agent/tags` - Create (agent)
- `PUT /api/tags/{id}` - Update
- `DELETE /api/tags/{id}` - Delete

### Clients
- `GET /api/clients` - List all
- `GET /api/clients/{id}` - Get one
- `POST /api/clients` - Create
- `PUT /api/clients/{id}` - Update
- `DELETE /api/clients/{id}` - Delete

### Departments
- `GET /api/departments` - List all
- `GET /api/departments/{id}` - Get one
- `POST /api/departments` - Create
- `PUT /api/departments/{id}` - Update
- `DELETE /api/departments/{id}` - Delete

### Users
- `GET /api/users` - List all
- `GET /api/users/{id}` - Get one
- `POST /api/users` - Create
- `PUT /api/users/{id}` - Update
- `DELETE /api/users/{id}` - Delete

### Messages
- `GET /api/messages` - List all
- `GET /api/messages/{id}` - Get one
- `POST /api/messages` - Create
- `PUT /api/messages/{id}` - Update
- `DELETE /api/messages/{id}` - Delete

### Channels
- `GET /api/channels` - List all
- `GET /api/channels/{id}` - Get one
- `POST /api/channels` - Create
- `PUT /api/channels/{id}` - Update
- `DELETE /api/channels/{id}` - Delete

---

## Key Data Types

### Ticket
```typescript
{
  id: number;
  title: string;
  client_id: string; // UUID
  channel_id: string;
  department_id?: number;
  status: "new" | "wait_for_agent" | "in_progress" | "wait_for_user" | "on_hold" | "resolved" | "closed" | "unresolved" | "spam";
  priority: string;
  secret?: string; // Only on creation
  custom_fields: Record<string, any>;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}
```

### User
```typescript
{
  id: string; // UUID
  name: string;
  last_name: string;
  email: string;
  display_name?: string;
  type: "administrator" | "agent";
  avatar?: string;
  created_at: string;
  updated_at: string;
}
```

### Client
```typescript
{
  id: string; // UUID
  name: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

### Message
```typescript
{
  id: number;
  ticket_id: number;
  user_id?: string; // UUID
  client_id?: string; // UUID
  body: string;
  is_system_message: boolean;
  created_at: string;
}
```

### Department
```typescript
{
  id: number;
  name: string;
  description?: string;
  created_at: string;
}
```

### Tag
```typescript
{
  id: number;
  name: string;
}
```

### Channel
```typescript
{
  id: string;
  name: string;
  logo?: string;
  enabled: boolean;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

---

## Common Patterns

### With Authentication
All authenticated endpoints require this header:
```
Authorization: Bearer {access_token}
```

### Pagination
All list endpoints support:
```
?page=1&limit=20
```

Response format:
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
    "message": "Error description"
  }
}
```

### Valid Ticket Statuses
- `new`
- `wait_for_agent`
- `in_progress`
- `wait_for_user`
- `on_hold`
- `resolved`
- `closed`
- `unresolved`
- `spam`

### Valid User Types
- `administrator` - Full access
- `agent` - Department-based access

---

## Implementation Checklist

### Authentication
- [ ] Login page with email/password
- [ ] OAuth login integration (Google/Microsoft)
- [ ] Token storage and refresh logic
- [ ] Automatic 401 handling
- [ ] Logout functionality

### Core Features
- [ ] Ticket listing with pagination
- [ ] Ticket detail view with messages
- [ ] Create/update ticket functionality
- [ ] Change ticket status
- [ ] Assign ticket to user/department
- [ ] Add tags to tickets
- [ ] Reply to tickets

### Management
- [ ] View/manage departments
- [ ] View/manage users
- [ ] View/manage clients
- [ ] View/manage tags
- [ ] View/manage channels

### Dashboard
- [ ] Unread tickets count
- [ ] Ticket statistics
- [ ] User activity
- [ ] Department overview

---

## Configuration

### Backend Config Location
```
/home/evo/homa-backend/config.yml
```

### Key Settings
```yaml
HTTP:
  Port: 8000

JWT:
  SECRET: "change-in-production"

OAUTH:
  GOOGLE:
    ENABLED: true
    CLIENT_ID: "..."
    SECRET: "..."
  MICROSOFT:
    ENABLED: true
    CLIENT_ID: "..."
    SECRET: "..."
```

---

## Important Notes

1. **Ticket Secret**: Each ticket gets a unique 32-char secret for unauthenticated client access. Only returned on creation.

2. **Custom Fields**: Both tickets and clients support flexible JSON custom_fields.

3. **Token Expiry**: Access tokens expire in 24 hours. Implement refresh logic.

4. **Role-Based Access**: Agents can only access their assigned departments.

5. **OAuth Redirect**: Always pass `redirect_url` parameter to OAuth endpoints.

6. **Bearer Token Format**: `Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`

---

## Next Steps

For detailed API documentation, see: `/home/evo/homa-dashboard/docs/homa-api-documentation.md`

For backend source code, visit: `/home/evo/homa-backend`

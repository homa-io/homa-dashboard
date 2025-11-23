# Conversation List API Requirements

## Overview
This document specifies the API requirements for the conversations list page left sidebar. The current API (`GET /api/agent/tickets`) is insufficient as it lacks search, filtering, customer details, and message preview capabilities needed for the frontend.

## Required Endpoint

### **Endpoint:** `GET /api/agent/tickets/search`
**Alternative:** Enhance existing `GET /api/agent/tickets` with additional parameters

**Base URL:** `https://api.getevo.dev`

**Description:**
Provide a comprehensive, filterable, searchable list of conversations/tickets for the agent dashboard left sidebar with all necessary information for display and interaction.

**Required Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## Query Parameters

### Pagination
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 50, max: 100): Items per page

### Search
- `search` (string, optional): Full-text search across:
  - Ticket title
  - Message content
  - Customer name
  - Customer email
  - Ticket number

### Filters (Multi-select support with comma-separated values)
- `status` (string, optional): Comma-separated values
  - Possible values: `new`, `open`, `in_progress`, `wait_for_customer`, `wait_for_agent`, `resolved`, `closed`
  - Example: `status=new,open,in_progress`

- `priority` (string, optional): Comma-separated values
  - Possible values: `low`, `medium`, `high`, `urgent`
  - Example: `priority=high,urgent`

- `channel` (string, optional): Comma-separated values
  - Possible values: `email`, `whatsapp`, `phone_call`, `webchat`, `webform`
  - Example: `channel=email,whatsapp`

- `department_id` (string, optional): Comma-separated department IDs
  - Example: `department_id=d123,d124`

- `tags` (string, optional): Comma-separated tag names or IDs
  - Example: `tags=payment,urgent,visa`

- `assigned_to_me` (boolean, optional): Filter tickets assigned to the authenticated agent
  - Example: `assigned_to_me=true`

- `unassigned` (boolean, optional): Filter unassigned tickets only
  - Example: `unassigned=true`

- `has_unread` (boolean, optional): Filter tickets with unread messages
  - Example: `has_unread=true`

### Sorting
- `sort_by` (string, optional, default: `updated_at`): Sort field
  - Possible values: `created_at`, `updated_at`, `last_message_at`, `priority`, `status`

- `sort_order` (string, optional, default: `desc`): Sort direction
  - Possible values: `asc`, `desc`

### Additional Options
- `include_unread_count` (boolean, optional): Include total unread count in response
  - Example: `include_unread_count=true`

---

## Example Request

### Complex Search with Multiple Filters

```bash
curl -X GET 'https://api.getevo.dev/api/agent/tickets/search' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -G \
  --data-urlencode 'page=1' \
  --data-urlencode 'limit=50' \
  --data-urlencode 'search=payment' \
  --data-urlencode 'status=new,open,in_progress' \
  --data-urlencode 'priority=high,urgent' \
  --data-urlencode 'channel=email,whatsapp' \
  --data-urlencode 'assigned_to_me=true' \
  --data-urlencode 'sort_by=updated_at' \
  --data-urlencode 'sort_order=desc' \
  --data-urlencode 'include_unread_count=true'
```

### Simple Request (All Tickets)

```bash
curl -X GET 'https://api.getevo.dev/api/agent/tickets/search?page=1&limit=50' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "page": 1,
    "limit": 50,
    "total": 127,
    "total_pages": 3,
    "unread_count": 23,
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "ticket_number": "TCK-2025-001234",
        "title": "Help needed for payment failure",
        "status": "open",
        "priority": "high",
        "channel": "email",
        "created_at": "2025-01-21T10:30:00Z",
        "updated_at": "2025-01-21T14:45:00Z",
        "last_message_at": "2025-01-21T14:45:00Z",
        "last_message_preview": "Hi, I need help to process the payment via my VISA card...",
        "unread_messages_count": 2,
        "is_assigned_to_me": true,
        "customer": {
          "id": "c123e4567-e89b-12d3-a456-426614174000",
          "name": "Dean Taylor",
          "email": "dean.taylor@gmail.com",
          "phone": "+1234567890",
          "avatar_url": null,
          "initials": "DT"
        },
        "assigned_agents": [
          {
            "id": "a123e4567-e89b-12d3-a456-426614174001",
            "name": "John Doe",
            "avatar_url": "/avatars/john.jpg"
          }
        ],
        "department": {
          "id": "d123",
          "name": "Sales Department"
        },
        "tags": [
          {
            "id": "t1",
            "name": "payment",
            "color": "#FF5733"
          },
          {
            "id": "t2",
            "name": "urgent",
            "color": "#FFC300"
          }
        ],
        "message_count": 8,
        "has_attachments": true
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "ticket_number": "TCK-2025-001235",
        "title": "Question about pricing plans",
        "status": "new",
        "priority": "medium",
        "channel": "webchat",
        "created_at": "2025-01-21T12:15:00Z",
        "updated_at": "2025-01-21T12:15:00Z",
        "last_message_at": "2025-01-21T12:15:00Z",
        "last_message_preview": "Hi, I have recently come across your website and...",
        "unread_messages_count": 1,
        "is_assigned_to_me": false,
        "customer": {
          "id": "c223e4567-e89b-12d3-a456-426614174002",
          "name": "Jenny Wilson",
          "email": "jenny.w@company.com",
          "phone": null,
          "avatar_url": null,
          "initials": "JW"
        },
        "assigned_agents": [],
        "department": {
          "id": "d124",
          "name": "Support Department"
        },
        "tags": [
          {
            "id": "t3",
            "name": "pricing",
            "color": "#28B463"
          }
        ],
        "message_count": 1,
        "has_attachments": false
      }
    ]
  }
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired access token"
  }
}
```

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Invalid query parameters",
    "details": {
      "limit": "Must be between 1 and 100"
    }
  }
}
```

---

## Response Field Descriptions

### Root Level
- `page` (integer): Current page number
- `limit` (integer): Items per page
- `total` (integer): Total number of tickets matching the filters
- `total_pages` (integer): Total number of pages
- `unread_count` (integer, optional): Total unread tickets count (if `include_unread_count=true`)
- `data` (array): Array of ticket objects

### Ticket Object

#### Basic Information
- `id` (string, UUID): Unique ticket identifier
- `ticket_number` (string): Human-readable ticket number (e.g., "TCK-2025-001234")
- `title` (string): Ticket subject/title
- `status` (string): Current status (new, open, in_progress, wait_for_customer, wait_for_agent, resolved, closed)
- `priority` (string): Priority level (low, medium, high, urgent)
- `channel` (string): Communication channel (email, whatsapp, phone_call, webchat, webform)

#### Timestamps
- `created_at` (string, ISO 8601): Ticket creation timestamp
- `updated_at` (string, ISO 8601): Last update timestamp
- `last_message_at` (string, ISO 8601): Timestamp of last message

#### Message Information
- `last_message_preview` (string): First ~100 characters of the last message
- `unread_messages_count` (integer): Number of unread messages in this ticket
- `message_count` (integer): Total number of messages in the conversation
- `has_attachments` (boolean): Whether the ticket has any attachments

#### Customer Information
- `customer` (object):
  - `id` (string, UUID): Customer identifier
  - `name` (string): Customer full name
  - `email` (string): Customer email address
  - `phone` (string, nullable): Customer phone number
  - `avatar_url` (string, nullable): URL to customer avatar image
  - `initials` (string): Customer initials (e.g., "DT" for "Dean Taylor")

#### Assignment Information
- `is_assigned_to_me` (boolean): Whether ticket is assigned to the authenticated agent
- `assigned_agents` (array): List of assigned agents
  - `id` (string, UUID): Agent identifier
  - `name` (string): Agent full name
  - `avatar_url` (string, nullable): URL to agent avatar image
- `department` (object):
  - `id` (string): Department identifier
  - `name` (string): Department name

#### Metadata
- `tags` (array): Associated tags
  - `id` (string): Tag identifier
  - `name` (string): Tag name
  - `color` (string): Hex color code for tag display (e.g., "#FF5733")

---

## Additional Required Endpoints

### 1. Get Unread Count
**Endpoint:** `GET /api/agent/tickets/unread-count`

**Description:** Get the total count of unread tickets for the authenticated agent

**Response:**
```json
{
  "success": true,
  "data": {
    "unread_count": 23
  }
}
```

---

### 2. Get Ticket Messages
**Endpoint:** `GET /api/agent/tickets/{id}/messages`

**Description:** Get all messages for a specific ticket

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "limit": 50,
    "total": 8,
    "data": [
      {
        "id": "m1",
        "ticket_id": "550e8400-e29b-41d4-a716-446655440000",
        "author": {
          "id": "c123",
          "name": "Dean Taylor",
          "type": "customer",
          "avatar_url": null,
          "initials": "DT"
        },
        "content": "Hi, I need help to process the payment via my VISA card...",
        "created_at": "2025-01-21T10:30:00Z",
        "is_read": true,
        "attachments": [
          {
            "id": "att1",
            "name": "doc.pdf",
            "size": 29000,
            "type": "application/pdf",
            "url": "https://storage.example.com/attachments/doc.pdf"
          }
        ]
      }
    ]
  }
}
```

---

### 3. Mark Ticket as Read
**Endpoint:** `PATCH /api/agent/tickets/{id}/read`

**Description:** Mark all messages in a ticket as read

**Response:**
```json
{
  "success": true,
  "data": {
    "ticket_id": "550e8400-e29b-41d4-a716-446655440000",
    "marked_read_at": "2025-01-21T15:00:00Z"
  }
}
```

---

### 4. Get Departments
**Endpoint:** `GET /api/agent/departments`

**Description:** Get list of all departments for filtering

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "d123",
      "name": "Sales Department",
      "agent_count": 5
    },
    {
      "id": "d124",
      "name": "Support Department",
      "agent_count": 12
    }
  ]
}
```

---

### 5. Get Tags
**Endpoint:** `GET /api/agent/tags`

**Description:** Get list of all available tags with usage statistics

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "t1",
      "name": "payment",
      "color": "#FF5733",
      "usage_count": 45
    },
    {
      "id": "t2",
      "name": "urgent",
      "color": "#FFC300",
      "usage_count": 23
    }
  ]
}
```

---

## Performance Requirements

### Response Time
- **Target:** < 500ms for typical queries (50 items, 2-3 filters)
- **Maximum:** < 1000ms for complex queries (100 items, 5+ filters, full-text search)

### Database Indexing
Efficient indexes must be created on the following fields:
- `status`
- `priority`
- `customer_id`
- `assigned_agent_id`
- `department_id`
- `created_at`
- `updated_at`
- `last_message_at`
- `channel`

### Full-Text Search
- Index ticket `title` and message `content` for fast full-text search
- Support for partial matching (e.g., "pay" matches "payment")

---

## Real-Time Updates (Optional but Recommended)

For a better user experience, implement real-time updates using:
- **WebSocket** connection at `wss://api.getevo.dev/ws/agent/tickets`
- **Server-Sent Events (SSE)** at `GET /api/agent/tickets/events`

### Event Types:
1. `ticket.created` - New ticket created
2. `ticket.updated` - Ticket status/priority/assignment changed
3. `message.created` - New message in a ticket
4. `ticket.assigned` - Ticket assigned to agent
5. `ticket.unassigned` - Ticket unassigned from agent

---

## Frontend Integration Notes

### Frontend Needs
The left sidebar requires:
1. ✅ List of conversations with customer info
2. ✅ Search functionality across multiple fields
3. ✅ Multi-select filters (status, priority, channel, tags)
4. ✅ Sort by different criteria
5. ✅ Unread message indicators
6. ✅ Real-time updates when new messages arrive
7. ✅ Pagination with infinite scroll support

### Current Frontend State
- Located in: `/home/evo/homa-dashboard/app/conversations/ConversationsContent.tsx`
- Using mock data currently
- Filter UI already built and functional
- Needs API integration with `conversationService`

---

## Implementation Priority

### Phase 1 (Critical - MVP)
1. ✅ `GET /api/agent/tickets/search` with basic filters (status, priority)
2. ✅ Include customer info and message preview
3. ✅ Pagination support
4. ✅ Search by ticket number, customer name, title

### Phase 2 (High Priority)
1. ✅ Advanced filters (channel, department, tags, assignment)
2. ✅ Sorting options
3. ✅ `GET /api/agent/tickets/{id}/messages`
4. ✅ `PATCH /api/agent/tickets/{id}/read`

### Phase 3 (Nice to Have)
1. ✅ Real-time updates via WebSocket/SSE
2. ✅ `GET /api/agent/departments`
3. ✅ `GET /api/agent/tags`
4. ✅ Full-text search across message content

---

## Testing Checklist

- [ ] Test with no filters (all tickets)
- [ ] Test single filter (e.g., only status)
- [ ] Test multiple filters combined
- [ ] Test search functionality
- [ ] Test pagination (first page, middle page, last page)
- [ ] Test sorting (ascending and descending)
- [ ] Test with authenticated agent
- [ ] Test performance with large datasets (1000+ tickets)
- [ ] Test error handling (invalid parameters, unauthorized)
- [ ] Test unread count accuracy

---

## Notes for Backend Implementation

1. **Use proper SQL joins** to fetch customer, agent, and department data efficiently
2. **Implement query result caching** (Redis) for frequently accessed data
3. **Use database connection pooling** to handle concurrent requests
4. **Implement rate limiting** to prevent API abuse (e.g., 100 requests/minute per agent)
5. **Log slow queries** (> 1 second) for optimization
6. **Return consistent timestamp format** (ISO 8601 with timezone)
7. **Sanitize search input** to prevent SQL injection
8. **Implement proper pagination** to avoid loading all records at once

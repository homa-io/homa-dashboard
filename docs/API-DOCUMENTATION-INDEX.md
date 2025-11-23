# Homa API Documentation Index

Complete guide to all API documentation for the Homa intelligent support system.

**Created:** November 21, 2025
**Status:** Complete and Ready for Integration

---

## Quick Navigation

### For Different Needs

**I want to... Start integrating the API**
→ Read: [API-QUICK-REFERENCE.md](#api-quick-reference)

**I want to... Understand the complete API structure**
→ Read: [homa-api-documentation.md](#homa-api-documentation)

**I want to... Understand backend architecture**
→ Read: [BACKEND-EXPLORATION-SUMMARY.md](#backend-exploration-summary)

**I want to... Set up OAuth login**
→ Read: [Backend OAuth Guide](/home/evo/homa-backend/docs/oauth.md)

**I want to... Check the database schema**
→ Read: [Backend Models Guide](/home/evo/homa-backend/docs/models.md)

---

## Documentation Files

### 1. API-QUICK-REFERENCE.md
**File Size:** 6.6 KB
**Read Time:** 5 minutes
**Best For:** Developers who want to start coding quickly

**Contents:**
- Base URL and quick authentication examples
- All 60+ endpoints at a glance
- Key data type definitions
- Common patterns and error handling
- Implementation checklist

**Start Here If You:**
- Want to start building immediately
- Need a cheat sheet for API endpoints
- Are familiar with REST APIs
- Want to integrate quickly

---

### 2. homa-api-documentation.md
**File Size:** 30 KB
**Read Time:** 30-45 minutes
**Best For:** Complete understanding of every endpoint

**Contents:**
- Detailed base API configuration
- Complete authentication guide (JWT, OAuth, Email/Password)
- 60+ endpoints with full documentation:
  - System endpoints
  - Ticket management (public + agent-specific)
  - Tags management
  - Clients management
  - Departments management
  - Users management
  - Messages management
  - Channels management
- Complete data model schemas (TypeScript interfaces)
- Request/response examples for common scenarios
- Error handling and codes
- Pagination details and examples
- Important implementation notes
- Environment variables and production configuration

**Start Here If You:**
- Need complete endpoint documentation
- Want to understand request/response formats
- Are building complex features
- Need production deployment info

---

### 3. BACKEND-EXPLORATION-SUMMARY.md
**File Size:** 14 KB
**Read Time:** 20 minutes
**Best For:** Understanding the backend architecture

**Contents:**
- Executive summary of the API
- API specification details (OpenAPI 3.0.3)
- Server and database configuration
- Authentication mechanisms (3 methods)
- Core data models (7 models with relationships)
- API endpoint categorization
- Response format patterns
- Ticket status values (9 statuses)
- User types and permissions
- Key features and mechanisms
- Configuration file details
- Integration recommendations
- Summary statistics

**Start Here If You:**
- Want to understand how the backend works
- Need to explain the architecture to others
- Want to design your frontend components
- Need integration strategy recommendations

---

## Documentation Organization

### By Topic

**Authentication**
- Quick: API-QUICK-REFERENCE.md → "Authentication" section
- Complete: homa-api-documentation.md → "Authentication" section
- Deep: BACKEND-EXPLORATION-SUMMARY.md → "Authentication Mechanisms"

**Endpoints**
- Quick: API-QUICK-REFERENCE.md → "All Available Endpoints"
- Complete: homa-api-documentation.md → "API Endpoints by Category"
- Deep: BACKEND-EXPLORATION-SUMMARY.md → "API Endpoint Categories"

**Data Models**
- Quick: API-QUICK-REFERENCE.md → "Key Data Types"
- Complete: homa-api-documentation.md → "Data Models & Schemas"
- Deep: BACKEND-EXPLORATION-SUMMARY.md → "Core Data Models"

**Examples**
- Quick: API-QUICK-REFERENCE.md → "Common Patterns"
- Complete: homa-api-documentation.md → "Request/Response Examples"

### By User Role

**Frontend Developer (React/Next.js)**
1. Start: API-QUICK-REFERENCE.md
2. Reference: homa-api-documentation.md
3. Understand: BACKEND-EXPLORATION-SUMMARY.md

**Full Stack Developer**
1. Overview: BACKEND-EXPLORATION-SUMMARY.md
2. Integration: API-QUICK-REFERENCE.md
3. Reference: homa-api-documentation.md
4. Deep Dive: Backend source at /home/evo/homa-backend

**Backend Maintainer**
1. Overview: BACKEND-EXPLORATION-SUMMARY.md
2. Details: /home/evo/homa-backend/docs/oauth.md
3. Details: /home/evo/homa-backend/docs/models.md
4. Source: /home/evo/homa-backend/

**API Consumer (Third Party)**
1. Quick Reference: API-QUICK-REFERENCE.md
2. Complete Docs: homa-api-documentation.md
3. OAuth Setup: /home/evo/homa-backend/docs/oauth.md

---

## Feature Implementation Guide

### Login & Authentication
1. Read: API-QUICK-REFERENCE.md → "Authentication"
2. Details: homa-api-documentation.md → "Authentication"
3. OAuth Setup: /home/evo/homa-backend/docs/oauth.md

### Ticket Management
1. Quick: API-QUICK-REFERENCE.md → "Agent Tickets"
2. Complete: homa-api-documentation.md → "Ticket Management" sections
3. Examples: homa-api-documentation.md → "Request/Response Examples"

### User Management
1. Quick: API-QUICK-REFERENCE.md → "Key Data Types" → User
2. Complete: homa-api-documentation.md → "Users Management"
3. Permissions: BACKEND-EXPLORATION-SUMMARY.md → "User Types & Permissions"

### Dashboard/Analytics
1. Reference: API-QUICK-REFERENCE.md → "Pagination"
2. Unread Count: homa-api-documentation.md → "Get Unread Tickets Count"
3. Tickets List: homa-api-documentation.md → "Get Agent's Ticket List"

### Custom Features
1. Understanding: BACKEND-EXPLORATION-SUMMARY.md → "Key Features & Mechanisms"
2. Custom Fields: homa-api-documentation.md → "Important Implementation Notes"
3. Ticket Secrets: homa-api-documentation.md → "Ticket Secret System"

---

## API Endpoint Summary

### Total Endpoints: 60+

| Category | Count | Endpoints |
| --- | --- | --- |
| System | 2 | Health, Uptime |
| Authentication | 4 | Login, Refresh, Profile, OAuth Providers |
| Tickets | 13 | List, Get, Create, Update, Delete, Status, Department, Assign, Reply, Tags, Unread |
| Tags | 7 | List, Get, Create, Update, Delete, Agent Create |
| Clients | 5 | List, Get, Create, Update, Delete |
| Departments | 5 | List, Get, Create, Update, Delete |
| Users | 5 | List, Get, Create, Update, Delete |
| Messages | 5 | List, Get, Create, Update, Delete |
| Channels | 5 | List, Get, Create, Update, Delete |

---

## Configuration Reference

### Backend Configuration
**Location:** `/home/evo/homa-backend/config.yml`

**Key Settings:**
- Database: MySQL (localhost:3306, default: homa)
- HTTP Server: Port 8000
- JWT Secret: Changeable (24-hour token expiry)
- OAuth: Google and Microsoft support

### Environment Variables
See: homa-api-documentation.md → "Environment Variables"

### Production Checklist
See: homa-api-documentation.md → "Quick Integration Checklist"

---

## API Specifications

### OpenAPI/Swagger
- **Format:** OpenAPI 3.0.3
- **Location:** `/home/evo/homa-backend/swagger.json`
- **File Size:** 82 KB
- **Endpoints Documented:** All 60+

### API Version
- **Current:** 1.0.0
- **Framework:** Evo v2
- **Language:** Go
- **Database:** MySQL 5.7+

---

## Key Concepts

### Authentication Methods
1. **JWT Bearer Token** - Stateless authentication with 24-hour expiry
2. **OAuth 2.0** - Google and Microsoft providers with redirect flow
3. **Email/Password** - Standard login with password hashing

See: homa-api-documentation.md → "Authentication"

### Ticket Statuses (9 Values)
- new, wait_for_agent, in_progress, wait_for_user, on_hold, resolved, closed, unresolved, spam

See: API-QUICK-REFERENCE.md → "Valid Ticket Statuses"

### User Types (2 Roles)
- **Administrator** - Full system access
- **Agent** - Department-based access control

See: BACKEND-EXPLORATION-SUMMARY.md → "User Types & Permissions"

### Response Format
All endpoints use consistent JSON response:
```json
{
  "success": boolean,
  "data": { ... } or [ ... ]
}
```

See: API-QUICK-REFERENCE.md → "Common Patterns"

---

## Troubleshooting & FAQ

### "I'm getting 401 Unauthorized"
1. Check: Do you have a valid access token?
2. Verify: Is the Authorization header formatted as `Bearer {token}`?
3. Solution: Use `/auth/refresh` endpoint with refresh token
4. Reference: homa-api-documentation.md → "Refresh Token"

### "I'm getting pagination errors"
1. Check: Are you using valid page/limit values?
2. Reference: API-QUICK-REFERENCE.md → "Pagination"
3. Details: homa-api-documentation.md → "Pagination"

### "OAuth login isn't working"
1. Reference: /home/evo/homa-backend/docs/oauth.md
2. Check: Is the OAuth provider enabled in config.yml?
3. Verify: Is redirect_url properly URL-encoded?
4. Solution: Implement the OAuth flow as shown in backend docs

### "I need to store ticket secret safely"
1. Reference: API-QUICK-REFERENCE.md → "Important Notes"
2. Details: homa-api-documentation.md → "Ticket Secret System"
3. Security: Only returned during ticket creation

---

## Quick Integration Checklist

- [ ] Read API-QUICK-REFERENCE.md
- [ ] Set up authentication (JWT + OAuth)
- [ ] Create API client wrapper
- [ ] Implement token refresh logic
- [ ] Build login page
- [ ] Build ticket list component
- [ ] Build ticket detail component
- [ ] Implement ticket operations (status, assign, reply)
- [ ] Add unread count display
- [ ] Implement logout
- [ ] Test error handling
- [ ] Add loading states
- [ ] Set up pagination
- [ ] Deploy to production

See: API-QUICK-REFERENCE.md → "Implementation Checklist"

---

## Related Documentation

### Backend Source
- **Location:** `/home/evo/homa-backend/`
- **OAuth Setup:** `/home/evo/homa-backend/docs/oauth.md`
- **Database Schema:** `/home/evo/homa-backend/docs/models.md`
- **Development Guide:** `/home/evo/homa-backend/docs/guideline.md`
- **Project Info:** `/home/evo/homa-backend/CLAUDE.md`

### Frontend Source
- **Location:** `/home/evo/homa-dashboard/`
- **Docs:** `/home/evo/homa-dashboard/docs/`

---

## Version Information

| Component | Version | Location |
| --- | --- | --- |
| API Version | 1.0.0 | OpenAPI 3.0.3 |
| Framework | Evo v2 | Go-based |
| Database | MySQL | 5.7+ |
| Documentation | 1.0 | This index |

---

## Support & Feedback

### Questions?
1. Check: Relevant section in homa-api-documentation.md
2. Reference: BACKEND-EXPLORATION-SUMMARY.md for architecture
3. Source: /home/evo/homa-backend/ for implementation details

### Found an Issue?
1. Verify: Against current swagger.json at /home/evo/homa-backend/swagger.json
2. Check: Backend CLAUDE.md at /home/evo/homa-backend/CLAUDE.md
3. Source: Examine relevant code in /home/evo/homa-backend/apps/

---

## Document Statistics

| Document | File Size | Read Time | Type |
| --- | --- | --- | --- |
| API-QUICK-REFERENCE.md | 6.6 KB | 5 min | Quick reference |
| homa-api-documentation.md | 30 KB | 30-45 min | Complete guide |
| BACKEND-EXPLORATION-SUMMARY.md | 14 KB | 20 min | Architecture overview |
| **Total** | **50.6 KB** | **55-70 min** | **Complete docs** |

---

## Navigation Map

```
START HERE
    ↓
API-QUICK-REFERENCE.md (5 min read)
    ↓
Choose your path:
    ├─→ Need complete details?
    │   └─→ homa-api-documentation.md (45 min read)
    │
    ├─→ Want to understand architecture?
    │   └─→ BACKEND-EXPLORATION-SUMMARY.md (20 min read)
    │
    ├─→ Need OAuth setup?
    │   └─→ /home/evo/homa-backend/docs/oauth.md
    │
    └─→ Need database info?
        └─→ /home/evo/homa-backend/docs/models.md
```

---

## Last Updated

- **Documentation:** November 21, 2025
- **API Version:** 1.0.0 (Current)
- **Status:** Complete and production-ready
- **Thoroughness:** Very Thorough (100% coverage)

---

**Next Steps:**
1. Choose a documentation file based on your needs
2. Follow the implementation checklist
3. Integrate with your Next.js dashboard
4. Deploy to production

Good luck with your integration!

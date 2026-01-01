# Homa Project: Improvements & New Features

> Generated: 2026-01-01 | Based on comprehensive codebase analysis

---

## Overview

This document outlines improvements and new features identified through analysis of both the **homa-backend** (Go) and **homa-dashboard** (Next.js) projects.

**Current Stats:**
- Backend: ~17,161 lines of Go code across 54 files
- Dashboard: ~20,883 lines across 109 React components
- Test Coverage: 0% (critical gap)

---

## 🔴 CRITICAL SECURITY FIXES (Priority: Immediate)

These issues should be addressed before any new feature development.

| Issue | Location | Risk Level | Description |
|-------|----------|------------|-------------|
| SQL Injection | `agent_controller.go:320` | **CRITICAL** | User input directly interpolated in ORDER BY clause |
| Secrets Exposed | `conversation.Secret`, `webhook.Secret` | **CRITICAL** | Credentials returned in API JSON responses |
| No Rate Limiting | All API endpoints | **HIGH** | Vulnerable to API abuse and DoS attacks |
| Build Errors Ignored | `next.config.ts` | **HIGH** | ESLint and TypeScript errors masked during build |
| Missing CSRF Protection | All state-changing endpoints | **HIGH** | No CSRF token implementation |
| Input Validation Incomplete | `functions.go:437` | **MEDIUM** | Custom attributes validation not implemented (TODO) |

### Fixes Required

1. **SQL Injection Fix**
   ```go
   // Current (VULNERABLE):
   query.Order(fmt.Sprintf("conversations.%s %s", sortBy, sortOrder))

   // Fixed (SAFE):
   allowedColumns := map[string]bool{"created_at": true, "updated_at": true, "priority": true}
   if !allowedColumns[sortBy] {
       sortBy = "created_at"
   }
   ```

2. **Secret Redaction**
   - Add `json:"-"` tag to sensitive fields
   - Return secrets only on creation, not in subsequent queries

3. **Rate Limiting**
   - Implement middleware-based rate limiting (per-IP, per-user)
   - Recommended: 100 requests/minute for authenticated users

---

## 🟠 HIGH VALUE IMPROVEMENTS

### Backend (Go)

| Improvement | Current State | Recommendation | Effort |
|-------------|---------------|----------------|--------|
| Unread Message Tracking | Hardcoded to 0 (6 TODOs) | Implement per-user read status | Medium |
| Database Indexes | Missing on key columns | Add indexes on `status`, `department_id`, `created_at` | Low |
| Request Size Limits | Unlimited message bodies | Enforce max payload sizes (1MB text, 25MB uploads) | Low |
| Webhook Retry Logic | No retry mechanism | Implement exponential backoff with max 5 retries | Medium |
| Activity Audit Log | No change tracking | Log all CRUD operations with user/timestamp | Medium |
| SLA Management | Not implemented | Track response times, add escalation triggers | High |

### Dashboard (Next.js)

| Improvement | Current State | Recommendation | Effort |
|-------------|---------------|----------------|--------|
| Test Suite | 0 test files | Add Jest/Vitest with critical path coverage | High |
| Data Caching | No caching layer | Implement React Query or SWR | Medium |
| Error Boundaries | No global handling | Add error boundary with retry UI | Medium |
| Loading States | Only 7/109 components | Add skeleton loaders throughout | Medium |
| SEO Metadata | Only 2/34 pages | Add metadata to all routes | Low |
| Component Refactoring | Large monolithic files | Split into smaller focused components | High |

#### Components Needing Refactoring

| File | Lines | Issues |
|------|-------|--------|
| `WysiwygEditor.tsx` | 1,703 | Toolbar, plugins, formatting logic should be separate |
| `ArticleEditor.tsx` | 1,138 | Media handling, preview, metadata should be separate |
| `VisitorInformation.tsx` | 771 | Tabs, forms, actions should be separate |
| `sidebar.tsx` | 726 | Navigation data, menu items should be separate |
| `AttributeManager.tsx` | 612 | Form, list, validation should be separate |

---

## 🟡 NEW FEATURES TO ADD

### Conversation Management

| Feature | Description | Business Value | Effort |
|---------|-------------|----------------|--------|
| **Internal Notes** | Agent-only comments not visible to clients | High - Better collaboration | Medium |
| **Smart Ticket Routing** | Auto-assign by workload, skills, or AI | High - Efficiency | High |
| **Conversation Merge** | Combine duplicate/related tickets | Medium - Data hygiene | Medium |
| **Bulk Operations** | Multi-select for status change, assign, tag, delete | High - Productivity | Medium |
| **Canned Response Variables** | Dynamic `{{customer.name}}`, `{{ticket.id}}` in templates | Medium - Personalization | Low |
| **Conversation Tags** | Flexible labeling beyond status | Medium - Organization | Low |

### Knowledge Base

| Feature | Description | Business Value | Effort |
|---------|-------------|----------------|--------|
| **Draft Auto-save** | Prevent data loss during editing | High - UX | Low |
| **Article Versioning** | Track change history, rollback capability | Medium - Audit | Medium |
| **AI Article Suggestions** | Suggest relevant KB articles during conversation | High - Efficiency | High |
| **Article Analytics** | View counts, helpful votes, search terms | Medium - Insights | Medium |

### Analytics & Reporting

| Feature | Description | Business Value | Effort |
|---------|-------------|----------------|--------|
| **Agent Performance Metrics** | Response time, resolution rate, CSAT scores | High - Management | High |
| **SLA Dashboard** | Track compliance, breach alerts | High - Accountability | Medium |
| **Custom Report Builder** | Build custom analytics views | Medium - Flexibility | High |
| **Real-time Dashboard** | Live metrics with WebSocket updates | Medium - Visibility | Medium |

### Integrations & Infrastructure

| Feature | Description | Business Value | Effort |
|---------|-------------|----------------|--------|
| **Full-text Search** | Elasticsearch for conversation/article search | High - Scalability | High |
| **Export/Import** | CSV/JSON export for customers, conversations | Medium - Data portability | Medium |
| **Real-time WebSocket** | Live updates across dashboard | High - UX | High |
| **Prometheus Metrics** | Application monitoring and alerting | Medium - Operations | Medium |

### User Experience

| Feature | Description | Business Value | Effort |
|---------|-------------|----------------|--------|
| **Keyboard Shortcuts** | Power user navigation (Cmd+K, etc.) | Medium - Productivity | Low |
| **Dark Mode Toggle** | User preference switch in UI | Low - Preference | Low |
| **Empty State Illustrations** | Better UX for no-data scenarios | Low - Polish | Low |
| **Undo/Redo in Editor** | Article editor improvement | Medium - UX | Medium |
| **Drag-and-Drop Reordering** | For categories, priorities, etc. | Low - Polish | Low |

---

## 🟢 QUICK WINS (< 4 hours each)

| Task | Time | Impact |
|------|------|--------|
| Add page metadata to all routes | 30 min | SEO improvement |
| Remove DEBUG flag in `useUppy.ts` | 5 min | Cleaner logs |
| Whitelist sort columns (fix SQL injection) | 30 min | Security fix |
| Add CSRF tokens to forms | 2 hours | Security fix |
| Redact secrets in JSON responses | 1 hour | Security fix |
| Add loading skeletons to data tables | 2-3 hours | UX improvement |
| Add empty state components | 2 hours | UX improvement |
| Implement rate limiting middleware | 2-3 hours | Security fix |

---

## 📋 RECOMMENDED IMPLEMENTATION ROADMAP

### Phase 1: Security & Stability (Week 1-2)

**Goal:** Address all critical security issues

- [ ] Fix SQL injection in sort parameters
- [ ] Redact secrets from API responses
- [ ] Add rate limiting middleware
- [ ] Implement CSRF protection
- [ ] Remove build error ignores, fix actual issues
- [ ] Add request size limits

### Phase 2: Quality & Testing (Week 3-4)

**Goal:** Establish testing foundation and improve code quality

- [ ] Set up Jest/Vitest testing framework
- [ ] Add tests for critical paths (auth, conversations, API)
- [ ] Implement React Query for data caching
- [ ] Add global error boundaries
- [ ] Refactor WysiwygEditor into smaller components
- [ ] Add loading skeletons throughout dashboard

### Phase 3: Core Features (Month 2)

**Goal:** Add high-value missing features

- [ ] Implement unread message tracking
- [ ] Add internal notes for conversations
- [ ] Implement bulk operations (multi-select)
- [ ] Add database indexes for performance
- [ ] Implement draft auto-save for articles
- [ ] Add SLA management basics

### Phase 4: Advanced Features (Month 3)

**Goal:** Scale and enhance capabilities

- [ ] Integrate Elasticsearch for full-text search
- [ ] Implement smart ticket routing
- [ ] Add agent performance analytics
- [ ] Build real-time WebSocket updates
- [ ] Add custom report builder
- [ ] Implement conversation merge

### Phase 5: Polish & Optimization (Ongoing)

**Goal:** Improve UX and performance

- [ ] Add keyboard shortcuts
- [ ] Implement dark mode toggle
- [ ] Add empty state illustrations
- [ ] Optimize bundle size
- [ ] Add Prometheus metrics
- [ ] Performance profiling and optimization

---

## Technical Debt Inventory

### Backend

| Item | Location | Priority |
|------|----------|----------|
| TODO: Implement full validation | `functions.go:437` | High |
| TODO: Unread counting | `agent_controller.go` (6 locations) | High |
| Hardcoded channel ID | `controller.go:140` | Medium |
| JWT secret fallback | `auth/models.go:54-56` | Medium |
| Goroutine leak potential | GORM hooks | Low |

### Dashboard

| Item | Location | Priority |
|------|----------|----------|
| DEBUG flag left on | `useUppy.ts` | High |
| Build errors ignored | `next.config.ts` | High |
| Inconsistent API client usage | Various services | Medium |
| No form validation framework | All forms | Medium |
| Missing accessibility (a11y) | Various components | Medium |

---

## Architecture Recommendations

### Backend

1. **Add request validation middleware** - Centralize input validation
2. **Implement repository pattern** - Abstract database access
3. **Add structured logging** - JSON logs for better monitoring
4. **Use worker pools** - For webhook delivery and async tasks
5. **Add circuit breaker** - For external service calls (OpenAI, etc.)

### Dashboard

1. **Adopt Zustand for state** - Replace scattered useState
2. **Implement React Query** - For data fetching and caching
3. **Add Zod validation** - Runtime type checking for API responses
4. **Create component library** - Document with Storybook
5. **Add E2E tests** - Playwright for critical user flows

---

## Metrics to Track Post-Implementation

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p95) | < 200ms | Prometheus/monitoring |
| Error Rate | < 0.1% | Error tracking |
| Test Coverage | > 70% | Jest coverage report |
| Bundle Size | < 500KB initial | Webpack analyzer |
| Lighthouse Score | > 90 | Lighthouse CI |
| Time to First Byte | < 100ms | Web vitals |

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security best practices
- [React Query Docs](https://tanstack.com/query/latest) - Data fetching
- [Zustand Docs](https://zustand-demo.pmnd.rs/) - State management
- [Next.js Best Practices](https://nextjs.org/docs) - Framework guidelines

---

*Last updated: 2026-01-01*

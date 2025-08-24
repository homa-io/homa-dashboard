# Development Patterns

This document captures development patterns, methodologies, and approaches that work well in this project. These patterns should be referenced and reused when implementing similar features.

## Format Template

```markdown
### Pattern: [Pattern Name]
**Category**: [UI/API/State/Data/etc.]
**Use Case**: [When to use this pattern]
**Implementation**:
\```typescript
// Pattern implementation
\```
**Benefits**: [Why this pattern works well]
**Example Usage**: [Real example from the project]
---
```

## Established Patterns

<!-- Patterns will be documented here as they are established -->

### Pattern: Custom Hook for API Calls
**Category**: Data Fetching
**Use Case**: When components need to fetch data from Go APIs
**Implementation**:
```typescript
// hooks/useApiData.ts
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export function useApiData<T>(
  key: string | string[],
  fetcher: () => Promise<T>,
  options?: {
    refetchInterval?: number;
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetcher,
    ...options,
  });
}
```
**Benefits**: 
- Consistent data fetching pattern
- Built-in caching and refetching
- Error and loading states handled automatically
**Example Usage**: 
```typescript
const { data, isLoading, error } = useApiData(
  ['dashboard', 'metrics'],
  () => dashboardService.getMetrics()
);
```

---

### Pattern: Service Layer for Go API Integration
**Category**: API Integration
**Use Case**: All communication with Go backend APIs
**Implementation**:
```typescript
// services/base.service.ts
export abstract class BaseService {
  protected baseUrl: string;
  
  constructor(endpoint: string) {
    this.baseUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  }
  
  protected async request<T>(
    path: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }
    
    return response.json();
  }
}
```
**Benefits**:
- Centralized API configuration
- Consistent error handling
- Easy to mock for testing
**Example Usage**: Extend BaseService for specific features

---

### Pattern: Component Composition
**Category**: UI Components
**Use Case**: Building complex UI from simple, reusable parts
**Implementation**:
```typescript
// components/Card/Card.tsx
export const Card = ({ children, className }: CardProps) => {
  return <div className={cn('card-base', className)}>{children}</div>;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```
**Benefits**:
- Flexible component composition
- Consistent styling
- Easy to extend and maintain

---

<!-- Add new patterns below this line -->
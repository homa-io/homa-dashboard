# Next.js Dashboard Development Guidelines

## Project Overview
This document outlines the best practices and structural guidelines for developing a Next.js interactive dashboard that consumes Go APIs. The architecture emphasizes modularity, maintainability, and scalability.

## Core Principles

### 1. Separation of Concerns
- **Single Responsibility**: Each file/module should have one clear purpose
- **Small, Focused Files**: Avoid monolithic components; break down complex logic into smaller, reusable pieces
- **Clear Boundaries**: Maintain clear separation between UI, business logic, and data layers

### 2. Type Safety
- Use TypeScript throughout the project
- Define interfaces for all data structures
- Leverage type inference where appropriate
- Create shared type definitions for API contracts

### 3. Component Architecture
- Prefer functional components with hooks
- Use composition over inheritance
- Keep components pure when possible
- Separate presentational and container components

## Project Structure

```
src/
├── app/                      # Next.js 13+ App Router
│   ├── (auth)/              # Route groups for authentication
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Main dashboard routes
│   │   ├── layout.tsx       # Dashboard layout wrapper
│   │   ├── page.tsx         # Dashboard home
│   │   ├── analytics/
│   │   ├── reports/
│   │   └── settings/
│   ├── api/                 # API routes (if needed)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── global.css           # Global styles
│
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── Form/
│   ├── charts/              # Chart components
│   │   ├── LineChart/
│   │   ├── BarChart/
│   │   └── PieChart/
│   ├── layouts/             # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   └── widgets/             # Business-specific widgets
│       ├── DashboardCard/
│       ├── MetricDisplay/
│       └── DataTable/
│
├── lib/                     # Core library code
│   ├── api/                 # API client and configuration
│   │   ├── client.ts        # HTTP client setup (Axios/Fetch)
│   │   ├── endpoints.ts     # API endpoint constants
│   │   └── interceptors.ts  # Request/Response interceptors
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts    # Data formatting utilities
│   │   ├── validators.ts    # Validation functions
│   │   └── helpers.ts       # General helper functions
│   └── config/              # Configuration
│       ├── constants.ts     # App constants
│       └── environment.ts   # Environment variables
│
├── services/                # Business logic and API services
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.types.ts
│   │   └── auth.hooks.ts
│   ├── dashboard/
│   │   ├── dashboard.service.ts
│   │   ├── dashboard.types.ts
│   │   └── dashboard.hooks.ts
│   └── analytics/
│       ├── analytics.service.ts
│       ├── analytics.types.ts
│       └── analytics.hooks.ts
│
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── usePagination.ts
│
├── store/                   # State management (Zustand/Redux)
│   ├── slices/
│   │   ├── auth.slice.ts
│   │   ├── dashboard.slice.ts
│   │   └── ui.slice.ts
│   ├── store.ts
│   └── types.ts
│
├── types/                   # TypeScript type definitions
│   ├── api.types.ts         # API response types
│   ├── models.types.ts      # Data model types
│   └── global.d.ts          # Global type declarations
│
├── styles/                  # Styling files
│   ├── themes/
│   │   ├── light.ts
│   │   └── dark.ts
│   ├── mixins/
│   └── variables.css
│
├── middleware/              # Next.js middleware
│   └── auth.ts
│
└── tests/                   # Test files
    ├── unit/
    ├── integration/
    └── e2e/
```

## File Organization Guidelines

### Component Files
Each component should be organized in its own directory with the following structure:

```
ComponentName/
├── ComponentName.tsx        # Main component file
├── ComponentName.types.ts   # TypeScript interfaces/types
├── ComponentName.styles.ts  # Styled components or CSS modules
├── ComponentName.test.tsx   # Component tests
├── ComponentName.stories.tsx # Storybook stories (if applicable)
└── index.ts                 # Public exports
```

### Service Layer
Services should handle all API communication and business logic:

```typescript
// services/dashboard/dashboard.service.ts
export class DashboardService {
  // Keep methods small and focused
  async getMetrics(): Promise<Metrics> { }
  async updateSettings(settings: Settings): Promise<void> { }
}

// services/dashboard/dashboard.hooks.ts
export const useDashboardMetrics = () => {
  // React Query or SWR for data fetching
}
```

## Best Practices

### 1. API Integration

#### API Client Setup
```typescript
// lib/api/client.ts
import axios from 'axios';
import { API_BASE_URL } from '@/lib/config/environment';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors in separate file
```

#### Service Pattern
```typescript
// services/analytics/analytics.service.ts
import { apiClient } from '@/lib/api/client';
import { AnalyticsData, ChartData } from './analytics.types';

export const analyticsService = {
  async getAnalytics(params: AnalyticsParams): Promise<AnalyticsData> {
    const { data } = await apiClient.get('/analytics', { params });
    return data;
  },
  
  async getChartData(chartId: string): Promise<ChartData> {
    const { data } = await apiClient.get(`/analytics/charts/${chartId}`);
    return data;
  },
};
```

### 2. State Management

#### Use Zustand for Global State
```typescript
// store/slices/dashboard.slice.ts
import { create } from 'zustand';

interface DashboardState {
  metrics: Metrics | null;
  loading: boolean;
  error: Error | null;
  fetchMetrics: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: null,
  loading: false,
  error: null,
  fetchMetrics: async () => {
    // Implementation
  },
}));
```

### 3. Data Fetching

#### Use React Query or SWR
```typescript
// hooks/useAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';

export const useAnalytics = (params: AnalyticsParams) => {
  return useQuery({
    queryKey: ['analytics', params],
    queryFn: () => analyticsService.getAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### 4. Component Patterns

#### Container/Presentational Pattern
```typescript
// components/widgets/MetricCard/MetricCard.tsx (Presentational)
interface MetricCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down';
  loading?: boolean;
}

export const MetricCard: FC<MetricCardProps> = ({ title, value, trend, loading }) => {
  // Pure presentation logic only
};

// components/widgets/MetricCard/MetricCardContainer.tsx (Container)
export const MetricCardContainer: FC<{ metricId: string }> = ({ metricId }) => {
  const { data, loading } = useMetric(metricId);
  return <MetricCard {...data} loading={loading} />;
};
```

### 5. Error Handling

#### Centralized Error Handling
```typescript
// lib/utils/error-handler.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
  }
}

export const handleApiError = (error: unknown): AppError => {
  // Standardize error handling
};
```

#### Error Boundaries
```typescript
// components/ErrorBoundary/ErrorBoundary.tsx
export class ErrorBoundary extends Component {
  // Implement error boundary for component trees
}
```

### 6. Performance Optimization

#### Code Splitting
- Use dynamic imports for heavy components
- Implement route-based code splitting
- Lazy load charts and visualizations

```typescript
// Lazy loading example
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

#### Memoization
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = memo(({ data }: Props) => {
  // Component implementation
});

// Use useMemo for expensive computations
const processedData = useMemo(() => {
  return heavyDataProcessing(rawData);
}, [rawData]);
```

### 7. Testing Strategy

#### Unit Tests
- Test individual functions and utilities
- Test component rendering and behavior
- Mock external dependencies

#### Integration Tests
- Test service layer with API mocks
- Test component integration with stores
- Test custom hooks

#### E2E Tests
- Test critical user flows
- Test dashboard interactions
- Test data visualization accuracy

### 8. Code Quality

#### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    'react/display-name': 'off',
  },
};
```

#### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### 9. Environment Configuration

#### Environment Variables
```typescript
// lib/config/environment.ts
const getEnvironmentVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config = {
  api: {
    baseUrl: getEnvironmentVariable('NEXT_PUBLIC_API_BASE_URL'),
    timeout: parseInt(getEnvironmentVariable('NEXT_PUBLIC_API_TIMEOUT') || '10000'),
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
  },
};
```

### 10. Security Best Practices

- **Input Validation**: Validate all user inputs
- **XSS Protection**: Sanitize user-generated content
- **CORS Configuration**: Configure CORS properly for API calls
- **Authentication**: Implement JWT or session-based auth
- **Authorization**: Implement role-based access control
- **Environment Variables**: Never commit sensitive data
- **HTTPS**: Always use HTTPS in production

## Naming Conventions

### Files and Folders
- **Components**: PascalCase (e.g., `DashboardCard.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `useAuth.ts`, `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE in files (e.g., `API_ENDPOINTS`)
- **Types/Interfaces**: PascalCase with descriptive suffixes (e.g., `UserProfile`, `ApiResponse`)

### Code Conventions
- **Functions**: camelCase (e.g., `getUserData`)
- **React Components**: PascalCase (e.g., `UserProfile`)
- **Variables**: camelCase (e.g., `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Interfaces**: PascalCase with 'I' prefix optional (e.g., `IUserData` or `UserData`)
- **Types**: PascalCase (e.g., `ButtonVariant`)
- **Enums**: PascalCase for name, UPPER_SNAKE_CASE for values

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `chore/description` - Maintenance tasks

### Commit Messages
Follow conventional commits:
- `feat: add new dashboard widget`
- `fix: resolve data fetching issue`
- `refactor: improve api service structure`
- `docs: update component documentation`
- `test: add unit tests for auth service`

## Development Workflow

1. **Planning Phase**
   - Define component requirements
   - Create TypeScript interfaces
   - Design component structure

2. **Implementation Phase**
   - Create component structure
   - Implement business logic in services
   - Add UI components
   - Integrate with state management

3. **Testing Phase**
   - Write unit tests
   - Add integration tests
   - Perform manual testing

4. **Documentation Phase**
   - Add JSDoc comments
   - Update component documentation
   - Add usage examples

## Performance Targets

- **Initial Load**: < 3 seconds
- **Route Transitions**: < 500ms
- **API Response**: < 1 second
- **Lighthouse Score**: > 90
- **Bundle Size**: < 200KB (initial)

## Accessibility Requirements

- **WCAG 2.1 Level AA** compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels
- Color contrast ratios
- Focus management

## Monitoring and Logging

### Client-Side Monitoring
- Implement error tracking (Sentry)
- Performance monitoring
- User analytics (privacy-compliant)

### Logging Strategy
```typescript
// lib/utils/logger.ts
export const logger = {
  error: (message: string, error?: Error) => {
    // Log to monitoring service
  },
  warn: (message: string, data?: any) => {
    // Warning logs
  },
  info: (message: string, data?: any) => {
    // Info logs (dev only)
  },
};
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Build optimization enabled
- [ ] Security headers configured
- [ ] Error monitoring setup
- [ ] Performance monitoring enabled
- [ ] SSL/TLS configured
- [ ] CDN configuration
- [ ] Database migrations completed
- [ ] API endpoints tested
- [ ] Load testing performed

## Continuous Improvement

- Regular dependency updates
- Performance audits
- Security audits
- Code quality reviews
- User feedback integration
- Documentation updates

---

**Note**: This guideline is a living document and should be updated as the project evolves and new best practices emerge.
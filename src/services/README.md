# Service Layer Documentation

This directory contains the service layer for the Homa Dashboard application. The service layer provides a clean abstraction over API calls and handles all external data operations.

## Architecture

### Core Components

1. **API Client** (`api-client.ts`)
   - Centralized HTTP client with authentication
   - Request/response interceptors
   - Error handling and retries
   - Token management

2. **Service Classes**
   - `auth.service.ts` - Authentication operations
   - `customer.service.ts` - Customer data operations  
   - `ticket.service.ts` - Ticket management operations

3. **React Hooks** (`../hooks/use-api.ts`)
   - `useApi` - Generic API operations with loading states
   - `usePaginatedApi` - Paginated data operations
   - `useApiAction` - Actions without data return (delete, etc.)

## Usage Examples

### Basic API Call

```typescript
import { customerService, useApi } from '@/services'

function CustomerList() {
  const { data, loading, error, execute } = useApi()

  useEffect(() => {
    execute(() => customerService.getCustomers({ page: 1, limit: 10 }))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.data.map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  )
}
```

### Paginated Data

```typescript
import { customerService, usePaginatedApi } from '@/services'

function CustomerTable() {
  const { data, pagination, loading, execute } = usePaginatedApi()

  const loadCustomers = (page = 1) => {
    execute(() => customerService.getCustomers({ page, limit: 20 }))
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  return (
    <div>
      {data?.map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
      
      <Pagination
        current={pagination?.page || 1}
        total={pagination?.total || 0}
        onChange={loadCustomers}
      />
    </div>
  )
}
```

### Form Submission

```typescript
import { customerService, useApiAction } from '@/services'

function CreateCustomerForm() {
  const { loading, error, execute } = useApiAction({
    onSuccess: () => {
      toast.success('Customer created successfully!')
      router.push('/customers')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = async (formData: CreateCustomerRequest) => {
    await execute(() => customerService.createCustomer(formData))
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Customer'}
      </button>
    </form>
  )
}
```

### Authentication

```typescript
import { authService, useApiAction } from '@/services'

function LoginForm() {
  const { loading, execute } = useApiAction({
    onSuccess: (data) => {
      toast.success('Login successful!')
      router.push('/dashboard')
    }
  })

  const handleLogin = async (email: string, password: string) => {
    await execute(() => authService.login({ email, password }))
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleLogin(email, password)
    }}>
      {/* login form */}
    </form>
  )
}
```

## Service Methods

### Customer Service

- `getCustomers(params)` - Get paginated customer list
- `getCustomer(id)` - Get single customer
- `createCustomer(data)` - Create new customer
- `updateCustomer(id, updates)` - Update customer
- `deleteCustomer(id)` - Delete customer
- `getCustomerStats()` - Get customer statistics
- `searchCustomers(query)` - Search customers
- `exportCustomers(format, filters)` - Export customer data

### Ticket Service

- `getTickets(params)` - Get paginated ticket list
- `getTicket(id)` - Get single ticket
- `createTicket(data)` - Create new ticket
- `updateTicket(id, updates)` - Update ticket
- `updateTicketStatus(id, status)` - Update ticket status
- `assignTicket(id, agentIds)` - Assign ticket to agents
- `getTicketStats()` - Get ticket statistics
- `getTicketComments(ticketId)` - Get ticket comments
- `addTicketComment(ticketId, comment)` - Add comment
- `bulkUpdateTickets(ids, updates)` - Bulk update tickets

### Auth Service

- `login(credentials)` - User login
- `logout()` - User logout
- `register(userData)` - Register new user
- `getProfile()` - Get current user profile
- `updateProfile(updates)` - Update user profile
- `changePassword(data)` - Change password
- `requestPasswordReset(email)` - Request password reset
- `refreshToken()` - Refresh authentication token

## Error Handling

All services use consistent error handling through the `ApiError` interface:

```typescript
interface ApiError {
  message: string
  status: number
  code?: string
}
```

Common error codes:
- `NETWORK_ERROR` - Connection issues
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data

## Environment Configuration

Set these environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Migration from Mock Data

To migrate existing components from mock data to the service layer:

1. Replace direct mock data imports with service calls
2. Add loading and error states using the provided hooks
3. Update component logic to handle asynchronous data
4. Add proper error handling and user feedback

Example migration:

```typescript
// Before (mock data)
import { mockCustomers } from '@/data/mockCustomers'

function CustomerList() {
  const customers = mockCustomers
  return <div>{/* render customers */}</div>
}

// After (service layer)
import { customerService, useApi } from '@/services'

function CustomerList() {
  const { data: customers, loading, error, execute } = useApi()

  useEffect(() => {
    execute(() => customerService.getCustomers())
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!customers) return <EmptyState />

  return <div>{/* render customers.data */}</div>
}
```

## Best Practices

1. **Always use the provided hooks** for consistent loading and error handling
2. **Handle all error cases** with appropriate user feedback
3. **Show loading states** for better user experience
4. **Use TypeScript types** provided by services for type safety
5. **Implement proper pagination** for large datasets
6. **Cache frequently used data** at the component level when appropriate
7. **Use optimistic updates** for better perceived performance
8. **Implement retry logic** for transient failures

## Testing

Services can be easily mocked for testing:

```typescript
// In tests
jest.mock('@/services', () => ({
  customerService: {
    getCustomers: jest.fn(),
    createCustomer: jest.fn(),
  }
}))
```

## Future Enhancements

- Add caching layer (React Query / SWR integration)
- Implement offline support
- Add request deduplication
- Add WebSocket support for real-time updates
- Implement optimistic updates pattern
- Add background sync capabilities
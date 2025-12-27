# Customer Implementation Quick Reference

## Files Created

```
/home/evo/homa-dashboard/
├── src/
│   ├── services/
│   │   └── customer.service.ts (UPDATED)
│   └── components/
│       └── customers/
│           ├── CreateCustomerModal.tsx (NEW)
│           ├── EditCustomerModal.tsx (NEW)
│           ├── CustomerConversationsModal.tsx (NEW)
│           └── index.ts (NEW)
├── CUSTOMER_IMPLEMENTATION_SUMMARY.md (NEW)
├── CUSTOMER_INTEGRATION_GUIDE.md (NEW)
└── CUSTOMER_QUICK_REFERENCE.md (NEW)
```

## API Endpoints Used

| Method | Endpoint | Service Method | Description |
|--------|----------|----------------|-------------|
| GET | `/api/admin/clients` | `getClients(params)` | List clients with pagination |
| GET | `/api/admin/clients?search=query` | `searchClients(query, limit)` | Search clients |
| GET | `/api/admin/clients/:id` | `getClient(id)` | Get single client |
| POST | `/api/admin/clients` | `createClient(data)` | Create new client |
| PUT | `/api/admin/clients/:id` | `updateClient(id, data)` | Update client |
| DELETE | `/api/admin/clients/:id` | `deleteClient(id)` | Delete client |
| GET | `/api/agent/clients/:id/conversations` | `conversationService.getClientPreviousConversations(id)` | Get client conversations |

## Data Types

### Client (Backend Schema)
```typescript
{
  id: string              // UUID
  name: string
  data: Record<string, any>  // Custom fields
  language: string | null
  timezone: string | null
  external_ids: ExternalID[]
  created_at: string
  updated_at: string
}
```

### ExternalID
```typescript
{
  id: number
  type: 'email' | 'phone' | 'whatsapp' | 'slack' | 'telegram' | 'web' | 'chat'
  value: string
}
```

### CreateClientRequest
```typescript
{
  name: string                    // Required
  data?: Record<string, any>      // Optional
  language?: string               // Optional
  timezone?: string               // Optional
  external_ids?: Array<{          // Optional
    type: string
    value: string
  }>
}
```

## Component Props

### CreateCustomerModal
```typescript
{
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}
```

### EditCustomerModal
```typescript
{
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: string | null
  onSuccess?: () => void
}
```

### CustomerConversationsModal
```typescript
{
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: string | null
  customerName?: string
}
```

## Usage Examples

### Import
```typescript
import {
  CreateCustomerModal,
  EditCustomerModal,
  CustomerConversationsModal
} from "@/components/customers"
import { customerService } from "@/services/customer.service"
```

### State Setup
```typescript
const [createOpen, setCreateOpen] = useState(false)
const [editOpen, setEditOpen] = useState(false)
const [conversationsOpen, setConversationsOpen] = useState(false)
const [selectedId, setSelectedId] = useState<string | null>(null)
```

### Create Customer
```typescript
<Button onClick={() => setCreateOpen(true)}>
  Add Customer
</Button>

<CreateCustomerModal
  open={createOpen}
  onOpenChange={setCreateOpen}
  onSuccess={() => console.log('Customer created!')}
/>
```

### Edit Customer
```typescript
<Button onClick={() => {
  setSelectedId(customer.id)
  setEditOpen(true)
}}>
  Edit
</Button>

<EditCustomerModal
  open={editOpen}
  onOpenChange={setEditOpen}
  customerId={selectedId}
  onSuccess={() => console.log('Customer updated!')}
/>
```

### View Conversations
```typescript
<Button onClick={() => {
  setSelectedId(customer.id)
  setConversationsOpen(true)
}}>
  View Conversations
</Button>

<CustomerConversationsModal
  open={conversationsOpen}
  onOpenChange={setConversationsOpen}
  customerId={selectedId}
  customerName={customer.name}
/>
```

### Fetch Customers
```typescript
const loadCustomers = async () => {
  const response = await customerService.getClients({
    page: 1,
    limit: 20,
    search: 'john'
  })

  if (response.success) {
    setCustomers(response.data.data)
  }
}
```

### Search Customers
```typescript
const searchCustomers = async (query: string) => {
  const response = await customerService.searchClients(query, 10)

  if (response.success) {
    setResults(response.data)
  }
}
```

### Create Customer
```typescript
const createCustomer = async () => {
  const response = await customerService.createClient({
    name: 'John Doe',
    language: 'en',
    timezone: 'America/New_York',
    external_ids: [
      { type: 'email', value: 'john@example.com' },
      { type: 'phone', value: '+1234567890' }
    ],
    data: {
      company: 'Acme Corp',
      custom_field: 'value'
    }
  })

  if (response.success) {
    console.log('Created:', response.data)
  }
}
```

### Update Customer
```typescript
const updateCustomer = async (id: string) => {
  const response = await customerService.updateClient(id, {
    name: 'Jane Doe',
    language: 'es',
    external_ids: [
      { type: 'email', value: 'jane@example.com' }
    ]
  })

  if (response.success) {
    console.log('Updated:', response.data)
  }
}
```

### Delete Customer
```typescript
const deleteCustomer = async (id: string) => {
  const response = await customerService.deleteClient(id)

  if (response.success) {
    console.log('Deleted successfully')
  }
}
```

### Get Customer Conversations
```typescript
const getConversations = async (clientId: string) => {
  const response = await conversationService.getClientPreviousConversations(
    clientId,
    100  // limit
  )

  console.log('Conversations:', response.data)
  console.log('Total:', response.total)
  console.log('Pages:', response.total_pages)
}
```

## Toast Notifications

### Success
```typescript
toast({
  title: "Success",
  description: "Customer created successfully"
})
```

### Error
```typescript
toast({
  title: "Error",
  description: "Failed to create customer",
  variant: "destructive"
})
```

### Validation Error
```typescript
toast({
  title: "Invalid JSON",
  description: "The custom data field contains invalid JSON",
  variant: "destructive"
})
```

## Common Patterns

### Handle API Response
```typescript
try {
  const response = await customerService.createClient(data)

  if (response.success) {
    toast({ title: "Success", description: "Action completed" })
    onSuccess?.()
  } else {
    toast({
      title: "Error",
      description: response.error?.message || "Action failed",
      variant: "destructive"
    })
  }
} catch (error) {
  console.error('Error:', error)
  toast({
    title: "Error",
    description: "An unexpected error occurred",
    variant: "destructive"
  })
}
```

### Form Validation
```typescript
if (!name.trim()) {
  toast({
    title: "Error",
    description: "Name is required",
    variant: "destructive"
  })
  return
}

// JSON validation
if (dataJson.trim()) {
  try {
    const parsed = JSON.parse(dataJson)
  } catch (error) {
    toast({
      title: "Invalid JSON",
      description: "The custom data field contains invalid JSON",
      variant: "destructive"
    })
    return
  }
}
```

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async () => {
  setIsLoading(true)
  try {
    await customerService.createClient(data)
  } finally {
    setIsLoading(false)
  }
}

// In JSX
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

## Styling Classes Used

### Modal Sizes
- Default: `max-w-lg` (32rem)
- Large: `max-w-2xl` (42rem) - Used for customer modals
- Extra Large: `max-w-3xl` (48rem) - Used for conversations modal

### Common Utilities
- Scrollable content: `overflow-y-auto max-h-[90vh]`
- Grid layout: `grid grid-cols-2 gap-4`
- Flex layout: `flex items-center gap-2`
- Spacing: `space-y-2`, `space-y-4`
- Text styles: `text-sm text-muted-foreground`

## External ID Types

- `email` - Email address
- `phone` - Phone number
- `whatsapp` - WhatsApp number
- `slack` - Slack user ID
- `telegram` - Telegram user ID
- `web` - Website/web identifier
- `chat` - Chat identifier

## Best Practices

1. Always validate JSON input before submission
2. Filter out empty external IDs before sending to API
3. Use loading states during async operations
4. Show toast notifications for user feedback
5. Reset forms after successful creation
6. Handle both API errors and client-side validation
7. Use proper TypeScript types for type safety
8. Call onSuccess callback to trigger data refresh
9. Use existing UI components for consistency
10. Follow project's code organization patterns

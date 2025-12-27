# Customer Modals Integration Guide

## Quick Integration Steps

To integrate the new customer modals into `/home/evo/homa-dashboard/app/customers/page.tsx`:

### 1. Add Imports

Add at the top of the file:

```typescript
import {
  CreateCustomerModal,
  EditCustomerModal,
  CustomerConversationsModal
} from "@/components/customers"
import { customerService } from "@/services/customer.service"
```

### 2. Add State Management

Inside the `CustomersPage` component, add state for modals:

```typescript
// Modal state management
const [createModalOpen, setCreateModalOpen] = useState(false)
const [editModalOpen, setEditModalOpen] = useState(false)
const [conversationsModalOpen, setConversationsModalOpen] = useState(false)
const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
const [selectedCustomerName, setSelectedCustomerName] = useState<string>("")

// Flag to trigger data refresh
const [refreshTrigger, setRefreshTrigger] = useState(0)
```

### 3. Add Refresh Handler

```typescript
const handleRefresh = () => {
  // Increment trigger to refresh customer list
  setRefreshTrigger(prev => prev + 1)

  // TODO: If you implement real API fetching, call the fetch function here
  // loadCustomers()
}
```

### 4. Update "Add Customer" Button Handlers

Find the "Add Customer" buttons (lines 276 and 574) and update onClick:

```typescript
// Line 276 - Header button
<Button className="w-full sm:w-auto" onClick={() => setCreateModalOpen(true)}>
  <Plus className="h-4 w-4 mr-2" />
  Add Customer
</Button>

// Line 574 - Empty state button
<Button onClick={() => setCreateModalOpen(true)}>
  <Plus className="h-4 w-4 mr-2" />
  Add Customer
</Button>
```

### 5. Update Dropdown Menu Actions

Update the `handleViewCustomer` and `handleEditCustomer` callbacks (lines 246-252):

```typescript
const handleViewCustomer = useCallback((customerId: string) => {
  const customer = customers.find(c => c.id === customerId)
  if (customer) {
    setSelectedCustomerId(customerId)
    setSelectedCustomerName(customer.name)
    setConversationsModalOpen(true)
  }
}, [customers])

const handleEditCustomer = useCallback((customerId: string) => {
  setSelectedCustomerId(customerId)
  setEditModalOpen(true)
}, [])
```

### 6. Add Modals at End of Component

Before the closing `</div>` tag (after line 581), add:

```typescript
      {/* Customer Modals */}
      <CreateCustomerModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleRefresh}
      />

      <EditCustomerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        customerId={selectedCustomerId}
        onSuccess={handleRefresh}
      />

      <CustomerConversationsModal
        open={conversationsModalOpen}
        onOpenChange={setConversationsModalOpen}
        customerId={selectedCustomerId}
        customerName={selectedCustomerName}
      />
    </div>
  )
}
```

## Complete Updated Component Structure

```typescript
"use client"

import { useState, useMemo, useCallback, memo } from "react"
// ... other imports ...
import {
  CreateCustomerModal,
  EditCustomerModal,
  CustomerConversationsModal
} from "@/components/customers"
import { customerService } from "@/services/customer.service"

export default function CustomersPage() {
  // Existing state
  const [customers] = useState<Customer[]>(mockCustomers)
  const [sortBy, setSortBy] = useState<string>('name')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filterSource, setFilterSource] = useState<string | null>(null)
  // ... other existing state ...

  // NEW: Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [conversationsModalOpen, setConversationsModalOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("")

  // NEW: Refresh handler
  const handleRefresh = () => {
    // Reload customer data here
    console.log('Refreshing customer list...')
  }

  // UPDATED: Existing callbacks
  const handleViewCustomer = useCallback((customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (customer) {
      setSelectedCustomerId(customerId)
      setSelectedCustomerName(customer.name)
      setConversationsModalOpen(true)
    }
  }, [customers])

  const handleEditCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId)
    setEditModalOpen(true)
  }, [])

  // ... rest of component ...

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Existing header, filters, table... */}

      {/* UPDATED: Add Customer buttons */}
      <Button
        className="w-full sm:w-auto"
        onClick={() => setCreateModalOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Customer
      </Button>

      {/* ... rest of existing JSX ... */}

      {/* NEW: Modals */}
      <CreateCustomerModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleRefresh}
      />

      <EditCustomerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        customerId={selectedCustomerId}
        onSuccess={handleRefresh}
      />

      <CustomerConversationsModal
        open={conversationsModalOpen}
        onOpenChange={setConversationsModalOpen}
        customerId={selectedCustomerId}
        customerName={selectedCustomerName}
      />
    </div>
  )
}
```

## Optional: Replace Mock Data with Real API

To fetch real customer data from the API:

### 1. Add useEffect to load customers:

```typescript
const [customers, setCustomers] = useState<Client[]>([])
const [isLoading, setIsLoading] = useState(true)
const [currentPage, setCurrentPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

useEffect(() => {
  loadCustomers()
}, [currentPage, refreshTrigger])

const loadCustomers = async () => {
  setIsLoading(true)
  try {
    const response = await customerService.getClients({
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined
    })

    if (response.success && response.data) {
      setCustomers(response.data.data)
      setTotalPages(response.data.total_pages)
    }
  } catch (error) {
    console.error('Error loading customers:', error)
    toast({
      title: "Error",
      description: "Failed to load customers",
      variant: "destructive"
    })
  } finally {
    setIsLoading(false)
  }
}
```

### 2. Add pagination controls:

```typescript
<div className="flex justify-center gap-2 mt-4">
  <Button
    variant="outline"
    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
    disabled={currentPage === 1}
  >
    Previous
  </Button>
  <span className="flex items-center px-4">
    Page {currentPage} of {totalPages}
  </span>
  <Button
    variant="outline"
    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
    disabled={currentPage === totalPages}
  >
    Next
  </Button>
</div>
```

### 3. Update types:

Replace the old `Customer` type imports with:

```typescript
import type { Client } from "@/services/customer.service"
```

Then update all `Customer` references to `Client` in the component.

### 4. Map Client to Customer format (if needed):

If you want to keep using the existing Customer type in the UI, create a mapper:

```typescript
const mapClientToCustomer = (client: Client): Customer => ({
  id: client.id,
  name: client.name,
  email: client.external_ids.find(e => e.type === 'email')?.value || '',
  phone: client.external_ids.find(e => e.type === 'phone')?.value || null,
  company: client.data?.company || '',
  status: 'active', // Set based on your logic
  createdAt: client.created_at,
  updatedAt: client.updated_at,
  avatar: client.data?.avatar,
  address: client.data?.address,
  customFields: client.data || {},
  tags: client.data?.tags || [],
  source: client.data?.source || 'web',
  totalTickets: 0, // Fetch separately if needed
  lastActivity: client.updated_at,
  value: 0 // Set based on your logic
})
```

## Testing the Integration

1. Click "Add Customer" button → should open CreateCustomerModal
2. Fill in customer details and click "Create Customer"
3. Verify toast notification appears
4. Verify customer list refreshes (if using real API)
5. Click "Edit Customer" in dropdown menu → should open EditCustomerModal with pre-filled data
6. Make changes and click "Save Changes"
7. Verify toast notification and data refresh
8. Click "View Details" in dropdown menu → should open CustomerConversationsModal
9. Verify conversations are displayed with pagination
10. Click on a conversation → should navigate to /conversations page

## Troubleshooting

### Modal doesn't open:
- Check that state is being updated correctly
- Verify imports are correct
- Check browser console for errors

### Data not saving:
- Check network tab for API calls
- Verify API endpoint is correct
- Check for validation errors in console
- Verify toast notifications show error messages

### Conversations not loading:
- Verify customerId is being passed correctly
- Check that conversationService is imported
- Verify API endpoint is accessible
- Check console for errors

### Type errors:
- Ensure Client type is imported from customer.service
- Verify ExternalID type is imported from conversation.types
- Check that all required props are passed to modals

## Additional Enhancements

### Add Delete Confirmation:

```typescript
const [deleteModalOpen, setDeleteModalOpen] = useState(false)

const handleDeleteCustomer = async () => {
  if (!selectedCustomerId) return

  try {
    const response = await customerService.deleteClient(selectedCustomerId)
    if (response.success) {
      toast({ title: "Success", description: "Customer deleted" })
      handleRefresh()
      setDeleteModalOpen(false)
    }
  } catch (error) {
    toast({ title: "Error", description: "Failed to delete customer", variant: "destructive" })
  }
}
```

### Add Search Debouncing:

```typescript
import { useEffect, useState } from 'react'
import { debounce } from 'lodash' // or implement your own

const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    // Trigger search
    loadCustomers()
  }, 300),
  []
)

useEffect(() => {
  debouncedSearch(searchQuery)
}, [searchQuery])
```

### Add Bulk Actions:

```typescript
const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([])

// Add checkboxes to table rows
// Add bulk action toolbar
// Implement bulk delete/update
```

"use client"

import { useState, useMemo, useCallback, memo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  MoreVertical,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Tag,
  Globe,
  Columns3,
  Mail,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CreateCustomerModal,
  EditCustomerModal,
  CustomerConversationsModal
} from "@/components/customers"
import { customerService, type Client } from "@/services/customer.service"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Memoized table row component for better performance
const CustomerTableRow = memo<{
  customer: Client
  visibleColumns: Record<string, boolean>
  onRowClick: (id: string) => void
  onViewCustomer: (id: string) => void
  onEditCustomer: (id: string) => void
  onDeleteCustomer: (id: string, name: string) => void
  getInitials: (name: string) => string
  formatDate: (date: string) => string
  getPrimaryEmail: (client: Client) => string
  getPrimaryPhone: (client: Client) => string
}>(({
  customer,
  visibleColumns,
  onRowClick,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  getInitials,
  formatDate,
  getPrimaryEmail,
  getPrimaryPhone
}) => {
  const primaryEmail = getPrimaryEmail(customer)
  const primaryPhone = getPrimaryPhone(customer)

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onRowClick(customer.id)}
    >
      <TableCell>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
            {customer.avatar && (
              <AvatarImage src={customer.avatar} alt={customer.name} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-sm sm:text-base block truncate">
              {customer.name}
            </div>
            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
              {primaryEmail && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{primaryEmail}</span>
                </div>
              )}
              {primaryPhone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span className="truncate">{primaryPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      {visibleColumns.language && (
        <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
          {customer.language || '-'}
        </TableCell>
      )}
      {visibleColumns.timezone && (
        <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
          {customer.timezone || '-'}
        </TableCell>
      )}
      {visibleColumns.externalIds && (
        <TableCell className="hidden sm:table-cell">
          <div className="flex flex-wrap gap-1">
            {(customer.external_ids || []).slice(0, 2).map((extId, index) => (
              <Badge key={index} variant="secondary" className="text-xs capitalize">
                {extId.type}
              </Badge>
            ))}
            {(customer.external_ids || []).length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{(customer.external_ids || []).length - 2}
              </Badge>
            )}
          </div>
        </TableCell>
      )}
      {visibleColumns.createdAt && (
        <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
          {formatDate(customer.created_at)}
        </TableCell>
      )}
      {visibleColumns.updatedAt && (
        <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden xl:table-cell">
          {formatDate(customer.updated_at)}
        </TableCell>
      )}
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewCustomer(customer.id)}>
              <Eye className="h-4 w-4 mr-2" />
              View Conversations
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditCustomer(customer.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Customer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDeleteCustomer(customer.id, customer.name)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
})

CustomerTableRow.displayName = 'CustomerTableRow'

export default function CustomersPage() {
  const router = useRouter()

  // Data state
  const [customers, setCustomers] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 20 // Items per page

  // Sorting and filtering
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [conversationsModalOpen, setConversationsModalOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null)

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    language: true,
    timezone: true,
    externalIds: true,
    createdAt: true,
    updatedAt: true
  })

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await customerService.getClients({
        page: currentPage,
        limit,
        search: debouncedSearchQuery || undefined,
        sort_by: sortBy === 'created' ? 'created_at' : sortBy,
        sort_order: sortOrder
      })

      if (response.success && response.data) {
        // Response structure: { success: true, data: Client[], meta: {...} }
        const clients = Array.isArray(response.data) ? response.data : []
        setCustomers(clients)
        setTotalCustomers(response.meta?.total || 0)
        setTotalPages(response.meta?.total_pages || 1)
      } else {
        setCustomers([])
        toast({
          title: "Error",
          description: response.error?.message || "Failed to load customers",
          variant: "destructive"
        })
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string; status?: number }
      console.error('Error fetching customers:', apiError)
      setCustomers([])
      toast({
        title: "Error",
        description: apiError?.message || "An unexpected error occurred while loading customers",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearchQuery, sortBy, sortOrder, currentPage])

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, sortBy, sortOrder])

  // Load customers on mount and when filters change
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Helper functions
  const getPrimaryEmail = useCallback((client: Client) => {
    const emailId = (client.external_ids || []).find(id => id.type === 'email')
    return emailId?.value || ''
  }, [])

  const getPrimaryPhone = useCallback((client: Client) => {
    const phoneId = (client.external_ids || []).find(id => id.type === 'phone' || id.type === 'whatsapp')
    return phoneId?.value || ''
  }, [])

  // Memoized callback functions for better performance
  const handleViewCustomer = useCallback((customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    setSelectedCustomerId(customerId)
    setSelectedCustomerName(customer?.name || null)
    setConversationsModalOpen(true)
  }, [customers])

  const handleEditCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId)
    setEditModalOpen(true)
  }, [])

  const handleDeleteCustomer = useCallback((customerId: string, customerName: string) => {
    setCustomerToDelete({ id: customerId, name: customerName })
    setDeleteDialogOpen(true)
  }, [])

  const handleRowClick = useCallback((customerId: string) => {
    router.push(`/customers/${customerId}`)
  }, [router])

  const confirmDelete = async () => {
    if (!customerToDelete) return

    setIsDeleting(true)
    try {
      const response = await customerService.deleteClient(customerToDelete.id)

      if (response.success) {
        toast({
          title: "Success",
          description: "Customer deleted successfully"
        })
        setDeleteDialogOpen(false)
        setCustomerToDelete(null)
        fetchCustomers() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: response.error?.message || "Failed to delete customer",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  const getInitials = useCallback((name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }, [])

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Customers</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
            Manage your customer database and relationships
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Filters and Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-0 sm:flex-initial sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-[350px]"
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="created_at">Sort by Created</SelectItem>
            <SelectItem value="updated_at">Sort by Updated</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </Button>

        <DropdownMenu open={columnsDropdownOpen} onOpenChange={setColumnsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <Columns3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Columns</span>
              <span className="sm:hidden">Cols</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <h4 className="font-semibold text-sm mb-2">Show Columns</h4>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.language}
                onCheckedChange={(checked) =>
                  setVisibleColumns(prev => ({ ...prev, language: checked }))
                }
              >
                <Globe className="h-4 w-4 mr-2" />
                Language
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.timezone}
                onCheckedChange={(checked) =>
                  setVisibleColumns(prev => ({ ...prev, timezone: checked }))
                }
              >
                <Globe className="h-4 w-4 mr-2" />
                Timezone
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.externalIds}
                onCheckedChange={(checked) =>
                  setVisibleColumns(prev => ({ ...prev, externalIds: checked }))
                }
              >
                <Tag className="h-4 w-4 mr-2" />
                External IDs
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.createdAt}
                onCheckedChange={(checked) =>
                  setVisibleColumns(prev => ({ ...prev, createdAt: checked }))
                }
              >
                <Calendar className="h-4 w-4 mr-2" />
                Created At
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.updatedAt}
                onCheckedChange={(checked) =>
                  setVisibleColumns(prev => ({ ...prev, updatedAt: checked }))
                }
              >
                <Calendar className="h-4 w-4 mr-2" />
                Updated At
              </DropdownMenuCheckboxItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results Summary and Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isLoading ? (
            'Loading customers...'
          ) : (
            `Showing ${((currentPage - 1) * limit) + 1}-${Math.min(currentPage * limit, totalCustomers)} of ${totalCustomers} customers`
          )}
        </p>

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 border rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-md">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No customers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery
                ? 'Try adjusting your search or add a new customer.'
                : 'Get started by adding your first customer.'}
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[600px] sm:min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] sm:w-[250px]">Customer</TableHead>
                {visibleColumns.language && <TableHead className="hidden lg:table-cell">Language</TableHead>}
                {visibleColumns.timezone && <TableHead className="hidden lg:table-cell">Timezone</TableHead>}
                {visibleColumns.externalIds && <TableHead className="hidden sm:table-cell">External IDs</TableHead>}
                {visibleColumns.createdAt && <TableHead className="hidden lg:table-cell">Created At</TableHead>}
                {visibleColumns.updatedAt && <TableHead className="hidden xl:table-cell">Updated At</TableHead>}
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  visibleColumns={visibleColumns}
                  onRowClick={handleRowClick}
                  onViewCustomer={handleViewCustomer}
                  onEditCustomer={handleEditCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  getInitials={getInitials}
                  formatDate={formatDate}
                  getPrimaryEmail={getPrimaryEmail}
                  getPrimaryPhone={getPrimaryPhone}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <CreateCustomerModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchCustomers}
      />

      <EditCustomerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        customerId={selectedCustomerId}
        onSuccess={fetchCustomers}
      />

      <CustomerConversationsModal
        open={conversationsModalOpen}
        onOpenChange={setConversationsModalOpen}
        customerId={selectedCustomerId}
        customerName={selectedCustomerName || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the customer "{customerToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
"use client"

import { useState, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  DollarSign,
  Ticket,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  Tag,
  Globe,
  Columns3,
  X,
  Check,
  MessageCircle,
  Monitor
} from "lucide-react"
import { mockCustomers, mockCustomFields } from "@/data/mockCustomers"
import { Customer, CustomerFilters } from "@/types/customer.types"
import { StatusBadge, SourceBadge } from "@/components/badges"
import { searchCustomers } from "@/lib/search-utils"
import { filterByTags } from "@/lib/badge-utils"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { CustomBadge } from "@/components/ui/custom-badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Memoized table row component for better performance
const CustomerTableRow = memo<{
  customer: Customer
  visibleColumns: Record<string, boolean>
  onViewCustomer: (id: string) => void
  onEditCustomer: (id: string) => void
  getInitials: (name: string) => string
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
}>(({ 
  customer, 
  visibleColumns, 
  onViewCustomer, 
  onEditCustomer, 
  getInitials, 
  formatCurrency, 
  formatDate 
}) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
          <AvatarImage src={customer.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {getInitials(customer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <Link 
            href={`/customers/${customer.id}`}
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline text-sm sm:text-base block truncate"
          >
            {customer.name}
          </Link>
          <div className="text-xs text-gray-500 mt-1">
            <StatusBadge status={customer.status} type="customer" size="sm" />
            {/* Show email on mobile when email column is hidden */}
            <div className="sm:hidden text-xs text-gray-500 mt-1 truncate">
              {customer.email}
            </div>
          </div>
        </div>
      </div>
    </TableCell>
    {visibleColumns.email && (
      <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
        {customer.email}
      </TableCell>
    )}
    {visibleColumns.phone && (
      <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
        {customer.phone || '-'}
      </TableCell>
    )}
    {visibleColumns.company && (
      <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
        {customer.company || '-'}
      </TableCell>
    )}
    {visibleColumns.source && (
      <TableCell className="hidden sm:table-cell">
        <SourceBadge source={customer.source} size="sm" />
      </TableCell>
    )}
    {visibleColumns.tags && (
      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {customer.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {customer.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{customer.tags.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
    )}
    {visibleColumns.tickets && (
      <TableCell className="text-sm hidden md:table-cell">
        <div className="flex items-center">
          <Ticket className="h-4 w-4 mr-1 text-gray-400" />
          {customer.totalTickets}
        </div>
      </TableCell>
    )}
    {visibleColumns.value && (
      <TableCell className="text-sm font-medium">
        {formatCurrency(customer.value)}
      </TableCell>
    )}
    {visibleColumns.lastActivity && (
      <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
        {formatDate(customer.lastActivity)}
      </TableCell>
    )}
    {visibleColumns.address && (
      <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden xl:table-cell">
        {customer.address ? `${customer.address.city}, ${customer.address.state}` : '-'}
      </TableCell>
    )}
    {visibleColumns.joinDate && (
      <TableCell className="text-sm text-gray-600 dark:text-gray-400 hidden xl:table-cell">
        {formatDate(customer.createdAt)}
      </TableCell>
    )}
    <TableCell>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewCustomer(customer.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEditCustomer(customer.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Customer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Customer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
))

CustomerTableRow.displayName = 'CustomerTableRow'

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(mockCustomers)
  const [sortBy, setSortBy] = useState<string>('name')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Individual filter states (following tickets pattern)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filterSource, setFilterSource] = useState<string | null>(null)
  
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false)
  const [tagSearchQuery, setTagSearchQuery] = useState('')
  const [visibleColumns, setVisibleColumns] = useState({
    email: true,
    phone: true,
    company: false,
    source: true,
    tags: true,
    tickets: true,
    value: true,
    lastActivity: true,
    address: false,
    joinDate: false,
    customFields: false
  })

  // Optimized filtering and sorting with centralized utilities
  const filteredAndSortedCustomers = useMemo(() => {
    // Apply search filter using centralized utility
    let filtered = searchCustomers(customers, searchQuery)

    // Apply tags filter using centralized utility
    filtered = filterByTags(filtered, filterTags)

    // Source filter
    if (filterSource) {
      filtered = filtered.filter(customer => customer.source === filterSource)
    }

    // Sort customers
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'email':
          return a.email.localeCompare(b.email)
        case 'company':
          return (a.company || '').localeCompare(b.company || '')
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'value':
          return b.value - a.value
        default:
          return 0
      }
    })
  }, [customers, searchQuery, filterTags, filterSource, sortBy])

  // Check if any filters are active
  const hasActiveFilters = filterTags.length > 0 || filterSource

  // Clear all filters function
  const clearAllFilters = () => {
    setFilterTags([])
    setFilterSource(null)
    setSearchQuery('')
  }

  // Available tags
  const availableTags = ['VIP', 'Enterprise', 'Pro', 'New', 'Healthcare', 'Finance', 'Tech', 'Retail']
  const filteredAvailableTags = availableTags
    .filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
    .slice(0, 5)

  // Memoized callback functions for better performance
  const handleViewCustomer = useCallback((customerId: string) => {
    window.location.href = `/customers/${customerId}`
  }, [])

  const handleEditCustomer = useCallback((customerId: string) => {
    window.location.href = `/customers/${customerId}?edit=true`
  }, [])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }, [])

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
        <Button className="w-full sm:w-auto">
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
            <SelectItem value="email">Sort by Email</SelectItem>
            <SelectItem value="company">Sort by Company</SelectItem>
            <SelectItem value="created">Sort by Created</SelectItem>
            <SelectItem value="value">Sort by Value</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2 sm:gap-4">
        <DropdownMenu open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1 sm:flex-initial">
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter & Sort</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Filter by Source */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Globe className="mr-2 h-4 w-4" />
                <span>Source</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={filterSource || ''} onValueChange={(value) => setFilterSource(value || null)}>
                  <DropdownMenuRadioItem value="">
                    <Globe className="mr-2 h-4 w-4 opacity-50" />
                    All Sources
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="webform">
                    <Globe className="mr-2 h-4 w-4" />
                    Web Form
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="webchat">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Web Chat
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="email">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="whatsapp">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="phone_call">
                    <Phone className="mr-2 h-4 w-4" />
                    Phone Call
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            {/* Filter by Tags */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tag className="mr-2 h-4 w-4" />
                <span>Tags</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                <Command>
                  <CommandInput 
                    placeholder="Search tags..." 
                    value={tagSearchQuery}
                    onValueChange={setTagSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup>
                      {filteredAvailableTags.map((tag) => (
                        <CommandItem key={tag} onSelect={() => {
                          if (filterTags.includes(tag)) {
                            setFilterTags(filterTags.filter(t => t !== tag))
                          } else {
                            setFilterTags([...filterTags, tag])
                          }
                        }}>
                          <div className="flex items-center gap-2 w-full">
                            <div className={`w-4 h-4 border rounded ${filterTags.includes(tag) ? 'bg-primary border-primary' : 'border-input'} flex items-center justify-center`}>
                              {filterTags.includes(tag) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span>{tag}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator />
            
            {/* Clear Filters */}
            <DropdownMenuItem onClick={clearAllFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear All Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
                checked={visibleColumns.email}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, email: checked }))
                }
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.phone}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, phone: checked }))
                }
              >
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.company}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, company: checked }))
                }
              >
                <Building className="h-4 w-4 mr-2" />
                Company
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.source}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, source: checked }))
                }
              >
                <Globe className="h-4 w-4 mr-2" />
                Source
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.tags}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, tags: checked }))
                }
              >
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.tickets}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, tickets: checked }))
                }
              >
                <Ticket className="h-4 w-4 mr-2" />
                Tickets
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.value}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, value: checked }))
                }
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Value
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.lastActivity}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, lastActivity: checked }))
                }
              >
                <Calendar className="h-4 w-4 mr-2" />
                Last Activity
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.address}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, address: checked }))
                }
              >
                <Building className="h-4 w-4 mr-2" />
                Address
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.joinDate}
                onCheckedChange={(checked) => 
                  setVisibleColumns(prev => ({ ...prev, joinDate: checked }))
                }
              >
                <Calendar className="h-4 w-4 mr-2" />
                Join Date
              </DropdownMenuCheckboxItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1 mb-4">
          {/* Source filter */}
          {filterSource && (
            <CustomBadge variant="blue" className="text-xs h-6 px-2 gap-1">
              <Globe className="w-3 h-3" />
              <span className="capitalize">{filterSource}</span>
              <button
                onClick={() => setFilterSource(null)}
                className="text-current hover:opacity-70 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </CustomBadge>
          )}
          
          {/* Tag filters */}
          {filterTags.map(tag => (
            <div key={`tag-${tag}`} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
              <Tag className="w-3 h-3" />
              <span className="capitalize">{tag}</span>
              <button
                onClick={() => setFilterTags(filterTags.filter(t => t !== tag))}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {/* Clear all filters button - show if multiple filters are active */}
          {((filterSource ? 1 : 0) + (filterTags.length > 0 ? 1 : 0)) > 1 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedCustomers.length} of {customers.length} customers
        </p>
      </div>

      {/* Customers Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[600px] sm:min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] sm:w-[250px]">Customer</TableHead>
              {visibleColumns.email && <TableHead className="hidden sm:table-cell">Email</TableHead>}
              {visibleColumns.phone && <TableHead className="hidden md:table-cell">Phone</TableHead>}
              {visibleColumns.company && <TableHead className="hidden lg:table-cell">Company</TableHead>}
              {visibleColumns.source && <TableHead className="hidden sm:table-cell">Source</TableHead>}
              {visibleColumns.tags && <TableHead className="hidden lg:table-cell">Tags</TableHead>}
              {visibleColumns.tickets && <TableHead className="hidden md:table-cell">Tickets</TableHead>}
              {visibleColumns.value && <TableHead>Value</TableHead>}
              {visibleColumns.lastActivity && <TableHead className="hidden lg:table-cell">Last Activity</TableHead>}
              {visibleColumns.address && <TableHead className="hidden xl:table-cell">Address</TableHead>}
              {visibleColumns.joinDate && <TableHead className="hidden xl:table-cell">Join Date</TableHead>}
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCustomers.map((customer) => (
              <CustomerTableRow 
                key={customer.id}
                customer={customer}
                visibleColumns={visibleColumns}
                onViewCustomer={handleViewCustomer}
                onEditCustomer={handleEditCustomer}
                getInitials={getInitials}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredAndSortedCustomers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No customers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or add your first customer.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
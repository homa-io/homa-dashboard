"use client"

import { Button } from '@/components/ui/button'
import { CustomBadge } from '@/components/ui/custom-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import {
  Filter,
  Mail,
  Globe,
  MessageCircle,
  Phone,
  Monitor,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CircleDot,
  X,
  Tag,
  Minus,
  AlertTriangle,
  Zap,
  Circle,
  Clock,
  XCircle,
  Loader,
  Archive,
  UserCheck,
  Check,
} from 'lucide-react'

interface ConversationFiltersProps {
  filterAssignedToMe: boolean
  setFilterAssignedToMe: (value: boolean) => void
  filterSource: string | null
  setFilterSource: (value: string | null) => void
  filterPriority: string | null
  setFilterPriority: (value: string | null) => void
  filterStatus: string | null
  setFilterStatus: (value: string | null) => void
  filterTags: string[]
  setFilterTags: (value: string[]) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (value: 'asc' | 'desc') => void
  tagSearchQuery: string
  setTagSearchQuery: (value: string) => void
  filteredAvailableTags: string[]
  hasActiveFilters: boolean
  clearAllFilters: () => void
}

// Helper functions for icons and colors
const getSourceIcon = (source: string) => {
  switch (source) {
    case 'email': return <Mail className="w-3 h-3" />
    case 'whatsapp': return <MessageCircle className="w-3 h-3" />
    case 'webchat': return <Monitor className="w-3 h-3" />
    case 'webform': return <Globe className="w-3 h-3" />
    case 'phone_call': return <Phone className="w-3 h-3" />
    default: return <Mail className="w-3 h-3" />
  }
}

const getSourceColor = (source: string) => {
  switch (source) {
    case 'email': return 'blue'
    case 'whatsapp': return 'green'
    case 'webchat': return 'purple'
    case 'webform': return 'yellow'
    case 'phone_call': return 'gray'
    default: return 'gray'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low': return 'gray'
    case 'medium': return 'yellow'
    case 'high': return 'red'
    case 'urgent': return 'red-dot'
    default: return 'gray'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return <Circle className="w-3 h-3" />
    case 'user_reply': return <ArrowUp className="w-3 h-3" />
    case 'agent_reply': return <ArrowDown className="w-3 h-3" />
    case 'processing': return <Loader className="w-3 h-3" />
    case 'closed': return <XCircle className="w-3 h-3" />
    case 'archived': return <Archive className="w-3 h-3" />
    case 'postponed': return <Clock className="w-3 h-3" />
    default: return <CircleDot className="w-3 h-3" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'blue'
    case 'user_reply': return 'green'
    case 'agent_reply': return 'blue'
    case 'processing': return 'yellow'
    case 'closed': return 'gray'
    case 'archived': return 'gray'
    case 'postponed': return 'yellow'
    default: return 'gray'
  }
}

export function ConversationFilters({
  filterAssignedToMe,
  setFilterAssignedToMe,
  filterSource,
  setFilterSource,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  filterTags,
  setFilterTags,
  sortOrder,
  setSortOrder,
  tagSearchQuery,
  setTagSearchQuery,
  filteredAvailableTags,
  hasActiveFilters,
  clearAllFilters,
}: ConversationFiltersProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter & Sort</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Assigned to me filter */}
          <DropdownMenuCheckboxItem
            checked={filterAssignedToMe}
            onCheckedChange={setFilterAssignedToMe}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Assigned to me
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />

          {/* Filter by Source */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Mail className="mr-2 h-4 w-4" />
              <span>Source</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={filterSource || ''} onValueChange={(value) => setFilterSource(value || null)}>
                <DropdownMenuRadioItem value="">
                  <Mail className="mr-2 h-4 w-4 opacity-50" />
                  All Sources
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="whatsapp">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="webchat">
                  <Monitor className="mr-2 h-4 w-4" />
                  Web Chat
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="webform">
                  <Globe className="mr-2 h-4 w-4" />
                  Web Form
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="phone_call">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone Call
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Filter by Priority */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Priority</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={filterPriority || ''} onValueChange={(value) => setFilterPriority(value || null)}>
                <DropdownMenuRadioItem value="">
                  <AlertCircle className="mr-2 h-4 w-4 opacity-50" />
                  All Priorities
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="low">
                  <Minus className="mr-2 h-4 w-4 text-gray-500" />
                  Low Priority
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">
                  <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  Medium Priority
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                  High Priority
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="urgent">
                  <Zap className="mr-2 h-4 w-4 text-red-600" />
                  Urgent
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Filter by Status */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CircleDot className="mr-2 h-4 w-4" />
              <span>Status</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={filterStatus || ''} onValueChange={(value) => setFilterStatus(value || null)}>
                <DropdownMenuRadioItem value="">
                  <CircleDot className="mr-2 h-4 w-4 opacity-50" />
                  All Status
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="new">
                  <Circle className="mr-2 h-4 w-4 text-blue-500" />
                  New
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="user_reply">
                  <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                  User Reply
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="agent_reply">
                  <ArrowDown className="mr-2 h-4 w-4 text-blue-500" />
                  Agent Reply
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="processing">
                  <Loader className="mr-2 h-4 w-4 text-yellow-500" />
                  Processing
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="closed">
                  <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                  Closed
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="archived">
                  <Archive className="mr-2 h-4 w-4 text-gray-500" />
                  Archived
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="postponed">
                  <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                  Postponed
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

          {/* Sort by Date */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <span>Sort by Date</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                <DropdownMenuRadioItem value="desc">
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Newest First
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="asc">
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Oldest First
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
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

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1 mt-2">
          {filterSource && (
            <CustomBadge variant={getSourceColor(filterSource) as "blue" | "green" | "yellow" | "purple" | "gray"} className="text-xs h-6 px-2 gap-1">
              {getSourceIcon(filterSource)}
              <span className="capitalize">{filterSource.replace(/_/g, ' ')}</span>
              <button onClick={() => setFilterSource(null)} className="text-current hover:opacity-70 ml-1">
                <X className="w-3 h-3" />
              </button>
            </CustomBadge>
          )}
          {filterPriority && (
            <CustomBadge variant={getPriorityColor(filterPriority) as "gray" | "yellow" | "red" | "red-dot"} className="text-xs h-6 px-2 gap-1">
              <AlertCircle className="w-3 h-3" />
              <span className="capitalize">{filterPriority} priority</span>
              <button onClick={() => setFilterPriority(null)} className="text-current hover:opacity-70 ml-1">
                <X className="w-3 h-3" />
              </button>
            </CustomBadge>
          )}
          {filterStatus && (
            <CustomBadge variant={getStatusColor(filterStatus) as "blue" | "green" | "yellow" | "gray"} className="text-xs h-6 px-2 gap-1">
              {getStatusIcon(filterStatus)}
              <span className="capitalize">{filterStatus.replace(/_/g, ' ')}</span>
              <button onClick={() => setFilterStatus(null)} className="text-current hover:opacity-70 ml-1">
                <X className="w-3 h-3" />
              </button>
            </CustomBadge>
          )}
          {filterTags.map(tag => (
            <CustomBadge key={tag} variant="outline" className="text-xs h-6 px-2 gap-1">
              <Tag className="w-3 h-3" />
              {tag}
              <button onClick={() => setFilterTags(filterTags.filter(t => t !== tag))} className="text-current hover:opacity-70 ml-1">
                <X className="w-3 h-3" />
              </button>
            </CustomBadge>
          ))}
        </div>
      )}
    </>
  )
}

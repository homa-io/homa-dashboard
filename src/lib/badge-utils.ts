/**
 * Centralized utility functions for badge styling and logic
 * Consolidates repeated logic from multiple components
 */

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 
  'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'red-dot'

export interface StatusConfig {
  color: BadgeVariant
  label: string
  icon?: string
}

export interface PriorityConfig {
  color: BadgeVariant
  label: string
  weight: number
}

export interface SourceConfig {
  color: BadgeVariant
  label: string
  iconName: string
}

// Customer status configurations
export const CUSTOMER_STATUS_CONFIG: Record<string, StatusConfig> = {
  active: { color: 'green', label: 'Active' },
  inactive: { color: 'red', label: 'Inactive' },
  pending: { color: 'yellow', label: 'Pending' }
} as const

// Conversation status configurations
export const TICKET_STATUS_CONFIG: Record<string, StatusConfig> = {
  new: { color: 'blue', label: 'New' },
  open: { color: 'green', label: 'Open' },
  pending: { color: 'yellow', label: 'Pending' },
  wait_for_agent: { color: 'yellow', label: 'Wait for Agent' },
  in_progress: { color: 'yellow', label: 'In Progress' },
  wait_for_user: { color: 'purple', label: 'Wait for User' },
  on_hold: { color: 'gray', label: 'On Hold' },
  resolved: { color: 'green', label: 'Resolved' },
  closed: { color: 'gray', label: 'Closed' },
  unresolved: { color: 'red', label: 'Unresolved' },
  spam: { color: 'red', label: 'Spam' }
} as const

// Priority configurations  
export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  low: { color: 'gray', label: 'Low Priority', weight: 1 },
  medium: { color: 'yellow', label: 'Medium Priority', weight: 2 },
  high: { color: 'red', label: 'High Priority', weight: 3 },
  urgent: { color: 'red-dot', label: 'Urgent', weight: 4 }
} as const

// Source configurations
export const SOURCE_CONFIG: Record<string, SourceConfig> = {
  email: { color: 'blue', label: 'Email', iconName: 'Mail' },
  webform: { color: 'green', label: 'Web Form', iconName: 'Globe' },
  whatsapp: { color: 'green', label: 'WhatsApp', iconName: 'MessageCircle' },
  phone_call: { color: 'yellow', label: 'Phone Call', iconName: 'Phone' },
  webchat: { color: 'purple', label: 'Web Chat', iconName: 'Monitor' },
  website: { color: 'blue', label: 'Website', iconName: 'Globe' },
  referral: { color: 'purple', label: 'Referral', iconName: 'Users' },
  social: { color: 'green', label: 'Social Media', iconName: 'Share' }
} as const

/**
 * Get badge variant for customer status
 */
export const getCustomerStatusVariant = (status: string): BadgeVariant => {
  return CUSTOMER_STATUS_CONFIG[status?.toLowerCase()]?.color || 'gray'
}

/**
 * Get badge variant for conversation status
 */
export const getTicketStatusVariant = (status: string): BadgeVariant => {
  return TICKET_STATUS_CONFIG[status?.toLowerCase()]?.color || 'gray'
}

/**
 * Get badge variant for priority
 */
export const getPriorityVariant = (priority: string): BadgeVariant => {
  return PRIORITY_CONFIG[priority?.toLowerCase()]?.color || 'gray'
}

/**
 * Get badge variant for source
 */
export const getSourceVariant = (source: string): BadgeVariant => {
  return SOURCE_CONFIG[source?.toLowerCase()]?.color || 'gray'
}

/**
 * Get priority weight for sorting
 */
export const getPriorityWeight = (priority: string): number => {
  return PRIORITY_CONFIG[priority?.toLowerCase()]?.weight || 0
}

/**
 * Get formatted label for status/priority/source
 */
export const getStatusLabel = (status: string): string => {
  return CUSTOMER_STATUS_CONFIG[status?.toLowerCase()]?.label || 
         TICKET_STATUS_CONFIG[status?.toLowerCase()]?.label || 
         status
}

export const getPriorityLabel = (priority: string): string => {
  return PRIORITY_CONFIG[priority?.toLowerCase()]?.label || priority
}

export const getSourceLabel = (source: string): string => {
  return SOURCE_CONFIG[source?.toLowerCase()]?.label || source
}

/**
 * Sort items by priority (highest first)
 */
export const sortByPriority = <T extends { priority: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => 
    getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
  )
}

/**
 * Filter items by status
 */
export const filterByStatus = <T extends { status: string }>(
  items: T[], 
  statuses: string[]
): T[] => {
  if (statuses.length === 0) return items
  return items.filter(item => 
    statuses.some(status => 
      item.status.toLowerCase() === status.toLowerCase()
    )
  )
}

/**
 * Filter items by tags
 */
export const filterByTags = <T extends { tags: string[] }>(
  items: T[], 
  filterTags: string[]
): T[] => {
  if (filterTags.length === 0) return items
  return items.filter(item =>
    filterTags.some(filterTag =>
      item.tags.some(tag => 
        tag.toLowerCase().includes(filterTag.toLowerCase())
      )
    )
  )
}
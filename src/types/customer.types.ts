export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  updatedAt: string
  avatar?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  customFields: Record<string, string | number | boolean | string[]>
  tags: string[]
  source: 'webform' | 'webchat' | 'email' | 'whatsapp' | 'phone_call'
  totalTickets: number
  lastActivity: string
  value: number // Customer lifetime value
}

export interface CustomerFilters {
  search: string
  status: string[]
  tags: string[]
  source: string[]
  company: string
  dateRange: {
    from: string | null
    to: string | null
  }
  customFieldFilters: Record<string, string | number | boolean | string[]>
}

export interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'multiselect' | 'boolean'
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select/multiselect fields
  defaultValue?: string | number | boolean | string[]
}

export interface CustomerTicket {
  id: string
  title: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  updatedAt: string
  assignee?: string
}
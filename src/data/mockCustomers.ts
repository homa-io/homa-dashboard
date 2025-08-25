import { Customer, CustomerTicket, CustomField } from '@/types/customer.types'

export const mockCustomFields: CustomField[] = [
  {
    id: '1',
    name: 'industry',
    type: 'select',
    label: 'Industry',
    required: false,
    options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing']
  },
  {
    id: '2',
    name: 'subscription_plan',
    type: 'select',
    label: 'Subscription Plan',
    required: false,
    options: ['Basic', 'Pro', 'Enterprise']
  },
  {
    id: '3',
    name: 'annual_revenue',
    type: 'number',
    label: 'Annual Revenue',
    placeholder: 'Enter annual revenue',
    required: false
  },
  {
    id: '4',
    name: 'priority_customer',
    type: 'boolean',
    label: 'Priority Customer',
    required: false
  }
]

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-06-20T14:22:00Z',
    avatar: '',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States'
    },
    customFields: {
      industry: 'Technology',
      subscription_plan: 'Enterprise',
      annual_revenue: 5000000,
      priority_customer: true
    },
    tags: ['VIP', 'Enterprise', 'Tech'],
    source: 'email',
    totalTickets: 15,
    lastActivity: '2024-06-18T09:15:00Z',
    value: 25000
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@healthplus.com',
    phone: '+1 (555) 987-6543',
    company: 'HealthPlus Medical',
    status: 'active',
    createdAt: '2024-02-08T08:45:00Z',
    updatedAt: '2024-06-19T16:30:00Z',
    address: {
      street: '456 Medical Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      country: 'United States'
    },
    customFields: {
      industry: 'Healthcare',
      subscription_plan: 'Pro',
      annual_revenue: 2000000,
      priority_customer: true
    },
    tags: ['Healthcare', 'Pro'],
    source: 'webform',
    totalTickets: 8,
    lastActivity: '2024-06-19T11:45:00Z',
    value: 12000
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@financeworld.com',
    phone: '+1 (555) 456-7890',
    company: 'Finance World LLC',
    status: 'pending',
    createdAt: '2024-05-12T12:20:00Z',
    updatedAt: '2024-06-15T10:10:00Z',
    address: {
      street: '789 Wall Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10005',
      country: 'United States'
    },
    customFields: {
      industry: 'Finance',
      subscription_plan: 'Basic',
      annual_revenue: 800000,
      priority_customer: false
    },
    tags: ['Finance', 'New'],
    source: 'webchat',
    totalTickets: 3,
    lastActivity: '2024-06-14T15:20:00Z',
    value: 3500
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.r@edutech.edu',
    phone: '+1 (555) 321-0987',
    company: 'EduTech University',
    status: 'active',
    createdAt: '2024-03-22T14:15:00Z',
    updatedAt: '2024-06-17T13:45:00Z',
    address: {
      street: '321 University Blvd',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'United States'
    },
    customFields: {
      industry: 'Education',
      subscription_plan: 'Pro',
      annual_revenue: 1500000,
      priority_customer: false
    },
    tags: ['Education', 'Academic'],
    source: 'phone_call',
    totalTickets: 12,
    lastActivity: '2024-06-17T09:30:00Z',
    value: 8500
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@retailmax.com',
    phone: '+1 (555) 654-3210',
    company: 'RetailMax Corp',
    status: 'inactive',
    createdAt: '2023-11-10T11:00:00Z',
    updatedAt: '2024-04-20T16:20:00Z',
    address: {
      street: '987 Commerce Dr',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States'
    },
    customFields: {
      industry: 'Retail',
      subscription_plan: 'Basic',
      annual_revenue: 300000,
      priority_customer: false
    },
    tags: ['Retail', 'Inactive'],
    source: 'whatsapp',
    totalTickets: 5,
    lastActivity: '2024-04-18T14:10:00Z',
    value: 2000
  }
]

export const mockCustomerTickets: Record<string, CustomerTicket[]> = {
  '1': [
    {
      id: 'T001',
      title: 'API Integration Issue',
      status: 'open',
      priority: 'high',
      createdAt: '2024-06-18T09:15:00Z',
      updatedAt: '2024-06-18T09:15:00Z',
      assignee: 'Tech Support Team'
    },
    {
      id: 'T002',
      title: 'Performance Optimization Request',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-06-15T14:30:00Z',
      updatedAt: '2024-06-17T11:20:00Z',
      assignee: 'Engineering Team'
    },
    {
      id: 'T003',
      title: 'Feature Request - Dashboard Analytics',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-06-10T10:45:00Z',
      updatedAt: '2024-06-16T16:30:00Z',
      assignee: 'Product Team'
    }
  ],
  '2': [
    {
      id: 'T004',
      title: 'Data Export Functionality',
      status: 'open',
      priority: 'medium',
      createdAt: '2024-06-19T11:45:00Z',
      updatedAt: '2024-06-19T11:45:00Z',
      assignee: 'Support Team'
    },
    {
      id: 'T005',
      title: 'User Training Request',
      status: 'closed',
      priority: 'low',
      createdAt: '2024-06-12T08:20:00Z',
      updatedAt: '2024-06-18T15:45:00Z',
      assignee: 'Customer Success'
    }
  ],
  '3': [
    {
      id: 'T006',
      title: 'Account Setup Assistance',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-06-14T15:20:00Z',
      updatedAt: '2024-06-15T10:10:00Z',
      assignee: 'Onboarding Team'
    }
  ],
  '4': [
    {
      id: 'T007',
      title: 'Bulk User Import',
      status: 'open',
      priority: 'medium',
      createdAt: '2024-06-17T09:30:00Z',
      updatedAt: '2024-06-17T09:30:00Z',
      assignee: 'Support Team'
    },
    {
      id: 'T008',
      title: 'SSO Configuration',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-06-10T13:15:00Z',
      updatedAt: '2024-06-16T14:20:00Z',
      assignee: 'IT Team'
    }
  ],
  '5': [
    {
      id: 'T009',
      title: 'Account Cancellation Request',
      status: 'closed',
      priority: 'low',
      createdAt: '2024-04-18T14:10:00Z',
      updatedAt: '2024-04-20T16:20:00Z',
      assignee: 'Account Management'
    }
  ]
}
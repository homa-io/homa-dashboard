import { Conversation } from '@/types/conversation.types'

export const mockConversations: Conversation[] = [
  {
    id: 'TK-0001',
    title: 'Unable to access dashboard after login',
    description: 'Customer reports being unable to access the main dashboard after successful login',
    customer: {
      id: 'c1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: undefined
    },
    status: 'open',
    priority: 'high',
    assignedTo: [
      { id: 'a1', name: 'Sarah Johnson', avatar: undefined }
    ],
    tags: ['bug', 'authentication', 'urgent'],
    createdAt: new Date('2024-01-22T10:00:00'),
    updatedAt: new Date('2024-01-22T14:30:00')
  },
  {
    id: 'TK-0002',
    title: 'Feature request: Export data to CSV',
    customer: {
      id: 'c2',
      name: 'Emily Smith',
      email: 'emily.smith@company.com',
      avatar: undefined
    },
    status: 'in_progress',
    priority: 'medium',
    assignedTo: [
      { id: 'a2', name: 'Mike Rodriguez', avatar: undefined },
      { id: 'a3', name: 'Anna Lee', avatar: undefined }
    ],
    tags: ['feature-request', 'export'],
    createdAt: new Date('2024-01-21T15:20:00'),
    updatedAt: new Date('2024-01-22T09:15:00')
  },
  {
    id: 'TK-0003',
    title: 'Payment processing error',
    customer: {
      id: 'c3',
      name: 'Robert Johnson',
      email: 'robert.j@email.com',
      avatar: undefined
    },
    status: 'open',
    priority: 'critical',
    assignedTo: [
      { id: 'a1', name: 'Sarah Johnson', avatar: undefined }
    ],
    tags: ['payment', 'critical', 'bug'],
    createdAt: new Date('2024-01-22T16:45:00'),
    updatedAt: new Date('2024-01-22T16:45:00')
  },
  {
    id: 'TK-0004',
    title: 'How to integrate API with third-party service',
    customer: {
      id: 'c4',
      name: 'Lisa Chen',
      email: 'lisa.chen@tech.io',
      avatar: undefined
    },
    status: 'resolved',
    priority: 'low',
    assignedTo: [
      { id: 'a3', name: 'Anna Lee', avatar: undefined }
    ],
    tags: ['question', 'api', 'integration'],
    createdAt: new Date('2024-01-20T11:30:00'),
    updatedAt: new Date('2024-01-22T08:00:00')
  },
  {
    id: 'TK-0005',
    title: 'Slow performance on mobile devices',
    customer: {
      id: 'c5',
      name: 'Michael Brown',
      email: 'michael.b@mobile.com',
      avatar: undefined
    },
    status: 'in_progress',
    priority: 'high',
    assignedTo: [
      { id: 'a2', name: 'Mike Rodriguez', avatar: undefined }
    ],
    tags: ['performance', 'mobile', 'optimization'],
    createdAt: new Date('2024-01-21T09:00:00'),
    updatedAt: new Date('2024-01-22T11:20:00')
  },
  {
    id: 'TK-0006',
    title: 'Account suspension without notice',
    customer: {
      id: 'c6',
      name: 'Sarah Williams',
      email: 'sarah.w@business.net',
      avatar: undefined
    },
    status: 'open',
    priority: 'high',
    assignedTo: undefined,
    tags: ['account', 'urgent'],
    createdAt: new Date('2024-01-22T13:15:00'),
    updatedAt: new Date('2024-01-22T13:15:00')
  },
  {
    id: 'TK-0007',
    title: 'Request for bulk user import feature',
    customer: {
      id: 'c7',
      name: 'David Martinez',
      email: 'david.m@enterprise.com',
      avatar: undefined
    },
    status: 'closed',
    priority: 'medium',
    assignedTo: [
      { id: 'a1', name: 'Sarah Johnson', avatar: undefined }
    ],
    tags: ['feature-request', 'enterprise'],
    createdAt: new Date('2024-01-19T14:00:00'),
    updatedAt: new Date('2024-01-21T16:30:00')
  },
  {
    id: 'TK-0008',
    title: 'Email notifications not being received',
    customer: {
      id: 'c8',
      name: 'Jennifer Taylor',
      email: 'jennifer.t@email.org',
      avatar: undefined
    },
    status: 'in_progress',
    priority: 'medium',
    assignedTo: [
      { id: 'a3', name: 'Anna Lee', avatar: undefined }
    ],
    tags: ['email', 'notifications', 'bug'],
    createdAt: new Date('2024-01-22T10:45:00'),
    updatedAt: new Date('2024-01-22T15:00:00')
  }
]

export const mockStats = {
  openTickets: 24,
  avgResponseTime: '2.5h',
  resolutionRate: 85,
  satisfaction: 4.8,
  todayTickets: 8,
  pendingTickets: 12,
  resolvedToday: 5
}

export const mockActivities = [
  {
    id: '1',
    type: 'reply',
    message: 'Agent replied to #TK-0052',
    time: '2m ago'
  },
  {
    id: '2',
    type: 'status',
    message: 'Status changed to Resolved',
    time: '15m ago'
  },
  {
    id: '3',
    type: 'new',
    message: 'New conversation from John Doe',
    time: '1h ago'
  },
  {
    id: '4',
    type: 'assign',
    message: 'Conversation assigned to Sarah J.',
    time: '2h ago'
  },
  {
    id: '5',
    type: 'priority',
    message: 'Priority changed to High',
    time: '3h ago'
  }
]

export const mockTopAgents = [
  { id: '1', name: 'Sarah J.', resolved: 45, avatar: undefined },
  { id: '2', name: 'Mike R.', resolved: 38, avatar: undefined },
  { id: '3', name: 'Anna L.', resolved: 32, avatar: undefined },
  { id: '4', name: 'Tom K.', resolved: 28, avatar: undefined },
  { id: '5', name: 'Lisa M.', resolved: 24, avatar: undefined }
]
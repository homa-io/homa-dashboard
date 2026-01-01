/**
 * Query Keys for React Query
 * Centralized key management for cache invalidation and data fetching
 */

export const queryKeys = {
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Departments
  departments: {
    all: ['departments'] as const,
    lists: () => [...queryKeys.departments.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.departments.lists(), filters] as const,
    details: () => [...queryKeys.departments.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.departments.details(), id] as const,
    assignableUsers: () => [...queryKeys.departments.all, 'assignable-users'] as const,
  },

  // Conversations
  conversations: {
    all: ['conversations'] as const,
    lists: () => [...queryKeys.conversations.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.conversations.lists(), filters] as const,
    details: () => [...queryKeys.conversations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.conversations.details(), id] as const,
    messages: (conversationId: string) => [...queryKeys.conversations.detail(conversationId), 'messages'] as const,
  },

  // Customers
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.customers.lists(), filters] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  },

  // Settings
  settings: {
    all: ['settings'] as const,
    category: (category: string) => [...queryKeys.settings.all, category] as const,
    ai: () => [...queryKeys.settings.all, 'ai'] as const,
    workflow: () => [...queryKeys.settings.all, 'workflow'] as const,
  },

  // Canned Messages
  cannedMessages: {
    all: ['canned-messages'] as const,
    lists: () => [...queryKeys.cannedMessages.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.cannedMessages.lists(), filters] as const,
  },

  // Custom Attributes
  customAttributes: {
    all: ['custom-attributes'] as const,
    lists: () => [...queryKeys.customAttributes.all, 'list'] as const,
    list: (entityType: string) => [...queryKeys.customAttributes.lists(), entityType] as const,
  },

  // Webhooks
  webhooks: {
    all: ['webhooks'] as const,
    lists: () => [...queryKeys.webhooks.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.webhooks.lists(), filters] as const,
    details: () => [...queryKeys.webhooks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.webhooks.details(), id] as const,
  },

  // Knowledge Base
  knowledgeBase: {
    all: ['knowledge-base'] as const,
    articles: () => [...queryKeys.knowledgeBase.all, 'articles'] as const,
    articleList: (filters: Record<string, unknown>) => [...queryKeys.knowledgeBase.articles(), filters] as const,
    article: (id: string) => [...queryKeys.knowledgeBase.articles(), id] as const,
    categories: () => [...queryKeys.knowledgeBase.all, 'categories'] as const,
  },

  // Activity Logs
  activityLogs: {
    all: ['activity-logs'] as const,
    lists: () => [...queryKeys.activityLogs.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.activityLogs.lists(), filters] as const,
  },

  // Tags
  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
  },
} as const;

import { KnowledgeBaseCategory, KnowledgeBaseArticle, KnowledgeBaseTag, KnowledgeBaseStats } from '@/types/knowledge-base.simple.types'

export const mockKnowledgeBaseTags: KnowledgeBaseTag[] = [
  {
    id: '1',
    name: 'Getting Started',
    color: '#10B981',
    usageCount: 15
  },
  {
    id: '2',
    name: 'Advanced',
    color: '#F59E0B',
    usageCount: 8
  },
  {
    id: '3',
    name: 'Troubleshooting',
    color: '#EF4444',
    usageCount: 12
  },
  {
    id: '4',
    name: 'API',
    color: '#8B5CF6',
    usageCount: 6
  },
  {
    id: '5',
    name: 'Security',
    color: '#DC2626',
    usageCount: 4
  }
]

export const mockKnowledgeBaseCategories: KnowledgeBaseCategory[] = [
  {
    id: '1',
    name: 'Getting Started',
    description: 'Everything you need to know to get up and running quickly',
    icon: '🚀',
    color: '#10B981',
    slug: 'getting-started',
    articleCount: 12
  },
  {
    id: '2',
    name: 'Account Management',
    description: 'Managing your account settings, billing, and preferences',
    icon: '👤',
    color: '#3B82F6',
    slug: 'account-management',
    articleCount: 8
  },
  {
    id: '3',
    name: 'Features & Functionality',
    description: 'Detailed guides on using all platform features',
    icon: '⚡',
    color: '#8B5CF6',
    slug: 'features-functionality',
    articleCount: 25
  },
  {
    id: '4',
    name: 'Integrations',
    description: 'Connect with third-party tools and services',
    icon: '🔗',
    color: '#F59E0B',
    slug: 'integrations',
    articleCount: 15
  },
  {
    id: '5',
    name: 'API Documentation',
    description: 'Developer resources and API references',
    icon: '🛠️',
    color: '#6366F1',
    slug: 'api-documentation',
    articleCount: 20
  },
  {
    id: '6',
    name: 'Troubleshooting',
    description: 'Common issues, solutions, and debugging guides',
    icon: '🔧',
    color: '#EF4444',
    slug: 'troubleshooting',
    articleCount: 18
  }
]

export const mockKnowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    id: '1',
    title: 'Quick Start Guide: Setting Up Your First Dashboard',
    slug: 'quick-start-guide-dashboard-setup',
    excerpt: 'Learn how to set up your dashboard in just 5 minutes with this comprehensive quick start guide.',
    content: `# Quick Start Guide: Setting Up Your First Dashboard

Welcome to our platform! This guide will help you set up your first dashboard in just a few simple steps.

## Prerequisites

Before you begin, make sure you have:
- A valid account with admin privileges
- Access to your organization's data sources
- Basic understanding of dashboard concepts

## Step 1: Create Your Dashboard

1. Navigate to the **Dashboards** section in the main menu
2. Click the **"Create New Dashboard"** button
3. Choose a template or start from scratch
4. Give your dashboard a meaningful name

## Step 2: Add Your First Widget

Widgets are the building blocks of your dashboard. Here's how to add one:

1. Click the **"Add Widget"** button
2. Select your data source from the dropdown
3. Choose the visualization type (chart, table, metric, etc.)
4. Configure the widget settings
5. Click **"Save"** to add it to your dashboard`,
    categoryId: '1',
    tags: [mockKnowledgeBaseTags[0]],
    author: {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      role: 'Product Manager'
    },
    status: 'published',
    featured: true,
    views: 1247,
    likes: 89,
    helpful: 156,
    notHelpful: 12,
    shares: 23,
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      alt: 'Dashboard setup screenshot',
      description: 'Main dashboard interface showing key metrics'
    },
    media: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        title: 'Dashboard Overview',
        description: 'Screenshot of the main dashboard interface'
      }
    ],
    relatedArticles: ['2', '3'],
    publishedAt: '2024-02-01',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-15'
  },
  {
    id: '2',
    title: 'Understanding User Roles and Permissions',
    slug: 'user-roles-permissions-guide',
    excerpt: 'A comprehensive guide to managing user access and permissions within your organization.',
    content: `# Understanding User Roles and Permissions

Managing user access is crucial for maintaining security and ensuring users have the right level of access to your platform.

## Default User Roles

Our platform comes with several predefined roles:

### Administrator
- Full system access
- User management capabilities
- System configuration
- Billing and subscription management

### Manager
- Department-level access
- Team management
- Report generation
- Limited user management`,
    categoryId: '2',
    tags: [mockKnowledgeBaseTags[4]],
    author: {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'Security Engineer'
    },
    status: 'published',
    featured: false,
    views: 892,
    likes: 67,
    helpful: 124,
    notHelpful: 8,
    shares: 15,
    media: [],
    relatedArticles: ['1'],
    publishedAt: '2024-02-05',
    createdAt: '2024-01-20',
    updatedAt: '2024-02-20'
  },
  {
    id: '3',
    title: 'Advanced Analytics: Custom Metrics and KPIs',
    slug: 'advanced-analytics-custom-metrics',
    excerpt: 'Learn how to create custom metrics, set up KPIs, and build advanced analytics dashboards.',
    content: `# Advanced Analytics: Custom Metrics and KPIs

Take your analytics to the next level with custom metrics and key performance indicators.

## What Are Custom Metrics?

Custom metrics allow you to track business-specific data points that aren't available in standard reports.

## Creating Custom Metrics

### Step 1: Define Your Metric
- Identify what you want to measure
- Determine the calculation method
- Set the data sources needed`,
    categoryId: '3',
    tags: [mockKnowledgeBaseTags[1], mockKnowledgeBaseTags[3]],
    author: {
      id: '3',
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      role: 'Data Analyst'
    },
    status: 'published',
    featured: true,
    views: 1456,
    likes: 123,
    helpful: 198,
    notHelpful: 15,
    shares: 34,
    media: [],
    relatedArticles: ['1', '4'],
    publishedAt: '2024-02-10',
    createdAt: '2024-01-25',
    updatedAt: '2024-02-25'
  },
  {
    id: '4',
    title: 'API Authentication and Rate Limiting',
    slug: 'api-authentication-rate-limiting',
    excerpt: 'Comprehensive guide to API authentication methods and managing rate limits effectively.',
    content: `# API Authentication and Rate Limiting

Learn how to authenticate with our API and manage rate limits for optimal performance.

## Authentication Methods

We support multiple authentication methods:

### API Keys
The simplest method for server-to-server communication`,
    categoryId: '5',
    tags: [mockKnowledgeBaseTags[3], mockKnowledgeBaseTags[4]],
    author: {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      role: 'API Developer'
    },
    status: 'published',
    featured: false,
    views: 743,
    likes: 45,
    helpful: 87,
    notHelpful: 6,
    shares: 12,
    media: [],
    relatedArticles: [],
    publishedAt: '2024-02-08',
    createdAt: '2024-01-30',
    updatedAt: '2024-02-18'
  },
  {
    id: '5',
    title: 'Troubleshooting Connection Issues',
    slug: 'troubleshooting-connection-issues',
    excerpt: 'Step-by-step guide to diagnose and resolve common connection problems.',
    content: `# Troubleshooting Connection Issues

Having trouble connecting to our services? This guide will help you diagnose and resolve common connection problems.

## Quick Diagnostics

Before diving into complex solutions, try these quick fixes:

1. **Check your internet connection**
2. **Clear your browser cache**
3. **Disable browser extensions**`,
    categoryId: '6',
    tags: [mockKnowledgeBaseTags[2]],
    author: {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      role: 'Support Engineer'
    },
    status: 'published',
    featured: false,
    views: 2134,
    likes: 156,
    helpful: 289,
    notHelpful: 23,
    shares: 45,
    media: [],
    relatedArticles: [],
    publishedAt: '2024-02-12',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-26'
  }
]

export const mockKnowledgeBaseStats: KnowledgeBaseStats = {
  totalArticles: mockKnowledgeBaseArticles.length,
  publishedArticles: mockKnowledgeBaseArticles.filter(a => a.status === 'published').length,
  draftArticles: mockKnowledgeBaseArticles.filter(a => a.status === 'draft').length,
  totalViews: mockKnowledgeBaseArticles.reduce((sum, article) => sum + article.views, 0),
  totalCategories: mockKnowledgeBaseCategories.length,
  totalTags: mockKnowledgeBaseTags.length,
  popularArticles: [...mockKnowledgeBaseArticles].sort((a, b) => b.views - a.views).slice(0, 5),
  recentArticles: [...mockKnowledgeBaseArticles].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5),
  topCategories: mockKnowledgeBaseCategories.map(cat => ({
    ...cat,
    viewCount: mockKnowledgeBaseArticles
      .filter(article => article.categoryId === cat.id)
      .reduce((sum, article) => sum + article.views, 0)
  })).sort((a, b) => b.viewCount - a.viewCount).slice(0, 5),
  searchQueries: [
    { query: 'dashboard setup', count: 156, lastSearched: '2024-02-28' },
    { query: 'API authentication', count: 89, lastSearched: '2024-02-27' },
    { query: 'user permissions', count: 67, lastSearched: '2024-02-26' }
  ]
}
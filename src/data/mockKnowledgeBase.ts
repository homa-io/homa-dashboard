import { KnowledgeBaseCategory, KnowledgeBaseArticle, KnowledgeBaseTag, ArticleMedia } from '@/types/knowledge-base.types'

export const mockKnowledgeBaseTags: KnowledgeBaseTag[] = [
  {
    id: '1',
    name: 'Getting Started',
    slug: 'getting-started',
    color: '#10B981',
    description: 'Basic setup and initial steps',
    usageCount: 15,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Advanced',
    slug: 'advanced',
    color: '#F59E0B',
    description: 'Advanced features and configurations',
    usageCount: 8,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Troubleshooting',
    slug: 'troubleshooting',
    color: '#EF4444',
    description: 'Common issues and solutions',
    usageCount: 12,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '4',
    name: 'API',
    slug: 'api',
    color: '#8B5CF6',
    description: 'API documentation and examples',
    usageCount: 6,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '5',
    name: 'Security',
    slug: 'security',
    color: '#DC2626',
    description: 'Security best practices',
    usageCount: 4,
    createdAt: new Date('2024-02-05')
  },
  {
    id: '6',
    name: 'Integration',
    slug: 'integration',
    color: '#059669',
    description: 'Third-party integrations',
    usageCount: 7,
    createdAt: new Date('2024-02-10')
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
    order: 1,
    isPublished: true,
    articleCount: 12,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '2',
    name: 'Account Management',
    description: 'Managing your account settings, billing, and preferences',
    icon: '👤',
    color: '#3B82F6',
    slug: 'account-management',
    order: 2,
    isPublished: true,
    articleCount: 8,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '3',
    name: 'Features & Functionality',
    description: 'Detailed guides on using all platform features',
    icon: '⚡',
    color: '#8B5CF6',
    slug: 'features-functionality',
    order: 3,
    isPublished: true,
    articleCount: 25,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '4',
    name: 'Integrations',
    description: 'Connect with third-party tools and services',
    icon: '🔗',
    color: '#F59E0B',
    slug: 'integrations',
    order: 4,
    isPublished: true,
    articleCount: 15,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-02-18')
  },
  {
    id: '5',
    name: 'API Documentation',
    description: 'Developer resources and API references',
    icon: '🛠️',
    color: '#6366F1',
    slug: 'api-documentation',
    order: 5,
    isPublished: true,
    articleCount: 20,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-22')
  },
  {
    id: '6',
    name: 'Troubleshooting',
    description: 'Common issues, solutions, and debugging guides',
    icon: '🔧',
    color: '#EF4444',
    slug: 'troubleshooting',
    order: 6,
    isPublished: true,
    articleCount: 18,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-02-25')
  },
  {
    id: '7',
    name: 'Security & Privacy',
    description: 'Best practices for keeping your data safe',
    icon: '🔒',
    color: '#DC2626',
    slug: 'security-privacy',
    order: 7,
    isPublished: true,
    articleCount: 10,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-12')
  },
  {
    id: '8',
    name: 'Advanced Topics',
    description: 'In-depth guides for power users and developers',
    icon: '🎯',
    color: '#7C3AED',
    slug: 'advanced-topics',
    order: 8,
    isPublished: true,
    articleCount: 14,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-02-28')
  }
]

const mockArticleMedia: ArticleMedia[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    title: 'Dashboard Overview',
    alt: 'Main dashboard interface showing key metrics',
    description: 'Screenshot of the main dashboard interface',
    size: 256000,
    mimeType: 'image/jpeg',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '2',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    title: 'Getting Started Tutorial',
    description: 'Step-by-step video guide for new users',
    size: 1048576,
    mimeType: 'video/mp4',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200',
    duration: 300,
    createdAt: new Date('2024-02-03')
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
5. Click **"Save"** to add it to your dashboard

## Step 3: Customize Layout

You can drag and drop widgets to rearrange them:
- Hover over a widget to see the drag handle
- Drag to reposition
- Resize by dragging the corners
- Use the grid snap for perfect alignment

## Next Steps

Now that you have your first dashboard set up, explore these advanced features:
- [Setting up real-time updates](#)
- [Creating custom filters](#)
- [Sharing dashboards with your team](#)

Need help? Contact our support team or check out our [video tutorials](#).`,
    categoryId: '1',
    tags: [mockKnowledgeBaseTags[0], mockKnowledgeBaseTags[1]],
    author: {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      role: 'Product Manager'
    },
    status: 'published',
    visibility: 'public',
    featured: true,
    sticky: false,
    metaTitle: 'Quick Start Guide - Dashboard Setup | Help Center',
    metaDescription: 'Learn how to set up your first dashboard in 5 minutes with our comprehensive quick start guide.',
    keywords: ['dashboard', 'setup', 'quick start', 'getting started'],
    views: 1247,
    likes: 89,
    helpful: 156,
    notHelpful: 12,
    shares: 23,
    featuredImage: mockArticleMedia[0],
    media: [mockArticleMedia[0], mockArticleMedia[1]],
    relatedArticles: ['2', '3'],
    prerequisites: [],
    version: '1.2',
    versions: [],
    publishedAt: new Date('2024-02-01'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-15'),
    lastViewedAt: new Date('2024-02-28')
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
- Limited user management

### Agent
- Standard user access
- Customer interaction
- Conversation management
- Basic reporting

### Viewer
- Read-only access
- View dashboards and reports
- No editing capabilities

## Creating Custom Roles

You can create custom roles tailored to your organization's needs:

1. Go to **Settings > User Management > Roles**
2. Click **"Create Custom Role"**
3. Define permissions for each module
4. Set data access levels
5. Save and assign to users

## Best Practices

- Follow the principle of least privilege
- Regular audit of user permissions
- Use groups for easier management
- Document custom roles and their purposes

For more advanced permission management, see our [Advanced Security Guide](#).`,
    categoryId: '2',
    tags: [mockKnowledgeBaseTags[4], mockKnowledgeBaseTags[1]],
    author: {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'Security Engineer'
    },
    status: 'published',
    visibility: 'internal',
    featured: false,
    sticky: true,
    keywords: ['permissions', 'roles', 'security', 'access control'],
    views: 892,
    likes: 67,
    helpful: 124,
    notHelpful: 8,
    shares: 15,
    media: [],
    relatedArticles: ['7', '8'],
    prerequisites: ['1'],
    version: '1.0',
    versions: [],
    publishedAt: new Date('2024-02-05'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-20')
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
- Set the data sources needed

### Step 2: Build the Formula
Use our formula builder to create complex calculations:
\`\`\`
Revenue Per Customer = Total Revenue / Total Customers
Customer Lifetime Value = (Average Purchase Value × Purchase Frequency) × Customer Lifespan
\`\`\`

### Step 3: Set Up Tracking
1. Navigate to **Analytics > Custom Metrics**
2. Click **"Create New Metric"**
3. Enter your formula
4. Configure data sources
5. Set refresh intervals

## KPI Dashboards

Key Performance Indicators help you monitor business health at a glance.

### Best Practices for KPIs:
- Keep it simple (5-7 KPIs max per dashboard)
- Use clear visualizations
- Set meaningful thresholds
- Update regularly

## Advanced Features

### Predictive Analytics
- Trend forecasting
- Anomaly detection
- Seasonality analysis

### Real-time Monitoring
- Live data feeds
- Instant alerts
- Mobile notifications

For more on advanced analytics, check out our [Data Science Toolkit](#).`,
    categoryId: '8',
    tags: [mockKnowledgeBaseTags[1], mockKnowledgeBaseTags[3]],
    author: {
      id: '3',
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      role: 'Data Analyst'
    },
    status: 'published',
    visibility: 'public',
    featured: true,
    sticky: false,
    keywords: ['analytics', 'metrics', 'KPI', 'advanced', 'dashboard'],
    views: 1456,
    likes: 123,
    helpful: 198,
    notHelpful: 15,
    shares: 34,
    media: [mockArticleMedia[0]],
    relatedArticles: ['1', '4'],
    prerequisites: ['1', '2'],
    version: '1.1',
    versions: [],
    publishedAt: new Date('2024-02-10'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-25')
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
The simplest method for server-to-server communication:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.example.com/v1/users
\`\`\`

### OAuth 2.0
For applications requiring user consent:

1. Register your application
2. Redirect users to authorization endpoint
3. Exchange authorization code for access token
4. Use access token for API calls

### JWT Tokens
For stateless authentication:

\`\`\`javascript
const token = jwt.sign(
  { userId: user.id, scope: 'read:users' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
\`\`\`

## Rate Limiting

Our API implements rate limiting to ensure fair usage:

- **Free tier**: 1,000 requests/hour
- **Pro tier**: 10,000 requests/hour
- **Enterprise**: Custom limits

### Handling Rate Limits

Check response headers for rate limit information:
\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
\`\`\`

### Best Practices
- Implement exponential backoff
- Cache responses when possible
- Use webhooks for real-time updates
- Monitor your usage patterns

## Error Handling

Common error responses:
- **401 Unauthorized**: Invalid credentials
- **403 Forbidden**: Insufficient permissions
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server issue

For complete API reference, see our [API Documentation](#).`,
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
    visibility: 'public',
    featured: false,
    sticky: false,
    keywords: ['API', 'authentication', 'rate limiting', 'development'],
    views: 743,
    likes: 45,
    helpful: 87,
    notHelpful: 6,
    shares: 12,
    media: [],
    relatedArticles: ['5', '6'],
    prerequisites: [],
    version: '1.0',
    versions: [],
    publishedAt: new Date('2024-02-08'),
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-18')
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
   - Try accessing other websites
   - Test your connection speed
   - Restart your router if needed

2. **Clear your browser cache**
   - Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Select "All time" for the time range
   - Clear cache and cookies

3. **Disable browser extensions**
   - Try accessing in incognito/private mode
   - Disable ad blockers temporarily
   - Check for conflicting extensions

## Common Issues and Solutions

### SSL Certificate Errors
If you see "Your connection is not private" errors:

1. Check your system date and time
2. Clear SSL state in browser settings
3. Try a different browser
4. Contact IT if using corporate network

### Timeout Errors
For connection timeout issues:

1. Check firewall settings
2. Verify proxy configurations
3. Try connecting from different network
4. Contact your network administrator

### DNS Resolution Problems
If pages won't load at all:

\`\`\`bash
# Flush DNS cache (Windows)
ipconfig /flushdns

# Flush DNS cache (Mac)
sudo dscacheutil -flushcache

# Try alternative DNS servers
8.8.8.8 (Google)
1.1.1.1 (Cloudflare)
\`\`\`

## Network Requirements

Our services require these ports to be open:
- **HTTP**: Port 80
- **HTTPS**: Port 443
- **WebSocket**: Port 443 (WSS)
- **API**: Ports 8080, 8443

## Still Having Issues?

If none of these solutions work:

1. **Run our connection test tool** (coming soon)
2. **Contact support** with these details:
   - Your IP address
   - Browser and version
   - Error messages
   - Screenshots of the issue

3. **Check our status page** for service outages

For more technical troubleshooting, see our [Advanced Networking Guide](#).`,
    categoryId: '6',
    tags: [mockKnowledgeBaseTags[2], mockKnowledgeBaseTags[0]],
    author: {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      role: 'Support Engineer'
    },
    status: 'published',
    visibility: 'public',
    featured: false,
    sticky: false,
    keywords: ['troubleshooting', 'connection', 'network', 'support'],
    views: 2134,
    likes: 156,
    helpful: 289,
    notHelpful: 23,
    shares: 45,
    media: [],
    relatedArticles: ['6', '7'],
    prerequisites: [],
    version: '1.3',
    versions: [],
    publishedAt: new Date('2024-02-12'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-26')
  }
]

export const mockKnowledgeBaseStats = {
  totalArticles: mockKnowledgeBaseArticles.length,
  publishedArticles: mockKnowledgeBaseArticles.filter(a => a.status === 'published').length,
  draftArticles: mockKnowledgeBaseArticles.filter(a => a.status === 'draft').length,
  totalViews: mockKnowledgeBaseArticles.reduce((sum, article) => sum + article.views, 0),
  totalCategories: mockKnowledgeBaseCategories.length,
  totalTags: mockKnowledgeBaseTags.length,
  popularArticles: mockKnowledgeBaseArticles.sort((a, b) => b.views - a.views).slice(0, 5),
  recentArticles: mockKnowledgeBaseArticles.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5),
  topCategories: mockKnowledgeBaseCategories.map(cat => ({
    ...cat,
    viewCount: mockKnowledgeBaseArticles
      .filter(article => article.categoryId === cat.id)
      .reduce((sum, article) => sum + article.views, 0)
  })).sort((a, b) => b.viewCount - a.viewCount).slice(0, 5),
  searchQueries: [
    { query: 'dashboard setup', count: 156, lastSearched: new Date('2024-02-28') },
    { query: 'API authentication', count: 89, lastSearched: new Date('2024-02-27') },
    { query: 'user permissions', count: 67, lastSearched: new Date('2024-02-26') }
  ]
}
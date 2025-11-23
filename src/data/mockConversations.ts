interface ConversationMessage {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  type: 'customer' | 'agent' | 'system';
}

export interface Conversation {
  id: number;
  title: string;
  customer: string;
  email: string;
  priority: string;
  status: string;
  time: string;
  preview?: string;
  tags?: string[];
  department?: string;
  assignees?: string[];
  source?: string;
  author?: string;
  conversation?: ConversationMessage[];
  aiSummary?: string;
}

export const mockConversations: Conversation[] = [
  { id: 1, title: "Payment gateway not working", customer: "John Doe", email: "john@example.com", priority: "high", status: "new", time: "2 min ago", preview: "Customer unable to complete checkout process. Error occurs at payment step.", tags: ["payment", "urgent"], department: "Technical", assignees: ["JD", "MS"], source: "email" },
  { id: 2, title: "Unable to reset password", customer: "Jane Smith", email: "jane@example.com", priority: "medium", status: "new", time: "5 min ago", preview: "Password reset link not working. Customer tried multiple times.", tags: ["account", "password"], department: "Support", assignees: ["AB"], source: "chat" },
  { id: 10, title: "Login form not responsive", customer: "Alex Rodriguez", email: "alex@example.com", priority: "low", status: "new", time: "8 min ago", preview: "Login page doesn't display properly on mobile devices.", tags: ["ui", "mobile"], department: "Development", assignees: [], source: "email" },
  { id: 11, title: "Subscription cancellation", customer: "Maria Garcia", email: "maria@example.com", priority: "medium", status: "new", time: "12 min ago", preview: "Customer wants to cancel subscription and get refund.", tags: ["billing", "cancellation"], department: "Billing", assignees: [], source: "phone" },
  { id: 12, title: "Account locked after failed attempts", customer: "Chris Johnson", email: "chris@example.com", priority: "high", status: "new", time: "15 min ago", preview: "Multiple failed login attempts locked the account.", tags: ["security", "locked"], department: "Support", assignees: [], source: "chat" },
  { id: 13, title: "Data export request", customer: "Amanda White", email: "amanda@example.com", priority: "low", status: "new", time: "20 min ago", preview: "Customer requesting export of all their data.", tags: ["data", "export"], department: "Technical", assignees: [], source: "email" },
  { id: 3, title: "Account billing inquiry", customer: "Mike Johnson", email: "mike@example.com", priority: "low", status: "open", time: "1 hour ago", preview: "Questions about recent charges on account statement.", tags: ["billing", "inquiry"], department: "Billing", assignees: ["CD", "EF"], source: "phone" },
  { id: 4, title: "Feature request - API limits", customer: "Sarah Wilson", email: "sarah@example.com", priority: "medium", status: "open", time: "2 hours ago", preview: "Requesting increase in API rate limits for enterprise plan.", tags: ["feature", "api"], department: "Product", assignees: ["GH"], source: "email" },
  { id: 5, title: "Database connection timeout", customer: "Robert Davis", email: "robert@example.com", priority: "urgent", status: "pending", time: "30 min ago", preview: "Server experiencing intermittent database connectivity issues.", tags: ["technical", "database"], department: "Technical", assignees: ["IJ", "KL"], source: "email" },
  { id: 6, title: "Mobile app crashing", customer: "Lisa Brown", email: "lisa@example.com", priority: "high", status: "pending", time: "45 min ago", preview: "App crashes when trying to upload files on iOS devices.", tags: ["mobile", "bug"], department: "Development", assignees: ["MN"], source: "chat" },
  { id: 7, title: "Invoice download issue", customer: "David Miller", email: "david@example.com", priority: "low", status: "resolved", time: "1 day ago", preview: "PDF generation fixed for invoice downloads.", tags: ["resolved", "billing"], department: "Support", assignees: ["OP"], source: "email" },
  { id: 8, title: "SSL certificate expired", customer: "Emma Wilson", email: "emma@example.com", priority: "urgent", status: "resolved", time: "2 days ago", preview: "Certificate renewed and deployed successfully.", tags: ["security", "resolved"], department: "Technical", assignees: ["QR", "ST"], source: "phone" },
  { id: 9, title: "Data export functionality", customer: "Tom Anderson", email: "tom@example.com", priority: "medium", status: "closed", time: "3 days ago", preview: "Export feature implemented and tested successfully.", tags: ["feature", "closed"], department: "Product", assignees: ["UV"], source: "email" },
  { id: 14, title: "Server maintenance notification", customer: "Kevin Thompson", email: "kevin@example.com", priority: "low", status: "closed", time: "4 days ago", preview: "Scheduled maintenance completed successfully.", tags: ["maintenance", "server"], department: "Technical", assignees: ["XY"], source: "email" },
  { id: 15, title: "Account upgrade confirmation", customer: "Rachel Green", email: "rachel@example.com", priority: "low", status: "closed", time: "5 days ago", preview: "Premium account upgrade processed and confirmed.", tags: ["upgrade", "billing"], department: "Billing", assignees: ["ZA"], source: "phone" },
  { id: 16, title: "Bug report - search function", customer: "Daniel Park", email: "daniel@example.com", priority: "medium", status: "closed", time: "6 days ago", preview: "Search functionality bug fixed and deployed.", tags: ["bug", "search"], department: "Development", assignees: ["BC"], source: "chat" },
  { id: 17, title: "Integration setup complete", customer: "Sophie Turner", email: "sophie@example.com", priority: "low", status: "closed", time: "1 week ago", preview: "Third-party integration successfully configured.", tags: ["integration", "setup"], department: "Technical", assignees: ["DE"], source: "email" },
]

// Generate additional conversations for testing
export const generateAdditionalTickets = (): Conversation[] => {
  return Array.from({ length: 35 }, (_, i) => ({
    id: 100 + i,
    title: `Generated Conversation ${i + 1}`,
    customer: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    priority: ['low', 'medium', 'high', 'urgent'][i % 4],
    status: ['new', 'open', 'pending', 'resolved', 'closed'][i % 5],
    time: `${Math.floor(Math.random() * 24)} hours ago`,
    preview: `This is a generated conversation for testing purposes. Conversation number ${i + 1}.`,
    tags: [`tag${i % 5}`, `category${i % 3}`],
    department: ['Support', 'Technical', 'Billing', 'Product'][i % 4],
    assignees: i % 3 === 0 ? [] : [`Agent${i % 5}`],
    source: ['email', 'chat', 'phone', 'webform'][i % 4],
  }))
}

export const getAllTickets = (): Conversation[] => {
  return [...mockConversations, ...generateAdditionalTickets()]
}
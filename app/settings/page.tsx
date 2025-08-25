"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Tag, 
  Ticket, 
  Zap, 
  Plug, 
  MessageSquare,
  Plus,
  X,
  Edit,
  Trash2,
  Save,
  Globe,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AttributeManager } from "@/components/settings/AttributeManager"
import type { CustomAttribute } from "@/types/settings.types"

type SettingsTab = 'general' | 'customer-attributes' | 'ticket-attributes' | 'integrations' | 'plugins' | 'canned-messages'

const tabs = [
  {
    id: 'general' as SettingsTab,
    label: 'General',
    icon: Settings,
    description: 'Basic application settings and preferences'
  },
  {
    id: 'customer-attributes' as SettingsTab,
    label: 'Customer Attributes',
    icon: User,
    description: 'Manage custom fields and attributes for customers'
  },
  {
    id: 'ticket-attributes' as SettingsTab,
    label: 'Ticket Attributes',
    icon: Ticket,
    description: 'Configure ticket fields, statuses, and priorities'
  },
  {
    id: 'integrations' as SettingsTab,
    label: 'Integrations',
    icon: Zap,
    description: 'Connect with external services and APIs'
  },
  {
    id: 'plugins' as SettingsTab,
    label: 'Plugins',
    icon: Plug,
    description: 'Manage installed plugins and extensions'
  },
  {
    id: 'canned-messages' as SettingsTab,
    label: 'Canned Messages',
    icon: MessageSquare,
    description: 'Pre-written responses and message templates'
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  
  // Sample customer attributes
  const [customerAttributes, setCustomerAttributes] = useState<CustomAttribute[]>([
    {
      id: '1',
      varName: 'industry',
      displayName: 'Industry',
      description: 'Customer industry category',
      type: 'select',
      defaultValue: '',
      validationRule: '',
      selectOptions: [
        { key: 'tech', label: 'Technology' },
        { key: 'health', label: 'Healthcare' },
        { key: 'finance', label: 'Finance' },
        { key: 'education', label: 'Education' }
      ],
      required: false
    },
    {
      id: '2',
      varName: 'annual_revenue',
      displayName: 'Annual Revenue',
      description: 'Company annual revenue in USD',
      type: 'decimal',
      defaultValue: '0',
      validationRule: 'min:0',
      required: false
    }
  ])

  // Sample ticket attributes
  const [ticketAttributes, setTicketAttributes] = useState<CustomAttribute[]>([
    {
      id: '1',
      varName: 'severity_level',
      displayName: 'Severity Level',
      description: 'Technical severity classification',
      type: 'select',
      defaultValue: 'medium',
      validationRule: '',
      selectOptions: [
        { key: 'low', label: 'Low Impact' },
        { key: 'medium', label: 'Medium Impact' },
        { key: 'high', label: 'High Impact' },
        { key: 'critical', label: 'Critical Impact' }
      ],
      required: true
    },
    {
      id: '2',
      varName: 'estimated_hours',
      displayName: 'Estimated Hours',
      description: 'Estimated time to resolve in hours',
      type: 'decimal',
      defaultValue: '1',
      validationRule: 'min:0.1,max:100',
      required: false
    }
  ])
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your dashboard preferences and system settings.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Vertical Navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-left transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'customer-attributes' && (
            <AttributeManager
              title="Customer Attributes"
              description="Manage custom fields and attributes for customer profiles."
              attributes={customerAttributes}
              onSave={setCustomerAttributes}
            />
          )}
          {activeTab === 'ticket-attributes' && (
            <AttributeManager
              title="Ticket Attributes"
              description="Configure custom fields and attributes for tickets."
              attributes={ticketAttributes}
              onSave={setTicketAttributes}
            />
          )}
          {activeTab === 'integrations' && <IntegrationsSettings />}
          {activeTab === 'plugins' && <PluginsSettings />}
          {activeTab === 'canned-messages' && <CannedMessagesSettings />}
        </div>
      </div>
    </div>
  )
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">General Settings</h2>
        <p className="text-muted-foreground mb-6">
          Configure basic application settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Basic configuration for your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input id="app-name" defaultValue="Homa Dashboard" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="Your Company" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="app-description">Description</Label>
            <Textarea 
              id="app-description" 
              defaultValue="Modern customer service dashboard"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable maintenance mode to prevent user access
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Registration</Label>
              <p className="text-sm text-muted-foreground">
                Allow new users to register accounts
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Localization</CardTitle>
          <CardDescription>
            Language and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time</SelectItem>
                  <SelectItem value="pst">Pacific Time</SelectItem>
                  <SelectItem value="cet">Central European Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Integrations</h2>
        <p className="text-muted-foreground mb-6">
          Connect with external services and manage API integrations.
        </p>
      </div>

      <div className="grid gap-6">
        {[
          {
            name: 'Slack',
            description: 'Get notifications and manage tickets from Slack',
            connected: true,
            logo: '💬'
          },
          {
            name: 'WhatsApp Business',
            description: 'Handle customer support via WhatsApp',
            connected: false,
            logo: '📱'
          },
          {
            name: 'Gmail',
            description: 'Manage email tickets and customer communications',
            connected: false,
            logo: '📧'
          },
          {
            name: 'SMTP',
            description: 'Send emails through custom SMTP server',
            connected: true,
            logo: '📮'
          },
          {
            name: 'Outlook',
            description: 'Integrate with Microsoft Outlook for email management',
            connected: false,
            logo: '📨'
          },
          {
            name: 'Webhook',
            description: 'Receive real-time notifications via HTTP webhooks',
            connected: true,
            logo: '🔗'
          },
          {
            name: 'NATS',
            description: 'High-performance messaging system for real-time communication',
            connected: 'error',
            logo: '⚡'
          },
        ].map((integration) => (
          <Card key={integration.name}>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="text-2xl">{integration.logo}</div>
              <div className="flex-1">
                <h3 className="font-medium">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {integration.connected === true ? (
                  <>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button variant="outline" size="sm">Logs</Button>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </>
                ) : integration.connected === 'error' ? (
                  <>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Error
                    </Badge>
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button variant="outline" size="sm">Logs</Button>
                    <Button variant="outline" size="sm">Reconnect</Button>
                  </>
                ) : (
                  <Button size="sm">Connect</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>
            Configure API access and webhooks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Base URL</Label>
            <Input defaultValue="https://api.yourdomain.com/v1" readOnly className="bg-muted" />
          </div>
          
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input defaultValue="sk-1234567890abcdef..." readOnly className="bg-muted" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable API Access</Label>
              <p className="text-sm text-muted-foreground">
                Allow external applications to access your data
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input placeholder="https://yourapp.com/webhooks" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PluginsSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Plugins</h2>
        <p className="text-muted-foreground mb-6">
          Manage installed plugins and browse available extensions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Installed Plugins</CardTitle>
          <CardDescription>
            Manage your currently installed plugins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Auto-Response Bot',
                description: 'Automatically respond to common customer inquiries',
                version: '1.2.3',
                active: true
              },
              {
                name: 'Customer Satisfaction Survey',
                description: 'Send automated satisfaction surveys after ticket resolution',
                version: '2.1.0',
                active: true
              },
              {
                name: 'Advanced Analytics',
                description: 'Extended reporting and analytics capabilities',
                version: '1.0.5',
                active: false
              },
            ].map((plugin) => (
              <div key={plugin.name} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{plugin.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      v{plugin.version}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{plugin.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={plugin.active} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Configure</DropdownMenuItem>
                      <DropdownMenuItem>Update</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Uninstall</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plugin Store</CardTitle>
          <CardDescription>
            Browse and install new plugins to extend functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Plugin Store Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              We're working on a plugin marketplace where you can discover and install new extensions.
            </p>
            <Button variant="outline">Browse Plugins</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CannedMessagesSettings() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      title: 'Welcome Message',
      content: 'Hi {customer_name}, thank you for contacting us. How can we help you today?',
      category: 'Greetings'
    },
    {
      id: '2',
      title: 'Ticket Received',
      content: 'We have received your inquiry and a support ticket has been created. We will get back to you within 24 hours.',
      category: 'Confirmations'
    },
    {
      id: '3',
      title: 'Issue Resolved',
      content: 'Your issue has been resolved. If you need any further assistance, please don\'t hesitate to contact us.',
      category: 'Closures'
    },
    {
      id: '4',
      title: 'Thank You',
      content: 'Thank you for choosing our service. We appreciate your business!',
      category: 'Closures'
    },
    {
      id: '5',
      title: 'Password Reset',
      content: 'Your password has been reset successfully. Please use the new password to log in.',
      category: 'Technical'
    },
    {
      id: '6',
      title: 'Account Activation',
      content: 'Your account has been activated. You can now access all our features.',
      category: 'Confirmations'
    },
    {
      id: '7',
      title: 'Meeting Scheduled',
      content: 'We have scheduled a meeting for {date} at {time}. Please confirm your availability.',
      category: 'General'
    },
    {
      id: '8',
      title: 'Payment Received',
      content: 'We have received your payment of ${amount}. Thank you for your prompt payment.',
      category: 'Confirmations'
    },
    {
      id: '9',
      title: 'Service Maintenance',
      content: 'Our system will be undergoing maintenance on {date}. We apologize for any inconvenience.',
      category: 'Technical'
    },
    {
      id: '10',
      title: 'Follow Up',
      content: 'We wanted to follow up on your recent inquiry. Is there anything else we can help you with?',
      category: 'General'
    },
    {
      id: '11',
      title: 'Feature Update',
      content: 'We have released new features that you might find useful. Check them out in your dashboard.',
      category: 'General'
    },
    {
      id: '12',
      title: 'Feedback Request',
      content: 'We would love to hear your feedback about our service. Please take a moment to share your thoughts.',
      category: 'General'
    },
  ])

  const [categories, setCategories] = useState([
    'General', 'Greetings', 'Confirmations', 'Closures', 'Technical'
  ])

  const [editingMessage, setEditingMessage] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [newCategory, setNewCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const addMessage = () => {
    const newMessage = {
      id: '',
      title: '',
      content: '',
      category: 'General'
    }
    setEditingMessage(newMessage)
    setIsDialogOpen(true)
  }

  const editMessage = (message: any) => {
    setEditingMessage({ ...message })
    setIsDialogOpen(true)
  }

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id))
  }

  const saveMessage = (message: any) => {
    if (message.id && messages.find(msg => msg.id === message.id)) {
      // Update existing
      setMessages(messages.map(msg => 
        msg.id === message.id ? message : msg
      ))
    } else {
      // Add new
      if (!message.id) {
        message.id = Date.now().toString()
      }
      setMessages([...messages, message])
    }
    setIsDialogOpen(false)
    setEditingMessage(null)
  }

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory('')
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    // Don't allow removing categories that are in use
    const inUse = messages.some(msg => msg.category === categoryToRemove)
    if (inUse) {
      alert('Cannot remove category that is currently in use by messages.')
      return
    }
    setCategories(categories.filter(cat => cat !== categoryToRemove))
  }

  // Filter messages based on search and category
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || message.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedMessages = filteredMessages.slice(startIndex, endIndex)

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Canned Messages</h2>
        <p className="text-muted-foreground mb-6">
          Create and manage pre-written responses for common inquiries.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Message Templates</CardTitle>
            <CardDescription>
              Pre-written responses that can be quickly inserted into conversations
            </CardDescription>
          </div>
          <Button onClick={addMessage}>
            <Plus className="w-4 h-4 mr-2" />
            Add Message
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages by title or content..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-48">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredMessages.length)} of {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in "${selectedCategory}" category`}
              {filteredMessages.length !== messages.length && ` (${messages.length} total)`}
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {messages.length === 0 ? (
                <>
                  <p>No canned messages created yet.</p>
                  <Button variant="outline" onClick={addMessage} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Message
                  </Button>
                </>
              ) : (
                <>
                  <p>No messages match your search criteria.</p>
                  <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="mt-4">
                    Clear Filters
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Content Preview</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{message.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground truncate">
                        {message.content}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editMessage(message)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <MessageDialog
        message={editingMessage}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingMessage(null)
        }}
        onSave={saveMessage}
        categories={categories}
      />

      {/* Category Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Message Categories</CardTitle>
          <CardDescription>
            Organize your canned messages into categories for better organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add New Category */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter new category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                className="flex-1"
              />
              <Button onClick={addCategory} disabled={!newCategory.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            {/* Existing Categories */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Categories:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const messageCount = messages.filter(msg => msg.category === category).length
                  return (
                    <Badge 
                      key={category} 
                      variant="outline" 
                      className="px-3 py-1 flex items-center gap-2"
                    >
                      {category}
                      <span className="text-xs text-muted-foreground">({messageCount})</span>
                      {messageCount === 0 && (
                        <button
                          onClick={() => removeCategory(category)}
                          className="ml-1 hover:text-red-500 transition-colors"
                          title="Remove category"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  )
                })}
              </div>
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">No categories created yet.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface MessageDialogProps {
  message: any
  isOpen: boolean
  onClose: () => void
  onSave: (message: any) => void
  categories: string[]
}

function MessageDialog({ message, isOpen, onClose, onSave, categories }: MessageDialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    category: 'General'
  })

  // Update form data when message changes
  useEffect(() => {
    if (message && isOpen) {
      setFormData({ ...message })
    } else if (isOpen) {
      const newMessage = {
        id: '',
        title: '',
        content: '',
        category: 'General'
      }
      setFormData(newMessage)
    }
  }, [message, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {message?.id ? 'Edit Canned Message' : 'Add New Canned Message'}
          </DialogTitle>
          <DialogDescription>
            Create a reusable message template for quick responses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Welcome Message"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter your message content here..."
              rows={5}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use variables like {'{customer_name}'}, {'{ticket_id}'}, {'{agent_name}'} for personalization
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Save Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
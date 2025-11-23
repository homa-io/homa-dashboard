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
  Conversation, 
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

type SettingsTab = 'general' | 'customer-attributes' | 'conversation-attributes' | 'integrations' | 'plugins' | 'canned-messages'

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
    id: 'conversation-attributes' as SettingsTab,
    label: 'Conversation Attributes',
    icon: Conversation,
    description: 'Configure conversation fields, statuses, and priorities'
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

  // Sample conversation attributes
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
    <div className="flex-1 pl-3 sm:pl-4 pr-4 sm:pr-6 py-3 sm:py-4">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure your dashboard preferences and system settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:gap-3">
        {/* Horizontal Navigation on Mobile, Vertical on Desktop */}
        <div className="lg:w-44 lg:flex-shrink-0">
          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as SettingsTab)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:block space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded text-left transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 lg:max-w-none">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'customer-attributes' && (
            <AttributeManager
              title="Customer Attributes"
              description="Manage custom fields and attributes for customer profiles."
              attributes={customerAttributes}
              onSave={setCustomerAttributes}
            />
          )}
          {activeTab === 'conversation-attributes' && (
            <AttributeManager
              title="Conversation Attributes"
              description="Configure custom fields and attributes for conversations."
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">General Settings</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Configure basic application settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Application Settings</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Basic configuration for your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="app-name" className="text-xs sm:text-sm font-medium text-muted-foreground">Application Name</Label>
              <Input id="app-name" defaultValue="Homa Dashboard" className="text-sm h-9 sm:h-10" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="company-name" className="text-xs sm:text-sm font-medium text-muted-foreground">Company Name</Label>
              <Input id="company-name" defaultValue="Your Company" className="text-sm h-9 sm:h-10" />
            </div>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="app-description" className="text-xs sm:text-sm font-medium text-muted-foreground">Description</Label>
            <Textarea 
              id="app-description" 
              defaultValue="Modern customer service dashboard"
              rows={3}
              className="text-sm resize-none"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 py-3 sm:py-4">
            <div className="space-y-0.5">
              <Label className="text-xs sm:text-sm font-medium">Maintenance Mode</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enable maintenance mode to prevent user access
              </p>
            </div>
            <Switch className="self-start sm:self-center" />
          </div>
          
          <div className="border-t border-border"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 py-3 sm:py-4">
            <div className="space-y-0.5">
              <Label className="text-xs sm:text-sm font-medium">Enable Registration</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Allow new users to register accounts
              </p>
            </div>
            <Switch defaultChecked className="self-start sm:self-center" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Localization</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Language and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="text-sm h-9 sm:h-10">
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
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger className="text-sm h-9 sm:h-10">
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

      <div className="flex justify-end pt-2 sm:pt-0">
        <Button className="w-full sm:w-auto text-sm h-9 sm:h-10">
          <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

function IntegrationsSettings() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">Integrations</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Connect with external services and manage API integrations.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-6">
        {[
          {
            name: 'Slack',
            description: 'Get notifications and manage conversations from Slack',
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
            description: 'Manage email conversations and customer communications',
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
            <CardContent className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 sm:py-6">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-xl sm:text-2xl flex-shrink-0">{integration.logo}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">{integration.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">{integration.description}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                {integration.connected === true ? (
                  <>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs justify-center sm:justify-start">
                      Connected
                    </Badge>
                    <div className="flex gap-1 sm:gap-2">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs h-8">Configure</Button>
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs h-8">Logs</Button>
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs h-8">Disconnect</Button>
                    </div>
                  </>
                ) : integration.connected === 'error' ? (
                  <>
                    <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs justify-center sm:justify-start">
                      Error
                    </Badge>
                    <div className="flex gap-1 sm:gap-2">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs h-8">Configure</Button>
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs h-8">Logs</Button>
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs h-8">Reconnect</Button>
                    </div>
                  </>
                ) : (
                  <Button size="sm" className="w-full sm:w-auto text-xs h-8">Connect</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">API Settings</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Configure API access and webhooks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm font-medium text-muted-foreground">API Base URL</Label>
            <Input defaultValue="https://api.yourdomain.com/v1" readOnly className="bg-muted text-sm h-9 sm:h-10" />
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm font-medium text-muted-foreground">API Key</Label>
            <Input defaultValue="sk-1234567890abcdef..." readOnly className="bg-muted text-sm h-9 sm:h-10" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 py-3 sm:py-4">
            <div className="space-y-0.5">
              <Label className="text-xs sm:text-sm font-medium">Enable API Access</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Allow external applications to access your data
              </p>
            </div>
            <Switch defaultChecked className="self-start sm:self-center" />
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Webhook URL</Label>
            <Input placeholder="https://yourapp.com/webhooks" className="text-sm h-9 sm:h-10" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PluginsSettings() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">Plugins</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Manage installed plugins and browse available extensions.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Installed Plugins</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage your currently installed plugins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                name: 'Auto-Response Bot',
                description: 'Automatically respond to common customer inquiries',
                version: '1.2.3',
                active: true
              },
              {
                name: 'Customer Satisfaction Survey',
                description: 'Send automated satisfaction surveys after conversation resolution',
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
              <div key={plugin.name} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h4 className="font-medium text-sm sm:text-base truncate">{plugin.name}</h4>
                    <Badge variant="outline" className="text-xs w-fit">
                      v{plugin.version}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{plugin.description}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0">
                  <span className="text-xs text-muted-foreground sm:hidden">{plugin.active ? 'Active' : 'Inactive'}</span>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked={plugin.active} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className="text-xs">Configure</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">Update</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-red-600">Uninstall</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Plugin Store</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Browse and install new plugins to extend functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8">
            <Globe className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">Plugin Store Coming Soon</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              We're working on a plugin marketplace where you can discover and install new extensions.
            </p>
            <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9">Browse Plugins</Button>
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
      title: 'Conversation Received',
      content: 'We have received your inquiry and a support conversation has been created. We will get back to you within 24 hours.',
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2">Canned Messages</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
          Create and manage pre-written responses for common inquiries.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-6">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Message Templates</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Pre-written responses that can be quickly inserted into conversations
            </CardDescription>
          </div>
          <Button onClick={addMessage} className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Add Message
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages by title or content..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="text-sm h-9 sm:h-10">
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
            <div className="text-xs sm:text-sm text-muted-foreground">
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
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-3">
                {paginatedMessages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{message.title}</h4>
                        <Badge variant="secondary" className="text-xs mt-1">{message.category}</Badge>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editMessage(message)}
                          className="h-8 px-2 text-xs"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                          className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto -mx-3 sm:-mx-6 px-3 sm:px-6">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Title</TableHead>
                      <TableHead className="text-xs sm:text-sm">Category</TableHead>
                      <TableHead className="text-xs sm:text-sm">Content Preview</TableHead>
                      <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">{message.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{message.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {message.content}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editMessage(message)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMessage(message.id)}
                              className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 pt-4">
              <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-xs h-8"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>
                
                {/* Page Numbers - Hide on very small screens */}
                <div className="hidden xs:flex items-center space-x-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 3) {
                      pageNum = i + 1
                    } else if (currentPage <= 2) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i
                    } else {
                      pageNum = currentPage - 1 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0 text-xs"
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
                  className="text-xs h-8"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
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
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Message Categories</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Organize your canned messages into categories for better organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {/* Add New Category */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter new category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                className="flex-1 text-sm h-9 sm:h-10"
              />
              <Button onClick={addCategory} disabled={!newCategory.trim()} className="text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Add Category
              </Button>
            </div>

            {/* Existing Categories */}
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-medium">Current Categories:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const messageCount = messages.filter(msg => msg.category === category).length
                  return (
                    <Badge 
                      key={category} 
                      variant="outline" 
                      className="px-2 sm:px-3 py-1 flex items-center gap-1 sm:gap-2 text-xs"
                    >
                      <span className="truncate max-w-[120px] sm:max-w-none">{category}</span>
                      <span className="text-xs text-muted-foreground">({messageCount})</span>
                      {messageCount === 0 && (
                        <button
                          onClick={() => removeCategory(category)}
                          className="ml-1 hover:text-red-500 transition-colors flex-shrink-0"
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
                <p className="text-xs sm:text-sm text-muted-foreground">No categories created yet.</p>
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
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {message?.id ? 'Edit Canned Message' : 'Add New Canned Message'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Create a reusable message template for quick responses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="title" className="text-xs sm:text-sm font-medium text-muted-foreground">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Welcome Message"
                required
                className="text-sm h-9 sm:h-10"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="category" className="text-xs sm:text-sm font-medium text-muted-foreground">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="text-sm h-9 sm:h-10">
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

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="content" className="text-xs sm:text-sm font-medium text-muted-foreground">Message Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter your message content here..."
              rows={4}
              required
              className="text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Use variables like {'{customer_name}'}, {'{ticket_id}'}, {'{agent_name}'} for personalization
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 pt-3 sm:pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs sm:text-sm h-9 sm:h-10 order-2 sm:order-1">
              Cancel
            </Button>
            <Button type="submit" className="text-xs sm:text-sm h-9 sm:h-10 order-1 sm:order-2">
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Save Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
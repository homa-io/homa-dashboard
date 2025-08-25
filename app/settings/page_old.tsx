"use client"

import { useState } from "react"
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
  Globe
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

function CustomerAttributesSettings() {
  const [customFields, setCustomFields] = useState([
    { id: '1', name: 'industry', label: 'Industry', type: 'select', required: false },
    { id: '2', name: 'company_size', label: 'Company Size', type: 'select', required: false },
    { id: '3', name: 'annual_revenue', label: 'Annual Revenue', type: 'number', required: false },
  ])

  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      name: 'new_field',
      label: 'New Field',
      type: 'text',
      required: false
    }
    setCustomFields([...customFields, newField])
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Customer Attributes</h2>
        <p className="text-muted-foreground mb-6">
          Manage custom fields and attributes for customer profiles.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
          <CardDescription>
            Define additional fields to capture customer information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customFields.map((field) => (
              <div key={field.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs">Field Name</Label>
                    <Input defaultValue={field.name} className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Display Label</Label>
                    <Input defaultValue={field.label} className="h-8" />
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select defaultValue={field.type}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked={field.required} />
                    <Label className="text-xs">Required</Label>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomField(field.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button variant="outline" onClick={addCustomField} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Field
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Tags</CardTitle>
          <CardDescription>
            Manage predefined tags for customer categorization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['VIP', 'Enterprise', 'SMB', 'Trial', 'Churned', 'Prospect'].map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1">
                  {tag}
                  <button className="ml-2 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add new tag" className="flex-1" />
              <Button>Add Tag</Button>
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

function TicketAttributesSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Ticket Attributes</h2>
        <p className="text-muted-foreground mb-6">
          Configure ticket fields, statuses, priorities, and categories.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Statuses</CardTitle>
          <CardDescription>
            Define the available statuses for tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Open', color: 'blue', default: true },
              { name: 'In Progress', color: 'yellow', default: true },
              { name: 'Resolved', color: 'green', default: true },
              { name: 'Closed', color: 'gray', default: true },
            ].map((status) => (
              <div key={status.name} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className={`w-4 h-4 rounded-full bg-${status.color}-500`}></div>
                <div className="flex-1">
                  <Input defaultValue={status.name} />
                </div>
                <Select defaultValue={status.color}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
                {!status.default && (
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Status
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Priority Levels</CardTitle>
          <CardDescription>
            Configure ticket priority levels and their colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Low', color: 'green' },
              { name: 'Medium', color: 'yellow' },
              { name: 'High', color: 'orange' },
              { name: 'Urgent', color: 'red' },
            ].map((priority) => (
              <div key={priority.name} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className={`w-4 h-4 rounded-full bg-${priority.color}-500`}></div>
                <div className="flex-1">
                  <Input defaultValue={priority.name} />
                </div>
                <Select defaultValue={priority.color}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
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
            logo: '🔔'
          },
          {
            name: 'Zapier',
            description: 'Automate workflows with 3000+ apps',
            connected: false,
            logo: '⚡'
          },
          {
            name: 'WhatsApp Business',
            description: 'Handle customer support via WhatsApp',
            connected: true,
            logo: '💬'
          },
          {
            name: 'Stripe',
            description: 'Sync customer and payment data',
            connected: false,
            logo: '💳'
          },
        ].map((integration) => (
          <Card key={integration.name}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="text-2xl">{integration.logo}</div>
              <div className="flex-1">
                <h3 className="font-medium">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {integration.connected ? (
                  <>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button variant="outline" size="sm">Disconnect</Button>
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
            <Input defaultValue="https://api.yourdomain.com/v1" />
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
  ])

  const addMessage = () => {
    const newMessage = {
      id: Date.now().toString(),
      title: 'New Message',
      content: 'Enter your message content here...',
      category: 'General'
    }
    setMessages([...messages, newMessage])
  }

  const removeMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id))
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
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
          <CardDescription>
            Pre-written responses that can be quickly inserted into conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input defaultValue={message.title} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select defaultValue={message.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Greetings">Greetings</SelectItem>
                        <SelectItem value="Confirmations">Confirmations</SelectItem>
                        <SelectItem value="Closures">Closures</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <Textarea 
                    defaultValue={message.content}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use variables like {'{customer_name}'}, {'{ticket_id}'}, {'{agent_name}'} for personalization
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMessage(message.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            <Button variant="outline" onClick={addMessage} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Canned Message
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message Categories</CardTitle>
          <CardDescription>
            Organize your canned messages into categories for easy access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['General', 'Greetings', 'Confirmations', 'Closures', 'Technical'].map((category) => (
                <Badge key={category} variant="secondary" className="px-3 py-1">
                  {category}
                  <button className="ml-2 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add new category" className="flex-1" />
              <Button>Add Category</Button>
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
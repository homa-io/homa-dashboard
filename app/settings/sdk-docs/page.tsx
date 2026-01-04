"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Download,
  Copy,
  Check,
  Code,
  Settings2,
  Palette,
  Bell,
  User,
  MessageSquare,
  Zap,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.getevo.dev'
const WIDGET_VERSION = "1.1.7"
const WIDGET_URL = `${API_URL}/widget/homa-chat.min.js?v=${WIDGET_VERSION}`

export default function SDKDocsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadDocs = () => {
    const docContent = generateMarkdownDocs()
    const blob = new Blob([docContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'homa-chat-sdk-documentation.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateMarkdownDocs = () => {
    return `# Homa Chat SDK Documentation
Version: ${WIDGET_VERSION}

## Installation

Add the following script to your website, just before the closing \`</body>\` tag:

\`\`\`html
<script>
  (function(w,d,s,o,f,js,fjs){
    w['HomaChat']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  })(window,document,'script','homaChat','${WIDGET_URL}');

  homaChat('init', {
    baseUrl: '${API_URL}',
    websiteToken: 'YOUR_WEBSITE_TOKEN'
  });
</script>
\`\`\`

## Configuration Options

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| baseUrl | string | API base URL |
| websiteToken | string | Your website token |

### Appearance Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| position | string | 'right' | Widget position: 'left' or 'right' |
| darkMode | string | 'light' | Theme: 'light', 'dark', or 'auto' |
| brandColor | string | '#3B82F6' | Primary brand color |
| headerColor | string | null | Header background color |
| textColor | string | '#FFFFFF' | Header text color |
| launcherSize | number | 60 | Launcher button size in pixels |
| launcherIcon | string | null | Custom SVG icon for launcher |
| launcherText | string | null | Text next to launcher button |
| windowWidth | number | 380 | Chat window width in pixels |
| windowHeight | number | 600 | Chat window height in pixels |
| borderRadius | number | 16 | Window border radius in pixels |
| zIndex | number | 999999 | CSS z-index |
| customCSS | string | null | Custom CSS to inject |

### Behavior Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| locale | string | 'auto' | Language code or 'auto' |
| autoOpen | number | 0 | Auto-open after X milliseconds (0 = disabled) |
| autoOpenOnce | boolean | true | Only auto-open once per session |
| hideOnMobile | boolean | false | Hide widget on mobile devices |
| hidePoweredBy | boolean | false | Hide "Powered by" badge |
| showAvatar | boolean | true | Show agent avatars |

### User Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| userName | string | null | Pre-fill user name |
| userEmail | string | null | Pre-fill user email |
| userAttributes | object | {} | Custom user attributes |
| conversationAttributes | object | {} | Custom conversation attributes |
| preChatFormFields | array | ['name', 'email'] | Fields to show in pre-chat form |

### Notification Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| soundEnabled | boolean | true | Play sound on new messages |
| soundType | string | 'chime' | Sound type (see available sounds) |
| titleNotification | boolean | true | Update page title on new message |
| titlePrefix | string | '💬 ' | Prefix for title notification |

### Messaging Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| greetingTitle | string | null | Custom greeting title |
| greetingMessage | string | null | Custom greeting message |
| offlineMessage | string | null | Message when agents are offline |
| transcriptEmail | boolean | false | Allow users to email transcript |
| defaultDepartmentId | number | null | Auto-assign to department |

## Available Sound Types

- chime (default)
- bell
- ding
- pop
- bubble
- drop
- ping
- pluck
- tap
- whoosh
- none

## Pre-Chat Form Fields

Available fields for \`preChatFormFields\`:
- 'name' - User's name (required by default)
- 'email' - User's email (required by default)
- 'phone' - Phone number
- 'company' - Company name
- 'message' - Initial message

Example:
\`\`\`javascript
preChatFormFields: ['name', 'email', 'phone', 'company']
\`\`\`

## SDK Methods

### Open/Close Widget

\`\`\`javascript
// Open the widget
homaChat('open');

// Close the widget
homaChat('close');

// Toggle open/close
homaChat('toggle');
\`\`\`

### Update User Info

\`\`\`javascript
homaChat('setUser', {
  name: 'John Doe',
  email: 'john@example.com'
});
\`\`\`

### Set Custom Attributes

\`\`\`javascript
homaChat('setCustomAttributes', {
  plan: 'premium',
  userId: '12345'
});
\`\`\`

### Event Listeners

\`\`\`javascript
// Widget opened
homaChat('on', 'open', function() {
  console.log('Widget opened');
});

// Widget closed
homaChat('on', 'close', function() {
  console.log('Widget closed');
});

// Message received from agent
homaChat('on', 'message:received', function(message) {
  console.log('New message:', message);
});

// Message sent by user
homaChat('on', 'message:sent', function(message) {
  console.log('Message sent:', message);
});

// Conversation started
homaChat('on', 'conversation:started', function(conversation) {
  console.log('Conversation started:', conversation);
});
\`\`\`

## Full Example

\`\`\`html
<script>
  (function(w,d,s,o,f,js,fjs){
    w['HomaChat']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  })(window,document,'script','homaChat','${WIDGET_URL}');

  homaChat('init', {
    // Required
    baseUrl: '${API_URL}',
    websiteToken: 'YOUR_WEBSITE_TOKEN',

    // Appearance
    brandColor: '#3B82F6',
    headerColor: '#2563EB',
    textColor: '#FFFFFF',
    darkMode: 'auto',
    position: 'right',
    launcherSize: 60,
    launcherText: 'Chat with us',
    windowWidth: 380,
    windowHeight: 600,
    borderRadius: 16,

    // Language
    locale: 'auto',

    // Auto-open
    autoOpen: 5000, // Open after 5 seconds
    autoOpenOnce: true,

    // User info
    userName: window.currentUser?.name || null,
    userEmail: window.currentUser?.email || null,

    // Custom attributes
    userAttributes: {
      plan: 'premium',
      userId: window.currentUser?.id
    },

    // Pre-chat form
    preChatFormFields: ['name', 'email', 'phone'],

    // Notifications
    soundEnabled: true,
    soundType: 'chime',
    titleNotification: true,

    // Messages
    offlineMessage: 'We are currently offline. Leave a message and we will get back to you.',
    transcriptEmail: true,

    // Custom CSS
    customCSS: \`
      .homa-chat-launcher { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    \`
  });

  // Open widget when help button is clicked
  document.getElementById('help-btn')?.addEventListener('click', function() {
    homaChat('open');
  });
</script>
\`\`\`

---
Generated by Homa Chat SDK v${WIDGET_VERSION}
`
  }

  const CodeBlock = ({ code, id }: { code: string, id: string }) => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-8 w-8 p-0"
        onClick={() => copyToClipboard(code, id)}
      >
        {copied === id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
      </Button>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono pr-12">
        {code}
      </pre>
    </div>
  )

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/settings/sdk">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to SDK Settings
            </Button>
          </Link>
        </div>
        <Button onClick={downloadDocs}>
          <Download className="w-4 h-4 mr-2" />
          Download Documentation
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8" />
        <div>
          <h1 className="text-2xl font-bold">Homa Chat SDK Documentation</h1>
          <p className="text-muted-foreground">Version {WIDGET_VERSION}</p>
        </div>
      </div>

      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="methods">Methods</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        {/* Getting Started */}
        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Installation
              </CardTitle>
              <CardDescription>
                Add this code to your website, just before the closing &lt;/body&gt; tag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="install"
                code={`<script>
  (function(w,d,s,o,f,js,fjs){
    w['HomaChat']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  })(window,document,'script','homaChat','${WIDGET_URL}');

  homaChat('init', {
    baseUrl: '${API_URL}',
    websiteToken: 'YOUR_WEBSITE_TOKEN'
  });
</script>`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Set User Identity
              </CardTitle>
              <CardDescription>
                Pre-fill user information to skip the pre-chat form and identify returning users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="user-identity"
                code={`homaChat('init', {
  baseUrl: '${API_URL}',
  websiteToken: 'YOUR_WEBSITE_TOKEN',

  // Pre-fill user info (skips pre-chat form if both provided)
  userName: 'John Doe',
  userEmail: 'john@example.com',

  // Custom user attributes (visible to agents)
  userAttributes: {
    plan: 'premium',
    userId: '12345',
    signupDate: '2024-01-15',
    company: 'Acme Inc'
  },

  // Custom conversation attributes
  conversationAttributes: {
    page: window.location.pathname,
    referrer: document.referrer,
    orderNumber: 'ORD-789'
  }
});`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Pre-Chat Form Fields
              </CardTitle>
              <CardDescription>
                Customize which fields appear in the pre-chat form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Available fields: <code className="bg-muted px-1 rounded">name</code>, <code className="bg-muted px-1 rounded">email</code>, <code className="bg-muted px-1 rounded">phone</code>, <code className="bg-muted px-1 rounded">company</code>, <code className="bg-muted px-1 rounded">message</code>
              </p>
              <CodeBlock
                id="prechat-fields"
                code={`homaChat('init', {
  baseUrl: '${API_URL}',
  websiteToken: 'YOUR_WEBSITE_TOKEN',

  // Customize pre-chat form fields
  preChatFormFields: ['name', 'email', 'phone', 'company']
});`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Colors & Styling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="colors"
                code={`homaChat('init', {
  baseUrl: '${API_URL}',
  websiteToken: 'YOUR_WEBSITE_TOKEN',

  // Colors
  brandColor: '#3B82F6',      // Primary brand color
  headerColor: '#2563EB',     // Header background (uses brandColor if null)
  textColor: '#FFFFFF',       // Header text color
  darkMode: 'auto',           // 'light', 'dark', or 'auto'

  // Dimensions
  launcherSize: 60,           // Launcher button size (px)
  windowWidth: 380,           // Chat window width (px)
  windowHeight: 600,          // Chat window height (px)
  borderRadius: 16,           // Border radius (px)

  // Position
  position: 'right',          // 'left' or 'right'
  zIndex: 999999,             // CSS z-index

  // Launcher customization
  launcherText: 'Chat with us', // Text next to launcher
  launcherIcon: null,         // Custom SVG icon

  // Custom CSS injection
  customCSS: \`
    .homa-chat-launcher {
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .homa-chat-window {
      font-family: 'Inter', sans-serif;
    }
  \`
});`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom CSS Classes</CardTitle>
              <CardDescription>Available CSS classes you can target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Main Elements</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><code className="bg-muted px-1 rounded">.homa-chat-widget</code> - Main container</li>
                    <li><code className="bg-muted px-1 rounded">.homa-chat-launcher</code> - Launcher button</li>
                    <li><code className="bg-muted px-1 rounded">.homa-chat-window</code> - Chat window</li>
                    <li><code className="bg-muted px-1 rounded">.homa-chat-header</code> - Window header</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Message Elements</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><code className="bg-muted px-1 rounded">.homa-chat-messages</code> - Messages area</li>
                    <li><code className="bg-muted px-1 rounded">.homa-chat-message</code> - Single message</li>
                    <li><code className="bg-muted px-1 rounded">.homa-chat-input</code> - Input container</li>
                    <li><code className="bg-muted px-1 rounded">.homa-chat-send-btn</code> - Send button</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior */}
        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Auto-Open Widget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="auto-open"
                code={`homaChat('init', {
  baseUrl: '${API_URL}',
  websiteToken: 'YOUR_WEBSITE_TOKEN',

  // Auto-open after 5 seconds
  autoOpen: 5000,

  // Only auto-open once per session (default: true)
  autoOpenOnce: true
});`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="notifications"
                code={`homaChat('init', {
  baseUrl: '${API_URL}',
  websiteToken: 'YOUR_WEBSITE_TOKEN',

  // Sound notifications
  soundEnabled: true,
  soundType: 'chime',  // chime, bell, ding, pop, bubble, drop, ping, pluck, tap, whoosh, none

  // Title notifications
  titleNotification: true,
  titlePrefix: '💬 '
});`}
              />
              <div className="mt-4 grid grid-cols-5 gap-2">
                {['chime', 'bell', 'ding', 'pop', 'bubble', 'drop', 'ping', 'pluck', 'tap', 'whoosh'].map(sound => (
                  <div key={sound} className="text-center p-2 bg-muted rounded text-xs">
                    {sound}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages & Offline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="messages"
                code={`homaChat('init', {
  baseUrl: '${API_URL}',
  websiteToken: 'YOUR_WEBSITE_TOKEN',

  // Custom messages
  greetingTitle: 'Welcome!',
  greetingMessage: 'How can we help you today?',

  // Offline message (shown when no agents available)
  offlineMessage: 'We are currently offline. Leave a message and we will get back to you within 24 hours.',

  // Allow users to email conversation transcript
  transcriptEmail: true
});`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Methods */}
        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widget Control</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="control"
                code={`// Open the chat widget
homaChat('open');

// Close the chat widget
homaChat('close');

// Toggle open/close
homaChat('toggle');`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update User Info</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="update-user"
                code={`// Update user info after initialization
homaChat('setUser', {
  name: 'Jane Doe',
  email: 'jane@example.com'
});

// Set custom attributes after init
homaChat('setCustomAttributes', {
  plan: 'enterprise',
  lastPurchase: '2024-03-20'
});`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Listeners</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="events"
                code={`// Widget opened
homaChat('on', 'open', function() {
  console.log('Widget opened');
  analytics.track('Chat Opened');
});

// Widget closed
homaChat('on', 'close', function() {
  console.log('Widget closed');
});

// Message received from agent
homaChat('on', 'message:received', function(message) {
  console.log('New message:', message);
});

// Message sent by user
homaChat('on', 'message:sent', function(message) {
  console.log('Message sent:', message);
});

// Conversation started
homaChat('on', 'conversation:started', function(conversation) {
  console.log('Conversation started:', conversation);
});`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference */}
        <TabsContent value="reference" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Configuration Options</CardTitle>
              <CardDescription>Complete reference of all available options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-medium">Option</th>
                      <th className="text-left py-3 pr-4 font-medium">Type</th>
                      <th className="text-left py-3 pr-4 font-medium">Default</th>
                      <th className="text-left py-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b"><td colSpan={4} className="py-2 font-medium text-foreground">Required</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">baseUrl</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">API base URL</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">websiteToken</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Website token</td></tr>

                    <tr className="border-b"><td colSpan={4} className="py-2 font-medium text-foreground pt-4">Appearance</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">position</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">'right'</td><td className="py-2">'left' or 'right'</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">darkMode</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">'light'</td><td className="py-2">'light', 'dark', or 'auto'</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">brandColor</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">'#3B82F6'</td><td className="py-2">Primary brand color</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">headerColor</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">null</td><td className="py-2">Header background</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">textColor</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">'#FFFFFF'</td><td className="py-2">Header text color</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">launcherSize</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">60</td><td className="py-2">Launcher size (px)</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">launcherIcon</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">null</td><td className="py-2">Custom SVG icon</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">launcherText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">null</td><td className="py-2">Text next to launcher</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">windowWidth</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">380</td><td className="py-2">Window width (px)</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">windowHeight</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">600</td><td className="py-2">Window height (px)</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">16</td><td className="py-2">Border radius (px)</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">zIndex</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">999999</td><td className="py-2">CSS z-index</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">customCSS</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">null</td><td className="py-2">Custom CSS to inject</td></tr>

                    <tr className="border-b"><td colSpan={4} className="py-2 font-medium text-foreground pt-4">Behavior</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">locale</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">'auto'</td><td className="py-2">Language or 'auto'</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">autoOpen</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">0</td><td className="py-2">Auto-open delay (ms)</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">autoOpenOnce</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Only auto-open once</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">hideOnMobile</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Hide on mobile</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">hidePoweredBy</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Hide badge</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">showAvatar</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Show agent avatars</td></tr>

                    <tr className="border-b"><td colSpan={4} className="py-2 font-medium text-foreground pt-4">User</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">userName</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">null</td><td className="py-2">Pre-fill name</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">userEmail</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">null</td><td className="py-2">Pre-fill email</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">userAttributes</td><td className="py-2 pr-4">object</td><td className="py-2 pr-4">{'{}'}</td><td className="py-2">Custom attributes</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">conversationAttributes</td><td className="py-2 pr-4">object</td><td className="py-2 pr-4">{'{}'}</td><td className="py-2">Conversation data</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">preChatFormFields</td><td className="py-2 pr-4">array</td><td className="py-2 pr-4">['name','email']</td><td className="py-2">Pre-chat fields</td></tr>

                    <tr className="border-b"><td colSpan={4} className="py-2 font-medium text-foreground pt-4">Notifications</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">soundEnabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Enable sounds</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">soundType</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">'chime'</td><td className="py-2">Sound type</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">titleNotification</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Update page title</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">titlePrefix</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">'💬 '</td><td className="py-2">Title prefix</td></tr>

                    <tr className="border-b"><td colSpan={4} className="py-2 font-medium text-foreground pt-4">Messages</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">greetingTitle</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">null</td><td className="py-2">Greeting title</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">greetingMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">null</td><td className="py-2">Greeting message</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">offlineMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">null</td><td className="py-2">Offline message</td></tr>
                    <tr className="border-b"><td className="py-2 pr-4 font-mono text-xs">transcriptEmail</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Allow email transcript</td></tr>
                    <tr><td className="py-2 pr-4 font-mono text-xs">defaultDepartmentId</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">null</td><td className="py-2">Auto department</td></tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

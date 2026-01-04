"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Code,
  Copy,
  Check,
  ExternalLink,
  Palette,
  Settings2,
  Eye,
  Loader2,
  Play,
  Volume2,
  BookOpen,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { getDepartmentsAction } from "@/actions/departments.actions"
import { getCustomAttributesAction, CustomAttribute } from "@/actions/custom-attributes.actions"
import Link from "next/link"

// Widget SDK version - update this when releasing new versions
const WIDGET_VERSION = "1.1.8"

interface Department {
  id: number
  name: string
}

// Sound types
type SoundTypeValue = 'chime' | 'bell' | 'ding' | 'pop' | 'bubble' | 'drop' | 'ping' | 'pluck' | 'tap' | 'whoosh' | 'none'

interface SDKConfig {
  baseUrl: string
  brandColor: string
  headerColor: string
  textColor: string
  position: 'left' | 'right'
  launcherSize: number
  launcherText: string
  windowWidth: number
  windowHeight: number
  borderRadius: number
  locale: string
  darkMode: 'light' | 'dark' | 'auto'
  hidePoweredBy: boolean
  hideOnMobile: boolean
  greetingTitle: string
  greetingMessage: string
  offlineMessage: string
  defaultDepartmentId: string
  soundEnabled: boolean
  soundType: SoundTypeValue
  titleNotification: boolean
  autoOpen: number
  autoOpenOnce: boolean
  preChatFormFields: string[]
  transcriptEmail: boolean
  customCSS: string
}

const DEFAULT_CONFIG: SDKConfig = {
  baseUrl: '',
  brandColor: '#3B82F6',
  headerColor: '#3B82F6',
  textColor: '#FFFFFF',
  position: 'right',
  launcherSize: 60,
  launcherText: '',
  windowWidth: 380,
  windowHeight: 600,
  borderRadius: 16,
  locale: 'auto',
  darkMode: 'light',
  hidePoweredBy: false,
  hideOnMobile: false,
  greetingTitle: 'Welcome',
  greetingMessage: 'Hi! How can we help you today?',
  offlineMessage: '',
  defaultDepartmentId: '',
  soundEnabled: true,
  soundType: 'chime',
  titleNotification: true,
  autoOpen: 0,
  autoOpenOnce: true,
  preChatFormFields: ['name', 'email'],
  transcriptEmail: false,
  customCSS: ''
}

const LOCALES = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
  { value: 'tr', label: 'Turkish' },
  { value: 'th', label: 'Thai' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'uk', label: 'Ukrainian' },
  { value: 'sv', label: 'Swedish' },
  { value: 'cs', label: 'Czech' },
  { value: 'el', label: 'Greek' },
  { value: 'he', label: 'Hebrew' },
  { value: 'id', label: 'Indonesian' },
  { value: 'ms', label: 'Malay' },
  { value: 'fa', label: 'Persian' },
]

// Preset themes for quick customization
const PRESET_THEMES = [
  { name: 'Ocean Blue', brandColor: '#3B82F6', headerColor: '#2563EB', textColor: '#FFFFFF', darkMode: 'light' as const },
  { name: 'Emerald', brandColor: '#10B981', headerColor: '#059669', textColor: '#FFFFFF', darkMode: 'light' as const },
  { name: 'Sunset', brandColor: '#F59E0B', headerColor: '#D97706', textColor: '#FFFFFF', darkMode: 'light' as const },
  { name: 'Rose', brandColor: '#F43F5E', headerColor: '#E11D48', textColor: '#FFFFFF', darkMode: 'light' as const },
  { name: 'Purple', brandColor: '#8B5CF6', headerColor: '#7C3AED', textColor: '#FFFFFF', darkMode: 'light' as const },
  { name: 'Slate Dark', brandColor: '#475569', headerColor: '#334155', textColor: '#FFFFFF', darkMode: 'dark' as const },
  { name: 'Midnight', brandColor: '#1E40AF', headerColor: '#1E3A8A', textColor: '#FFFFFF', darkMode: 'dark' as const },
  { name: 'Forest', brandColor: '#166534', headerColor: '#14532D', textColor: '#FFFFFF', darkMode: 'dark' as const },
  { name: 'Coral', brandColor: '#FB7185', headerColor: '#F43F5E', textColor: '#FFFFFF', darkMode: 'light' as const },
  { name: 'Teal', brandColor: '#14B8A6', headerColor: '#0D9488', textColor: '#FFFFFF', darkMode: 'light' as const },
]

// Sound types for notification (with frequencies for preview)
const SOUND_TYPES: Array<{value: SoundTypeValue, label: string, freq: number[], duration: number, type: OscillatorType}> = [
  { value: 'chime', label: 'Chime', freq: [800, 1000, 1200], duration: 0.15, type: 'sine' },
  { value: 'bell', label: 'Bell', freq: [523, 659, 784], duration: 0.2, type: 'sine' },
  { value: 'ding', label: 'Ding', freq: [1400], duration: 0.1, type: 'sine' },
  { value: 'pop', label: 'Pop', freq: [400, 600], duration: 0.08, type: 'square' },
  { value: 'bubble', label: 'Bubble', freq: [600, 800], duration: 0.12, type: 'sine' },
  { value: 'drop', label: 'Drop', freq: [1200, 800, 600], duration: 0.1, type: 'sine' },
  { value: 'ping', label: 'Ping', freq: [1800], duration: 0.08, type: 'sine' },
  { value: 'pluck', label: 'Pluck', freq: [400, 300], duration: 0.15, type: 'triangle' },
  { value: 'tap', label: 'Tap', freq: [800], duration: 0.05, type: 'square' },
  { value: 'whoosh', label: 'Whoosh', freq: [200, 400, 800], duration: 0.08, type: 'sawtooth' },
  { value: 'none', label: 'None', freq: [], duration: 0, type: 'sine' },
]

// Play preview sound using Web Audio API
function playPreviewSound(soundType: SDKConfig['soundType']) {
  const sound = SOUND_TYPES.find(s => s.value === soundType)
  if (!sound || sound.value === 'none') return

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = audioContext.currentTime

    sound.freq.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = freq
      oscillator.type = sound.type

      gainNode.gain.setValueAtTime(0.3, now + i * sound.duration)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * sound.duration)

      oscillator.start(now + i * sound.duration)
      oscillator.stop(now + (i + 1) * sound.duration)
    })
  } catch (e) {
    console.warn('Could not play preview sound', e)
  }
}

// Built-in fields that are always available
const BUILTIN_FIELDS = [
  { name: 'name', title: 'Name', data_type: 'string' as const },
  { name: 'email', title: 'Email', data_type: 'string' as const },
  { name: 'message', title: 'Message', data_type: 'string' as const },
]

export function SDKSettings() {
  const [config, setConfig] = useState<SDKConfig>(DEFAULT_CONFIG)
  const [departments, setDepartments] = useState<Department[]>([])
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)

  // Determine API URL
  const apiUrl = typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'https://api.getevo.dev')
    : 'https://api.getevo.dev'

  const widgetUrl = `${apiUrl}/widget/homa-chat.min.js?v=${WIDGET_VERSION}`

  useEffect(() => {
    loadData()
    // Set the baseUrl from environment
    setConfig(prev => ({ ...prev, baseUrl: apiUrl }))
  }, [apiUrl])

  const loadData = async () => {
    try {
      setLoading(true)
      // Load departments and custom attributes in parallel
      const [deptResult, attrResult] = await Promise.all([
        getDepartmentsAction(),
        getCustomAttributesAction('conversation')
      ])

      if (deptResult.success && deptResult.data) {
        setDepartments(deptResult.data)
      }
      if (attrResult.success && attrResult.data) {
        setCustomAttributes(attrResult.data)
      }
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = useCallback((key: keyof SDKConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }, [])

  const applyTheme = useCallback((theme: typeof PRESET_THEMES[0]) => {
    setConfig(prev => ({
      ...prev,
      brandColor: theme.brandColor,
      headerColor: theme.headerColor,
      textColor: theme.textColor,
      darkMode: theme.darkMode
    }))
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const generateEmbedCode = () => {
    const configObj: Record<string, any> = {
      baseUrl: `'${config.baseUrl}'`,
      websiteToken: "'YOUR_WEBSITE_TOKEN'",
    }

    // Only add non-default values
    if (config.locale !== 'auto') configObj.locale = `'${config.locale}'`
    if (config.brandColor !== '#3B82F6') configObj.brandColor = `'${config.brandColor}'`
    if (config.headerColor !== config.brandColor) configObj.headerColor = `'${config.headerColor}'`
    if (config.textColor !== '#FFFFFF') configObj.textColor = `'${config.textColor}'`
    if (config.position !== 'right') configObj.position = `'${config.position}'`
    if (config.launcherText) configObj.launcherText = `'${config.launcherText}'`
    if (config.launcherSize !== 60) configObj.launcherSize = config.launcherSize
    if (config.windowWidth !== 380) configObj.windowWidth = config.windowWidth
    if (config.windowHeight !== 600) configObj.windowHeight = config.windowHeight
    if (config.borderRadius !== 16) configObj.borderRadius = config.borderRadius
    if (config.darkMode !== 'light') configObj.darkMode = `'${config.darkMode}'`
    if (config.hidePoweredBy) configObj.hidePoweredBy = true
    if (config.hideOnMobile) configObj.hideOnMobile = true
    if (config.greetingTitle !== 'Welcome') configObj.greetingTitle = `'${config.greetingTitle}'`
    if (config.greetingMessage !== 'Hi! How can we help you today?') configObj.greetingMessage = `'${config.greetingMessage}'`
    if (config.offlineMessage) configObj.offlineMessage = `'${config.offlineMessage}'`
    if (config.defaultDepartmentId) configObj.defaultDepartmentId = config.defaultDepartmentId
    if (!config.soundEnabled) configObj.soundEnabled = false
    if (config.soundType !== 'chime') configObj.soundType = `'${config.soundType}'`
    if (!config.titleNotification) configObj.titleNotification = false
    if (config.autoOpen > 0) configObj.autoOpen = config.autoOpen
    if (!config.autoOpenOnce) configObj.autoOpenOnce = false
    // Only add preChatFormFields if different from default
    const defaultFields = ['name', 'email']
    if (JSON.stringify(config.preChatFormFields?.sort()) !== JSON.stringify(defaultFields.sort())) {
      configObj.preChatFormFields = `[${config.preChatFormFields.map(f => `'${f}'`).join(', ')}]`
    }
    // Add customFields definitions for non-built-in fields
    const builtinNames = BUILTIN_FIELDS.map(f => f.name)
    const selectedCustomFields = config.preChatFormFields?.filter(f => !builtinNames.includes(f)) || []
    if (selectedCustomFields.length > 0) {
      const customFieldDefs = selectedCustomFields
        .map(fieldName => {
          const attr = customAttributes.find(a => a.name === fieldName)
          if (attr) {
            return `{ name: '${attr.name}', title: '${attr.title}', data_type: '${attr.data_type}'${attr.description ? `, placeholder: '${attr.description}'` : ''} }`
          }
          return null
        })
        .filter(Boolean)
      if (customFieldDefs.length > 0) {
        configObj.customFields = `[${customFieldDefs.join(', ')}]`
      }
    }
    if (config.transcriptEmail) configObj.transcriptEmail = true
    if (config.customCSS) configObj.customCSS = `\`${config.customCSS}\``

    const configStr = Object.entries(configObj)
      .map(([key, value]) => `      ${key}: ${value}`)
      .join(',\n')

    return `<script>
  (function(w,d,s,o,f,js,fjs){
    w['HomaChat']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  })(window,document,'script','homaChat','${widgetUrl}');

  homaChat('init', {
${configStr}
  });
</script>`
  }

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Widget URL Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            <CardTitle className="text-base sm:text-lg">Widget SDK URL</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Use this URL to embed the chat widget on your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              value={widgetUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(widgetUrl)}
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(widgetUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SDK Playground */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              <CardTitle className="text-base sm:text-lg">SDK Playground</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={refreshPreview}>
              <Play className="w-4 h-4 mr-2" />
              Refresh Preview
            </Button>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Customize the widget settings and see changes in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Settings Panel */}
            <div className="space-y-6">
              <Tabs defaultValue="appearance">
                <TabsList className="w-full">
                  <TabsTrigger value="appearance" className="flex-1">
                    <Palette className="w-4 h-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="behavior" className="flex-1">
                    <Settings2 className="w-4 h-4 mr-2" />
                    Behavior
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-4 mt-4">
                  {/* Theme Presets */}
                  <div className="space-y-2">
                    <Label className="text-xs">Theme Presets</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_THEMES.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => applyTheme(theme)}
                          className="group relative rounded-lg p-1 border hover:border-primary transition-colors"
                          title={theme.name}
                        >
                          <div
                            className="h-8 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: theme.brandColor }}
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: theme.headerColor }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground block text-center mt-1 truncate">
                            {theme.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Brand Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.brandColor}
                          onChange={(e) => updateConfig('brandColor', e.target.value)}
                          className="w-12 h-9 p-1 cursor-pointer"
                        />
                        <Input
                          value={config.brandColor}
                          onChange={(e) => updateConfig('brandColor', e.target.value)}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Header Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.headerColor}
                          onChange={(e) => updateConfig('headerColor', e.target.value)}
                          className="w-12 h-9 p-1 cursor-pointer"
                        />
                        <Input
                          value={config.headerColor}
                          onChange={(e) => updateConfig('headerColor', e.target.value)}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-2">
                    <Label className="text-xs">Text Color (on brand color)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={config.textColor}
                        onChange={(e) => updateConfig('textColor', e.target.value)}
                        className="w-12 h-9 p-1 cursor-pointer"
                      />
                      <Input
                        value={config.textColor}
                        onChange={(e) => updateConfig('textColor', e.target.value)}
                        className="font-mono text-xs flex-1"
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <Label className="text-xs">Position</Label>
                    <Select value={config.position} onValueChange={(v) => updateConfig('position', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Launcher Text */}
                  <div className="space-y-2">
                    <Label className="text-xs">Launcher Text</Label>
                    <Input
                      value={config.launcherText}
                      onChange={(e) => updateConfig('launcherText', e.target.value)}
                      placeholder="Chat with us"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional text shown next to the launcher button
                    </p>
                  </div>

                  {/* Sizes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Launcher Size (px)</Label>
                      <Input
                        type="number"
                        value={config.launcherSize}
                        onChange={(e) => updateConfig('launcherSize', parseInt(e.target.value) || 60)}
                        min={40}
                        max={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Border Radius (px)</Label>
                      <Input
                        type="number"
                        value={config.borderRadius}
                        onChange={(e) => updateConfig('borderRadius', parseInt(e.target.value) || 16)}
                        min={0}
                        max={32}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Window Width (px)</Label>
                      <Input
                        type="number"
                        value={config.windowWidth}
                        onChange={(e) => updateConfig('windowWidth', parseInt(e.target.value) || 380)}
                        min={300}
                        max={600}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Window Height (px)</Label>
                      <Input
                        type="number"
                        value={config.windowHeight}
                        onChange={(e) => updateConfig('windowHeight', parseInt(e.target.value) || 600)}
                        min={400}
                        max={800}
                      />
                    </div>
                  </div>

                  {/* Dark Mode */}
                  <div className="space-y-2">
                    <Label className="text-xs">Theme</Label>
                    <Select value={config.darkMode} onValueChange={(v) => updateConfig('darkMode', v as 'light' | 'dark' | 'auto')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (Browser)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-4 mt-4">
                  {/* Locale */}
                  <div className="space-y-2">
                    <Label className="text-xs">Language</Label>
                    <Select value={config.locale} onValueChange={(v) => updateConfig('locale', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {LOCALES.map(locale => (
                          <SelectItem key={locale.value} value={locale.value}>
                            {locale.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Default Department */}
                  <div className="space-y-2">
                    <Label className="text-xs">Default Department</Label>
                    <Select
                      value={config.defaultDepartmentId || "none"}
                      onValueChange={(v) => updateConfig('defaultDepartmentId', v === "none" ? "" : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (show selector)</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      If set, conversations will automatically be assigned to this department.
                    </p>
                  </div>

                  {/* Greeting */}
                  <div className="space-y-2">
                    <Label className="text-xs">Greeting Title</Label>
                    <Input
                      value={config.greetingTitle}
                      onChange={(e) => updateConfig('greetingTitle', e.target.value)}
                      placeholder="Welcome"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Greeting Message</Label>
                    <Textarea
                      value={config.greetingMessage}
                      onChange={(e) => updateConfig('greetingMessage', e.target.value)}
                      placeholder="Hi! How can we help you today?"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Offline Message</Label>
                    <Textarea
                      value={config.offlineMessage}
                      onChange={(e) => updateConfig('offlineMessage', e.target.value)}
                      placeholder="We are currently offline. Leave a message..."
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">
                      Message shown when no agents are available
                    </p>
                  </div>

                  {/* Auto-open */}
                  <div className="space-y-3 pt-2 border-t">
                    <Label className="text-xs font-medium">Auto-open</Label>
                    <div className="space-y-2">
                      <Label className="text-xs">Auto-open delay (ms)</Label>
                      <Input
                        type="number"
                        value={config.autoOpen}
                        onChange={(e) => updateConfig('autoOpen', parseInt(e.target.value) || 0)}
                        min={0}
                        step={1000}
                        placeholder="0 = disabled"
                      />
                      <p className="text-xs text-muted-foreground">
                        Automatically open the chat after this delay (0 = disabled, 5000 = 5 seconds)
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Only auto-open once per session</Label>
                      <Switch
                        checked={config.autoOpenOnce}
                        onCheckedChange={(v) => updateConfig('autoOpenOnce', v)}
                      />
                    </div>
                  </div>

                  {/* Pre-chat form fields */}
                  <div className="space-y-3 pt-2 border-t">
                    <Label className="text-xs font-medium">Pre-chat Form Fields</Label>

                    {/* Built-in fields */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Built-in</span>
                      <div className="flex flex-wrap gap-2">
                        {BUILTIN_FIELDS.map((field) => (
                          <button
                            key={field.name}
                            onClick={() => {
                              const fields = config.preChatFormFields || []
                              if (fields.includes(field.name)) {
                                updateConfig('preChatFormFields', fields.filter(f => f !== field.name))
                              } else {
                                updateConfig('preChatFormFields', [...fields, field.name])
                              }
                            }}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              config.preChatFormFields?.includes(field.name)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted hover:border-primary/50'
                            }`}
                          >
                            {field.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom attributes from system */}
                    {customAttributes.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Custom Fields</span>
                        <div className="flex flex-wrap gap-2">
                          {customAttributes.map((attr) => (
                            <button
                              key={attr.name}
                              onClick={() => {
                                const fields = config.preChatFormFields || []
                                if (fields.includes(attr.name)) {
                                  updateConfig('preChatFormFields', fields.filter(f => f !== attr.name))
                                } else {
                                  updateConfig('preChatFormFields', [...fields, attr.name])
                                }
                              }}
                              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                config.preChatFormFields?.includes(attr.name)
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted hover:border-primary/50'
                              }`}
                              title={attr.description || `Type: ${attr.data_type}`}
                            >
                              {attr.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Select which fields to show in the pre-chat form. Custom fields are managed in Settings &gt; Custom Attributes.
                    </p>
                  </div>

                  {/* Transcript */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Allow email transcript</Label>
                      <Switch
                        checked={config.transcriptEmail}
                        onCheckedChange={(v) => updateConfig('transcriptEmail', v)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Allow users to email themselves a transcript of the conversation
                    </p>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-3 pt-2 border-t">
                    <Label className="text-xs font-medium">Notifications</Label>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Play sound on new message</Label>
                      <Switch
                        checked={config.soundEnabled}
                        onCheckedChange={(v) => updateConfig('soundEnabled', v)}
                      />
                    </div>

                    {config.soundEnabled && (
                      <div className="space-y-2">
                        <Label className="text-xs">Notification Sound</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {SOUND_TYPES.map((sound) => (
                            <button
                              key={sound.value}
                              onClick={() => {
                                updateConfig('soundType', sound.value)
                                if (sound.value !== 'none') {
                                  playPreviewSound(sound.value)
                                }
                              }}
                              className={`relative rounded-lg p-2 border text-center transition-colors ${
                                config.soundType === sound.value
                                  ? 'border-primary bg-primary/10'
                                  : 'hover:border-primary/50'
                              }`}
                            >
                              <Volume2 className={`w-4 h-4 mx-auto mb-1 ${sound.value === 'none' ? 'opacity-30' : ''}`} />
                              <span className="text-[10px] block">{sound.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Update page title on new message</Label>
                      <Switch
                        checked={config.titleNotification}
                        onCheckedChange={(v) => updateConfig('titleNotification', v)}
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Hide "Powered by" badge</Label>
                      <Switch
                        checked={config.hidePoweredBy}
                        onCheckedChange={(v) => updateConfig('hidePoweredBy', v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Hide on mobile devices</Label>
                      <Switch
                        checked={config.hideOnMobile}
                        onCheckedChange={(v) => updateConfig('hideOnMobile', v)}
                      />
                    </div>
                  </div>

                  {/* Custom CSS */}
                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-xs font-medium">Custom CSS</Label>
                    <Textarea
                      value={config.customCSS}
                      onChange={(e) => updateConfig('customCSS', e.target.value)}
                      placeholder=".homa-chat-launcher { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }"
                      rows={4}
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      Inject custom CSS to style the widget. Use classes like .homa-chat-launcher, .homa-chat-window, .homa-chat-header
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Panel */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <Label className="text-sm font-medium">Live Preview</Label>
              </div>
              <div
                className="relative border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                style={{ height: '500px' }}
              >
                <SDKPreview key={previewKey} config={config} />
              </div>

              {/* Embed Code */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <Label className="text-sm font-medium">Embed Code</Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateEmbedCode())}
                  >
                    {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add this code before the closing &lt;/body&gt; tag.
                </p>
                <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs font-mono max-h-[200px]">
                  {generateEmbedCode()}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SDK Documentation Link */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <CardTitle className="text-base sm:text-lg">SDK Documentation</CardTitle>
            </div>
            <Link href="/settings/sdk-docs">
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                View Full Documentation
              </Button>
            </Link>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Complete reference for all SDK options, methods, events, and examples. Documentation is also available for download.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

// Preview Component - renders a static preview of the widget
function SDKPreview({ config }: { config: SDKConfig }) {
  const isRTL = ['ar', 'he', 'fa'].includes(config.locale)
  const [systemDark, setSystemDark] = useState(false)

  useEffect(() => {
    // Check system preference
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(mq.matches)
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Determine if dark mode should be applied
  const isDark = config.darkMode === 'dark' || (config.darkMode === 'auto' && systemDark)

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Simulated website content */}
      <div className="absolute inset-0 p-4 overflow-hidden opacity-30">
        <div className="space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full mt-8"></div>
        </div>
      </div>

      {/* Chat Widget Preview */}
      <div
        className="absolute"
        style={{
          bottom: '20px',
          [config.position]: '20px',
          direction: isRTL ? 'rtl' : 'ltr'
        }}
      >
        {/* Chat Window (open state preview) */}
        <div
          className="mb-4 shadow-xl overflow-hidden"
          style={{
            width: `${Math.min(config.windowWidth, 320)}px`,
            height: `${Math.min(config.windowHeight, 400)}px`,
            borderRadius: `${config.borderRadius}px`,
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF'
          }}
        >
          {/* Header */}
          <div
            className="p-3 flex items-center gap-3"
            style={{
              backgroundColor: config.headerColor || config.brandColor,
              color: config.textColor,
              borderRadius: `${config.borderRadius}px ${config.borderRadius}px 0 0`
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <svg className="w-6 h-6" fill={config.textColor} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-sm">{config.greetingTitle || 'Welcome'}</div>
              <div className="text-xs opacity-80">We typically reply within a few minutes</div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 p-4"
            style={{
              backgroundColor: isDark ? '#111827' : '#F9FAFB',
              height: 'calc(100% - 130px)'
            }}
          >
            <div className="text-center py-4">
              <div
                className="text-sm font-medium mb-1"
                style={{ color: isDark ? '#F9FAFB' : '#111827' }}
              >
                {config.greetingTitle || 'Welcome'}
              </div>
              <div
                className="text-xs"
                style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
              >
                {config.greetingMessage || 'Hi! How can we help you today?'}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div
            className="p-3 border-t flex gap-2"
            style={{
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              borderColor: isDark ? '#374151' : '#E5E7EB'
            }}
          >
            <div
              className="flex-1 px-3 py-2 rounded-full text-xs"
              style={{
                backgroundColor: isDark ? '#374151' : '#F9FAFB',
                color: isDark ? '#9CA3AF' : '#9CA3AF'
              }}
            >
              Type your message...
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: config.brandColor }}
            >
              <svg className="w-4 h-4" fill={config.textColor} viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Launcher Button */}
        <div
          className="rounded-full flex items-center justify-center cursor-pointer shadow-lg"
          style={{
            width: `${config.launcherSize}px`,
            height: `${config.launcherSize}px`,
            backgroundColor: config.brandColor,
            marginLeft: config.position === 'right' ? 'auto' : '0'
          }}
        >
          <svg
            className="w-7 h-7"
            fill={config.textColor}
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

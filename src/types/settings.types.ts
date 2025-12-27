/**
 * Types for the Settings page and its components
 */

// Re-export types from the custom attributes service for convenience
export type {
  CustomAttribute as BackendCustomAttribute,
  CustomAttributeScope,
  CustomAttributeDataType,
  CustomAttributeVisibility,
  CreateCustomAttributeRequest,
  UpdateCustomAttributeRequest,
} from '@/services/custom-attributes.service'

export interface SelectOption {
  key: string
  label: string
}

// Frontend representation of custom attribute (used in forms)
export interface CustomAttribute {
  // Composite key: scope + name (name is unique within scope)
  scope: 'client' | 'conversation'
  name: string // snake_case identifier
  title: string // Display name
  description: string | null
  data_type: 'int' | 'float' | 'date' | 'string'
  validation: string | null
  visibility: 'everyone' | 'administrator' | 'hidden'
  created_at?: string
  updated_at?: string
}

// Legacy interface - maps old format to new
export interface LegacyCustomAttribute {
  id: string
  varName: string
  displayName: string
  description: string
  type: 'decimal' | 'integer' | 'text' | 'longtext' | 'image' | 'date' | 'select'
  defaultValue?: string | number | boolean
  validationRule?: string
  selectOptions?: SelectOption[]
  required?: boolean
}

// Legacy interface for backward compatibility
export interface CustomField {
  id: string
  name: string
  label: string
  type: 'text' | 'number' | 'email' | 'select' | 'boolean'
  required: boolean
  options?: string[]
}

export interface CannedMessage {
  id: string
  title: string
  content: string
  category: string
}

export interface ConversationStatus {
  id: string
  name: string
  color: string
  default: boolean
}

export interface ConversationPriority {
  id: string
  name: string
  color: string
  weight: number
}

export interface Integration {
  id: string
  name: string
  description: string
  connected: boolean
  logo: string
  configUrl?: string
}

export interface Plugin {
  id: string
  name: string
  description: string
  version: string
  active: boolean
  configurable: boolean
}

export interface GeneralSettings {
  appName: string
  companyName: string
  description: string
  maintenanceMode: boolean
  enableRegistration: boolean
  defaultLanguage: string
  timezone: string
}

export interface ApiSettings {
  baseUrl: string
  enableAccess: boolean
  webhookUrl: string
}

export interface LocalizationSettings {
  language: string
  timezone: string
  dateFormat: string
  timeFormat: string
}

export type SettingsTab = 
  | 'general' 
  | 'customer-attributes' 
  | 'conversation-attributes' 
  | 'integrations' 
  | 'plugins' 
  | 'canned-messages'

export interface SettingsTabConfig {
  id: SettingsTab
  label: string
  icon: any // Lucide React icon component
  description: string
}
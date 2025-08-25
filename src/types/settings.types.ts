/**
 * Types for the Settings page and its components
 */

export interface SelectOption {
  key: string
  label: string
}

export interface CustomAttribute {
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

export interface TicketStatus {
  id: string
  name: string
  color: string
  default: boolean
}

export interface TicketPriority {
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
  | 'ticket-attributes' 
  | 'integrations' 
  | 'plugins' 
  | 'canned-messages'

export interface SettingsTabConfig {
  id: SettingsTab
  label: string
  icon: any // Lucide React icon component
  description: string
}
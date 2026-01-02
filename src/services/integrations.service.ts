/**
 * Integrations Service
 * Handles API calls for integration management
 */

import { apiClient } from './api-client'

export interface IntegrationType {
  type: string
  name: string
  description: string
  icon: string
}

export interface ConfigField {
  name: string
  label: string
  type: 'text' | 'password' | 'email' | 'number' | 'select'
  required: boolean
  placeholder?: string
  options?: string[]
}

export interface Integration {
  id?: number
  type: string
  name: string
  status: 'disabled' | 'enabled' | 'error'
  config?: Record<string, any>
  last_error?: string
  tested_at?: string
  created_at?: string
  updated_at?: string
}

export interface TestResult {
  success: boolean
  message: string
  details?: string
}

// Integration type constants
export const INTEGRATION_TYPES = {
  SLACK: 'slack',
  TELEGRAM: 'telegram',
  WHATSAPP: 'whatsapp',
  SMTP: 'smtp',
  GMAIL: 'gmail',
  OUTLOOK: 'outlook',
} as const

// Integration icons (SVG paths or component names)
export const INTEGRATION_ICONS: Record<string, string> = {
  slack: '/icons/slack.svg',
  telegram: '/icons/telegram.svg',
  whatsapp: '/icons/whatsapp.svg',
  smtp: '/icons/smtp.svg',
  gmail: '/icons/gmail.svg',
  outlook: '/icons/outlook.svg',
}

// Fallback emojis for integrations
export const INTEGRATION_EMOJIS: Record<string, string> = {
  slack: '💬',
  telegram: '📱',
  whatsapp: '📲',
  smtp: '📮',
  gmail: '📧',
  outlook: '📨',
}

class IntegrationsService {
  private basePath = '/api/admin/integrations'

  /**
   * Get all available integration types
   */
  async getTypes(): Promise<IntegrationType[]> {
    const response = await apiClient.get(`${this.basePath}/types`)
    return response.data || []
  }

  /**
   * Get all configured integrations
   */
  async list(): Promise<Integration[]> {
    const response = await apiClient.get(this.basePath)
    return response.data || []
  }

  /**
   * Get a single integration by type
   */
  async get(type: string): Promise<Integration> {
    const response = await apiClient.get(`${this.basePath}/${type}`)
    return response.data
  }

  /**
   * Get configuration fields for an integration type
   */
  async getFields(type: string): Promise<ConfigField[]> {
    const response = await apiClient.get(`${this.basePath}/${type}/fields`)
    return response.data || []
  }

  /**
   * Save (create or update) an integration
   */
  async save(type: string, data: { status: string; config: Record<string, any> }): Promise<Integration> {
    const response = await apiClient.put(`${this.basePath}/${type}`, data)
    return response.data
  }

  /**
   * Test an integration connection
   */
  async test(type: string, config: Record<string, any>): Promise<TestResult> {
    const response = await apiClient.post(`${this.basePath}/${type}/test`, { config })
    return response.data
  }

  /**
   * Delete an integration
   */
  async delete(type: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${type}`)
  }

  /**
   * Get status badge variant
   */
  getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'enabled':
        return 'default'
      case 'error':
        return 'destructive'
      case 'disabled':
      default:
        return 'secondary'
    }
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'enabled':
        return 'Connected'
      case 'error':
        return 'Error'
      case 'disabled':
      default:
        return 'Disabled'
    }
  }
}

export const integrationsService = new IntegrationsService()

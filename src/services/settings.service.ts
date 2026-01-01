/**
 * Settings Service
 * Handles API calls for application settings
 */

import { apiClient } from './api-client'

export interface Setting {
  id: number
  key: string
  value: string
  type: string
  category: string
  label: string
  created_at: string
  updated_at: string
}

export interface SettingsMap {
  [key: string]: string
}

export interface UpdateSettingsRequest {
  settings: SettingsMap
}

// Predefined AI Endpoints
export const AI_ENDPOINTS = [
  { label: 'OpenAI', value: 'https://api.openai.com/v1' },
  { label: 'Google Gemini (OpenAI Compatible)', value: 'https://generativelanguage.googleapis.com/v1beta/openai' },
  { label: 'Anthropic (OpenAI Compatible)', value: 'https://api.anthropic.com/v1' },
  { label: 'OpenRouter', value: 'https://openrouter.ai/api/v1' },
  { label: 'Together AI', value: 'https://api.together.xyz/v1' },
  { label: 'Groq', value: 'https://api.groq.com/openai/v1' },
  { label: 'Ollama (Local)', value: 'http://localhost:11434/v1' },
  { label: 'Custom', value: 'custom' },
]

// Predefined Models per Endpoint
export const AI_MODELS: Record<string, { label: string; value: string }[]> = {
  'https://api.openai.com/v1': [
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
    { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
    { label: 'GPT-4', value: 'gpt-4' },
    { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  ],
  'https://generativelanguage.googleapis.com/v1beta/openai': [
    { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash-exp' },
    { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
    { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
  ],
  'https://api.anthropic.com/v1': [
    { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022' },
    { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
    { label: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307' },
  ],
  'https://openrouter.ai/api/v1': [
    { label: 'GPT-4o', value: 'openai/gpt-4o' },
    { label: 'Claude 3.5 Sonnet', value: 'anthropic/claude-3.5-sonnet' },
    { label: 'Gemini Pro 1.5', value: 'google/gemini-pro-1.5' },
    { label: 'Llama 3.1 70B', value: 'meta-llama/llama-3.1-70b-instruct' },
  ],
  'https://api.together.xyz/v1': [
    { label: 'Llama 3.1 70B', value: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo' },
    { label: 'Llama 3.1 8B', value: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo' },
    { label: 'Mistral 7B', value: 'mistralai/Mistral-7B-Instruct-v0.3' },
  ],
  'https://api.groq.com/openai/v1': [
    { label: 'Llama 3.1 70B', value: 'llama-3.1-70b-versatile' },
    { label: 'Llama 3.1 8B', value: 'llama-3.1-8b-instant' },
    { label: 'Mixtral 8x7B', value: 'mixtral-8x7b-32768' },
  ],
  'http://localhost:11434/v1': [
    { label: 'Llama 3.1', value: 'llama3.1' },
    { label: 'Mistral', value: 'mistral' },
    { label: 'Codellama', value: 'codellama' },
  ],
}

// Setting Keys
export const SETTING_KEYS = {
  // AI Settings
  AI_ENDPOINT: 'ai.endpoint',
  AI_API_KEY: 'ai.api_key',
  AI_MODEL: 'ai.model',
  AI_CONVERSATION_SUMMARY_ENABLED: 'ai.conversation_summary_enabled',
  AI_CONVERSATION_SUMMARY_DELAY: 'ai.conversation_summary_delay',

  // Workflow Settings
  DEFAULT_DEPARTMENT: 'workflow.default_department',

  // General Settings
  APP_NAME: 'general.app_name',
  COMPANY_NAME: 'general.company_name',
  MAINTENANCE_MODE: 'general.maintenance_mode',
}

class SettingsService {
  /**
   * Get all settings or filter by category
   */
  async getSettings(category?: string): Promise<SettingsMap> {
    const endpoint = category ? `/api/settings?category=${category}` : '/api/settings'
    const response = await apiClient.get<SettingsMap>(endpoint)
    return response.data
  }

  /**
   * Update multiple settings at once
   */
  async updateSettings(settings: SettingsMap): Promise<void> {
    await apiClient.put<void>('/api/settings', { settings })
  }

  /**
   * Get a single setting by key
   */
  async getSetting(key: string): Promise<Setting> {
    const response = await apiClient.get<Setting>(`/api/settings/${key}`)
    return response.data
  }

  /**
   * Set a single setting
   */
  async setSetting(key: string, value: string, type?: string, category?: string, label?: string): Promise<void> {
    await apiClient.put<void>(`/api/settings/${key}`, {
      value,
      type: type || 'string',
      category: category || '',
      label: label || '',
    })
  }

  /**
   * Delete a setting
   */
  async deleteSetting(key: string): Promise<void> {
    await apiClient.delete<void>(`/api/settings/${key}`)
  }

  /**
   * Get AI settings specifically
   */
  async getAISettings(): Promise<{
    endpoint: string
    apiKey: string
    model: string
  }> {
    const settings = await this.getSettings('ai')
    return {
      endpoint: settings[SETTING_KEYS.AI_ENDPOINT] || '',
      apiKey: settings[SETTING_KEYS.AI_API_KEY] || '',
      model: settings[SETTING_KEYS.AI_MODEL] || '',
    }
  }

  /**
   * Update AI settings
   */
  async updateAISettings(endpoint: string, apiKey: string, model: string): Promise<void> {
    await this.updateSettings({
      [SETTING_KEYS.AI_ENDPOINT]: endpoint,
      [SETTING_KEYS.AI_API_KEY]: apiKey,
      [SETTING_KEYS.AI_MODEL]: model,
    })
  }

  /**
   * Get workflow settings
   */
  async getWorkflowSettings(): Promise<{
    defaultDepartment: string
  }> {
    const settings = await this.getSettings('workflow')
    return {
      defaultDepartment: settings[SETTING_KEYS.DEFAULT_DEPARTMENT] || '',
    }
  }

  /**
   * Update workflow settings
   */
  async updateWorkflowSettings(defaultDepartment: string): Promise<void> {
    await this.updateSettings({
      [SETTING_KEYS.DEFAULT_DEPARTMENT]: defaultDepartment,
    })
  }
}

export const settingsService = new SettingsService()

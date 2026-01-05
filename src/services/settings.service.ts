/**
 * Settings Service
 * Handles API calls for application settings
 *
 * Note: Settings are fetched via server-side API route (/api/settings)
 * to keep sensitive data like API keys secure (not exposed to browser).
 */

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
  AI_BOT_PROMPT_TEMPLATE: 'ai.bot_prompt_template',

  // Workflow Settings
  DEFAULT_DEPARTMENT: 'workflow.default_department',
  CONVERSATION_TIMEOUT_HOURS: 'workflow.conversation_timeout_hours',

  // General Settings
  PROJECT_NAME: 'general.project_name',
  APP_NAME: 'general.app_name',
  COMPANY_NAME: 'general.company_name',
  MAINTENANCE_MODE: 'general.maintenance_mode',
}

class SettingsService {
  /**
   * Get all settings or filter by category
   * Uses server-side API route to keep sensitive data secure
   */
  async getSettings(category?: string): Promise<SettingsMap> {
    const endpoint = category ? `/api/settings?category=${category}` : '/api/settings'
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || data
  }

  /**
   * Update multiple settings at once
   * Uses server-side API route to keep sensitive data secure
   */
  async updateSettings(settings: SettingsMap): Promise<void> {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ settings }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update settings: ${response.statusText}`)
    }
  }

  /**
   * Get a single setting by key
   * Note: Currently fetches all settings and filters - individual key endpoint not implemented
   */
  async getSetting(key: string): Promise<Setting> {
    const settings = await this.getSettings()
    return {
      id: 0,
      key,
      value: settings[key] || '',
      type: 'string',
      category: '',
      label: '',
      created_at: '',
      updated_at: '',
    }
  }

  /**
   * Set a single setting
   */
  async setSetting(key: string, value: string, type?: string, category?: string, label?: string): Promise<void> {
    await this.updateSettings({ [key]: value })
  }

  /**
   * Delete a setting
   * Note: Not yet implemented for server-side route
   */
  async deleteSetting(key: string): Promise<void> {
    console.warn('deleteSetting not implemented for server-side route')
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

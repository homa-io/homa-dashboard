'use server'

import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.getevo.dev'

export interface SettingsMap {
  [key: string]: string
}

/**
 * Server action to get settings
 * This runs entirely on the server and never exposes data to the client network tab
 */
export async function getSettingsAction(category?: string): Promise<SettingsMap> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    throw new Error('Unauthorized')
  }

  const endpoint = category
    ? `${BACKEND_URL}/api/settings?category=${category}`
    : `${BACKEND_URL}/api/settings`

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error('Settings action error:', error)
    throw error
  }
}

/**
 * Server action to update settings
 * This runs entirely on the server
 */
export async function updateSettingsAction(settings: SettingsMap): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    throw new Error('Unauthorized')
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ settings }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update settings: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Settings action error:', error)
    throw error
  }
}

/**
 * Server action to check if a specific setting is enabled
 * Returns only the boolean value, not the full settings
 */
export async function isSettingEnabledAction(key: string): Promise<boolean> {
  try {
    const settings = await getSettingsAction()
    return settings[key] === 'true'
  } catch {
    return false
  }
}

/**
 * Server action to get AI settings
 * Returns only non-sensitive AI configuration
 */
export async function getAISettingsAction(): Promise<{
  endpoint: string
  model: string
  hasApiKey: boolean
}> {
  const settings = await getSettingsAction('ai')
  return {
    endpoint: settings['ai.endpoint'] || '',
    model: settings['ai.model'] || '',
    hasApiKey: !!settings['ai.api_key'],
  }
}

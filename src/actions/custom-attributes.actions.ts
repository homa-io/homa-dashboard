"use server"

import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.getevo.dev'

export interface CustomAttribute {
  scope: 'client' | 'conversation'
  name: string
  data_type: 'int' | 'float' | 'date' | 'string'
  validation: string | null
  title: string
  description: string | null
  visibility: 'everyone' | 'administrator' | 'hidden'
  created_at: string
  updated_at: string
}

interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Get custom attributes by scope
 * Server action that fetches custom attributes with authentication
 */
export async function getCustomAttributesAction(scope: 'client' | 'conversation' = 'conversation'): Promise<ActionResult<CustomAttribute[]>> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }

    const response = await fetch(`${BACKEND_URL}/api/admin/attributes?scope=${scope}&visibility=everyone`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch custom attributes: ${response.statusText}`
      }
    }

    const data = await response.json()

    // Handle different response formats
    const attributes = data.data || data || []

    return {
      success: true,
      data: Array.isArray(attributes) ? attributes : []
    }
  } catch (error: any) {
    console.error("Failed to fetch custom attributes:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch custom attributes"
    }
  }
}

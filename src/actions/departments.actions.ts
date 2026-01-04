"use server"

import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.getevo.dev'

interface Department {
  id: number
  name: string
  description?: string
  status?: string
}

interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Get all departments
 * Server action that fetches departments with authentication
 */
export async function getDepartmentsAction(): Promise<ActionResult<Department[]>> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }

    const response = await fetch(`${BACKEND_URL}/api/admin/departments`, {
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
        error: `Failed to fetch departments: ${response.statusText}`
      }
    }

    const data = await response.json()

    // Handle different response formats
    const departments = data.data || data || []

    return {
      success: true,
      data: Array.isArray(departments) ? departments : []
    }
  } catch (error: any) {
    console.error("Failed to fetch departments:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch departments"
    }
  }
}

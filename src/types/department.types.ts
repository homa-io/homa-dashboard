/**
 * Department Types
 */

// User type (simplified for department assignment)
export interface DepartmentUser {
  id: string
  name: string
  last_name: string
  display_name: string
  email: string
  type: 'agent' | 'administrator' | 'bot'
  status: 'active' | 'blocked'
  avatar?: string | null
}

// Department status
export type DepartmentStatus = 'active' | 'suspended'

// Department entity
export interface Department {
  id: number
  name: string
  description: string
  status: DepartmentStatus
  created_at: string
  updated_at: string
  users?: DepartmentUser[]
}

// Create department request
export interface DepartmentCreateRequest {
  name: string
  description?: string
  user_ids?: string[]
}

// Update department request
export interface DepartmentUpdateRequest {
  name: string
  description?: string
  status?: DepartmentStatus
  user_ids?: string[]
}

// List departments response
export interface DepartmentListResponse {
  data: Department[]
  total: number
}

// List departments params
export interface DepartmentListParams {
  search?: string
  status?: DepartmentStatus
  order_by?: 'name' | 'id' | 'created_at'
  page?: number
  limit?: number
}

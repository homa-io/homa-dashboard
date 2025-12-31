/**
 * Department Service
 * Handles CRUD operations for departments
 */

import { apiClient } from './api-client'
import type {
  Department,
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
  DepartmentListResponse,
  DepartmentListParams,
  DepartmentUser,
} from '@/types/department.types'

const BASE_PATH = '/api/admin/departments'
const USERS_PATH = '/api/admin/users'

/**
 * Get all departments
 */
export async function getDepartments(params?: DepartmentListParams): Promise<DepartmentListResponse> {
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.set('search', params.search)
  if (params?.status) queryParams.set('status', params.status)
  if (params?.order_by) queryParams.set('order_by', params.order_by)
  if (params?.page) queryParams.set('page', params.page.toString())
  if (params?.limit) queryParams.set('limit', params.limit.toString())

  const queryString = queryParams.toString()
  const url = queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH

  const response = await apiClient.get<Department[]>(url)
  return {
    data: response.data || [],
    total: response.meta?.total || response.data?.length || 0,
  }
}

/**
 * Get a single department by ID
 */
export async function getDepartment(id: number): Promise<Department> {
  const response = await apiClient.get<Department>(`${BASE_PATH}/${id}`)
  return response.data
}

/**
 * Create a new department
 */
export async function createDepartment(data: DepartmentCreateRequest): Promise<Department> {
  const response = await apiClient.post<Department>(BASE_PATH, data)
  return response.data
}

/**
 * Update an existing department
 */
export async function updateDepartment(id: number, data: DepartmentUpdateRequest): Promise<Department> {
  const response = await apiClient.put<Department>(`${BASE_PATH}/${id}`, data)
  return response.data
}

/**
 * Delete a department
 */
export async function deleteDepartment(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`)
}

/**
 * Suspend or activate a department
 */
export async function suspendDepartment(id: number, suspended: boolean): Promise<Department> {
  const response = await apiClient.put<Department>(`${BASE_PATH}/${id}/suspend`, { suspended })
  return response.data
}

/**
 * Get all users (agents and bots) for assignment
 */
export async function getAssignableUsers(): Promise<DepartmentUser[]> {
  const response = await apiClient.get<{ users: DepartmentUser[] } | DepartmentUser[]>(USERS_PATH)
  const data = response.data

  // Handle paginated response format: { page, users: [...] }
  if (data && typeof data === 'object' && 'users' in data && Array.isArray(data.users)) {
    return data.users
  }

  // Handle direct array format
  if (Array.isArray(data)) {
    return data
  }

  // If data is not in expected format, return empty array
  return []
}

// Convenience object export
export const departmentService = {
  list: getDepartments,
  get: getDepartment,
  create: createDepartment,
  update: updateDepartment,
  delete: deleteDepartment,
  suspend: suspendDepartment,
  getAssignableUsers,
}

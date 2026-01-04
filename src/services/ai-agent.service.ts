/**
 * AI Agent Service
 * Handles all API operations for AI Agents
 */

import { apiClient } from './api-client'
import type {
  AIAgent,
  AIAgentCreateRequest,
  AIAgentUpdateRequest,
  AIAgentListParams,
  AIAgentListResponse,
} from '@/types/ai-agent.types'

const BASE_PATH = '/api/admin/ai-agents'

/**
 * Get list of AI agents with optional filtering
 */
export async function getAIAgents(
  params?: AIAgentListParams
): Promise<AIAgentListResponse> {
  const queryParams = new URLSearchParams()

  if (params?.search) {
    queryParams.set('search', params.search)
  }
  if (params?.status) {
    queryParams.set('status', params.status)
  }
  if (params?.bot_id) {
    queryParams.set('bot_id', params.bot_id)
  }
  if (params?.page) {
    queryParams.set('page', params.page.toString())
  }
  if (params?.limit) {
    queryParams.set('limit', params.limit.toString())
  }
  if (params?.order_by) {
    queryParams.set('order_by', params.order_by)
  }
  if (params?.order_direction) {
    queryParams.set('order_direction', params.order_direction)
  }

  const url = queryParams.toString()
    ? `${BASE_PATH}?${queryParams.toString()}`
    : BASE_PATH

  const response = await apiClient.get<AIAgent[]>(url)

  return {
    data: response.data || [],
    total: response.meta?.total || 0,
  }
}

/**
 * Get a single AI agent by ID
 */
export async function getAIAgent(id: number): Promise<AIAgent> {
  const response = await apiClient.get<AIAgent>(`${BASE_PATH}/${id}`)
  return response.data
}

/**
 * Create a new AI agent
 */
export async function createAIAgent(
  data: AIAgentCreateRequest
): Promise<AIAgent> {
  const response = await apiClient.post<AIAgent>(BASE_PATH, data)
  return response.data
}

/**
 * Update an existing AI agent
 */
export async function updateAIAgent(
  id: number,
  data: AIAgentUpdateRequest
): Promise<AIAgent> {
  const response = await apiClient.put<AIAgent>(`${BASE_PATH}/${id}`, data)
  return response.data
}

/**
 * Delete an AI agent
 */
export async function deleteAIAgent(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`)
}

/**
 * Toggle AI agent status (activate/deactivate)
 */
export async function toggleAIAgentStatus(
  id: number,
  status: 'active' | 'inactive'
): Promise<AIAgent> {
  const response = await apiClient.put<AIAgent>(`${BASE_PATH}/${id}`, {
    status,
  })
  return response.data
}

/**
 * Get the generated system prompt template for an AI agent
 */
export interface AIAgentTemplateResponse {
  template: string
  token_count: number
}

export async function getAIAgentTemplate(
  id: number
): Promise<AIAgentTemplateResponse> {
  const response = await apiClient.get<AIAgentTemplateResponse>(
    `${BASE_PATH}/${id}/template`
  )
  return response.data
}

// Convenience export as object
export const aiAgentService = {
  list: getAIAgents,
  get: getAIAgent,
  create: createAIAgent,
  update: updateAIAgent,
  delete: deleteAIAgent,
  toggleStatus: toggleAIAgentStatus,
  getTemplate: getAIAgentTemplate,
}

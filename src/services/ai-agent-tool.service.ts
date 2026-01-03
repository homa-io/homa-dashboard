import { apiClient } from './api-client'
import type { AIAgentTool, AIAgentToolRequest } from '@/types/ai-agent-tool.types'

const getBasePath = (agentId: number) => `/api/admin/ai-agents/${agentId}/tools`

/**
 * Get all tools for an AI agent
 */
export async function getTools(agentId: number): Promise<AIAgentTool[]> {
  const response = await apiClient.get<AIAgentTool[]>(getBasePath(agentId))
  return response.data || []
}

/**
 * Get a single tool by ID
 */
export async function getTool(agentId: number, toolId: number): Promise<AIAgentTool> {
  const response = await apiClient.get<AIAgentTool>(`${getBasePath(agentId)}/${toolId}`)
  if (!response.data) {
    throw new Error('Tool not found')
  }
  return response.data
}

/**
 * Create a new tool
 */
export async function createTool(agentId: number, data: AIAgentToolRequest): Promise<AIAgentTool> {
  const response = await apiClient.post<AIAgentTool>(getBasePath(agentId), data)
  if (!response.data) {
    throw new Error('Failed to create tool')
  }
  return response.data
}

/**
 * Update an existing tool
 */
export async function updateTool(agentId: number, toolId: number, data: Partial<AIAgentToolRequest>): Promise<AIAgentTool> {
  const response = await apiClient.put<AIAgentTool>(`${getBasePath(agentId)}/${toolId}`, data)
  if (!response.data) {
    throw new Error('Failed to update tool')
  }
  return response.data
}

/**
 * Delete a tool
 */
export async function deleteTool(agentId: number, toolId: number): Promise<void> {
  await apiClient.delete(`${getBasePath(agentId)}/${toolId}`)
}

export const aiAgentToolService = {
  list: getTools,
  get: getTool,
  create: createTool,
  update: updateTool,
  delete: deleteTool,
}

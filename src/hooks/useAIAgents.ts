'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { aiAgentService } from '@/services/ai-agent.service'
import type {
  AIAgent,
  AIAgentCreateRequest,
  AIAgentUpdateRequest,
  AIAgentListParams,
} from '@/types/ai-agent.types'

/**
 * Hook to fetch AI agents list
 */
export function useAIAgents(params?: AIAgentListParams) {
  return useQuery({
    queryKey: queryKeys.aiAgents.list(params || {}),
    queryFn: () => aiAgentService.list(params),
  })
}

/**
 * Hook to fetch a single AI agent
 */
export function useAIAgent(id: number) {
  return useQuery({
    queryKey: queryKeys.aiAgents.detail(id),
    queryFn: () => aiAgentService.get(id),
    enabled: !!id,
  })
}

/**
 * Hook to create an AI agent
 */
export function useCreateAIAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AIAgentCreateRequest) => aiAgentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.aiAgents.all })
    },
  })
}

/**
 * Hook to update an AI agent
 */
export function useUpdateAIAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AIAgentUpdateRequest }) =>
      aiAgentService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.aiAgents.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.aiAgents.lists() })
    },
  })
}

/**
 * Hook to delete an AI agent
 */
export function useDeleteAIAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => aiAgentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.aiAgents.all })
    },
  })
}

/**
 * Hook to toggle AI agent status
 */
export function useToggleAIAgentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number
      status: 'active' | 'inactive'
    }) => aiAgentService.toggleStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.aiAgents.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.aiAgents.lists() })
    },
  })
}

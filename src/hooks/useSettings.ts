'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { SettingsMap, SETTING_KEYS } from '@/services/settings.service';
import { getSettingsAction, updateSettingsAction, getAISettingsAction } from '@/actions/settings.actions';

/**
 * Hook to fetch all settings or by category
 * Uses server actions to keep sensitive data secure
 */
export function useSettings(category?: string) {
  return useQuery({
    queryKey: category ? queryKeys.settings.category(category) : queryKeys.settings.all,
    queryFn: () => getSettingsAction(category),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

/**
 * Hook to fetch AI settings (non-sensitive fields only)
 */
export function useAISettings() {
  return useQuery({
    queryKey: queryKeys.settings.ai(),
    queryFn: () => getAISettingsAction(),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch workflow settings
 */
export function useWorkflowSettings() {
  return useQuery({
    queryKey: queryKeys.settings.workflow(),
    queryFn: async () => {
      const settings = await getSettingsAction('workflow')
      return {
        defaultDepartment: settings[SETTING_KEYS.DEFAULT_DEPARTMENT] || '',
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to update settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: SettingsMap) => updateSettingsAction(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

/**
 * Hook to update AI settings
 */
export function useUpdateAISettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ endpoint, apiKey, model }: { endpoint: string; apiKey: string; model: string }) =>
      updateSettingsAction({
        [SETTING_KEYS.AI_ENDPOINT]: endpoint,
        [SETTING_KEYS.AI_API_KEY]: apiKey,
        [SETTING_KEYS.AI_MODEL]: model,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.ai() });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

/**
 * Hook to update workflow settings
 */
export function useUpdateWorkflowSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (defaultDepartment: string) =>
      updateSettingsAction({
        [SETTING_KEYS.DEFAULT_DEPARTMENT]: defaultDepartment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.workflow() });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { settingsService, SettingsMap } from '@/services/settings.service';

/**
 * Hook to fetch all settings or by category
 */
export function useSettings(category?: string) {
  return useQuery({
    queryKey: category ? queryKeys.settings.category(category) : queryKeys.settings.all,
    queryFn: () => settingsService.getSettings(category),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

/**
 * Hook to fetch AI settings
 */
export function useAISettings() {
  return useQuery({
    queryKey: queryKeys.settings.ai(),
    queryFn: () => settingsService.getAISettings(),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch workflow settings
 */
export function useWorkflowSettings() {
  return useQuery({
    queryKey: queryKeys.settings.workflow(),
    queryFn: () => settingsService.getWorkflowSettings(),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to update settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: SettingsMap) => settingsService.updateSettings(settings),
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
      settingsService.updateAISettings(endpoint, apiKey, model),
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
      settingsService.updateWorkflowSettings(defaultDepartment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.workflow() });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

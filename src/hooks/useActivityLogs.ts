'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { activityLogService, ActivityLogFilters } from '@/services/activity-log.service';

/**
 * Hook to fetch activity logs
 */
export function useActivityLogs(filters?: ActivityLogFilters) {
  return useQuery({
    queryKey: queryKeys.activityLogs.list(filters || {}),
    queryFn: () => activityLogService.getActivityLogs(filters),
  });
}

/**
 * Hook to fetch activity logs for a specific entity
 */
export function useEntityActivityLogs(entityType: string, entityId: string, limit?: number) {
  return useQuery({
    queryKey: queryKeys.activityLogs.list({ entity_type: entityType, entity_id: entityId, limit }),
    queryFn: () => activityLogService.getEntityActivityLogs(entityType, entityId, limit),
    enabled: !!entityType && !!entityId,
  });
}

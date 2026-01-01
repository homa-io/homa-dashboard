import { apiClient } from './api-client';

export interface ActivityLog {
  id: number;
  entity_type: string;
  entity_id: string;
  action: string;
  user_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    user_id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ActivityLogFilters {
  entity_type?: string;
  entity_id?: string;
  action?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
}

export interface ActivityLogResponse {
  success: boolean;
  data: ActivityLog[];
  meta?: {
    count: number;
    total: number;
  };
}

// Entity type constants
export const EntityTypes = {
  CONVERSATION: 'conversation',
  CLIENT: 'client',
  USER: 'user',
  DEPARTMENT: 'department',
  TAG: 'tag',
  WEBHOOK: 'webhook',
  ARTICLE: 'article',
  CATEGORY: 'category',
  SETTING: 'setting',
  MESSAGE: 'message',
} as const;

// Action type constants
export const ActionTypes = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  STATUS_CHANGE: 'status_change',
  ASSIGN: 'assign',
  UNASSIGN: 'unassign',
  LOGIN: 'login',
  LOGOUT: 'logout',
  VIEW: 'view',
} as const;

// Human-readable labels
export const EntityTypeLabels: Record<string, string> = {
  conversation: 'Conversation',
  client: 'Client',
  user: 'User',
  department: 'Department',
  tag: 'Tag',
  webhook: 'Webhook',
  article: 'Article',
  category: 'Category',
  setting: 'Setting',
  message: 'Message',
};

export const ActionTypeLabels: Record<string, string> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  status_change: 'Status Changed',
  assign: 'Assigned',
  unassign: 'Unassigned',
  login: 'Logged In',
  logout: 'Logged Out',
  view: 'Viewed',
};

class ActivityLogService {
  async getActivityLogs(filters: ActivityLogFilters = {}): Promise<ActivityLogResponse> {
    const params = new URLSearchParams();

    if (filters.entity_type) params.append('entity_type', filters.entity_type);
    if (filters.entity_id) params.append('entity_id', filters.entity_id);
    if (filters.action) params.append('action', filters.action);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `/activity-logs?${queryString}` : '/activity-logs';

    const response = await apiClient.get<ActivityLogResponse>(url);
    return response.data;
  }

  async getEntityActivityLogs(
    entityType: string,
    entityId: string,
    limit?: number
  ): Promise<ActivityLogResponse> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await apiClient.get<ActivityLogResponse>(
      `/activity-logs/${entityType}/${entityId}${params}`
    );
    return response.data;
  }
}

export const activityLogService = new ActivityLogService();

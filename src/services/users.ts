import { apiClient } from './api-client';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  UsersListParams,
} from '@/types/user';

/**
 * Users Service
 * Handles all user management API calls
 */

/**
 * Fetch paginated list of users
 */
export async function getUsers(params?: UsersListParams) {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.status) queryParams.append('status', params.status);

  const query = queryParams.toString();
  const endpoint = `/api/admin/users${query ? `?${query}` : ''}`;

  return apiClient.get<UsersListResponse>(endpoint);
}

/**
 * Fetch a single user by ID
 */
export async function getUser(id: string) {
  return apiClient.get<User>(`/api/admin/users/${id}`);
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserRequest) {
  return apiClient.post<{ user: User }>('/api/admin/users', data);
}

/**
 * Update an existing user
 */
export async function updateUser(id: string, data: UpdateUserRequest) {
  return apiClient.put<{ user: User }>(`/api/admin/users/${id}`, data);
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  return apiClient.delete<null>(`/api/admin/users/${id}`);
}

/**
 * Block a user
 */
export async function blockUser(id: string) {
  return apiClient.post<{ id: string; email: string; status: string }>(
    `/api/admin/users/${id}/block`
  );
}

/**
 * Unblock a user
 */
export async function unblockUser(id: string) {
  return apiClient.post<{ id: string; email: string; status: string }>(
    `/api/admin/users/${id}/unblock`
  );
}

/**
 * Upload avatar for current user
 * Uses the agent endpoint which processes and resizes the image
 */
export async function uploadUserAvatar(base64Data: string) {
  return apiClient.post<{ avatar: string }>('/api/agent/me/avatar', { data: base64Data });
}

/**
 * Delete avatar for current user
 */
export async function deleteUserAvatar() {
  return apiClient.delete<{ message: string }>('/api/agent/me/avatar');
}

/**
 * Legacy upload avatar function (for admin use)
 * @deprecated Use uploadUserAvatar instead
 */
export async function uploadAvatar(base64Data: string) {
  return apiClient.post<{ url: string }>('/api/admin/upload/avatar', { data: base64Data });
}

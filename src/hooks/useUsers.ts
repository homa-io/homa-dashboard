'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import * as usersService from '@/services/users';
import type {
  User,
  CreateUserRequest,
  CreateBotRequest,
  UpdateUserRequest,
  UsersListParams,
} from '@/types/user';

/**
 * Hook to fetch users list
 */
export function useUsers(params?: UsersListParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params || {}),
    queryFn: async () => {
      const response = await usersService.getUsers(params);
      return response.data;
    },
  });
}

/**
 * Hook to fetch a single user
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const response = await usersService.getUser(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

/**
 * Hook to create a bot
 */
export function useCreateBot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBotRequest) => usersService.createBot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

/**
 * Hook to block a user
 */
export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.blockUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

/**
 * Hook to unblock a user
 */
export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.unblockUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

/**
 * Hook to upload user avatar
 */
export function useUploadAvatar() {
  return useMutation({
    mutationFn: (base64Data: string) => usersService.uploadUserAvatar(base64Data),
  });
}

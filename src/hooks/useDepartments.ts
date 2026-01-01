'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { departmentService } from '@/services/department.service';
import type {
  Department,
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
  DepartmentListParams,
} from '@/types/department.types';

/**
 * Hook to fetch departments list
 */
export function useDepartments(params?: DepartmentListParams) {
  return useQuery({
    queryKey: queryKeys.departments.list(params || {}),
    queryFn: () => departmentService.list(params),
  });
}

/**
 * Hook to fetch a single department
 */
export function useDepartment(id: number) {
  return useQuery({
    queryKey: queryKeys.departments.detail(id),
    queryFn: () => departmentService.get(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch assignable users for departments
 */
export function useAssignableUsers() {
  return useQuery({
    queryKey: queryKeys.departments.assignableUsers(),
    queryFn: () => departmentService.getAssignableUsers(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to create a department
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepartmentCreateRequest) => departmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });
}

/**
 * Hook to update a department
 */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartmentUpdateRequest }) =>
      departmentService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.lists() });
    },
  });
}

/**
 * Hook to delete a department
 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => departmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });
}

/**
 * Hook to suspend/unsuspend a department
 */
export function useSuspendDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, suspended }: { id: number; suspended: boolean }) =>
      departmentService.suspend(id, suspended),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.lists() });
    },
  });
}

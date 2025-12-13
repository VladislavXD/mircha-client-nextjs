/**
 * Admin Hooks
 * React Query хуки для административной панели
 */

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import * as adminService from '../services/admin.service';
import type {
  AdminStats,
  AdminUsersResponse,
  AdminBoardsResponse,
  AdminThreadsResponse,
  AdminRepliesResponse,
  AdminMediaFilesResponse,
  PaginationQueryParams,
  GetUsersQueryParams,
  UpdateUserRoleDto,
  UpdateUserDto,
  CreateBoardDto,
  UpdateBoardDto,
} from '../types/admin.types';

// ============ Query Keys ============

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  users: (params?: GetUsersQueryParams) => [...adminKeys.all, 'users', params] as const,
  boards: (params?: PaginationQueryParams) => [...adminKeys.all, 'boards', params] as const,
  threads: (params?: PaginationQueryParams) => [...adminKeys.all, 'threads', params] as const,
  replies: (params?: PaginationQueryParams) => [...adminKeys.all, 'replies', params] as const,
  media: (params?: PaginationQueryParams) => [...adminKeys.all, 'media', params] as const,
};

// ============ СТАТИСТИКА ============

/**
 * Получить статистику системы
 */
export const useAdminStats = (options?: Omit<UseQueryOptions<AdminStats>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: adminService.getStats,
    staleTime: 30000, // 30 секунд
    ...options,
  });
};

// ============ ПОЛЬЗОВАТЕЛИ ============

/**
 * Получить список пользователей
 */
export const useAdminUsers = (
  params: GetUsersQueryParams = {},
  options?: Omit<UseQueryOptions<AdminUsersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.getUsers(params),
    staleTime: 60000, // 1 минута
    ...options,
  });
};

/**
 * Обновить данные пользователя
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserDto }) =>
      adminService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

/**
 * Удалить пользователя
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

/**
 * Обновить роль пользователя
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRoleDto }) =>
      adminService.updateUserRole(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

/**
 * Переключить статус активности пользователя
 */
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

// ============ ДОСКИ ============

/**
 * Получить список досок
 */
export const useAdminBoards = (
  params: PaginationQueryParams = {},
  options?: Omit<UseQueryOptions<AdminBoardsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: adminKeys.boards(params),
    queryFn: () => adminService.getBoards(params),
    staleTime: 60000,
    ...options,
  });
};

/**
 * Создать доску
 */
export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.boards() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

/**
 * Обновить доску
 */
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, data }: { boardId: string; data: UpdateBoardDto }) =>
      adminService.updateBoard(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.boards() });
    },
  });
};

/**
 * Удалить доску
 */
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.boards() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

// ============ ТРЕДЫ ============

/**
 * Получить список тредов
 */
export const useAdminThreads = (
  params: PaginationQueryParams = {},
  options?: Omit<UseQueryOptions<AdminThreadsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: adminKeys.threads(params),
    queryFn: () => adminService.getThreads(params),
    staleTime: 30000,
    ...options,
  });
};

/**
 * Удалить тред
 */
export const useDeleteThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.deleteThread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.threads() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

// ============ ОТВЕТЫ ============

/**
 * Получить список ответов
 */
export const useAdminReplies = (
  params: PaginationQueryParams = {},
  options?: Omit<UseQueryOptions<AdminRepliesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: adminKeys.replies(params),
    queryFn: () => adminService.getReplies(params),
    staleTime: 30000,
    ...options,
  });
};

/**
 * Удалить ответ
 */
export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.deleteReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.replies() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
};

// ============ МЕДИАФАЙЛЫ ============

/**
 * Получить список медиафайлов
 */
export const useAdminMedia = (
  params: PaginationQueryParams = {},
  options?: Omit<UseQueryOptions<AdminMediaFilesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: adminKeys.media(params),
    queryFn: () => adminService.getMediaFiles(params),
    staleTime: 60000,
    ...options,
  });
};

/**
 * Admin Service
 * API клиент для административных функций
 */

import { BASE_URL } from '@/src/constants/api.url';
import Cookies from 'js-cookie';
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
  AdminActionResponse,
  UpdatedUserResponse,
  UpdatedUserRoleResponse,
  ToggledUserStatusResponse,
  AdminBoard,
} from '../types/admin.types';

/**
 * Получить заголовки для запросов (без токена, используем HTTP-only cookie session)
 */
const getAuthHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

/**
 * Обработчик ошибок API
 */
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Построить query string из параметров
 */
const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Для чисел отправляем как есть (не конвертируем в строку заранее)
      // URLSearchParams.append сам конвертирует, но важно не потерять тип
      queryParams.append(key, String(value));
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// ============ СТАТИСТИКА ============

/**
 * Получить общую статистику системы
 * GET /admin/stats
 */
export const getStats = async (): Promise<AdminStats> => {
  const response = await fetch(`${BASE_URL}/admin/stats`, {
    headers: getAuthHeaders(),
    credentials: 'include', // Отправляем HTTP-only cookie session
  });
  return handleApiError(response);
};

// ============ ПОЛЬЗОВАТЕЛИ ============

/**
 * Получить список пользователей с фильтрацией
 * GET /admin/users
 */
export const getUsers = async (params: GetUsersQueryParams = {}): Promise<AdminUsersResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(`${BASE_URL}/admin/users${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include', // Отправляем HTTP-only cookie session
  });
  return handleApiError(response);
};

/**
 * Обновить данные пользователя
 * PUT /admin/users/:userId
 */
export const updateUser = async (
  userId: string,
  data: UpdateUserDto
): Promise<UpdatedUserResponse> => {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleApiError(response);
};

/**
 * Удалить пользователя
 * DELETE /admin/users/:userId
 */
export const deleteUser = async (userId: string): Promise<AdminActionResponse> => {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleApiError(response);
};

/**
 * Обновить роль пользователя
 * PUT /admin/users/:userId/role
 */
export const updateUserRole = async (
  userId: string,
  data: UpdateUserRoleDto
): Promise<UpdatedUserRoleResponse> => {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleApiError(response);
};

/**
 * Переключить статус активности пользователя
 * PATCH /admin/users/:userId/status
 */
export const toggleUserStatus = async (userId: string): Promise<ToggledUserStatusResponse> => {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleApiError(response);
};

// ============ ДОСКИ ============

/**
 * Получить список досок
 * GET /admin/boards
 */
export const getBoards = async (params: PaginationQueryParams = {}): Promise<AdminBoardsResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(`${BASE_URL}/admin/boards${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleApiError(response);
};

/**
 * Создать новую доску
 * POST /admin/boards
 */
export const createBoard = async (data: CreateBoardDto): Promise<AdminBoard> => {
  const response = await fetch(`${BASE_URL}/admin/boards`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleApiError(response);
};

/**
 * Обновить доску
 * PUT /admin/boards/:boardId
 */
export const updateBoard = async (
  boardId: string,
  data: UpdateBoardDto
): Promise<AdminBoard> => {
  const response = await fetch(`${BASE_URL}/admin/boards/${boardId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleApiError(response);
};

/**
 * Удалить доску
 * DELETE /admin/boards/:boardId
 */
export const deleteBoard = async (boardId: string): Promise<AdminActionResponse> => {
  const response = await fetch(`${BASE_URL}/admin/boards/${boardId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleApiError(response);
};

// ============ ТРЕДЫ ============

/**
 * Получить список тредов
 * GET /admin/threads
 */
export const getThreads = async (params: PaginationQueryParams = {}): Promise<AdminThreadsResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(`${BASE_URL}/admin/threads${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleApiError(response);
};

/**
 * Удалить тред
 * DELETE /admin/threads/:threadId
 */
export const deleteThread = async (threadId: string): Promise<AdminActionResponse> => {
  const response = await fetch(`${BASE_URL}/admin/threads/${threadId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleApiError(response);
};

// ============ ОТВЕТЫ ============

/**
 * Получить список ответов
 * GET /admin/replies
 */
export const getReplies = async (params: PaginationQueryParams = {}): Promise<AdminRepliesResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(`${BASE_URL}/admin/replies${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleApiError(response);
};

/**
 * Удалить ответ
 * DELETE /admin/replies/:replyId
 */
export const deleteReply = async (replyId: string): Promise<AdminActionResponse> => {
  const response = await fetch(`${BASE_URL}/admin/replies/${replyId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleApiError(response);
};

// ============ МЕДИАФАЙЛЫ ============

/**
 * Получить список медиафайлов
 * GET /admin/media
 */
export const getMediaFiles = async (params: PaginationQueryParams = {}): Promise<AdminMediaFilesResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(`${BASE_URL}/admin/media${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleApiError(response);
};

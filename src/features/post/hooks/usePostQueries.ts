import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { postService } from '../services/post.service'
import type { Post } from '../types'

/**
 * Ключи для React Query кэша постов.
 */
export const postKeys = {
	all: ['posts'] as const,
	lists: () => [...postKeys.all, 'list'] as const,
	list: (filters?: unknown) => [...postKeys.lists(), filters] as const,
	details: () => [...postKeys.all, 'detail'] as const,
	detail: (id: string) => [...postKeys.details(), id] as const,
	byUser: (userId: string) => [...postKeys.all, 'user', userId] as const
}

/**
 * Хук для получения всех постов.
 * 
 * @param options - Опции React Query
 * @returns Данные всех постов, загрузка, ошибка
 */
export function usePosts(
	options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>
) {
	return useQuery<Post[], Error>({
		queryKey: postKeys.lists(),
		queryFn: () => postService.getPosts(),
		staleTime: 30 * 1000, // 30 секунд
		gcTime: 5 * 60 * 1000, // 5 минут (cacheTime в v5 называется gcTime)
		refetchOnWindowFocus: true,
		...options
	})
}

/**
 * Хук для получения одного поста по ID.
 * 
 * @param id - ID поста
 * @param options - Опции React Query
 * @returns Данные поста, загрузка, ошибка
 */
export function usePost(
	id: string,
	options?: Omit<UseQueryOptions<Post, Error>, 'queryKey' | 'queryFn'>
) {
	return useQuery<Post, Error>({
		queryKey: postKeys.detail(id),
		queryFn: () => postService.getPostById(id),
		enabled: !!id,
		staleTime: 60 * 1000, // 1 минута
		gcTime: 10 * 60 * 1000, // 10 минут
		...options
	})
}

/**
 * Хук для получения постов конкретного пользователя.
 * 
 * @param userId - ID пользователя
 * @param options - Опции React Query
 * @returns Данные постов пользователя, загрузка, ошибка
 */
export function usePostsByUserId(
	userId: string,
	options?: Omit<UseQueryOptions<Post[], Error>, 'queryKey' | 'queryFn'>
) {
	return useQuery<Post[], Error>({
		queryKey: postKeys.byUser(userId),
		queryFn: () => postService.getPostsByUserId(userId),
		enabled: !!userId,
		staleTime: 60 * 1000, // 1 минута
		gcTime: 10 * 60 * 1000, // 10 минут
		...options
	})
}

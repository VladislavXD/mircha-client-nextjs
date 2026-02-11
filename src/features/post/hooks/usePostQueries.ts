import { useInfiniteQuery, useQuery, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { postService } from '../services/post.service'
import type { Post } from '../types'
import { PostsResponse } from '../types/post.types'

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
 * Хук для получения всех постов с бесконечной прокруткой.
 * 
 * @param options - Опции React Query
 * @returns Данные постов с пагинацией, загрузка, ошибка
 */
export function usePosts(
	options?: Omit<
		UseInfiniteQueryOptions<PostsResponse, Error>,
		'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'select'
	>
) {
	return useInfiniteQuery<PostsResponse, Error>({
        queryKey: postKeys.lists(),
        queryFn: ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : undefined;
            return postService.getPosts({ limit: 15, cursor });
        },
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            // Используем nextCursor из ответа API
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        staleTime: 30 * 1000, // 30 секунд
        gcTime: 5 * 60 * 1000, // 5 минут
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

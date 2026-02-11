import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { postService } from '../services/post.service'
import type { AddViewResponse, AddViewsBatchResponse } from '../types'

/**
 * Хук для добавления просмотра поста (с Redis кэшированием).
 * 
 * @param options - Опции мутации
 * @returns Мутация добавления просмотра
 */
export function useAddView(
	options?: Omit<UseMutationOptions<AddViewResponse, Error, string>, 'mutationFn'>
) {
	return useMutation<AddViewResponse, Error, string>({
		mutationFn: (postId: string) => postService.addView(postId),
		...options
	})
}

/**
 * Хук для батчевого добавления просмотров (для ленты постов).
 * Использует Redis для быстрого кэширования и минимальной нагрузки на БД.
 * 
 * @param options - Опции мутации
 * @returns Мутация батчевого добавления просмотров
 */
export function useAddViewsBatch(
	options?: Omit<UseMutationOptions<AddViewsBatchResponse, Error, string[]>, 'mutationFn'>
) {
	return useMutation<AddViewsBatchResponse, Error, string[]>({
		mutationFn: (postIds: string[]) => postService.addViewsBatch(postIds),
		...options
	})
}

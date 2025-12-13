import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LikeService } from '../services/like.service'
import { postKeys } from '../../hooks/usePostQueries'

const likeService = new LikeService()
// Локальная защита от дабл-кликов: отслеживаем посты с активной мутацией
const inFlightLikes = new Set<string>()

/**
 * Хук для постановки лайка на пост с optimistic update
 * ОПТИМИЗИРОВАНО: Работает со счетчиками вместо массивов
 */
export function useLikePost() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['like', 'create'],
		mutationFn: async (postId: string) => {
			// Если уже идет мутация для этого поста — игнорируем повтор
			if (inFlightLikes.has(postId)) return Promise.resolve(undefined as any)
			inFlightLikes.add(postId)
			return likeService.likePost(postId)
		},
		onMutate: async (postId: string) => {
			await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })
			await queryClient.cancelQueries({ queryKey: postKeys.lists() })

			const previousPost = queryClient.getQueryData<any>(postKeys.detail(postId))
			const previousPosts = queryClient.getQueryData<any[]>(postKeys.lists())
			const currentUser = queryClient.getQueryData<any>(['profile'])



			if (previousPost) {
				queryClient.setQueryData(postKeys.detail(postId), (old: any) => {
					const updated = {
						...old,
						likeByUser: true,
						// Если есть счетчик, инкрементируем его
						likesCount: old.likesCount !== undefined ? old.likesCount + 1 : (old.likes?.length || 0) + 1,
						// Добавляем временный лайк только если массив существует и не пустой
						likes: old.likes ? [
							...old.likes,
							{
								id: `temp-${Date.now()}`,
								userId: currentUser?.id || 'me',
								postId,
								createdAt: new Date().toISOString()
							}
						] : []
					}
					return updated
				})
			}

			if (previousPosts) {
				queryClient.setQueryData(postKeys.lists(), (old: any[] = []) =>
					old.map(post => {
						if (post.id === postId) {
							const updated = {
								...post,
								likeByUser: true,
								// Инкрементируем счетчик
								likesCount: post.likesCount !== undefined ? post.likesCount + 1 : (post.likes?.length || 0) + 1,
								// Массив может быть пустым в оптимизированной версии
								likes: post.likes || []
							}
							return updated
						}
						return post
					})
				)
			}

			return { postId, previousPost, previousPosts }
		},
		onError: (err, postId, context: any) => {
			if (context?.previousPost) {
				queryClient.setQueryData(postKeys.detail(postId), context.previousPost)
			}
			if (context?.previousPosts) {
				queryClient.setQueryData(postKeys.lists(), context.previousPosts)
			}
		},
		onSettled: (data, error, postId) => {
			inFlightLikes.delete(postId)
			queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
			// Списки инвалидации только при успешном ответе
			if (!error) {
				queryClient.invalidateQueries({ queryKey: postKeys.lists() })
			}
		}
	})
}

/**
 * Хук для снятия лайка с поста с optimistic update
 * ОПТИМИЗИРОВАНО: Работает со счетчиками вместо массивов
 */
export function useUnlikePost() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['like', 'delete'],
		mutationFn: async (postId: string) => {
			// Защита от повторов
			if (inFlightLikes.has(postId)) return Promise.resolve(undefined as any)
			inFlightLikes.add(postId)
			return likeService.unlikePost(postId)
		},
		onMutate: async (postId: string) => {
			await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })
			await queryClient.cancelQueries({ queryKey: postKeys.lists() })

			const previousPost = queryClient.getQueryData<any>(postKeys.detail(postId))
			const previousPosts = queryClient.getQueryData<any[]>(postKeys.lists())
			const currentUser = queryClient.getQueryData<any>(['profile'])

			if (previousPost) {
				queryClient.setQueryData(postKeys.detail(postId), (old: any) => {
					const updated = {
						...old,
						likeByUser: false,
						// Декрементируем счетчик
						likesCount: old.likesCount !== undefined 
							? Math.max(0, old.likesCount - 1) // Не даем уйти в минус
							: Math.max(0, (old.likes?.length || 0) - 1),
						// Фильтруем массив только если он существует
						likes: old.likes ? old.likes.filter((like: any) => like.userId !== currentUser?.id) : []
					}
					return updated
				})
			}

			if (previousPosts) {
				queryClient.setQueryData(postKeys.lists(), (old: any[] = []) =>
					old.map(post => {
						if (post.id === postId) {
							const updated = {
								...post,
								likeByUser: false,
								// Декрементируем счетчик
								likesCount: post.likesCount !== undefined 
									? Math.max(0, post.likesCount - 1)
									: Math.max(0, (post.likes?.length || 0) - 1),
								// Массив может быть пустым в оптимизированной версии
								likes: post.likes || []
							}
							return updated
						}
						return post
					})
				)
			}

			return { postId, previousPost, previousPosts }
		},
		onError: (err, postId, context: any) => {
			if (context?.previousPost) {
				queryClient.setQueryData(postKeys.detail(postId), context.previousPost)
			}
			if (context?.previousPosts) {
				queryClient.setQueryData(postKeys.lists(), context.previousPosts)
			}
		},
		onSettled: (data, error, postId) => {
			inFlightLikes.delete(postId)
			queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
			if (!error) {
				queryClient.invalidateQueries({ queryKey: postKeys.lists() })
			}
		}
	})
}

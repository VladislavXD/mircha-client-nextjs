import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { likeService } from '../services/like.service'
import { postKeys } from './usePostQueries'
import type { Post, User, Like } from '../types'

type LikeContext = {
	previousAllPosts?: Post[]
	previousPost?: Post
}

/**
 * Hook для лайка поста с оптимистичным обновлением
 * 
 * Optimistic Updates:
 * - Мгновенно добавляет лайк в UI
 * - Обновляет счетчик лайков
 * - Откат при ошибке
 * 
 * Usage:
 * ```tsx
 * const { mutate: likePost } = useLikePost()
 * 
 * // Fire-and-forget (НЕ используй async/await!)
 * likePost(postId)
 * ```
 */
export function useLikePost(
	options?: Omit<UseMutationOptions<Like, Error, string, LikeContext>, 'mutationFn'>
) {
	const queryClient = useQueryClient()

	return useMutation<Like, Error, string, LikeContext>({
		mutationFn: (postId: string) => likeService.likePost(postId),

		onMutate: async (postId) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: postKeys.lists() })
			await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })

			// Snapshot previous values
			const previousAllPosts = queryClient.getQueryData<Post[]>(postKeys.lists())
			const previousPost = queryClient.getQueryData<Post>(postKeys.detail(postId))

			// Get current user
			const currentUser = queryClient.getQueryData<User>(['user', 'profile'])

			if (!currentUser) {
				return { previousAllPosts, previousPost }
			}

			// Create optimistic like
			const optimisticLike: Like = {
				id: `temp-${Date.now()}`,
				userId: currentUser.id,
				postId: postId,
				user: currentUser,
				post: {} as Post, // Will be filled by server
			}

			// Optimistically update getAllPosts cache
			queryClient.setQueryData<Post[]>(postKeys.lists(), (old) => {
				if (!old) return old
				return old.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							likeByUser: true,
							likes: [...post.likes, optimisticLike],
						}
					}
					return post
				})
			})

			// Optimistically update getPostById cache
			queryClient.setQueryData<Post>(postKeys.detail(postId), (old) => {
				if (!old) return old
				return {
					...old,
					likeByUser: true,
					likes: [...old.likes, optimisticLike],
				}
			})

			return { previousAllPosts, previousPost }
		},

		onError: (error, postId, context) => {
			// Rollback on error
			if (context?.previousAllPosts) {
				queryClient.setQueryData(postKeys.lists(), context.previousAllPosts)
			}
			if (context?.previousPost) {
				queryClient.setQueryData(postKeys.detail(postId), context.previousPost)
			}
			toast.error('Не удалось поставить лайк')
			console.error('Like error:', error)
		},

		onSuccess: (newLike, postId) => {
			// Replace temp like with real like from server
			queryClient.setQueryData<Post[]>(postKeys.lists(), (old) => {
				if (!old) return old
				return old.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							likes: post.likes.map((like) =>
								like.id.startsWith('temp-') ? newLike : like
							),
						}
					}
					return post
				})
			})

			queryClient.setQueryData<Post>(postKeys.detail(postId), (old) => {
				if (!old) return old
				return {
					...old,
					likes: old.likes.map((like) => (like.id.startsWith('temp-') ? newLike : like)),
				}
			})
			
			// Инвалидируем queries для синхронизации с сервером
			queryClient.invalidateQueries({ queryKey: postKeys.lists() })
			queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
		},

		...options,
	})
}

/**
 * Hook для снятия лайка с поста с оптимистичным обновлением
 * 
 * Optimistic Updates:
 * - Мгновенно убирает лайк из UI
 * - Обновляет счетчик лайков
 * - Откат при ошибке
 * 
 * Usage:
 * ```tsx
 * const { mutate: unlikePost } = useUnlikePost()
 * 
 * // Fire-and-forget (НЕ используй async/await!)
 * unlikePost(postId)
 * ```
 */
export function useUnlikePost(
	options?: Omit<UseMutationOptions<void, Error, string, LikeContext>, 'mutationFn'>
) {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string, LikeContext>({
		mutationFn: (postId: string) => likeService.unlikePost(postId),

		onMutate: async (postId) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: postKeys.lists() })
			await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })

			// Snapshot previous values
			const previousAllPosts = queryClient.getQueryData<Post[]>(postKeys.lists())
			const previousPost = queryClient.getQueryData<Post>(postKeys.detail(postId))

			// Get current user
			const currentUser = queryClient.getQueryData<User>(['user', 'profile'])

			if (!currentUser) {
				return { previousAllPosts, previousPost }
			}

			// Optimistically update getAllPosts cache
			queryClient.setQueryData<Post[]>(postKeys.lists(), (old) => {
				if (!old) return old
				return old.map((post) => {
					if (post.id === postId) {
						return {
							...post,
							likeByUser: false,
							likes: post.likes.filter((like) => like.userId !== currentUser.id),
						}
					}
					return post
				})
			})

			// Optimistically update getPostById cache
			queryClient.setQueryData<Post>(postKeys.detail(postId), (old) => {
				if (!old) return old
				return {
					...old,
					likeByUser: false,
					likes: old.likes.filter((like) => like.userId !== currentUser.id),
				}
			})

			return { previousAllPosts, previousPost }
		},

		onError: (error, postId, context) => {
			// Rollback on error
			if (context?.previousAllPosts) {
				queryClient.setQueryData(postKeys.lists(), context.previousAllPosts)
			}
			if (context?.previousPost) {
				queryClient.setQueryData(postKeys.detail(postId), context.previousPost)
			}
			toast.error('Не удалось убрать лайк')
			console.error('Unlike error:', error)
		},

		onSuccess: (_, postId) => {
			// Инвалидируем queries для синхронизации с сервером
			queryClient.invalidateQueries({ queryKey: postKeys.lists() })
			queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
		},

		...options,
	})
}

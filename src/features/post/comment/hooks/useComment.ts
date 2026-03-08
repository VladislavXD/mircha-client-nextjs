
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CommentService } from '../services/commnet.service'
import type { CreateCommentDto } from '../../types'
import { postKeys } from '../../hooks/usePostQueries'

const commentService = new CommentService()

/**
 * Хук для создания комментария к посту с optimistic update
 * ОПТИМИЗИРОВАНО: Работает со счетчиками
 */
export function useCreateComment() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['comment', 'create'],
		mutationFn: async (payload: CreateCommentDto) => {
			return commentService.createComment(payload)
		},
		onMutate: async (payload: CreateCommentDto) => {
			const postId = payload.postId
			if (!postId) return

			// Отменяем текущие запросы комментариев
			await queryClient.cancelQueries({ queryKey: ['comments', 'post', postId] })
			await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })
			
			const previousComments = queryClient.getQueryData<any>(['comments', 'post', postId])
			const previousPost = queryClient.getQueryData<any>(postKeys.detail(postId))

			// optimistic comment
			const currentUser = queryClient.getQueryData<any>(['profile'])
			const optimistic = {
				id: `temp-${Date.now()}`,
				content: payload.content,
				emojiUrls: payload.emojiUrls || [],
				user: currentUser || { id: 'me', name: 'You', avatarUrl: '' },
				createdAt: new Date().toISOString(),
				likeCount: 0,
				likedByUser: false,
				replies: [],
			}

			// Обновляем кеш комментариев
			if (previousComments) {
				queryClient.setQueryData(['comments', 'post', postId], (old: any[]) => {
					return [optimistic, ...(old || [])]
				})
			}

			// Обновляем кеш поста
			if (previousPost) {
				queryClient.setQueryData(postKeys.detail(postId), (old: any) => {
					return {
						...old,
						comments: [optimistic, ...(old?.comments || [])],
						// Инкрементируем счетчик комментариев
						commentsCount: old.commentsCount !== undefined 
							? old.commentsCount + 1 
							: (old.comments?.length || 0) + 1
					}
				})
			}

			return { postId, previousComments, previousPost }
		},
		onError: (err, payload, context: any) => {
			if (context?.postId) {
				if (context.previousComments) {
					queryClient.setQueryData(['comments', 'post', context.postId], context.previousComments)
				}
				if (context.previousPost) {
					queryClient.setQueryData(postKeys.detail(context.postId), context.previousPost)
				}
			}
		},
		onSettled: (data, error, payload: CreateCommentDto, context: any) => {
			// Инвалидируем query комментариев и поста
			if (context?.postId) {
				queryClient.invalidateQueries({ queryKey: ['comments', 'post', context.postId] })
				queryClient.invalidateQueries({ queryKey: postKeys.detail(context.postId) })
				// Также обновляем списки постов
				queryClient.invalidateQueries({ queryKey: postKeys.lists() })
			}
		}
	})
}

/**
 * Хук для удаления комментария с optimistic update
 * ОПТИМИЗИРОВАНО: Работает со счетчиками
 * Поддерживает вызов mutate(payload: { id, postId })
 */
export function useDeleteComment() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['comment', 'delete'],
		mutationFn: async (payload: string | { id: string; postId?: string }) => {
			const id = typeof payload === 'string' ? payload : payload.id
			return commentService.deleteComment(id)
		},
		onMutate: async (payload: string | { id: string; postId?: string }) => {
			const commentId = typeof payload === 'string' ? payload : payload.id
			const postId = typeof payload === 'string' ? undefined : payload.postId
			if (!postId) return { postId: undefined }

			// Отменяем запросы
			await queryClient.cancelQueries({ queryKey: ['comments', 'post', postId] })
			await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })
			
			const previousComments = queryClient.getQueryData<any>(['comments', 'post', postId])
			const previousPost = queryClient.getQueryData<any>(postKeys.detail(postId))

			// Рекурсивно удаляет комментарий на любом уровне вложенности
			const removeFromTree = (comments: any[], id: string): any[] =>
				comments
					.filter((c: any) => c.id !== id)
					.map((c: any) => ({ ...c, replies: removeFromTree(c.replies || [], id) }))

			// Обновляем кеш комментариев
			if (previousComments) {
				queryClient.setQueryData(['comments', 'post', postId], (old: any[]) => {
					return removeFromTree(old || [], commentId)
				})
			}

			// Обновляем кеш поста
			if (previousPost) {
				queryClient.setQueryData(postKeys.detail(postId), (old: any) => {
					return {
						...old,
						comments: removeFromTree(old?.comments || [], commentId),
						// Декрементируем счетчик комментариев
						commentsCount: old.commentsCount !== undefined 
							? Math.max(0, old.commentsCount - 1)
							: Math.max(0, (old.comments?.length || 0) - 1)
					}
				})
			}

			return { postId, previousComments, previousPost }
		},
		onError: (err, payload, context: any) => {
			if (context?.postId) {
				if (context.previousComments) {
					queryClient.setQueryData(['comments', 'post', context.postId], context.previousComments)
				}
				if (context.previousPost) {
					queryClient.setQueryData(postKeys.detail(context.postId), context.previousPost)
				}
			}
		},
		onSettled: (data, error, payload: any, context: any) => {
			if (context?.postId) {
				queryClient.invalidateQueries({ queryKey: ['comments', 'post', context.postId] })
				queryClient.invalidateQueries({ queryKey: postKeys.detail(context.postId) })
				// Также обновляем списки постов
				queryClient.invalidateQueries({ queryKey: postKeys.lists() })
			}
		}
	})
}
/**
 * Хук для создания ответа на комментарий с optimistic update
 * ОПТИМИЗИРОВАНО: Вставляет ответ в нужное место в дереве комментариев
 */
export function useCreateReply() {
	const queryClient = useQueryClient()

	return useMutation({
mutationKey: ['comment', 'reply', 'create'],
mutationFn: async (payload: CreateCommentDto & { replyToId: string }) => {
			return commentService.createReply(payload)
		},
		onMutate: async (payload: CreateCommentDto & { replyToId: string }) => {
			const postId = payload.postId
			if (!postId) return

			// Отменяем текущие запросы комментариев
			await queryClient.cancelQueries({ queryKey: ['comments', 'post', postId] })
			await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })
			
			const previousComments = queryClient.getQueryData<any>(['comments', 'post', postId])
			const previousPost = queryClient.getQueryData<any>(postKeys.detail(postId))

			// optimistic reply
			const currentUser = queryClient.getQueryData<any>(['profile'])
			const optimisticReply = {
				id: `temp-reply-${Date.now()}`,
				content: payload.content,
				emojiUrls: payload.emojiUrls || [],
				user: currentUser || { id: 'me', name: 'You', avatarUrl: '' },
				userId: currentUser?.id || 'me',
				postId,
				replyToId: payload.replyToId,
				createdAt: new Date().toISOString(),
				likeCount: 0,
				likedByUser: false,
				replies: [],
			}

			// Рекурсивная функция для добавления ответа в нужное место
			const addReplyToComment = (comments: any[]): any[] => {
				return comments.map(comment => {
					if (comment.id === payload.replyToId) {
						return {
							...comment,
							replies: [...(comment.replies || []), optimisticReply]
						}
					} else if (comment.replies && comment.replies.length > 0) {
						return {
							...comment,
							replies: addReplyToComment(comment.replies)
						}
					}
					return comment
				})
			}

			// Обновляем кеш комментариев
			if (previousComments) {
				queryClient.setQueryData(['comments', 'post', postId], (old: any[]) => {
					return addReplyToComment(old || [])
				})
			}

			// Обновляем кеш поста
			if (previousPost) {
				queryClient.setQueryData(postKeys.detail(postId), (old: any) => {
					return {
						...old,
						comments: addReplyToComment(old?.comments || []),
						// Инкрементируем счетчик комментариев
						commentsCount: old.commentsCount !== undefined 
							? old.commentsCount + 1 
							: (old.comments?.length || 0) + 1
					}
				})
			}

			return { postId, previousComments, previousPost }
		},
		onError: (err, payload, context: any) => {
			if (context?.postId) {
				if (context.previousComments) {
					queryClient.setQueryData(['comments', 'post', context.postId], context.previousComments)
				}
				if (context.previousPost) {
					queryClient.setQueryData(postKeys.detail(context.postId), context.previousPost)
				}
			}
		},
		onSettled: (data, error, payload: CreateCommentDto & { replyToId: string }, context: any) => {
			// Инвалидируем query комментариев и поста
			if (context?.postId) {
				queryClient.invalidateQueries({ queryKey: ['comments', 'post', context.postId] })
				queryClient.invalidateQueries({ queryKey: postKeys.detail(context.postId) })
				// Также обновляем списки постов
				queryClient.invalidateQueries({ queryKey: postKeys.lists() })
			}
		}
	})
}

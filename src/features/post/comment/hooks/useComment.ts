
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

			await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })
			const previous = queryClient.getQueryData<any>(postKeys.detail(postId))

			// optimistic comment
			const currentUser = queryClient.getQueryData<any>(['profile'])
			const optimistic = {
				id: `temp-${Date.now()}`,
				content: payload.content,
				emojiUrls: payload.emojiUrls || [],
				user: currentUser || { id: 'me', name: 'You', avatarUrl: '' },
				createdAt: new Date().toISOString(),
			}

			if (previous) {
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

			return { postId, previous }
		},
		onError: (err, payload, context: any) => {
			if (context?.postId && context?.previous) {
				queryClient.setQueryData(postKeys.detail(context.postId), context.previous)
			}
		},
		onSettled: (data, error, payload: CreateCommentDto, context: any) => {
			// Не инвалидацируем деталь поста при успешном создании,
			// чтобы не потерять оптимистичные emojiUrls, если сервер их не возвращает.
			// Инвалидация только при ошибке либо отдельным действием.
			if (error && context?.postId) {
				queryClient.invalidateQueries({ queryKey: postKeys.detail(context.postId) })
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

			await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) })
			const previous = queryClient.getQueryData<any>(postKeys.detail(postId))

			if (previous) {
				queryClient.setQueryData(postKeys.detail(postId), (old: any) => {
					return {
						...old,
						comments: (old?.comments || []).filter((c: any) => c.id !== commentId),
						// Декрементируем счетчик комментариев
						commentsCount: old.commentsCount !== undefined 
							? Math.max(0, old.commentsCount - 1)
							: Math.max(0, (old.comments?.length || 0) - 1)
					}
				})
			}

			return { postId, previous }
		},
		onError: (err, payload, context: any) => {
			if (context?.postId && context?.previous) {
				queryClient.setQueryData(postKeys.detail(context.postId), context.previous)
			}
		},
		onSettled: (data, error, payload: any, context: any) => {
			if (context?.postId) {
				queryClient.invalidateQueries({ queryKey: postKeys.detail(context.postId) })
			}
		}
	})
}
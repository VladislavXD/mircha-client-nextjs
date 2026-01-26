import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query'
import { postService } from '../services/post.service'
import { postKeys } from './usePostQueries'
import type { Post, CreatePostDto, UpdatePostDto, User } from '../types'
import toast from 'react-hot-toast'
import { addToast } from '@heroui/react'

/**
 * Хук для создания поста с оптимистичным обновлением.
 * 
 * @param options - Опции мутации
 * @returns Мутация создания поста
 */
type CreatePostContext = {
	previousPosts?: Post[]
}

export function useCreatePost(
	options?: Omit<UseMutationOptions<Post, Error, FormData, CreatePostContext>, 'mutationFn'>
) {
	const queryClient = useQueryClient()

	return useMutation<Post, Error, FormData, CreatePostContext>({
		mutationFn: async (formData: FormData) => {
			return postService.createPost(formData)
		},

		onMutate: async (formData: FormData) => {
			// Отменяем исходящие запросы
			await queryClient.cancelQueries({ queryKey: postKeys.lists() })

			// Сохраняем предыдущее состояние
			const previousPosts = queryClient.getQueryData<Post[]>(postKeys.lists())

			// Получаем текущего пользователя из кэша
			const currentUser = queryClient.getQueryData<User>(['profile'])

			// Создаём временный пост (без оптимистичного обновления для упрощения)
			// Оптимистичное обновление будет добавлено после успешного ответа

			return { previousPosts }
		},

		onSuccess: (newPost) => {
			// Добавляем новый пост в начало списка
			queryClient.setQueryData<Post[]>(postKeys.lists(), (old) => {
				if (!old) return [newPost]
				return [newPost, ...old]
			})

			addToast({
				title: 'Пост создан!',
				color: 'success',
			})
		},

		onError: (error, _, context) => {
			// Откатываем изменения при ошибке
			if (context?.previousPosts) {
				queryClient.setQueryData(postKeys.lists(), context.previousPosts)
			}

			addToast({
				title: 'Ошибка при создании поста',
				description: String(error.message || 'Не удалось создать пост.'),
				color: 'danger',
			})
			console.error('Create post error:', error)
		},

		...options
	})
}

/**
 * Хук для обновления поста.
 * 
 * @param options - Опции мутации
 * @returns Мутация обновления поста
 */
export function useUpdatePost(
	options?: Omit<
		UseMutationOptions<Post, Error, { id: string; data: UpdatePostDto }>,
		'mutationFn'
	>
) {
	const queryClient = useQueryClient()

	return useMutation<Post, Error, { id: string; data: UpdatePostDto }>({
		mutationFn: async ({ id, data }) => {
			const formData = new FormData()
			
			if (data.content !== undefined) {
				formData.append('content', data.content)
			}
			
			if (data.contentSpoiler !== undefined) {
				formData.append('contentSpoiler', String(data.contentSpoiler))
			}

			return postService.updatePost(id, formData)
		},

		onSuccess: (updatedPost) => {
			// Обновляем пост в списке
			queryClient.setQueryData<Post[]>(postKeys.lists(), (old) => {
				if (!old) return [updatedPost]
				return old.map(post => 
					post.id === updatedPost.id ? updatedPost : post
				)
			})

			// Обновляем в детальном кэше
			queryClient.invalidateQueries({ queryKey: postKeys.lists() })
			
			addToast({
				title: 'Пост обновлён!',
				color: 'success',
			})
		},

		onError: (error) => {
			addToast({
				title: 'Ошибка при обновлении поста',
				description: String(error.message || 'Не удалось обновить пост.'),
				color: 'danger',
			})
			console.error('Update post error:', error)
		},

		...options
	})
}

type DeletePostContext = {
	previousPosts?: Post[]
	deletedPost?: Post
}

/**
 * Хук для удаления поста с оптимистичным обновлением.
 * 
 * @param options - Опции мутации
 * @returns Мутация удаления поста
 */
export function useDeletePost(
	options?: Omit<UseMutationOptions<void, Error, string, DeletePostContext>, 'mutationFn'>
) {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string, DeletePostContext>({
		mutationFn: (id: string) => postService.deletePost(id),

		onMutate: async (postId) => {
			// Отменяем исходящие запросы
			await queryClient.cancelQueries({ queryKey: postKeys.lists() })

			// Сохраняем предыдущее состояние
			const previousPosts = queryClient.getQueryData<Post[]>(postKeys.lists())

			// Сохраняем удаляемый пост для возможного восстановления
			const deletedPost = previousPosts?.find(post => post.id === postId)

			// Оптимистично удаляем пост
			queryClient.setQueryData<Post[]>(postKeys.lists(), (old) => {
				if (!old) return []
				return old.filter(post => post.id !== postId)
			})

			return { previousPosts, deletedPost }
		},

		onSuccess: (_, postId) => {
			// Удаляем из детального кэша
			queryClient.removeQueries({ queryKey: postKeys.detail(postId) })

			toast.success('Пост удалён!')
		},

		onError: (error, _, context) => {
			// Откатываем изменения при ошибке
			if (context?.previousPosts) {
				queryClient.setQueryData(postKeys.lists(), context.previousPosts)
			}

			toast.error('Ошибка при удалении поста')
			console.error('Delete post error:', error)
		},

		...options
	})
}

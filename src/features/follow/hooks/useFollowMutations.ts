import { useMutation, useQueryClient } from '@tanstack/react-query'
import { followService } from '../services/follow.service'
import { toast } from 'react-hot-toast'

/**
 * Хук для подписки на пользователя.
 */
export function useFollow() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (targetUserId: string) => followService.followUser(targetUserId),
		onSuccess: () => {
			// Инвалидируем кеш профиля и списков подписок
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			queryClient.invalidateQueries({ queryKey: ['user'] })
			queryClient.invalidateQueries({ queryKey: ['followers'] })
			queryClient.invalidateQueries({ queryKey: ['following'] })
			queryClient.invalidateQueries({ queryKey: ['followStats'] })
			
			toast.success('Вы успешно подписались')
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Ошибка при подписке')
		}
	})
}

/**
 * Хук для отписки от пользователя.
 */
export function useUnfollow() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (targetUserId: string) => followService.unfollow(targetUserId),
		onSuccess: () => {
			// Инвалидируем кеш профиля и списков подписок
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			queryClient.invalidateQueries({ queryKey: ['user'] })
			queryClient.invalidateQueries({ queryKey: ['followers'] })
			queryClient.invalidateQueries({ queryKey: ['following'] })
			queryClient.invalidateQueries({ queryKey: ['followStats'] })
			
			toast.success('Вы успешно отписались')
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Ошибка при отписке')
		}
	})
}

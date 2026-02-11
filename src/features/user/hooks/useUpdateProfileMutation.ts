import { useMutation } from '@tanstack/react-query'


import type { TypeSettingsSchema } from '../schemes'
import { userService } from '../services'
import { addToast } from '@heroui/react'
import { queryClient } from '@/lib/queryClient'

/**
 * Хук для выполнения мутации обновления профиля пользователя.
 */
export function useUpdateProfileMutation() {
	const { mutate: update, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update profile'],
		mutationFn: ({ values }: { values: TypeSettingsSchema | FormData }) =>
			userService.updateProfile(values),
		onSuccess() {
			// Инвалидируем кеш профиля, чтобы данные перезагрузились
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			addToast({
				title: 'Профиль успешно обновлён',
				color: 'success',
			})
		},
		onError(error) {
			addToast({
				title: 'Ошибка при обновлении профиля',
				description: (error as Error).message,
				color: 'danger',
			})
		}
	})

	return { update, isLoadingUpdate }
}

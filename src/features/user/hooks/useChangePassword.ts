'use client'
import { useMutation } from '@tanstack/react-query'
import { userService } from '../services'
import { addToast } from '@heroui/react'

/**
 * Хук для смены пароля пользователя
 */
export function useChangePassword() {
	const mutation = useMutation({
		mutationFn: (data: { currentPassword: string; newPassword: string }) =>
			userService.changePassword(data),
		onSuccess: (data) => {
			addToast({
				title: 'Пароль успешно изменён',
				description: 'Ваш пароль был успешно обновлён.',
				color: 'success'
			})
		},
		onError: (error: any) => {
			const errorMessage = 
				error?.response?.data?.message || 
				error?.message || 
				'Не удалось изменить пароль. Проверьте правильность текущего пароля.'
			addToast({
				title: 'Ошибка при изменении пароля',
				color: 'danger'
			})
		}
	})

	return {
		changePassword: mutation.mutate,
		isLoading: mutation.isPending,
		isSuccess: mutation.isSuccess,
		error: mutation.error
	}
}

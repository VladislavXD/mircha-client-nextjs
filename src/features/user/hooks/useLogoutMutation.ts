import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'


import { authService } from '../../auth/services'
import { addToast } from '@heroui/react'



/**
 * Хук для выполнения мутации выхода из системы.
 */
export function useLogoutMutation() {
	const router = useRouter()

	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess() {
			router.push('/auth')
			addToast({
				title: 'Вы успешно вышли из системы',
				color: 'success',
			})
		},
		onError(error) {
			addToast({
				title: 'Ошибка при выходе из системы',
				description: (error as Error).message,
				color: 'danger',
			})
		}
	})

	return { logout, isLoadingLogout }
}

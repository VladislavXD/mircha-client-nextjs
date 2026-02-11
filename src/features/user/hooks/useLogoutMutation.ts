import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation'


import { authService } from '../../auth/services'
import { addToast } from '@heroui/react'



/**
 * Хук для выполнения мутации выхода из системы.
 */
export function useLogoutMutation() {
	const router = useRouter()
	const pathname = usePathname()
	const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/)
	const locale = localeMatch?.[1]
	const queryClient = useQueryClient()
	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess() {

			const prefix = locale ? `/${locale}` : ''
			router.push(`${prefix}/auth`)
			queryClient.clear()
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

import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
// import { toast } from 'sonner'

// import { toastMessageHandler } from '@/shared/utils'

import { TypeNewPasswordSchema } from '../schemes'
import { passwordRecoveryService } from '../services'
import { addToast } from '@heroui/react'

/**
 * Хук для выполнения мутации установки нового пароля.
 */
export function useNewPasswordMutation() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const token = searchParams.get('token')

	const { mutate: newPassword, isPending: isLoadingNew } = useMutation({
		mutationKey: ['new password'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeNewPasswordSchema
			recaptcha: string
		}) => passwordRecoveryService.new(values, token, recaptcha),
		onSuccess() {
			// toast.success('Пароль успешно изменён', {
			// 	description: 'Теперь вы можете войти в свой аккаунт.'
			// })
			addToast({
				title: 'Пароль успешно изменён',
				description: 'Теперь вы можете войти в свой аккаунт.',
				color: 'success',
			})
			router.push('/auth')
		},
		onError(error) {
			addToast({
				title: 'Ошибка изменения пароля',
				description: (error as Error).message,
				color: 'danger',
			})
		}
	})

	return { newPassword, isLoadingNew }
}

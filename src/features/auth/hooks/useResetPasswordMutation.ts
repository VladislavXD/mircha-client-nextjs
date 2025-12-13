import { useMutation } from '@tanstack/react-query'
// import { toast } from 'sonner'

// import { toastMessageHandler } from '@/shared/utils'

import { TypeResetPasswordSchema } from '../schemes'
import { passwordRecoveryService } from '../services'
import { addToast } from '@heroui/react'

/**
 * Хук для выполнения мутации сброса пароля.
 */
export function useResetPasswordMutation() {
	const { mutate: reset, isPending: isLoadingReset } = useMutation({
		mutationKey: ['reset password'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeResetPasswordSchema
			recaptcha: string
		}) => passwordRecoveryService.reset(values, recaptcha),
		onSuccess() {
			addToast({
				title: "На вашу почту была отправлена ссылка для подтверждения.",
				color: "success",
			})
		},

		onError(error) {
			addToast({
				title: "Ошибка сброса пароля",
				description: (error as Error).message,
				color: "danger",
			})
		}
	})

	return { reset, isLoadingReset }
}

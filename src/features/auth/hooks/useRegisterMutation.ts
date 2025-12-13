import { useMutation } from '@tanstack/react-query'

// import { toastMessageHandler } from '@/shared/utils'

import { TypeRegisterSchema } from '../schemes'
import { authService } from '../services'
import { addToast } from '@heroui/react'

/**
 * Хук для выполнения мутации регистрации пользователя.
 */
export function useRegisterMutation() {
	const { mutate: register, isPending: isLoadingRegister } = useMutation({
		mutationKey: ['register user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeRegisterSchema
			recaptcha: string
		}) => authService.register(values, recaptcha),
		onSuccess(data: any) {
			addToast({
				title: "Успешная регистрация",
				description: "Пожалуйста, подтвердите ваш email перед входом.",
				color: "success",
			})
		},
		onError(error) {
			addToast({
				title: "Ошибка регистрации",
				description: (error as Error).message,
				color: "danger",
			})
		}
	})

	return { register, isLoadingRegister }
}

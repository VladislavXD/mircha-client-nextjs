import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
// import { toast } from 'sonner'

import { verificationService } from '../services'
import { addToast } from '@heroui/react'

/**
 * Хук для выполнения мутации подтверждения электронной почты.
 */
export function useVerificationMutation() {
	const router = useRouter()

	const { mutate: verification } = useMutation({
		mutationKey: ['new verification'],
		mutationFn: (token: string | null) =>
			verificationService.newVerification(token),
		onSuccess() {
			addToast({
				title: 'Почта успешно подтверждена',
				color: 'success',
			})
			router.push('/dashboard/settings')
		},
		onError() {
			router.push('/auth')
		}
	})

	return { verification }
}

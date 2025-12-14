import { useMutation } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation'
// import { toast } from 'sonner'

import { verificationService } from '../services'
import { addToast } from '@heroui/react'

/**
 * Хук для выполнения мутации подтверждения электронной почты.
 */
export function useVerificationMutation() {
	const router = useRouter()
	const pathname = usePathname()
	const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/)
	const locale = localeMatch?.[1]

	const { mutate: verification } = useMutation({
		mutationKey: ['new verification'],
		mutationFn: (token: string | null) =>
			verificationService.newVerification(token),
		onSuccess() {
			addToast({
				title: 'Почта успешно подтверждена',
				color: 'success',
			})
			const prefix = locale ? `/${locale}` : ''
			router.push(`${prefix}/dashboard/settings`)
		},
		onError() {
			const prefix = locale ? `/${locale}` : ''
			router.push(`${prefix}/auth`)
		}
	})

	return { verification }
}

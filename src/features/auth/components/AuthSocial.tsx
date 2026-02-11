'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FaGithub, FaGoogle, FaYandex } from 'react-icons/fa'



import { authService } from '../services'
import { Button } from '@heroui/button'
import { addToast } from '@heroui/react'

/**
 * Компонент для аутентификации через социальные сети.
 */
export function AuthSocial() {
	const router = useRouter()

	const { mutateAsync } = useMutation({
		mutationKey: ['oauth by provider'],
		mutationFn: async (provider: 'google' | 'yandex' | 'github') =>
			await authService.oauthByProvider(provider)
	})

	const onClick = async (provider: 'google' | 'yandex' | 'github') => {
		if (provider === 'github') {
			addToast({
				title: 'Аутентификация через GitHub в разработке',
				color: 'warning'
			})
			return
		}
		const response = await mutateAsync(provider)

		if (response) {
			router.push(response.url)
		}
	}

	return (
		<>
			<div className='flex flex-wrap gap-3 items-center justify-center '>
				<Button onClick={() => onClick('google')} variant='flat'>
					<FaGoogle className='mr-2 size-4' />
					Google
				</Button>
				<Button onClick={() => onClick('yandex')} variant='flat'>
					<FaYandex className='mr-2 size-4' />
					Яндекс
				</Button>
				<Button onClick={() => onClick('github')} variant='flat'>
					<FaGithub className='mr-2 size-4' />
					GitHub
				</Button>
			</div>
			
		</>
	)
}

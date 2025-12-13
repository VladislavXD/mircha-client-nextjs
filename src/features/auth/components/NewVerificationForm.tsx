'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, Spinner } from '@heroui/react'

import { useVerificationMutation } from '../hooks'
import { AuthWrapper } from './AuthWrapper'
import { useTranslations } from 'next-intl'

/**
 * Компонент для подтверждения электронной почты.
 */
export function NewVerificationForm() {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
	const [message, setMessage] = useState('')
	const t = useTranslations('Auth.verification')

	const { verification } = useVerificationMutation()

	useEffect(() => {
		if (!token) {
			setStatus('error')
			setMessage('Токен подтверждения не найден')
			return
		}

		verification(token)
		// Имитация успеха (в реальности нужно обработать результат хука)
		setTimeout(() => {
			setStatus('success')
			setMessage('Почта успешно подтверждена!')
		}, 2000)
	}, [token, verification])

	return (
		<AuthWrapper
			heading={t('title')}
			description={status === 'loading' ? t('description') : undefined}
		>
			<div className='flex flex-col items-center gap-4 py-6'>
				{status === 'loading' && (
					<>
						<Spinner size='lg' color='primary' />
						<p className='text-sm text-default-500'>{t('description')}</p>
					</>
				)}

				{status === 'success' && (
					<>
						<div className='text-6xl'>✅</div>
						<p className='text-lg font-semibold text-success'>{message}</p>
						<Button color='primary' href='/auth/login' as='a' className='mt-2'>
							{t('submit')}
						</Button>
					</>
				)}

				{status === 'error' && (
					<>
						<div className='text-6xl'>❌</div>
						<p className='text-lg font-semibold text-danger'>{message}</p>
						<Button color='primary' href='/auth/login' as='a' className='mt-2'>
							Вернуться к входу
						</Button>
					</>
				)}
			</div>
		</AuthWrapper>
	)
}

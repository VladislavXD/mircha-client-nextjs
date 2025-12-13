'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { addToast, Button, Input } from '@heroui/react'

import { useNewPasswordMutation } from '../hooks'
import { NewPasswordSchema, type TypeNewPasswordSchema } from '../schemes'
import { AuthWrapper } from './AuthWrapper'
import { useTranslations } from 'next-intl'

/**
 * Форма для установки нового пароля.
 */
export function NewPasswordForm() {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const t = useTranslations('Auth.newPassword')

	const form = useForm<TypeNewPasswordSchema>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: ''
		}
	})

	const { newPassword, isLoadingNew } = useNewPasswordMutation()

	const onSubmit = (values: TypeNewPasswordSchema) => {
		if (!recaptchaValue) {
			addToast({ title: 'Пожалуйста, завершите проверку reCAPTCHA', color: 'danger' })
			return
		}
		newPassword({ values, recaptcha: recaptchaValue })
	}

	return (
		<AuthWrapper
			heading={t('title')}
			description={t('description')}
			backButtonLabel={t('../resetPassword.backToLogin')}
			backButtonHref='/auth/login'
		>
			<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
				{/* Password */}
				<Controller
					control={form.control}
					name='password'
					render={({ field, fieldState }) => (
						<Input
							label={t('password')}
							placeholder='******'
							type='password'
							
							isDisabled={isLoadingNew}
							isInvalid={!!fieldState.error}
							errorMessage={fieldState.error?.message}
							autoComplete='new-password'
							{...field}
						/>
					)}
				/>

				{/* reCAPTCHA */}
				<div
					className={`flex justify-center ${isLoadingNew ? 'pointer-events-none opacity-60' : ''}`}
					aria-disabled={isLoadingNew}
				>
					<ReCAPTCHA
						sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
						onChange={setRecaptchaValue}
						onExpired={() => setRecaptchaValue(null)}
						theme={theme === 'light' ? 'light' : 'dark'}
					/>
				</div>

				{/* Submit */}
				<Button
					type='submit'
					color='primary'
					fullWidth
					isDisabled={isLoadingNew}
					isLoading={isLoadingNew}
				>
					{isLoadingNew ? t('updating') : t('submit')}
				</Button>

				{/* Helper text */}
				<p className='text-xs text-muted-foreground text-center'>
					{t('hint')}
				</p>
			</form>
		</AuthWrapper>
	)
}

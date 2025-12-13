
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import { addToast, Button, Input } from '@heroui/react'

import { useResetPasswordMutation } from '../hooks'
import { ResetPasswordSchema, type TypeResetPasswordSchema } from '../schemes'
import { AuthWrapper } from './AuthWrapper'
import { useTranslations } from 'next-intl'

/**
 * Форма для сброса пароля.
 */
export function ResetPasswordForm() {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const t = useTranslations('Auth.resetPassword')

	const form = useForm<TypeResetPasswordSchema>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			email: ''
		}
	})

	const { reset, isLoadingReset } = useResetPasswordMutation()

	const onSubmit = (values: TypeResetPasswordSchema) => {
		if (recaptchaValue) {
			reset({ values, recaptcha: recaptchaValue })
		} else {
			addToast({ title: 'Пожалуйста, завершите проверку reCAPTCHA', color: 'danger' })
		}
	}

	return (
		<AuthWrapper
			heading={t('title')}
			description={t('description')}
			backButtonLabel={t('backToLogin')}
			backButtonHref='/auth/login'
		>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-4'
			>
					{/* Email */}
					<Controller
						control={form.control}
						name='email'
						render={({ field, fieldState }) => (
							<Input
								label={t('email')}
								placeholder='ivan@example.com'
								disabled={isLoadingReset}
								type='email'
								autoComplete='email'
								aria-label={t('email')}
								isInvalid={!!fieldState.error}
								errorMessage={fieldState.error?.message}
								{...field}
							/>
						)}
					/>
					{/* reCAPTCHA */}
					<div
						className={`flex justify-center ${
							isLoadingReset ? 'pointer-events-none opacity-60' : ''
						}`}
						aria-disabled={isLoadingReset}
					>
						<ReCAPTCHA
							sitekey={
								process.env.RECAPTCHA_SITE_KEY as string
							}
							onChange={setRecaptchaValue}
							onExpired={() => setRecaptchaValue(null)}
							theme={theme === 'light' ? 'light' : 'dark'}
						/>
					</div>
					{/* Submit */}
					<Button
						type='submit'
						isDisabled={isLoadingReset}
						fullWidth
						color='primary'
						isLoading={isLoadingReset}
					>
						{isLoadingReset ? t('sending') : t('submit')}
					</Button>

					{/* Helper text */}
					<p className='text-xs text-muted-foreground text-center'>
						{t('../common.checkSpam', { defaultValue: 'Если письма нет, проверьте папку «Спам» или попробуйте другой адрес.' })}
					</p>
			</form>
		</AuthWrapper>
	)
}

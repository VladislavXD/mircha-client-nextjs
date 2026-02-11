import type { Metadata } from 'next'

import { ResetPasswordForm } from '@/src/features/auth/components'

export const metadata: Metadata = {
	title: 'Сброс пароля'
}

export default function ResetPasswordPage() {
	return <ResetPasswordForm />
}

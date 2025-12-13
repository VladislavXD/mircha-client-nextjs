import { NewPasswordForm } from '@/src/features/auth/components'
import type { Metadata } from 'next'



export const metadata: Metadata = {
	title: 'Новый пароль'
}

export default function NewPasswordPage() {
	return <NewPasswordForm />
}

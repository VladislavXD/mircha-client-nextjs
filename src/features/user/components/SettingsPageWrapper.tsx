'use client'

import { Button } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface SettingsPageWrapperProps {
	title: string
	children: ReactNode
}

export function SettingsPageWrapper({ title, children }: SettingsPageWrapperProps) {
	const router = useRouter()

	return (
		<div className="flex flex-col gap-4">
			{/* Мобильная кнопка "Назад" */}
			<div className="md:hidden">
				<Button
					variant="light"
					startContent={<ArrowLeft className="w-4 h-4" />}
					onPress={() => router.push('/dashboard/settings')}
					className="mb-2"
				>
					Назад к настройкам
				</Button>
			</div>


			{/* Контент */}
			{children}
		</div>
	)
}

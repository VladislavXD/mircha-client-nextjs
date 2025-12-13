'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
	const router = useRouter()

	useEffect(() => {
		// На десктопе автоматически переходим к профилю
		const checkAndRedirect = () => {
			if (window.innerWidth >= 768) { // md breakpoint
				router.push('/dashboard/settings/profile')
			}
		}

		checkAndRedirect()

		// Слушаем изменение размера окна
		window.addEventListener('resize', checkAndRedirect)
		return () => window.removeEventListener('resize', checkAndRedirect)
	}, [router])

	// На мобильном устройстве SettingsSidebar isMobile отображается через layout
	return null
}

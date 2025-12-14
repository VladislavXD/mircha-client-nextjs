'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function SettingsPage() {
	const router = useRouter()
	const pathname = usePathname()
	const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/)
	const locale = localeMatch?.[1]

	useEffect(() => {
		// На десктопе автоматически переходим к профилю
		const checkAndRedirect = () => {
			const prefix = locale ? `/${locale}` : ''
			if (window.innerWidth >= 768) { // md breakpoint
				router.push(`${prefix}/dashboard/settings/profile`)
			}2
		}

		checkAndRedirect()

		// Слушаем изменение размера окна
		window.addEventListener('resize', checkAndRedirect)
		return () => window.removeEventListener('resize', checkAndRedirect)
	}, [router])

	// На мобильном устройстве SettingsSidebar isMobile отображается через layout
	return null
}

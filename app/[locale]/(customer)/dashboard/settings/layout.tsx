'use client'

import { SettingsSidebar } from '@/src/features/user/components/SettingsSidebar'
import { usePathname } from 'next/navigation'

export default function SettingsLayout({
	children
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	
	// Проверяем, находимся ли мы на главной странице настроек
	const isMainSettingsPage = pathname.endsWith('/settings')

	return (
		<div className="flex flex-col md:flex-row md:gap-6 w-full max-w-7xl mx-auto min-h-screen md:min-h-0 md:p-6">
			{/* Левый сайдбар с навигацией - десктоп */}
			<aside className="w-full md:w-64 md:shrink-0 hidden md:block">
				<div className="sticky top-4">
					<SettingsSidebar />
				</div>
			</aside>

			{/* Основной контент настроек - десктоп всегда, мобайл только на подстраницах */}
			<main className={`flex-1 min-w-0 ${isMainSettingsPage ? 'hidden md:block' : 'block'}`}>
				{children}
			</main>

			{/* Мобильный вид - полноэкранный сайдбар только на главной странице */}
			{isMainSettingsPage && (
				<div className="md:hidden flex flex-col min-h-screen">
					<SettingsSidebar isMobile />
				</div>
			)}
		</div>
	)
}

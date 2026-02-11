import { AppearanceSettings, SettingsPageWrapper } from '@/src/features/user/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Оформление | Настройки'
}

export default function AppearancePage() {
	return (
		<SettingsPageWrapper title="Оформление">
			<AppearanceSettings />
		</SettingsPageWrapper>
	)
}

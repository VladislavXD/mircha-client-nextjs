import { SecuritySettings, SettingsPageWrapper } from '@/src/features/user/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Безопасность | Настройки'
}

export default function SecurityPage() {
	return (
		<SettingsPageWrapper title="Безопасность">
			<SecuritySettings />
		</SettingsPageWrapper>
	)
}

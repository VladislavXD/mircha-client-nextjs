import { PrivacySettings, SettingsPageWrapper } from '@/src/features/user/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Конфиденциальность | Настройки'
}

export default function PrivacyPage() {
	return (
		<SettingsPageWrapper title="Конфиденциальность">
			<PrivacySettings />
		</SettingsPageWrapper>
	)
}

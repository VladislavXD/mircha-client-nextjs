'use client'

import { Button, Card, CardBody, CardHeader, Divider, Switch } from '@heroui/react'
import { Lock, Eye, UserX, Globe } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function PrivacySettings() {
	const t = useTranslations('Settings.privacy')
	
	const [settings, setSettings] = useState({
		profileVisibility: true,
		showEmail: false,
		showActivity: true,
		allowMessages: true,
		showOnlineStatus: true
	})

	const handleToggle = (key: keyof typeof settings) => {
		setSettings(prev => ({ ...prev, [key]: !prev[key] }))
	}

	return (
		<Card className="w-full rounded-none shadow-none md:rounded-xl md:shadow-medium">
			<CardHeader className="p-4 sm:p-6">
				<div className="flex items-center gap-3">
					<Lock className="w-6 h-6 text-primary" />
					<div>
						<h2 className="text-lg sm:text-xl font-semibold">{t('title')}</h2>
						<p className="text-small text-default-500">
							{t('description')}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardBody className="p-4 sm:p-6">
				<div className="flex flex-col gap-6">
					{/* Видимость профиля */}
					<div className="flex items-start justify-between gap-4 p-4 border border-default-200 rounded-lg">
						<div className="flex items-start gap-3 flex-1">
							<Eye className="w-5 h-5 text-default-500 mt-1" />
							<div>
								<h3 className="text-medium font-semibold">{t('publicProfile')}</h3>
								<p className="text-small text-default-500 mt-1">
									{t('publicProfileDesc')}
								</p>
							</div>
						</div>
						<Switch
							isSelected={settings.profileVisibility}
							onValueChange={() => handleToggle('profileVisibility')}
						/>
					</div>

					<Divider />

					{/* Показывать email */}
					<div className="flex items-start justify-between gap-4 p-4 border border-default-200 rounded-lg">
						<div className="flex items-start gap-3 flex-1">
							<Globe className="w-5 h-5 text-default-500 mt-1" />
							<div>
								<h3 className="text-medium font-semibold">{t('showEmail')}</h3>
								<p className="text-small text-default-500 mt-1">
									{t('showEmailDesc')}
								</p>
							</div>
						</div>
						<Switch
							isSelected={settings.showEmail}
							onValueChange={() => handleToggle('showEmail')}
						/>
					</div>

					<Divider />

					{/* Показывать активность */}
					<div className="flex items-start justify-between gap-4 p-4 border border-default-200 rounded-lg">
						<div className="flex items-start gap-3 flex-1">
							<Eye className="w-5 h-5 text-default-500 mt-1" />
							<div>
								<h3 className="text-medium font-semibold">Активность</h3>
								<p className="text-small text-default-500 mt-1">
									Показывать вашу активность (лайки, комментарии) другим пользователям
								</p>
							</div>
						</div>
						<Switch
							isSelected={settings.showActivity}
							onValueChange={() => handleToggle('showActivity')}
						/>
					</div>

					<Divider />

					{/* Сообщения */}
					<div className="flex items-start justify-between gap-4 p-4 border border-default-200 rounded-lg">
						<div className="flex items-start gap-3 flex-1">
							<UserX className="w-5 h-5 text-default-500 mt-1" />
							<div>
								<h3 className="text-medium font-semibold">Личные сообщения</h3>
								<p className="text-small text-default-500 mt-1">
									Разрешить другим пользователям отправлять вам сообщения
								</p>
							</div>
						</div>
						<Switch
							isSelected={settings.allowMessages}
							onValueChange={() => handleToggle('allowMessages')}
						/>
					</div>

					<Divider />

					{/* Онлайн статус */}
					<div className="flex items-start justify-between gap-4 p-4 border border-default-200 rounded-lg">
						<div className="flex items-start gap-3 flex-1">
							<Globe className="w-5 h-5 text-default-500 mt-1" />
							<div>
								<h3 className="text-medium font-semibold">Онлайн статус</h3>
								<p className="text-small text-default-500 mt-1">
									Показывать, когда вы онлайн
								</p>
							</div>
						</div>
						<Switch
							isSelected={settings.showOnlineStatus}
							onValueChange={() => handleToggle('showOnlineStatus')}
						/>
					</div>

					<div className="flex justify-end pt-4">
						<Button color="primary">
							{t('saveChanges')}
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

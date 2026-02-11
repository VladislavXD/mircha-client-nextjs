'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Avatar, Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react'
import { useProfile } from '@/src/features/profile/hooks'
import { useUpdateProfileMutation } from '../hooks'
import { z } from 'zod'
import { useRef } from 'react'
import { addToast } from '@heroui/react'
import { useTranslations } from 'next-intl'

const profileSchema = z.object({
	name: z.string().min(2, 'Имя должно содержать минимум 2 символа').optional(),
	email: z.string().email('Некорректный email').optional(),
	username: z.string().min(3, 'Никнейм должен содержать минимум 3 символа').optional(),
	dateOfBirth: z.string().optional(),
	bio: z.string().max(500, 'Максимум 500 символов').optional(),
	status: z.string().max(100, 'Максимум 100 символов').optional(),
	location: z.string().max(100, 'Максимум 100 символов').optional()
}).partial()

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileSettings() {
	const { user, isLoading } = useProfile()
	const { update, isLoadingUpdate } = useUpdateProfileMutation()
	const avatarFileRef = useRef<File | null>(null)
	const t = useTranslations('Settings.profile')

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		values: {
			name: user?.name ?? '',
			email: user?.email ?? '',
			username: (user as any)?.username ?? '',
			dateOfBirth: (() => {
				const dob = (user as any)?.dateOfBirth
				if (!dob) return ''
				try {
					const d = typeof dob === 'string' ? new Date(dob) : (dob as Date)
					return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
				} catch {
					return ''
				}
			})(),
			bio: (user as any)?.bio ?? '',
			status: (user as any)?.status ?? '',
			location: (user as any)?.location ?? ''
		}
	})

	const onSubmit = (values: ProfileFormData) => {
		const fd = new FormData()
		
		// Обязательные поля - всегда отправляем (из формы или из профиля)
		fd.append('name', values.name || user?.name || '')
		fd.append('email', values.email || user?.email || '')
		fd.append('username', values.username || (user as any)?.username || '')
		
		// Опциональные поля - отправляем только если заполнены
		if (values.dateOfBirth) fd.append('dateOfBirth', values.dateOfBirth)
		if (values.bio) fd.append('bio', values.bio)
		if (values.status) fd.append('status', values.status)
		if (values.location) fd.append('location', values.location)
		
		if (avatarFileRef.current) {
			fd.append('avatar', avatarFileRef.current)
		}
		update({ values: fd as any })
	}

	if (isLoading) {
		return (
			<Card className="rounded-none shadow-none md:rounded-xl md:shadow-medium">
				<CardBody className="p-4 sm:p-6">
					<div className="py-8 text-center text-default-500">{t('loading')}</div>
				</CardBody>
			</Card>
		)
	}

	if (!user) {
		return (
			<Card className="rounded-none shadow-none md:rounded-xl md:shadow-medium">
				<CardBody className="p-4 sm:p-6">
					<div className="py-8 text-center text-default-500">{t('notFound')}</div>
				</CardBody>
			</Card>
		)
	}

	console.log('user in ProfileSettings:', user.backgroundUrl);
	return (
		<Card className="w-full rounded-none shadow-none md:rounded-xl md:shadow-medium">
			<CardHeader className="flex flex-col gap-3 pb-4 p-4 sm:p-6">
				<div className="flex items-center gap-4 w-full">
					<Avatar 
						src={(user as any)?.avatarUrl || undefined} 
						name={user?.name}
						className="w-20 h-20"
					/>
					<div className="flex-1">
						<h2 className="text-lg sm:text-xl font-semibold">{t('title')}</h2>
						<p className="text-small text-default-500">
							{t('description')}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardBody className="p-4 sm:p-6">
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
					{/* Превью профиля */}
					<div className="relative h-48 rounded-lg overflow-hidden border border-default-200">
						<video 
							className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"
							src={(user as any)?.backgroundUrl || undefined}
							controls={false}
							autoPlay
							muted
							loop
						/>
						<div 
							className="absolute inset-0"
							style={{
								backgroundImage: (user as any)?.backgroundUrl 
									? `url(${(user as any)?.backgroundUrl})` 
									: undefined,
								backgroundSize: 'cover',
								backgroundPosition: 'center'
							}}
						/>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="relative">
								{(user as any)?.avatarFrameUrl && (
									<div 
										className="absolute inset-0 pointer-events-none z-10"
										style={{
											backgroundImage: `url(${(user as any)?.avatarFrameUrl})`,
											backgroundSize: 'contain',
											backgroundPosition: 'center',
											backgroundRepeat: 'no-repeat',
											width: '120px',
											height: '120px',
											left: '50%',
											top: '50%',
											transform: 'translate(-50%, -50%)'
										}}
									/>
								)}
								<div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg">
									<img 
										src={(user as any)?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=96`}
										alt={user?.name || 'Avatar'}
										className="w-full h-full object-cover"
									/>
								</div>
							</div>
						</div>
						<div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
							Предпросмотр профиля
						</div>
					</div>

					{/* Аватар */}
					<div className="flex flex-col gap-2">
						<label className="text-small font-medium">Аватар</label>
						<input
							type="file"
							accept="image/*"
							onChange={e => {
								const f = e.target.files?.[0] || null
								avatarFileRef.current = f
								if (f) addToast({ title: 'Файл выбран', description: f.name })
							}}
							className="border-small border-default-200 rounded-medium p-2 hover:border-default-400 transition"
						/>
						<p className="text-tiny text-default-400">
							JPG, PNG или GIF. Максимум 5MB.
						</p>
					</div>

					{/* Основные поля */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Controller
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<Input 
									label="Имя" 
									placeholder="Иван Иванов"
									isDisabled={isLoadingUpdate}
									isInvalid={!!fieldState.error}
									errorMessage={fieldState.error?.message}
									{...field}
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<Input 
									label="Email" 
									type="email"
									placeholder="ivan@example.com"
									isDisabled={isLoadingUpdate}
									isInvalid={!!fieldState.error}
									errorMessage={fieldState.error?.message}
									{...field}
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="username"
							render={({ field, fieldState }) => (
								<Input 
									label="имя пользователя" 
									placeholder="ivan123"
									isDisabled={isLoadingUpdate}
									isInvalid={!!fieldState.error}
									errorMessage={fieldState.error?.message}
									{...field}
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="dateOfBirth"
							render={({ field, fieldState }) => (
								<Input 
									label="Дата рождения" 
									type="date"
									isDisabled={isLoadingUpdate}
									isInvalid={!!fieldState.error}
									errorMessage={fieldState.error?.message}
									{...field}
								/>
							)}
						/>
					</div>

					{/* О себе */}
					<Controller
						control={form.control}
						name="bio"
						render={({ field, fieldState }) => (
							<Textarea 
								label="О себе" 
								placeholder="Расскажите немного о себе..."
								isDisabled={isLoadingUpdate}
								isInvalid={!!fieldState.error}
								errorMessage={fieldState.error?.message}
								{...field}
							/>
						)}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Controller
							control={form.control}
							name="status"
							render={({ field, fieldState }) => (
								<Input 
									label="Статус" 
									placeholder="На связи"
									isDisabled={isLoadingUpdate}
									isInvalid={!!fieldState.error}
									errorMessage={fieldState.error?.message}
									{...field}
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="location"
							render={({ field, fieldState }) => (
								<Input 
									label="Местоположение" 
									placeholder="Москва, Россия"
									isDisabled={isLoadingUpdate}
									isInvalid={!!fieldState.error}
									errorMessage={fieldState.error?.message}
									{...field}
								/>
							)}
						/>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button
							type="button"
							variant="flat"
							onPress={() => form.reset()}
							isDisabled={isLoadingUpdate}
						>
							{t('common.cancel')}
						</Button>
						<Button
							type="submit"
							color="primary"
							isLoading={isLoadingUpdate}
							isDisabled={isLoadingUpdate}
						>
							{t('saveChanges')}
						</Button>
					</div>
				</form>
			</CardBody>
		</Card>
	)
}

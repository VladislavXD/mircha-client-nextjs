'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { addToast, Avatar, Button, Card, CardBody, CardHeader, CardFooter, Divider, Input, Switch, Textarea } from '@heroui/react'


import { useUpdateProfileMutation } from '../hooks'
import { SettingsSchema, type TypeSettingsSchema } from '../schemes'


// Используем опциональные поля без жесткого приведения типов
import { useProfile } from '@/src/features/profile/hooks'

/**
 * Форма для настройки профиля пользователя.
 */
export function SettingsForm() {
	const { user, isLoading } = useProfile()

	const form = useForm<TypeSettingsSchema>({
		// Тип workaround из-за zod preprocess: приводим резолвер к any
		resolver: zodResolver(SettingsSchema) as any,
		values: {
			name: user?.name ?? '',
			email: user?.email ?? '',
			username: (user as any)?.username ?? '',
			isTwoFactorEnabled: (user as any)?.isTwoFactorEnabled ?? false,
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
			location: (user as any)?.location ?? '',
			backgroundUrl: (user as any)?.backgroundUrl ?? '',
			usernameFrameUrl: (user as any)?.usernameFrameUrl ?? '',
			avatarFrameUrl: (user as any)?.avatarFrameUrl ?? ''
		}
	})

	const { update, isLoadingUpdate } = useUpdateProfileMutation()

	// Локальный стейт для файла аватара
	let avatarFile: File | null = null

	const onSubmit = (values: TypeSettingsSchema) => {
		// Собираем FormData с дефолтными значениями из профиля
		const fd = new FormData()
		fd.append('name', values.name || '')
		fd.append('email', values.email || '')
		fd.append('username', values.username || '')
		fd.append('isTwoFactorEnabled', String(values.isTwoFactorEnabled || false))
		fd.append('dateOfBirth', values.dateOfBirth || '')
		fd.append('bio', values.bio || '')
		fd.append('status', values.status || '')
		fd.append('location', values.location || '')
		fd.append('backgroundUrl', values.backgroundUrl || '')
		fd.append('usernameFrameUrl', values.usernameFrameUrl || '')
		fd.append('avatarFrameUrl', values.avatarFrameUrl || '')
		if (avatarFile) {
			fd.append('avatar', avatarFile)
		}
		
		update({ values: fd })

	if (!user){
		return (
			<div className='w-full max-w-2xl'>
				<Card>
					<CardBody>
						<p className='text-center text-default-500'>Профиль не найден</p>
					</CardBody>
				</Card>
			</div>
		)
	}

	return (
		<Card className='w-full max-w-2xl'>
			<CardHeader className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<Avatar src={(user as any)?.avatarUrl || undefined} name={user?.name} />
					<div>
						<h2 className='text-xl font-semibold'>Настройки профиля</h2>
						<p className='text-small text-default-500'>Управляйте основной информацией, безопасностью и оформлением</p>
					</div>
				</div>
				{/* Кнопка пользователя может быть добавлена здесь при наличии компонента */}
			</CardHeader>
			<CardBody>
				{isLoading ? (
					<div className='py-8 text-center text-default-500'>Загружаем профиль…</div>
				) : (
					<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
						{/* Превью профиля с фоном и аватаром */}
						<div className='relative h-48 rounded-lg overflow-hidden border border-default-200'>
							{/* Фон профиля */}
							<div 
								className='absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20'
								style={{
									backgroundImage: form.watch('backgroundUrl') || (user as any)?.backgroundUrl
										? `url(${form.watch('backgroundUrl') || (user as any)?.backgroundUrl})` 
										: undefined,
									backgroundSize: 'cover',
									backgroundPosition: 'center'
								}}
							/>
							
							{/* Аватар с рамкой по центру */}
							<div className='absolute inset-0 flex items-center justify-center'>
								<div className='relative'>
									{/* Рамка аватара */}
									{(form.watch('avatarFrameUrl') || (user as any)?.avatarFrameUrl) && (
										<div 
											className='absolute inset-0 pointer-events-none z-10'
											style={{
												backgroundImage: `url(${form.watch('avatarFrameUrl') || (user as any)?.avatarFrameUrl})`,
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
									{/* Аватар (квадратный) */}
									<div className='w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg'>
										<img 
											src={(user as any)?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=96`} 
											alt={user?.name || 'Avatar'}
											className='w-full h-full object-cover'
										/>
									</div>
								</div>
							</div>
							
							{/* Подсказка */}
							<div className='absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded'>
								Предпросмотр профиля
							</div>
						</div>
						{/* Основная информация */}
						<div>
							<h3 className='text-medium font-semibold mb-3'>Основное</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<Controller
									control={form.control}
									name='name'
									render={({ field, fieldState }) => (
										<Input label='Имя' placeholder='Иван' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
									)}
								/>
								<Controller
									control={form.control}
									name='email'
									render={({ field, fieldState }) => (
										<Input label='Электронная почта' placeholder='ivan@example.com' type='email' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
									)}
								/>
								<Controller
									control={form.control}
									name='username'
									render={({ field, fieldState }) => (
										<Input label='Имя пользователя' placeholder='ivan123' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
									)}
								/>
								<Controller
									control={form.control}
									name='dateOfBirth'
									render={({ field, fieldState }) => (
										<Input label='Дата рождения' type='date' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
									)}
								/>
							</div>
						</div>

						<Divider />

						{/* О себе */}
						<div>
							<h3 className='text-medium font-semibold mb-3'>О себе</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<Controller
									control={form.control}
									name='bio'
									render={({ field, fieldState }) => (
										<Textarea label='Био' placeholder='Пара слов о себе' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
									)}
								/>
								<Controller
									control={form.control}
									name='status'
									render={({ field, fieldState }) => (
										<Input label='Статус' placeholder='На связи' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
									)}
								/>
								<Controller
									control={form.control}
									name='location'
									render={({ field, fieldState }) => (
										<Input label='Локация' placeholder='Москва' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
									)}
								/>
							</div>
						</div>

						<Divider />

						{/* Оформление */}
						<div>
							<h3 className='text-medium font-semibold mb-3'>Оформление</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<Controller control={form.control} name='backgroundUrl' render={({ field, fieldState }) => (
									<Input label='Фон профиля (URL)' placeholder='https://...' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
								)} />
								<Controller control={form.control} name='usernameFrameUrl' render={({ field, fieldState }) => (
									<Input label='Рамка никнейма (URL)' placeholder='https://...' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
								)} />
								<Controller control={form.control} name='avatarFrameUrl' render={({ field, fieldState }) => (
									<Input label='Рамка аватара (URL)' placeholder='https://...' isDisabled={isLoadingUpdate} isInvalid={!!fieldState.error} errorMessage={fieldState.error?.message} {...field} />
								)} />
								<div className='flex flex-col gap-2'>
									<label className='text-small text-default-500'>Аватар (изображение)</label>
									<input
										type='file'
										accept='image/*'
										onChange={e => {
											const f = e.target.files?.[0] || null
											avatarFile = f
											if (f) addToast({ title: 'Файл выбран', description: f.name })
										}}
										className='border-small rounded-medium p-2'
									/>
								</div>
							</div>
						</div>

						<Divider />

						{/* Безопасность */}
						<div className='flex items-center justify-between border-small rounded-medium p-3'>
							<div>
								<p className='text-small font-medium'>Двухфакторная аутентификация</p>
								<p className='text-tiny text-default-500'>Включите второй фактор для дополнительной защиты</p>
							</div>
							<Controller control={form.control} name='isTwoFactorEnabled' render={({ field }) => (
								<Switch isSelected={field.value as boolean} onValueChange={field.onChange} isDisabled={isLoadingUpdate} />
							)} />
						</div>

						<CardFooter className='px-0'>
							<Button type='submit' color='primary' isDisabled={isLoadingUpdate} isLoading={isLoadingUpdate}>
								Сохранить изменения
							</Button>
						</CardFooter>
					</form>
				)}
			</CardBody>
		</Card>
	)
}

}
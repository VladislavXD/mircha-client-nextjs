import { z } from 'zod'

/**
 * Схема для валидации и типизации данных настроек пользователя.
 */
export const SettingsSchema = z.object({
	// Основные поля (все опциональные, чтобы можно было менять по одному)
	name: z
		.string()
		.min(1, { message: 'Введите имя' })
		.max(64, { message: 'Слишком длинное имя' })
		.optional(),
	email: z
		.string()
		.email({ message: 'Некорректная почта' })
		.optional(),
	username: z
		.string()
		.min(3, { message: 'Минимум 3 символа' })
		.max(32, { message: 'Максимум 32 символа' })
		.optional(),

	// Флаги (multipart/form-data приходит строкой "true"/"false")
	isTwoFactorEnabled: z
		.preprocess(val => {
			if (typeof val === 'string') return val === 'true'
			return !!val
		}, z.boolean())
		.optional(),

	// Дата рождения как строка (yyyy-mm-dd), конвертируется при отправке
	dateOfBirth: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/,{ message: 'Некорректная дата' })
		.optional(),

	// Текстовые поля
	bio: z.string().max(280, { message: 'Максимум 280 символов' }).optional(),
	status: z.string().max(64, { message: 'Максимум 64 символа' }).optional(),
	location: z.string().max(64, { message: 'Максимум 64 символа' }).optional(),

	// URL-поля (допускаем пустую строку как undefined)
	backgroundUrl: z
		.preprocess(val => (val === '' ? undefined : val), z.string().url().optional()),
	usernameFrameUrl: z
		.preprocess(val => (val === '' ? undefined : val), z.string().url().optional()),
	avatarFrameUrl: z
		.preprocess(val => (val === '' ? undefined : val), z.string().url().optional())

}).partial() // Делаем все поля опциональными, чтобы можно было обновлять по одному

/**
 * Тип данных настроек пользователя, выведенный из схемы.
 */
export type TypeSettingsSchema = z.infer<typeof SettingsSchema>

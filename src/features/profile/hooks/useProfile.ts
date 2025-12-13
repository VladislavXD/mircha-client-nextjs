import { userService } from '@/src/features/user/services'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

/**
 * Проверяет наличие токена аутентификации.
 */


/**
 * Хук для получения профиля текущего пользователя.
 * Поддерживает как NextAuth, так и кастомную аутентификацию.
 */
export function useProfile() {
	const pathname = usePathname()

	// Удаляем префикс локали (/ru, /en) и нормализуем путь
	const normalizedPath = (() => {
		if (!pathname) return '/'
		const parts = pathname.split('/')
		// parts[0] === ''
		const maybeLocale = parts[1]
		const locales = new Set(['ru', 'en'])
		if (locales.has(maybeLocale)) {
			return '/' + parts.slice(2).join('/') || '/'
		}
		return pathname
	})()

	// Публичные корни, где не нужно дергать приватный профиль
	const publicRoots = new Set([
		// Главная должна подтягивать профиль, чтобы навигация и лайки знали состояние авторизации
		// '/',
		'/auth',
		'/forum',
		'/user', // страница чужого профиля
		'/search',
		// Не исключаем админку: для проверки роли нужен профиль
	])

	const isPublicPage = Array.from(publicRoots).some((root) =>
		normalizedPath === root || normalizedPath.startsWith(root + '/')
	)

	const { data: user, isLoading, refetch } = useQuery({
		queryKey: ['profile'],
		queryFn: () => userService.findProfile(),
		// Не дергаем приватный эндпойнт на публичных страницах
		enabled: !isPublicPage,
		retry: false,
		staleTime: 60 * 1000,
	})

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		refetch
	}

}

export function getProfileById(userId: string){
		const {data: user, isLoading, refetch} = useQuery({
			queryKey: ['profile', userId],
			queryFn: () => userService.getUserById(userId),
			enabled: !!userId,
			retry: false,
			staleTime: 60 * 1000,
		})

		return {
			user,
			isLoading,
			isAuthenticated: !!user,
			refetch
		}
}

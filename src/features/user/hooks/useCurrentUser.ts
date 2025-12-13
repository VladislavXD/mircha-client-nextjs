import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { userService } from '../services'
import type { IUser } from '../types'

/**
 * Хук для получения данных текущего авторизованного пользователя.
 * Использует React Query для кеширования и автоматического обновления данных.
 * 
 * @param options - Дополнительные опции для useQuery
 * @returns Объект с данными пользователя, статусом загрузки и флагом авторизации
 * 
 * @example
 * ```tsx
 * const { user, isLoading, isAuthenticated } = useCurrentUser()
 * 
 * if (isLoading) return <Spinner />
 * if (!isAuthenticated) return <LoginPrompt />
 * 
 * return <div>Привет, {user.username}!</div>
 * ```
 */
export function useCurrentUser(
	options?: Omit<UseQueryOptions<IUser | undefined, Error>, 'queryKey' | 'queryFn'>
) {
	const { data: user, isLoading, error, refetch } = useQuery<IUser | undefined, Error>({
		queryKey: ['currentUser'],
		queryFn: () => userService.findProfile(),
		retry: false,
		staleTime: 60 * 1000, // Кешируем на 1 минуту
		...options,
	})

	return {
		user,
		isLoading,
		error,
		isAuthenticated: !!user,
		refetch,
	}
}

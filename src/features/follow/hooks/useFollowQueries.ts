import { useQuery } from '@tanstack/react-query'
import { followService } from '../services/follow.service'

/**
 * Хук для получения списка подписчиков пользователя.
 */
export function useFollowers(userId: string, page = 1, limit = 20) {
	return useQuery({
		queryKey: ['followers', userId, page, limit],
		queryFn: () => followService.getFollowers(userId, page, limit),
		enabled: !!userId,
		staleTime: 2 * 60 * 1000, // 2 минуты
	})
}

/**
 * Хук для получения списка подписок пользователя.
 */
export function useFollowing(userId: string, page = 1, limit = 20) {
	return useQuery({
		queryKey: ['following', userId, page, limit],
		queryFn: () => followService.getFollowing(userId, page, limit),
		enabled: !!userId,
		staleTime: 2 * 60 * 1000, // 2 минуты
	})
}

/**
 * Хук для проверки подписки на пользователя.
 */
export function useIsFollowing(targetUserId: string, opts?: { enabled?: boolean }) {
	const enabled = (opts?.enabled ?? true) && !!targetUserId
	return useQuery({
		queryKey: ['isFollowing', targetUserId],
		queryFn: () => followService.isFollowing(targetUserId),
		enabled,
		staleTime: 1 * 60 * 1000, // 1 минута
		retry: false,
	})
}

/**
 * Хук для получения статистики подписок пользователя.
 */
export function useFollowStats(userId: string, opts?: { enabled?: boolean }) {
	const enabled = (opts?.enabled ?? true) && !!userId
	return useQuery({
		queryKey: ['followStats', userId],
		queryFn: () => followService.getStats(userId),
		enabled,
		staleTime: 5 * 60 * 1000, // 5 минут
		retry: false,
	})
}

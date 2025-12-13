'use client'

import confetti from 'canvas-confetti'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useFollow, useUnfollow, useIsFollowing, useFollowStats } from '@/src/features/follow'
import { userService } from '@/src/features/user/services'
import { useProfile } from '@/src/features/profile/hooks/useProfile'
import { useAppearance } from './useAppearance'
import { useStatus } from './useStatus'

/**
 * Главный хук для работы с профилем пользователя.
 * Содержит логику: загрузка данных, follow/unfollow.
 * Оформление (appearance) и статус вынесены в отдельные хуки.
 */
export function useUserProfile(userId?: string) {
	const queryClient = useQueryClient()
	const { user: currentUser, isAuthenticated } = useProfile()
	
	// Хук для управления оформлением профиля
	const appearanceHook = useAppearance(userId)

	// Определяем свой это профиль или чужой
	const isOwnProfile = currentUser?.id === userId

	// Загрузка данных профиля
	const {
		data: profileData,
		isLoading: isProfileLoading,
		refetch: refetchProfile,
	} = useQuery({
		queryKey: ['user', userId],
		queryFn: async () => {
			// Для своего профиля - текущий пользователь (требует авторизацию)
			if (isOwnProfile && isAuthenticated) {
				return userService.findProfile()
			}
			// Для всех остальных (включая неавторизованных) - публичный API
			return userService.getUserById(userId!)
		},
		enabled: !!userId,
		staleTime: 1 * 60 * 1000, // Уменьшили staleTime до 1 минуты
		// Для своего профиля используем initialData из currentUser
		initialData: isOwnProfile ? currentUser : undefined,
	})

	// Хук для управления статусом пользователя
	const statusHook = useStatus(userId, profileData?.status)

	// Проверка подписки (только для чужих профилей)
	const {
		data: followData,
		isLoading: isFollowCheckLoading,
		refetch: refetchIsFollowing,
	} = useIsFollowing(userId || '', { enabled: !!userId && isAuthenticated && !isOwnProfile })

	// Статистика подписок
	const {
		data: statsData,
		isLoading: isStatsLoading,
		refetch: refetchStats,
	} = useFollowStats(userId || '', { enabled: !!userId && isAuthenticated })

	const isFollowing = followData?.isFollowing || false

	// Мутации follow/unfollow
	const followMutation = useFollow()
	const unfollowMutation = useUnfollow()

	/**
	 * Подписаться/отписаться от пользователя
	 */
	const handleFollow = async () => {
		if (!userId || !isAuthenticated || isOwnProfile) return

		try {
			if (isFollowing) {
				await unfollowMutation.mutateAsync(userId)
			} else {
				await followMutation.mutateAsync(userId)
				// Конфетти при подписке
				confetti({
					particleCount: 100,
					spread: 70,
					origin: { x: 0.35, y: 0.8 },
				})
			}

			// Обновляем данные
			await Promise.all([
				refetchProfile(),
				refetchIsFollowing(),
				refetchStats(),
			])
		} catch (error) {
			console.error('Follow error:', error)
		}
	}

	/**
	 * Обновить данные после редактирования профиля
	 */
	const refreshUserAfterEdit = async () => {
		if (!userId) return
		try {
			await Promise.all([
				refetchProfile(),
				refetchStats(),
				queryClient.invalidateQueries({ queryKey: ['profile'] }),
			])
		} catch (error) {
			console.error('Refresh error:', error)
		}
	}

	return {
		// Данные
		data: profileData,
		currentUser,
		isFollowing,
		isOwnProfile,
		isAuthenticated, // ✅ Флаг авторизации для UI
		stats: statsData,

		// Состояния загрузки
		isDataLoading: isProfileLoading,
		isFollowLoading: followMutation.isPending,
		isUnfollowLoading: unfollowMutation.isPending,
		isLoading: isProfileLoading || isFollowCheckLoading || isStatsLoading,

		// Appearance (из отдельного хука)
		...appearanceHook,

		// Status (из отдельного хука)
		...statusHook,

		// Действия (доступны только авторизованным)
		handleFollow: isAuthenticated ? handleFollow : undefined,
		refreshUserAfterEdit: isAuthenticated ? refreshUserAfterEdit : undefined,

		// Ошибки
		followError: followMutation.error,
		unfollowError: unfollowMutation.error,
	}
}

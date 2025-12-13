'use client'

import React from 'react'
import Link from 'next/link'
import { addToast, Button } from '@heroui/react'
import {
	MdOutlinePersonAddAlt1,
	MdOutlinePersonAddDisabled,
} from 'react-icons/md'
import { SendHorizontal } from 'lucide-react'
import { formatToClientDate } from '@/app/utils/formatToClientDate'
import type { ProfileData, ProfileStats } from '../types'

interface ProfileInfoProps {
	data: ProfileData
	stats: ProfileStats
	isFollowing: boolean
	isOwner: boolean
	isFollowLoading: boolean
	isDataLoading: boolean
	isUnfollowLoading: boolean
	unfollowError: any
	followError: any
	onFollow: () => void
	currentUserId?: string
}

/**
 * Компонент информации о пользователе в профиле.
 * Отображает имя, bio, статистику, кнопки подписки/сообщений.
 */
export function ProfileInfo({
	data,
	stats,
	isFollowing,
	isOwner,
	isFollowLoading,
	isDataLoading,
	isUnfollowLoading,
	followError,
	unfollowError,
	onFollow,
	currentUserId,
}: ProfileInfoProps) {
	// Показ ошибок подписки
	React.useEffect(() => {
		if (followError || unfollowError) {
			addToast({
				title: 'Ошибка подписки',
				description:
					'Не удалось выполнить действие. Пожалуйста, попробуйте через 15 мин.',
				color: 'danger',
			})
		}
	}, [followError, unfollowError])

	return (
		<div className="flex flex-col gap-4 sm:gap-6">
			{/* Верхняя часть: имя и кнопки */}
			<div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
				{/* Имя пользователя */}
				<div className="flex-1 w-full">
					<div className="relative inline-block mb-2">
						{data.usernameFrameUrl && data.usernameFrameUrl !== 'none' && (
							<div
								className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
								style={{
									backgroundImage: `url(${data.usernameFrameUrl})`,
									backgroundRepeat: 'repeat-x',
									backgroundSize: 'auto 100%',
									backgroundPosition: 'left center',
								}}
							/>
						)}
						<h1 className="relative z-0 text-2xl sm:text-3xl lg:text-4xl font-bold px-0">
							{data.name}
						</h1>
					</div>
					<p className="text-default-500 text-base sm:text-lg">@{data.username}</p>
				</div>

				{/* Кнопки действий (только для чужого профиля) - мобильная версия в конце */}
				{!isOwner && (
					<div className="hidden sm:flex flex-col gap-3 shrink-0">
						<Button
							color={isFollowing ? 'default' : 'primary'}
							variant={isFollowing ? 'flat' : 'solid'}
							disabled={isDataLoading || isFollowLoading || isUnfollowLoading}
							isDisabled={isDataLoading || isFollowLoading || isUnfollowLoading}
							size="lg"
							className="min-w-[140px] font-semibold"
							onClick={() =>
								!currentUserId
									? addToast({
											title: 'Вы не авторизованы',
											description: 'Пожалуйста, войдите в систему.',
											color: 'danger',
										})
									: onFollow()
							}
							endContent={
								isFollowing ? (
									<MdOutlinePersonAddDisabled />
								) : (
									<MdOutlinePersonAddAlt1 />
								)
							}
						>
							{isFollowing ? 'Отписаться' : 'Подписаться'}
						</Button>

						<Button
							variant="flat"
							size="lg"
							className="min-w-[140px]"
							endContent={<SendHorizontal size={16} />}
							onPress={() =>
								!currentUserId
									? addToast({
											title: 'Вы не авторизованы',
											description: 'Пожалуйста, войдите в систему.',
											color: 'danger',
										})
									: null
							}
						>
							<Link href={!currentUserId ? '#' : `/chat/${data.id}`}>
								Сообщение
							</Link>
						</Button>
					</div>
				)}
			</div>

			{/* Bio */}
			{data.bio && (
				<p className="text-default-600 text-sm sm:text-base max-w-2xl leading-relaxed">
					{data.bio}
				</p>
			)}

			{/* Метаинформация */}
			<div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-default-500">
				{data.dateOfBirth && (
					<div className="flex items-center gap-1.5 sm:gap-2">
						<span>🎂</span>
						<span className="truncate">{formatToClientDate(data.dateOfBirth)}</span>
					</div>
				)}
				{data.location && (
					<div className="flex items-center gap-1.5 sm:gap-2">
						<span>📍</span>
						<span className="truncate">{data.location}</span>
					</div>
				)}
				<div className="flex items-center gap-1.5 sm:gap-2">
					<span>📅</span>
					<span className="truncate">Присоединился {formatToClientDate(data.createdAt)}</span>
				</div>
			</div>

			{/* Статистика подписок */}
			<div className="flex flex-wrap gap-4 sm:gap-6">
				<Link href={`/following/${data.id}`} className="group">
					<div className="flex items-center gap-1 group-hover:text-primary transition-colors">
						<span className="font-bold text-base sm:text-lg">{stats.followingCount}</span>
						<span className="text-default-500 text-sm sm:text-base">Подписки</span>
					</div>
				</Link>
				<Link href={`/followers/${data.id}`} className="group">
					<div className="flex items-center gap-1 group-hover:text-primary transition-colors">
						<span className="font-bold text-base sm:text-lg">{stats.followersCount}</span>
						<span className="text-default-500 text-sm sm:text-base">Подписчики</span>
					</div>
				</Link>
				<div className="flex items-center gap-1">
					<span className="font-bold text-base sm:text-lg">{stats.postsCount}</span>
					<span className="text-default-500 text-sm sm:text-base">Посты</span>
				</div>
			</div>

			{/* Кнопки действий - мобильная версия */}
			{!isOwner && (
				<div className="flex sm:hidden flex-col gap-3 w-full">
					<Button
						color={isFollowing ? 'default' : 'primary'}
						variant={isFollowing ? 'flat' : 'solid'}
						disabled={isDataLoading || isFollowLoading || isUnfollowLoading}
						isDisabled={isDataLoading || isFollowLoading || isUnfollowLoading}
						size="lg"
						fullWidth
						className="font-semibold"
						onClick={() =>
							!currentUserId
								? addToast({
										title: 'Вы не авторизованы',
										description: 'Пожалуйста, войдите в систему.',
										color: 'danger',
									})
								: onFollow()
						}
						endContent={
							isFollowing ? (
								<MdOutlinePersonAddDisabled />
							) : (
								<MdOutlinePersonAddAlt1 />
							)
						}
					>
						{isFollowing ? 'Отписаться' : 'Подписаться'}
					</Button>

					<Button
						variant="flat"
						size="lg"
						fullWidth
						endContent={<SendHorizontal size={16} />}
						onPress={() =>
							!currentUserId
								? addToast({
										title: 'Вы не авторизованы',
										description: 'Пожалуйста, войдите в систему.',
										color: 'danger',
									})
								: null
						}
					>
						<Link href={!currentUserId ? '#' : `/chat/${data.id}`}>
							Сообщение
						</Link>
					</Button>
				</div>
			)}
		</div>
	)
}

export default ProfileInfo

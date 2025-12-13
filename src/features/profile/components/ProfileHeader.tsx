'use client'

import React from 'react'
import {
	Button,
	Dropdown,
	DropdownMenu,
	DropdownTrigger,
	DropdownItem,
	Image,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from '@heroui/react'
import { CiEdit } from 'react-icons/ci'
import Link from 'next/link'
import defaultProfileBg from '@/public/images/default_profile_bg.png'
import { useUserProfile } from '../hooks/useUserProfile'
import { ProfileInfo } from './ProfileInfo'
import { ProfileStatus } from './ProfileStatus'
import StatusModal from './modals/Status.Modals'

interface ProfileHeaderProps {
	userId: string
	isAuthenticated?: boolean // ✅ Флаг авторизации (если передан извне)
	isOwnProfile?: boolean    // ✅ Флаг своего профиля (если передан извне)
}

/**
 * Компонент шапки профиля с аватаром, фоном и основной информацией.
 */
export function ProfileHeader({ 
	userId,
	isAuthenticated: externalIsAuthenticated,
	isOwnProfile: externalIsOwnProfile 
}: ProfileHeaderProps) {
	const {
		data,
		currentUser,
		isOwnProfile: hookIsOwnProfile,
		isAuthenticated: hookIsAuthenticated,
		isFollowLoading,
		isUnfollowLoading,
		isDataLoading,
		handleFollow,
		followError,
		unfollowError,
		// Appearance из нового хука
		openAppearance,
		appearanceType,
		appearanceModal,
		confirmModal,
		FRAME_PRESETS,
		BACKGROUND_PRESETS,
		handleSelectAppearance,
		handleConfirmAppearance,
		isUpdating, // Флаг загрузки обновления appearance
		// Status данные и действия
		statusModal,
		updateStatus,
		setUpdateStatus,
		maxLength,
		currentLength,
		isMaxReached,
		isUpdating: isStatusUpdating,
		handleSaveStatus,
		handleOpenStatusModal,
	} = useUserProfile(userId)

	// ✅ Используем внешние флаги если переданы, иначе из хука
	const isOwnProfile = externalIsOwnProfile ?? hookIsOwnProfile
	const isAuthenticated = externalIsAuthenticated ?? hookIsAuthenticated

	if (!data) {
		return <div>Загрузка профиля...</div>
	}


	return (
		<>
			<div
				style={{
					backgroundImage: `url(${
						data.backgroundUrl === 'none' ? defaultProfileBg.src : ''
					})`,
				}}
				className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl"
			>
				{/* Фон профиля */}
				<div className="relative h-64 md:h-80">
					<video
						key={data.backgroundUrl}
						loop
						muted
						playsInline
						autoPlay
						className="absolute inset-0 w-full h-full object-cover"
					>
						{data.backgroundUrl && (
							<source src={`${data.backgroundUrl}`} type="video/mp4" />
						)}
					</video>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

					{/* Кнопки редактирования (только для своего профиля И авторизованных) */}
					{isOwnProfile && isAuthenticated && (
						<div className="absolute top-4 right-4 flex gap-2">
							<Button
								size="sm"
								as={Link}
								href="/dashboard/settings/profile"
								variant="flat"
								className="bg-white/20 backdrop-blur-sm text-white border-white/30"
								endContent={<CiEdit />}
							>
								Редактировать
							</Button>
							<Dropdown>
								<DropdownTrigger>
									<Button
										variant="flat"
										size="sm"
										className="bg-white/20 backdrop-blur-sm text-white border-white/30"
									>
										Оформление
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									aria-label="Appearance actions"
									onAction={(key) => openAppearance(key as 'frame' | 'background')}
								>
									<DropdownItem key="frame">Рамка аватара</DropdownItem>
									<DropdownItem key="background">Фон профиля</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</div>
					)}
				</div>

				{/* Основная информация */}
				<div className="relative bg-background/95 backdrop-blur-sm p-6">
					<div className="flex flex-col lg:flex-row gap-6 items-start">
						{/* Аватар */}
						<div className="relative shrink-0 mx-auto lg:mx-0">
							<div className="relative w-32 h-32 lg:w-40 lg:h-40 -mt-16 lg:-mt-20">
								<div className="absolute inset-0 flex items-center justify-center p-3 overflow-hidden">
									<Image
										isBlurred
										src={data.avatarUrl || '/default-avatar.png'}
										alt={data.name || 'User avatar'}
										className={`w-full h-full object-cover rounded-2xl shadow-lg ${
											!data.avatarFrameUrl
												? 'border-4 border-white dark:border-gray-700'
												: ''
										}`}
										style={{
											width: '150px',
											maxHeight: '130px',
										}}
									/>

									{/* Рамка аватара */}
									{data.avatarFrameUrl && data.avatarFrameUrl !== 'none' && (
										<img
											src={data.avatarFrameUrl}
											alt=""
											aria-hidden="true"
											className="absolute inset-0 w-full h-full pointer-events-none select-none z-100"
										/>
									)}
								</div>
							</div>

							{/* Статус пользователя */}
							{!isOwnProfile ? (
								data.status && (
									<ProfileStatus
										status={data.status}
										isOwner={false}
									/>
								)
							) : (
								isAuthenticated && (
									<ProfileStatus
										status={data.status}
										isOwner={true}
										onOpen={handleOpenStatusModal}
									/>
								)
							)}

							<StatusModal
								isOpen={statusModal.isOpen}
								onOpenChange={statusModal.onOpenChange}
								userAvatalUrl={data.avatarUrl}
								updateStatus={updateStatus}
								setUpdateStatus={setUpdateStatus}
								maxLength={maxLength}
								currentLength={currentLength}
								isMaxReached={isMaxReached}
								isUpdating={isStatusUpdating}
								onSave={handleSaveStatus}
							/>
						</div>

						{/* Информация о пользователе */}
						<div className="flex-1">
							<ProfileInfo
								data={data}
								stats={{
									followersCount: data._count?.followers || 0,
									followingCount: data._count?.following || 0,
									postsCount: data._count?.post || 0,
								}}
								isFollowing={data.isFollowing || false}
								followError={followError}
								unfollowError={unfollowError}
								isOwner={isOwnProfile}
								isFollowLoading={isFollowLoading}
								isDataLoading={isDataLoading}
								isUnfollowLoading={isUnfollowLoading}
								onFollow={handleFollow || (() => {})} 
								currentUserId={currentUser?.id}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Модалка выбора оформления */}
			<Modal
				isOpen={appearanceModal.isOpen}
				onClose={appearanceModal.onClose}
				size="lg"
				scrollBehavior="inside"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								{appearanceType === 'frame' ? 'Выбор рамки' : 'Выбор фона'}
							</ModalHeader>
							<ModalBody>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
									{(appearanceType === 'frame'
										? FRAME_PRESETS
										: BACKGROUND_PRESETS
									).map((item: any) => (
										<div
											key={item.id}
											className="group relative rounded-lg p-2 bg-background/40 hover:bg-background/60 transition cursor-pointer overflow-hidden"
										>
											<div className="aspect-square relative flex items-center justify-center overflow-hidden rounded">
												{appearanceType === 'frame' ? (
													<>
														<img
															src={item.url}
															alt={item.label}
															className="absolute inset-0 w-full h-full object-contain pointer-events-none"
														/>
														<img
															src={data?.avatarUrl || '/default-avatar.png'}
															alt="preview"
															className="w-2/3 h-2/3 object-cover rounded pointer-events-none"
														/>
													</>
												) : item.type === 'video' ? (
													<video
														autoPlay
														loop
														playsInline
														muted
														className="absolute inset-0 w-full h-full object-cover"
													>
														<source src={item.url} type="video/mp4" />
													</video>
												) : item.type === 'image' ? (
													<img
														src={item.url}
														alt={item.label}
														className="absolute inset-0 w-full h-full object-cover"
													/>
												) : (
													<div className="absolute inset-0 w-full h-full bg-default-100 flex items-center justify-center text-xs text-default-500">
														Без фона
													</div>
												)}
											</div>
											<div className="mt-2 flex justify-between items-center">
												<span className="text-xs truncate max-w-[70%]">
													{item.label}
												</span>
												<Button
													size="sm"
													variant="flat"
													onClick={() =>
														handleSelectAppearance({
															id: item.id,
															url: item.url,
															type: appearanceType!,
														})
													}
												>
													Выбрать
												</Button>
											</div>
										</div>
									))}
								</div>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									Закрыть
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Модалка подтверждения */}
			<Modal
				isOpen={confirmModal.isOpen}
				onClose={confirmModal.onClose}
				size="sm"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Подтверждение</ModalHeader>
							<ModalBody>
								<p>
									Вы точно хотите применить выбранное{' '}
									{appearanceType === 'frame' ? 'рамку' : 'оформление фона'}?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									Отмена
								</Button>
								<Button
									color="primary"
									isLoading={isUpdating}
									onClick={handleConfirmAppearance}
								>
									Применить
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default ProfileHeader

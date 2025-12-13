'use client'

import { useState, useMemo } from 'react'
import { useDisclosure } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { userService } from '@/src/features/user/services'
import { ProfileFrames, ProfileBackground } from '@/app/[locale]/(customer)/user/[id]/ProfileData'
import type { AppearanceType, SelectedAppearanceItem, BackgroundPreset, FramePreset } from '../types'

interface UpdateAppearanceData {
	id: string
	avatarFrameUrl?: string
	backgroundUrl?: string
}

/**
 * Хук для управления оформлением профиля (фон и рамка аватара).
 * Содержит логику модалок выбора, пресеты и мутацию обновления.
 */
export function useAppearance(userId?: string) {
	const queryClient = useQueryClient()
	
	// Состояния для appearance
	const [appearanceType, setAppearanceType] = useState<AppearanceType>(null)
	const [selectedItem, setSelectedItem] = useState<SelectedAppearanceItem | null>(null)
	const appearanceModal = useDisclosure()
	const confirmModal = useDisclosure()

	// Пресеты для рамок
	const FRAME_PRESETS: FramePreset[] = useMemo(
		() =>
			ProfileFrames.map((f) => ({
				id: String(f.id),
				url: f.url,
				label: f.name,
			})),
		[]
	)

	// Пресеты для фонов
	const BACKGROUND_PRESETS: BackgroundPreset[] = useMemo(
		() =>
			ProfileBackground.map((b) => ({
				id: String(b.id),
				url: b.url,
				label: b.name,
				type: (b as any).type ?? 'video',
			})),
		[]
	)

	// Мутация для обновления appearance
	const updateAppearanceMutation = useMutation({
		mutationFn: async (data: UpdateAppearanceData) => {
			return userService.updateProfile({
				avatarFrameUrl: data.avatarFrameUrl,
				backgroundUrl: data.backgroundUrl,
			} as any)
		},
		onSuccess: async () => {
			toast.success('Оформление обновлено')
			// Инвалидируем кеш профиля и принудительно перезапрашиваем
			await Promise.all([
				queryClient.invalidateQueries({ 
					queryKey: ['user', userId],
					refetchType: 'active' // Перезапросить активные запросы
				}),
				queryClient.invalidateQueries({ 
					queryKey: ['profile'],
					refetchType: 'active'
				})
			])
		},
		onError: (error: any) => {
			toast.error(error?.message || 'Ошибка обновления оформления')
		},
	})

	/**
	 * Открыть модалку выбора оформления
	 */
	const openAppearance = (type: 'frame' | 'background') => {
		setAppearanceType(type)
		appearanceModal.onOpen()
	}

	/**
	 * Выбрать элемент оформления
	 */
	const handleSelectAppearance = (item: SelectedAppearanceItem) => {
		setSelectedItem(item)
		confirmModal.onOpen()
	}

	/**
	 * Подтвердить выбор оформления
	 */
	const handleConfirmAppearance = async () => {
		if (!selectedItem || !userId) return

		try {
			// Отправляем запрос и ждем завершения (включая инвалидацию)
			await updateAppearanceMutation.mutateAsync({
				id: userId,
				avatarFrameUrl: selectedItem.type === 'frame' ? selectedItem.url : undefined,
				backgroundUrl: selectedItem.type === 'background' ? selectedItem.url : undefined,
			})
			
			// Закрываем модалки и сбрасываем состояние только после успеха
			confirmModal.onClose()
			appearanceModal.onClose()
			setSelectedItem(null)
			setAppearanceType(null)
		} catch (error) {
			console.error('Appearance update error:', error)
			// При ошибке не закрываем модалки, чтобы пользователь мог попробовать еще раз
		}
	}

	/**
	 * Закрыть все модалки и сбросить состояние
	 */
	const closeAppearanceModals = () => {
		confirmModal.onClose()
		appearanceModal.onClose()
		setSelectedItem(null)
		setAppearanceType(null)
	}

	return {
		// Состояния
		appearanceType,
		selectedItem,
		appearanceModal,
		confirmModal,
		
		// Пресеты
		FRAME_PRESETS,
		BACKGROUND_PRESETS,
		
		// Загрузка
		isUpdating: updateAppearanceMutation.isPending,
		
		// Действия
		openAppearance,
		handleSelectAppearance,
		handleConfirmAppearance,
		closeAppearanceModals,
		setAppearanceType,
		setSelectedItem,
	}
}

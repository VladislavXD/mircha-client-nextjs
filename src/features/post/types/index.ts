import type { User, Post as GlobalPost, Like, Comment } from '@/src/types/types'

/**
 * Экспортируем глобальный тип Post из общих типов
 */
export type { GlobalPost as Post, User, Like, Comment }

/**
 * DTO для создания поста
 */
export interface CreatePostDto {
	content: string
	image?: File
	emojiUrls?: string[]
}

/**
 * DTO для обновления поста
 */
export interface UpdatePostDto {
	content?: string
	image?: File
	emojiUrls?: string[]
}

/**
 * Ответ при добавлении просмотра
 */
export interface AddViewResponse {
	message: string
	viewsCount: number
}

/**
 * Ответ при батчевом добавлении просмотров
 */
export interface AddViewsBatchResponse {
	message: string
	processedCount: number
	postIds: string[]
}

/**
 * Параметры для создания временного поста (оптимистичное обновление)
 */
export interface TempPostParams {
	content: string
	imageUrl?: string
	emojiUrls?: string[]
	currentUser: User
}


export interface CreateCommentDto {
	userId?: string
	postId: string
	content: string
	emojiUrls?: string[]
}


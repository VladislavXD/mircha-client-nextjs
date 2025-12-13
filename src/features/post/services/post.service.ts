import { api } from '@/src/api'
import type { Post, AddViewResponse, AddViewsBatchResponse } from '../types/index'

/**
 * API сервис для работы с постами.
 * 
 * Использует axios через базовый api сервис.
 */
class PostService {
	/**
	 * Создание нового поста.
	 * 
	 * @param data - FormData с полями: content, image (опционально), emojiUrls (JSON строка)
	 * @returns Созданный пост
	 */
	async createPost(data: FormData): Promise<Post> {
		return api.post<Post>('posts', data)
	}

	/**
	 * Получение всех постов.
	 * 
	 * @returns Массив постов с флагом likeByUser
	 */
	async getPosts(): Promise<Post[]> {
		return api.get<Post[]>('posts')
	}

	/**
	 * Получение поста по ID.
	 * 
	 * @param id - ID поста
	 * @returns Пост с комментариями и лайками
	 */
	async getPostById(id: string): Promise<Post> {
		return api.get<Post>(`posts/${id}`)
	}

	/**
	 * Получение постов конкретного пользователя.
	 * 
	 * @param userId - ID пользователя
	 * @returns Массив постов пользователя
	 */
	async getPostsByUserId(userId: string): Promise<Post[]> {
		return api.get<Post[]>(`posts/user/${userId}`)
	}

	/**
	 * Обновление поста.
	 * 
	 * @param id - ID поста
	 * @param data - FormData с полями: content, image (опционально), emojiUrls
	 * @returns Обновлённый пост
	 */
	async updatePost(id: string, data: FormData): Promise<Post> {
		return api.patch<Post>(`posts/${id}`, data)
	}

	/**
	 * Удаление поста.
	 * 
	 * @param id - ID поста
	 */
	async deletePost(id: string): Promise<void> {
		return api.delete<void>(`posts/${id}`)
	}

	/**
	 * Добавление просмотра поста (с Redis кэшированием).
	 * 
	 * @param postId - ID поста
	 * @returns Сообщение и количество просмотров
	 */
	async addView(postId: string): Promise<AddViewResponse> {
		return api.post<AddViewResponse>('posts/view', { postId })
	}

	/**
	 * Батчевое добавление просмотров (для ленты постов).
	 * 
	 * @param postIds - Массив ID постов
	 * @returns Количество обработанных просмотров
	 */
	async addViewsBatch(postIds: string[]): Promise<AddViewsBatchResponse> {
		return api.post<AddViewsBatchResponse>('posts/views-batch', { postIds })
	}
}

export const postService = new PostService()

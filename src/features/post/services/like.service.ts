import { api } from '@/src/api'
import type { Like } from '../types'

/**
 * Like Service - API методы для работы с лайками постов
 * 
 * Endpoints:
 * - POST /likes - Лайк поста
 * - DELETE /likes/:postId - Убрать лайк с поста
 */
class LikeService {
	/**
	 * Поставить лайк на пост
	 * @param postId - ID поста
	 * @returns Созданный лайк
	 */
	async likePost(postId: string): Promise<Like> {
		return api.post<Like>('/likes', { postId })
	}

	/**
	 * Убрать лайк с поста
	 * @param postId - ID поста
	 * @returns void
	 */
	async unlikePost(postId: string): Promise<void> {
		return api.delete<void>(`/likes/${postId}`)
	}
}

export const likeService = new LikeService()

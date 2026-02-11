import { api } from "@/src/api";


/**
 * Like Service - API методы для работы с лайками постов
 * 
 * Endpoints:
 * - POST /likes - Лайк поста
 * - DELETE /likes/:postId - Убрать лайк с поста
 */
export class LikeService { 
/**
	 * Поставить лайк на пост
	 * @param postId - ID поста
	 * @returns Созданный лайк
	 */
public async likePost(postId: string) {
const response = await api.post("likes", { postId })
return response
}

/**
	 * Убрать лайк с поста
	 * @param postId - ID поста
	 * @returns void
	 */
public async unlikePost(postId: string) {
const response = await api.delete(`likes/${postId}`)
return response
}

}

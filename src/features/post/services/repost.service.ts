import { api } from '@/src/api'
import type { Post } from '../types'

export interface CreateRepostDto {
  postId: string
  comment?: string
}

export interface Repost {
  id: string
  userId: string
  postId: string
  repostComment?: string
  createdAt: string
  user: {
    id: string
    username: string
    name: string
    avatarUrl?: string
  }
  post: Post
}

export interface RepostResponse {
  items: Repost[]
  nextCursor: string | null
  hasMore: boolean
}

/**
 * API сервис для работы с репостами.
 * 
 * Использует axios через базовый api сервис.
 */
class RepostService {
  /**
   * Создать репост поста
   * @param postId - ID поста
   * @param comment - Опциональный комментарий к репосту
   * @returns Созданный репост
   */
  async createRepost(postId: string, comment?: string): Promise<Repost> {
    return api.post<Repost>(`posts/${postId}/reposts`, comment ? { comment } : {})
  }

  /**
   * Удалить репост
   * @param postId - ID поста
   * @returns Сообщение об успешном удалении
   */
  async deleteRepost(postId: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`posts/${postId}/reposts`)
  }

  /**
   * Получить репосты пользователя
   * @param userId - ID пользователя
   * @param limit - Лимит результатов
   * @param cursor - Курсор для пагинации
   * @returns Репосты пользователя
   */
  async getUserReposts(
    userId: string,
    limit = 20,
    cursor?: string
  ): Promise<RepostResponse> {
    return api.get<RepostResponse>(`users/${userId}/reposts`, {
      params: { limit, cursor },
    })
  }

  /**
   * Получить пользователей, которые репостили пост
   * @param postId - ID поста
   * @param limit - Лимит результатов
   * @returns Массив пользователей с информацией о репосте
   */
  async getPostReposters(postId: string, limit = 20): Promise<Array<{
    id: string
    username: string
    name: string
    avatarUrl?: string
    repostedAt: string
    repostComment?: string
  }>> {
    return api.get(`posts/${postId}/reposts`, { params: { limit } })
  }

  /**
   * Проверить, репостил ли текущий пользователь пост
   * @param postId - ID поста
   * @returns Объект с флагом hasReposted
   */
  async checkRepost(postId: string): Promise<{ hasReposted: boolean }> {
    return api.get<{ hasReposted: boolean }>(`posts/${postId}/reposts/check`)
  }
}

export const repostService = new RepostService()


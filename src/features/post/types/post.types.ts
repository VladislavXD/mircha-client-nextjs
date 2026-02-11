/**
 * Типы для постов с поддержкой медиа и спойлеров
 * 
 * @module features/post/types/post
 */

import type { User } from '@/src/types/types'
import type { MediaFile } from './media.types'

/**
 * Интерфейс лайка
 */
export interface Like {
  id: string
  user: User
  userId: string
  postId: string
  createdAt?: string
}

/**
 * Интерфейс комментария
 */
export interface Comment {
  id: string
  content: string
  emojiUrls?: string[]
  user: User
  userId: string
  postId: string
  createdAt: string
  updatedAt?: string
}

/**
 * Основной интерфейс поста с медиа и спойлерами
 */
export interface Post {
  id: string
  content: string | object
  contentSpoiler: boolean
  media: MediaFile[]
  emojiUrls: string[]
  author: User
  authorId: string
  likes: Like[]
  comments: Comment[]
  views: string[]
  createdAt: string
  updatedAt: string
  
  // Вычисляемые поля
  likesCount?: number
  commentsCount?: number
  viewsCount?: number
  likeByUser?: boolean
  
  // Поля для репостов
  repostCount?: number
  repostedByUser?: boolean
  repostData?: {
    id: string
    repostComment?: string
    createdAt: string
  }
}

export type PostsResponse = {
  items: Post[];
  nextCursor: string | null;
  hasMore: boolean;
};

/**
 * Упрощенная версия поста (для списков)
 */
export interface PostPreview {
  id: string
  content: string
  contentSpoiler: boolean
  mediaCount: number
  firstMediaUrl?: string
  authorId: string
  authorName?: string
  authorAvatar?: string
  likesCount: number
  commentsCount: number
  viewsCount: number
  createdAt: string
}

/**
 * Пост с расширенной информацией (для детальной страницы)
 */
export interface PostDetailed extends Post {
  author: User & {
    followersCount: number
    followingCount: number
    postsCount: number
  }
  relatedPosts?: PostPreview[]
}

/**
 * DTO для создания поста
 */
export interface CreatePostDto {
  content: string
  contentSpoiler?: boolean
  emojiUrls?: string[]
  mediaSpoilers?: number[]
}

/**
 * DTO для обновления поста
 */
export interface UpdatePostDto {
  content?: string
  contentSpoiler?: boolean
  emojiUrls?: string[]
}

/**
 * Параметры для создания временного поста (оптимистичное обновление)
 */
export interface TempPostParams {
  content: string
  contentSpoiler?: boolean
  mediaUrls?: string[]
  emojiUrls?: string[]
  currentUser: User
}

/**
 * Ответ при добавлении просмотра
 */
export interface AddViewResponse {
  message: string
  viewsCount: number
}

/**
 * DTO для создания комментария
 */
export interface CreateCommentDto {
  userId?: string
  postId: string
  content: string
  emojiUrls?: string[]
  replyToId?: string // Для создания ответов на комментарии
}

/**
 * Фильтры для постов
 */
export interface PostFilters {
  authorId?: string
  hasMedia?: boolean
  hasSpoiler?: boolean
  fromDate?: string
  toDate?: string
  sortBy?: 'recent' | 'popular' | 'trending'
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  page: number
  limit: number
}

/**
 * Ответ с пагинацией
 */
export interface PaginatedPostsResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

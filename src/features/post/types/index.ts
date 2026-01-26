/**
 * Централизованный экспорт типов для фичи постов
 * 
 * @module features/post/types
 */

// Медиа типы
export type {
  MediaFile,
  MediaFileDto,
  MediaPreviewData,
  MediaLimits,
} from './media.types'

export {
  MediaType,
  DEFAULT_MEDIA_LIMITS,
  MediaUtils,
} from './media.types'

// Пост типы
export type {
  Post,
  PostPreview,
  PostDetailed,
  Like,
  Comment,
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
  TempPostParams,
  AddViewResponse,
  PostFilters,
  PaginationParams,
  PaginatedPostsResponse,
} from './post.types'

// Для обратной совместимости - экспортируем User
export type { User } from '@/src/types/types'

/**
 * DTO для добавления просмотров батчем
 */
export interface AddViewsBatchResponse {
	message: string
	processedCount: number
	postIds: string[]
}



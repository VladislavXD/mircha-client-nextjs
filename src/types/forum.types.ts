import type { Board, Thread, Reply } from "@/src/types/types"

// Категории
export interface Category {
  id: string
  name: string
  slug: string
  imageUrl?: string
  icon?: string
  color?: string
  description?: string
  parentId?: string | null
  parent?: Category | null
  children?: Category[]
  group?: string | null
  createdAt: string
  updatedAt: string
  _count?: { threads: number }
}

// Теги
export interface Tag {
  id: string
  name: string
  slug: string
  icon?: string
  color?: string
  description?: string
  createdAt: string
  _count?: { threadTags: number }
}

// Сводная статистика форума
export interface ForumStats {
  boards: number
  threads: number
  replies: number
  media: number
  images: number
  videos: number
  categories: number
  tags: number
  lastActivity: string | null
}

// Элемент списка последних тредов
export interface LatestThreadItem extends Pick<Thread,
  'id' | 'shortId' | 'slug' | 'subject' | 'content' | 'imageUrl' | 'thumbnailUrl' |
  'mediaFiles' | 'createdAt' | '_count' | 'replyCount' | 'categoryId'
> {
  lastReplyAuthorName?: string | null
  lastReplyAuthorTrip?: string | null
  lastReplyAt?: string
  board?: { name: string; title: string; isNsfw: boolean } | null
  category?: { id: string; name: string; slug: string } | null
  tags?: Tag[]
}

// Пагинации для разных ответов API
export interface LatestPostsPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface BoardThreadsPagination {
  page: number
  totalPages: number
  totalThreads: number
}

// Ответы API
export interface LatestPostsResponse {
  items: LatestThreadItem[]
  pagination: LatestPostsPagination
}

export interface BoardThreadsResponse {
  board: Board
  threads: Thread[]
  pagination: BoardThreadsPagination
}

export interface BoardInfoResponse extends Board {
  stats: {
    totalThreads: number
    totalReplies: number
    totalImages: number
    lastActivity: string | null
  }
}

export interface CategoryThreadsResponse {
  category: Pick<Category, 'id' | 'name' | 'slug' | 'color'>
  threads: Thread[]
  pagination: LatestPostsPagination
}

// ---------- Requests (query/mutation args) ----------
export type BoardName = string
export type CategorySlug = string
export type ThreadId = string
export type ThreadSlug = string

export interface LatestPostsQuery {
  page?: number
  limit?: number
  board?: string
  category?: string
  tag?: string
  nsfw?: '0' | '1'
}

export interface CategoryThreadsQuery {
  slug: CategorySlug
  tag?: string
  page?: number
  limit?: number
}

export interface BoardThreadsQuery {
  boardName: BoardName
  page?: number
  tag?: string
}

export interface GetThreadQuery {
  boardName: BoardName
  threadId: ThreadId
}

export interface GetThreadByCategoryAndSlugQuery {
  categorySlug: CategorySlug
  threadSlug: ThreadSlug
}

export interface CreateThreadRequest {
  boardName: BoardName
  formData: FormData
}

export interface CreateThreadInCategoryRequest {
  slug: CategorySlug
  formData: FormData
}

export interface CreateReplyRequest {
  boardName: BoardName
  threadId: ThreadId
  formData: FormData
}

export interface CreateReplyInCategoryRequest {
  categorySlug: CategorySlug
  threadId: ThreadId
  formData: FormData
}

export interface AssignTagToThreadRequest {
  threadId: ThreadId
  tagSlug: string
}

export interface UpdateBoardRequest {
  boardName: BoardName
  data: Partial<Board>
}

export interface DeleteThreadRequest {
  boardName: BoardName
  threadId: ThreadId
}

export interface DeleteReplyRequest {
  boardName: BoardName
  replyId: string
}

// ---------- Mutation responses ----------
export interface AssignTagToThreadResponse {
  id: string
  threadId: string
  tagId: string
}

export interface CreateBoardResponse {
  message: string
  board: Board
}

export type UpdateBoardResponse = CreateBoardResponse
export type DeactivateBoardResponse = CreateBoardResponse

export interface DeleteThreadResponse {
  message: string
  deletedMediaCount: number
}

export interface DeleteReplyResponse {
  message: string
}

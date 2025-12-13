// RTK Query service - DEPRECATED, migrate to features/forum
import { api } from "@/src/services/api.old"
import type { Board, Thread, Reply } from "@/src/types/types"
import type {
  Category,
  Tag,
  ForumStats,
  LatestThreadItem,
  LatestPostsResponse,
  BoardThreadsResponse,
  BoardInfoResponse,
  CategoryThreadsResponse,
  LatestPostsQuery,
  CategoryThreadsQuery,
  BoardThreadsQuery,
  GetThreadQuery,
  GetThreadByCategoryAndSlugQuery,
  CreateThreadRequest,
  CreateThreadInCategoryRequest,
  CreateReplyRequest,
  CreateReplyInCategoryRequest,
  AssignTagToThreadRequest,
  AssignTagToThreadResponse,
  CreateBoardResponse,
  UpdateBoardRequest,
  UpdateBoardResponse,
  DeleteThreadRequest,
  DeleteThreadResponse,
  DeleteReplyRequest,
  DeleteReplyResponse
} from "@/src/types/forum.types"

export type {
  Category,
  Tag,
  ForumStats,
  LatestThreadItem,
  LatestPostsResponse,
  BoardThreadsResponse,
  BoardInfoResponse,
  CategoryThreadsResponse,
  LatestPostsQuery,
  CategoryThreadsQuery,
  BoardThreadsQuery,
  GetThreadQuery,
  GetThreadByCategoryAndSlugQuery,
  CreateThreadRequest,
  CreateThreadInCategoryRequest,
  CreateReplyRequest,
  CreateReplyInCategoryRequest,
  AssignTagToThreadRequest,
  AssignTagToThreadResponse,
  CreateBoardResponse,
  UpdateBoardRequest,
  UpdateBoardResponse,
  DeleteThreadRequest,
  DeleteThreadResponse,
  DeleteReplyRequest,
  DeleteReplyResponse
}



export const forumApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // -------- Последние посты (OP тредов) --------
    getLatestPosts: builder.query<LatestPostsResponse, LatestPostsQuery>({
      query: ({ page = 1, limit = 20, board, category, tag, nsfw } = {}) => {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('limit', String(limit))
        if (board) params.set('board', board)
        if (category) params.set('category', category)
        if (tag) params.set('tag', tag)
        if (nsfw) params.set('nsfw', nsfw)
        return { url: `/forum/posts/latest?${params.toString()}`, method: 'GET' }
      },
      providesTags: (result) =>
        result && result.items
          ? [
              ...result.items.map((t) => ({ type: 'Thread' as const, id: t.id })),
              { type: 'Thread' as const, id: 'LATEST' }
            ]
          : [{ type: 'Thread' as const, id: 'LATEST' }]
    }),
    // -------- Сводная статистика форума --------
    getForumStats: builder.query<ForumStats, void>({
      query: () => ({ url: '/forum/stats', method: 'GET' }),
      providesTags: ['Board', 'Category', 'Thread', 'Reply', 'Tag']
    }),
    // -------- Категории и теги --------
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/forum/categories', method: 'GET' }),
      providesTags: ['Category']
    }),
    getCategory: builder.query<Category, string>({
      query: (slug) => ({ url: `/forum/categories/${slug}`, method: 'GET' }),
      providesTags: (r, e, slug) => [{ type: 'Category', id: slug }]
    }),
  getCategoryThreads: builder.query<CategoryThreadsResponse, CategoryThreadsQuery>({
      query: ({ slug, tag, page = 1, limit = 10 }) => ({
        url: `/forum/categories/${slug}/threads${tag ? `?tag=${encodeURIComponent(tag)}&page=${page}&limit=${limit}` : `?page=${page}&limit=${limit}`}`,
        method: 'GET'
      }),
      providesTags: (r, e, { slug }) => [{ type: 'Category', id: slug }, 'Thread']
    }),
    createCategory: builder.mutation<Category, FormData>({
      query: (formData) => ({ url: '/forum/categories', method: 'POST', body: formData }),
      invalidatesTags: ['Category']
    }),
    createTag: builder.mutation<Tag, FormData>({
      query: (formData) => ({ url: '/forum/tags', method: 'POST', body: formData }),
      invalidatesTags: ['Tag']
    }),
    assignTagToThread: builder.mutation<AssignTagToThreadResponse, AssignTagToThreadRequest>({
      query: ({ threadId, tagSlug }) => ({ url: `/forum/threads/${threadId}/tags/${tagSlug}`, method: 'POST' }),
      invalidatesTags: (r, e, { threadId }) => [{ type: 'Thread', id: threadId }]
    }),
    getTags: builder.query<Tag[], void>({
      query: () => ({ url: '/forum/tags', method: 'GET' }),
      providesTags: ['Tag']
    }),
    // Получить все борды
    getBoards: builder.query<Board[], void>({
      query: () => ({
        url: '/forum/boards',
        method: 'GET'
      }),
      providesTags: ['Board']
    }),

    // Получить информацию о борде
    getBoardInfo: builder.query<BoardInfoResponse, string>({
      query: (boardName) => ({
        url: `/forum/boards/${boardName}/info`,
        method: 'GET'
      }),
      providesTags: (result, error, boardName) => [
        { type: 'Board', id: boardName }
      ]
    }),

    // Получить борд по имени
    getBoardByName: builder.query<Board, string>({
      query: (boardName) => ({
        url: `/forum/boards/${boardName}`,
        method: 'GET'
      }),
      providesTags: (result, error, boardName) => [
        { type: 'Board', id: boardName }
      ]
    }),

    // Получить треды борда (упрощённая версия)
    getThreads: builder.query<Thread[], string>({
      query: (boardName) => ({
        url: `/forum/boards/${boardName}/threads`,
        method: 'GET'
      }),
      providesTags: (result, error, boardName) => [
        { type: 'Thread', id: `${boardName}-threads` }
      ]
    }),

    // Получить треды борда
    getBoardThreads: builder.query<BoardThreadsResponse, BoardThreadsQuery>({
      query: ({ boardName, page = 1, tag }) => ({
        url: `/forum/boards/${boardName}/full?page=${page}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`,
        method: 'GET'
      }),
      providesTags: (result, error, { boardName }) => [
        { type: 'Thread', id: `${boardName}-threads` },
        { type: 'Board', id: boardName }
      ]
    }),

    // Получить конкретный тред
    getThread: builder.query<Thread, GetThreadQuery>({
      query: ({ boardName, threadId }) => ({
        url: `/forum/boards/${boardName}/threads/${threadId}`,
        method: 'GET'
      }),
      providesTags: (result, error, { threadId }) => [
        { type: 'Thread', id: threadId },
        { type: 'Reply', id: `${threadId}-replies` }
      ]
    }),

    // Создать новый борд
    createBoard: builder.mutation<CreateBoardResponse, Partial<Board>>({
      query: (boardData) => ({
        url: '/forum/boards',
        method: 'POST',
        body: boardData
      }),
      invalidatesTags: ['Board']
    }),

    // Создать новый тред (в борде)
    createThread: builder.mutation<Thread, CreateThreadRequest>({
      query: ({ boardName, formData }) => ({
        url: `/forum/boards/${boardName}/threads`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: (result, error, { boardName }) => [
        { type: 'Thread', id: `${boardName}-threads` },
        { type: 'Board', id: boardName }
      ]
    }),

    // Создать тред (в категории)
    createThreadInCategory: builder.mutation<Thread, CreateThreadInCategoryRequest>({
      query: ({ slug, formData }) => ({
        url: `/forum/categories/${slug}/threads`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: (r, e, { slug }) => [{ type: 'Category', id: slug }, 'Thread']
    }),

    // Создать ответ в треде (в борде)
    createReply: builder.mutation<Reply, CreateReplyRequest>({
      query: ({ boardName, threadId, formData }) => ({
        url: `/forum/boards/${boardName}/threads/${threadId}/replies`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: (result, error, { threadId }) => [
        { type: 'Thread', id: threadId },
        { type: 'Reply', id: `${threadId}-replies` }
      ]
    }),

    // Создать ответ в треде (в категории)
    createReplyInCategory: builder.mutation<Reply, CreateReplyInCategoryRequest>({
      query: ({ categorySlug, threadId, formData }) => ({
        url: `/forum/categories/${categorySlug}/threads/${threadId}/replies`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: (r, e, { threadId, categorySlug }) => [
        { type: 'Thread', id: threadId },
        { type: 'Category', id: categorySlug },
        { type: 'Reply', id: `${threadId}-replies` }
      ]
    }),

    // Получить тред по категории и slug
    getThreadByCategoryAndSlug: builder.query<Thread, GetThreadByCategoryAndSlugQuery>({
      query: ({ categorySlug, threadSlug }) => ({
        url: `/forum/categories/${categorySlug}/threads/${threadSlug}`,
        method: 'GET'
      }),
      providesTags: (result, error, { categorySlug, threadSlug }) => [
        { type: 'Thread', id: `${categorySlug}-${threadSlug}` }
      ]
    }),

    // Обновить настройки борда
    updateBoard: builder.mutation<UpdateBoardResponse, UpdateBoardRequest>({
      query: ({ boardName, data }) => ({
        url: `/forum/boards/${boardName}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { boardName }) => [
        { type: 'Board', id: boardName },
        'Board'
      ]
    }),

    // Деактивировать борд
    deactivateBoard: builder.mutation<UpdateBoardResponse, string>({
      query: (boardName) => ({
        url: `/forum/boards/${boardName}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Board']
    }),

    // Удалить тред
    deleteThread: builder.mutation<DeleteThreadResponse, DeleteThreadRequest>({
      query: ({ boardName, threadId }) => ({
        url: `/forum/boards/${boardName}/threads/${threadId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { boardName, threadId }) => [
        { type: 'Thread', id: `${boardName}-threads` },
        { type: 'Thread', id: threadId }
      ]
    }),

    // Удалить ответ
    deleteReply: builder.mutation<DeleteReplyResponse, DeleteReplyRequest>({
      query: ({ boardName, replyId }) => ({
        url: `/forum/boards/${boardName}/replies/${replyId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { replyId }) => [
        { type: 'Reply', id: replyId }
      ]
    })
    
   
  })
})

export const {
  useGetLatestPostsQuery,
  useGetForumStatsQuery,
  // Категории и теги
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetCategoryThreadsQuery,
  useCreateCategoryMutation,
  useCreateTagMutation,
  useAssignTagToThreadMutation,
  useGetTagsQuery,
  useGetThreadByCategoryAndSlugQuery,
  useGetBoardsQuery,
  useGetBoardInfoQuery,
  useGetBoardByNameQuery,
  useGetThreadsQuery,
  useGetBoardThreadsQuery,
  useGetThreadQuery,
  useCreateBoardMutation,
  useCreateThreadMutation,
  useCreateThreadInCategoryMutation,
  useCreateReplyMutation,
  useCreateReplyInCategoryMutation,
  useUpdateBoardMutation,
  useDeactivateBoardMutation,
  useDeleteThreadMutation,
  useDeleteReplyMutation
} = forumApi

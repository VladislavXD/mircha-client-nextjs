import { api } from "@/src/services/api"
import type { Board, Thread, Reply } from "@/src/types/types"

// Типы для API ответов
interface BoardThreadsResponse {
  board: Board
  threads: Thread[]
  pagination: {
    page: number
    totalPages: number
    totalThreads: number
  }
}

interface BoardInfoResponse extends Board {
  stats: {
    totalThreads: number
    totalReplies: number
    totalImages: number
    lastActivity: string | null
  }
}

export const forumApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
    getBoardThreads: builder.query<BoardThreadsResponse, { boardName: string; page?: number }>({
      query: ({ boardName, page = 1 }) => ({
        url: `/forum/boards/${boardName}?page=${page}`,
        method: 'GET'
      }),
      providesTags: (result, error, { boardName }) => [
        { type: 'Thread', id: `${boardName}-threads` },
        { type: 'Board', id: boardName }
      ]
    }),

    // Получить конкретный тред
    getThread: builder.query<Thread, { boardName: string; threadId: string }>({
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
    createBoard: builder.mutation<{ message: string; board: Board }, Partial<Board>>({
      query: (boardData) => ({
        url: '/forum/boards',
        method: 'POST',
        body: boardData
      }),
      invalidatesTags: ['Board']
    }),

    // Создать новый тред
    createThread: builder.mutation<Thread, { 
      boardName: string; 
      formData: FormData 
    }>({
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

    // Создать ответ в треде
    createReply: builder.mutation<Reply, { 
      boardName: string; 
      threadId: string; 
      formData: FormData 
    }>({
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

    // Обновить настройки борда
    updateBoard: builder.mutation<{ message: string; board: Board }, { 
      boardName: string; 
      data: Partial<Board> 
    }>({
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
    deactivateBoard: builder.mutation<{ message: string; board: Board }, string>({
      query: (boardName) => ({
        url: `/forum/boards/${boardName}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Board']
    }),

    // Удалить тред
    deleteThread: builder.mutation<{ message: string; deletedMediaCount: number }, { 
      boardName: string; 
      threadId: string 
    }>({
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
    deleteReply: builder.mutation<{ message: string }, { 
      boardName: string; 
      replyId: string 
    }>({
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
  useGetBoardsQuery,
  useGetBoardInfoQuery,
  useGetBoardByNameQuery,
  useGetThreadsQuery,
  useGetBoardThreadsQuery,
  useGetThreadQuery,
  useCreateBoardMutation,
  useCreateThreadMutation,
  useCreateReplyMutation,
  useUpdateBoardMutation,
  useDeactivateBoardMutation,
  useDeleteThreadMutation,
  useDeleteReplyMutation
} = forumApi

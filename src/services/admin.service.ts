import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "@/src/constants/api.url"
import type { RootState } from "@/src/store/store"

const adminBaseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/admin`,
  prepareHeaders: (headers: Headers, {getState}: { getState: () => unknown }) => {
      const token = (getState() as RootState).user.token || localStorage.getItem('token')
      if (token){
          headers.set('authorization', `Bearer ${token}`)
      }
      return headers
  }
})

const adminBaseQueryRetry = retry(adminBaseQuery, { maxRetries: 1 })

// Типы для админ API
export interface AdminUser {
  id: string
  username: string
  email: string
  role: 'ADMIN' | 'MODERATOR' | 'USER'
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    posts: number
    replies: number
  }
}

export interface AdminBoard {
  id: string
  name: string
  title: string
  description: string
  shortName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    threads: number
  }
}

export interface AdminThread {
  id: string
  shortId: string
  title?: string
  content: string
  author?: {
    username: string
  }
  authorIp?: string
  board?: {
    shortId: string
    name: string
  }
  isPinned: boolean
  isLocked: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  repliesCount: number
  imageCount: number
  _count?: {
    replies: number
  }
}

export interface AdminReply {
  id: string
  shortId: string
  content: string
  author?: {
    username: string
  }
  authorIp?: string
  thread?: {
    shortId: string
    title?: string
  }
  parentReply?: {
    shortId: string
    content: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
  imageCount: number
  media?: AdminMediaFile[]
}

export interface AdminMediaFile {
  id: string
  type: string
  url: string
  thumbnailUrl?: string
  filename: string
  originalName: string
  size: number
  cloudinaryId: string
  createdAt: string
  thread?: {
    shortId: string
    title?: string
  }
  reply?: {
    shortId: string
    content: string
  }
}

export interface AdminStats {
  users: {
    total: number
    active: number
    admins: number
    moderators: number
  }
  boards: {
    total: number
    active: number
  }
  threads: {
    total: number
    today: number
  }
  replies: {
    total: number
    today: number
  }
  media: {
    total: number
    totalSize: number
  }
}

export interface UsersFilter {
  role?: string
  isActive?: string
  search?: string
  page?: number
  limit?: number
}

export interface BoardsFilter {
  isActive?: string
  search?: string
  page?: number
  limit?: number
}

export interface ThreadsFilter {
  boardShortId?: string
  authorUsername?: string
  isPinned?: boolean
  isLocked?: boolean
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface RepliesFilter {
  threadShortId?: string
  authorUsername?: string
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface MediaFilter {
  type?: string
  threadShortId?: string
  replyShortId?: string
  search?: string
  page?: number
  limit?: number
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role?: 'ADMIN' | 'MODERATOR' | 'USER'
  isActive?: boolean
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  password?: string
  role?: 'ADMIN' | 'MODERATOR' | 'USER'
  isActive?: boolean
}

export interface CreateBoardRequest {
  name: string
  title: string
  description?: string
  isNsfw?: boolean
  maxFileSize?: number
  allowedFileTypes?: string[]
  postsPerPage?: number
  threadsPerPage?: number
  bumpLimit?: number
  imageLimit?: number
}

export interface UpdateBoardRequest {
  name?: string
  title?: string
  description?: string
  shortName?: string
  isActive?: boolean
}

export interface UpdateThreadRequest {
  title?: string
  content?: string
  isPinned?: boolean
  isLocked?: boolean
  isActive?: boolean
}

export interface UpdateReplyRequest {
  content?: string
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: adminBaseQueryRetry,
  refetchOnMountOrArgChange: true,
  tagTypes: ['AdminUser', 'AdminBoard', 'AdminThread', 'AdminReply', 'AdminMedia', 'AdminStats'],
  endpoints: (builder) => ({
    // Статистика
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/stats',
      providesTags: ['AdminStats'],
    }),

    // Пользователи
    getAdminUsers: builder.query<{ users: AdminUser[], total: number, page: number, totalPages: number }, UsersFilter>({
      query: (filters = {}) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value))
          }
        })
        return `/users?${params.toString()}`
      },
      providesTags: (result) =>
        result && result.users && Array.isArray(result.users)
          ? [
              ...result.users.map(({ id }) => ({ type: 'AdminUser' as const, id })),
              { type: 'AdminUser', id: 'LIST' },
            ]
          : [{ type: 'AdminUser', id: 'LIST' }],
    }),

    getAdminUserById: builder.query<AdminUser, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminUser', id }],
    }),

    createAdminUser: builder.mutation<AdminUser, CreateUserRequest>({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }, 'AdminStats'],
    }),

    updateAdminUser: builder.mutation<AdminUser, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminUser', id },
        { type: 'AdminUser', id: 'LIST' },
        'AdminStats'
      ],
    }),

    deleteAdminUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AdminUser', id },
        { type: 'AdminUser', id: 'LIST' },
        'AdminStats'
      ],
    }),

    // Борды
    getAdminBoards: builder.query<{ boards: AdminBoard[], total: number, page: number, totalPages: number }, BoardsFilter>({
      query: (filters = {}) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value))
          }
        })
        return `/boards?${params.toString()}`
      },
      providesTags: (result) =>
        result && result.boards && Array.isArray(result.boards)
          ? [
              ...result.boards.map(({ id }) => ({ type: 'AdminBoard' as const, id })),
              { type: 'AdminBoard', id: 'LIST' },
            ]
          : [{ type: 'AdminBoard', id: 'LIST' }],
    }),

    getAdminBoardById: builder.query<AdminBoard, string>({
      query: (id) => `/boards/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminBoard', id }],
    }),

    createAdminBoard: builder.mutation<AdminBoard, CreateBoardRequest>({
      query: (newBoard) => ({
        url: '/boards',
        method: 'POST',
        body: newBoard,
      }),
      transformResponse: (response: { message: string; board: AdminBoard }) => response.board,
      invalidatesTags: [{ type: 'AdminBoard', id: 'LIST' }, 'AdminStats'],
    }),

    updateAdminBoard: builder.mutation<AdminBoard, { id: string; data: UpdateBoardRequest }>({
      query: ({ id, data }) => ({
        url: `/boards/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminBoard', id },
        { type: 'AdminBoard', id: 'LIST' },
        'AdminStats'
      ],
    }),

    deleteAdminBoard: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AdminBoard', id },
        { type: 'AdminBoard', id: 'LIST' },
        'AdminStats'
      ],
    }),

    // Треды
    getAdminThreads: builder.query<{ threads: AdminThread[], total: number, page: number, totalPages: number }, ThreadsFilter>({
      query: (filters = {}) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value))
          }
        })
        return `/threads?${params.toString()}`
      },
      providesTags: (result) =>
        result && result.threads && Array.isArray(result.threads)
          ? [
              ...result.threads.map(({ id }) => ({ type: 'AdminThread' as const, id })),
              { type: 'AdminThread', id: 'LIST' },
            ]
          : [{ type: 'AdminThread', id: 'LIST' }],
    }),

    getAdminThreadById: builder.query<AdminThread, string>({
      query: (id) => `/threads/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminThread', id }],
    }),

    updateAdminThread: builder.mutation<AdminThread, { id: string; data: UpdateThreadRequest }>({
      query: ({ id, data }) => ({
        url: `/threads/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminThread', id },
        { type: 'AdminThread', id: 'LIST' },
        'AdminStats'
      ],
    }),

    deleteAdminThread: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/threads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AdminThread', id },
        { type: 'AdminThread', id: 'LIST' },
        'AdminStats'
      ],
    }),

    // Ответы
    getAdminReplies: builder.query<{ replies: AdminReply[], total: number, page: number, totalPages: number }, RepliesFilter>({
      query: (filters = {}) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value))
          }
        })
        return `/replies?${params.toString()}`
      },
      providesTags: (result) =>
        result && result.replies && Array.isArray(result.replies)
          ? [
              ...result.replies.map(({ id }) => ({ type: 'AdminReply' as const, id })),
              { type: 'AdminReply', id: 'LIST' },
            ]
          : [{ type: 'AdminReply', id: 'LIST' }],
    }),

    getAdminReplyById: builder.query<AdminReply, string>({
      query: (id) => `/replies/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminReply', id }],
    }),

    updateAdminReply: builder.mutation<AdminReply, { id: string; data: UpdateReplyRequest }>({
      query: ({ id, data }) => ({
        url: `/replies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminReply', id },
        { type: 'AdminReply', id: 'LIST' },
        'AdminStats'
      ],
    }),

    deleteAdminReply: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/replies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AdminReply', id },
        { type: 'AdminReply', id: 'LIST' },
        'AdminStats'
      ],
    }),

    // Медиа
    getAdminMedia: builder.query<{ media: AdminMediaFile[], total: number, page: number, totalPages: number }, MediaFilter>({
      query: (filters = {}) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value))
          }
        })
        return `/media?${params.toString()}`
      },
      providesTags: ['AdminMedia'],
    }),

    deleteAdminMedia: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminMedia', 'AdminStats'],
    }),
  }),
})

// Экспорт хуков
export const {
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAdminBoardsQuery,
  useGetAdminBoardByIdQuery,
  useCreateAdminBoardMutation,
  useUpdateAdminBoardMutation,
  useDeleteAdminBoardMutation,
  useGetAdminThreadsQuery,
  useGetAdminThreadByIdQuery,
  useUpdateAdminThreadMutation,
  useDeleteAdminThreadMutation,
  useGetAdminRepliesQuery,
  useGetAdminReplyByIdQuery,
  useUpdateAdminReplyMutation,
  useDeleteAdminReplyMutation,
  useGetAdminMediaQuery,
  useDeleteAdminMediaMutation,
} = adminApi

// Экспорт типов для совместимости
export type User = AdminUser
export type Board = AdminBoard
export type Thread = AdminThread
export type Reply = AdminReply
export type MediaFile = AdminMediaFile

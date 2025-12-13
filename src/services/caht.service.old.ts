import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants/api.url';
import { RootState } from '../store/storeOld';

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  otherParticipant?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    lastSeen?: string;
  };
  unreadCount: number;
  isOnline: boolean;
  messages?: Message[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface ChatMessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.user.token || localStorage.getItem('token');
      console.log('ChatAPI token:', token ? 'Token exists' : 'No token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Chat', 'Message'],
  endpoints: (builder) => ({
    // Получить все чаты пользователя
    getUserChats: builder.query<Chat[], void>({
      query: () => '/chats',
      providesTags: ['Chat'],
      // Принудительно обновляем данные при каждом запросе
      keepUnusedDataFor: 0,
    }),

    // Получить или создать чат с пользователем
    getOrCreateChat: builder.query<Chat, string>({
      query: (otherUserId) => `/chats/${otherUserId}`,
      providesTags: (result, error, otherUserId) => [{ type: 'Chat', id: otherUserId }],
    }),

    // Получить сообщения чата с пагинацией
    getChatMessages: builder.query<ChatMessagesResponse, { chatId: string; page?: number; limit?: number }>({
      query: ({ chatId, page = 1, limit = 50 }) => 
        `/chats/${chatId}/messages?page=${page}&limit=${limit}`,
      providesTags: (result, error, { chatId }) => [{ type: 'Message', id: chatId }],
    }),

    // Отметить сообщения как прочитанные
    markMessagesAsRead: builder.mutation<{ message: string; count: number }, string>({
      query: (chatId) => ({
        url: `/chats/${chatId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, chatId) => [
        { type: 'Chat' },
        { type: 'Message', id: chatId }
      ],
    }),

    // Удалить чат
    deleteChat: builder.mutation<{ message: string }, string>({
      query: (chatId) => ({
        url: `/chats/${chatId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chat'],
    }),
  }),
});

export const {
  useGetUserChatsQuery,
  useLazyGetOrCreateChatQuery,
  useGetChatMessagesQuery,
  useMarkMessagesAsReadMutation,
  useDeleteChatMutation,
} = chatApi;

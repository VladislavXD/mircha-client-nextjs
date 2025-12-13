import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import type { Chat, GetMessagesResponse, GetMessagesParams } from "../types";

/**
 * Query keys для чатов
 */
export const chatKeys = {
  all: ["chats"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  list: (filters?: any) => [...chatKeys.lists(), { filters }] as const,
  details: () => [...chatKeys.all, "detail"] as const,
  detail: (id: string) => [...chatKeys.details(), id] as const,
  messages: (chatId: string) => [...chatKeys.detail(chatId), "messages"] as const,
  messagesList: (chatId: string, params?: GetMessagesParams) =>
    [...chatKeys.messages(chatId), params] as const,
};

/**
 * Хук для получения списка всех чатов пользователя
 * 
 * @param options - Опции React Query
 * @returns Список чатов с информацией о собеседниках
 * 
 * @example
 * const { data: chats, isLoading } = useGetUserChats()
 */
export function useGetUserChats(
  options?: Omit<UseQueryOptions<Chat[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<Chat[], Error>({
    queryKey: chatKeys.lists(),
    queryFn: () => chatService.getUserChats(),
    staleTime: 30 * 1000, // 30 секунд
    ...options,
  });
}

/**
 * Хук для получения или создания чата с пользователем
 * 
 * @param otherUserId - ID собеседника
 * @param options - Опции React Query
 * @returns Чат с сообщениями
 * 
 * @example
 * const { data: chat } = useGetOrCreateChat('user-id')
 */
export function useGetOrCreateChat(
  otherUserId: string,
  options?: Omit<UseQueryOptions<Chat, Error>, "queryKey" | "queryFn">
) {
  return useQuery<Chat, Error>({
    queryKey: chatKeys.detail(otherUserId),
    queryFn: () => chatService.getOrCreateChat(otherUserId),
    enabled: !!otherUserId,
    staleTime: 10 * 1000, // 10 секунд
    ...options,
  });
}

/**
 * Хук для получения сообщений чата с пагинацией
 * 
 * @param chatId - ID чата
 * @param params - Параметры пагинации
 * @param options - Опции React Query
 * @returns Сообщения с пагинацией
 * 
 * @example
 * const { data, fetchNextPage, hasNextPage } = useGetChatMessages(chatId, { page: 1, limit: 50 })
 */
export function useGetChatMessages(
  chatId: string,
  params?: GetMessagesParams,
  options?: Omit<UseQueryOptions<GetMessagesResponse, Error>, "queryKey" | "queryFn">
) {
  return useQuery<GetMessagesResponse, Error>({
    queryKey: chatKeys.messagesList(chatId, params),
    queryFn: () => chatService.getChatMessages(chatId, params),
    enabled: !!chatId,
    staleTime: 5 * 1000, // 5 секунд
    ...options,
  });
}

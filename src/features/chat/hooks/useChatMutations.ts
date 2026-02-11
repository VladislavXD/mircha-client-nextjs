import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { chatService } from "../services/chat.service";
import { chatKeys } from "./useChatQueries";
import type { MarkAsReadResponse, DeleteChatResponse } from "../types";

/**
 * Хук для пометки сообщений как прочитанных
 * 
 * @param options - Опции React Query
 * @returns Мутация для пометки сообщений
 * 
 * @example
 * const { mutate: markAsRead } = useMarkMessagesAsRead()
 * markAsRead(chatId)
 */
export function useMarkMessagesAsRead(
  options?: Omit<
    UseMutationOptions<MarkAsReadResponse, Error, string>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation<MarkAsReadResponse, Error, string>({
    mutationFn: (chatId: string) => chatService.markMessagesAsRead(chatId),
    onSuccess: (data, chatId) => {
      // Обновляем список чатов (уменьшаем счетчик непрочитанных)
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      
      // Обновляем детали чата
      queryClient.invalidateQueries({ queryKey: chatKeys.detail(chatId) });
      
      // Обновляем сообщения чата
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(chatId) });
    },
    onError: (error) => {
      console.error("Ошибка при пометке сообщений как прочитанных:", error);
      toast.error("Не удалось отметить сообщения как прочитанные");
    },
    ...options,
  });
}

/**
 * Хук для удаления чата
 * 
 * @param options - Опции React Query
 * @returns Мутация для удаления чата
 * 
 * @example
 * const { mutate: deleteChat, isPending } = useDeleteChat()
 * deleteChat(chatId, {
 *   onSuccess: () => router.push('/messages')
 * })
 */
export function useDeleteChat(
  options?: Omit<
    UseMutationOptions<DeleteChatResponse, Error, string, { previousChats?: any }>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();

  return useMutation<DeleteChatResponse, Error, string, { previousChats?: any }>({
    mutationFn: (chatId: string) => chatService.deleteChat(chatId),
    onMutate: async (chatId) => {
      // Отменяем текущие запросы
      await queryClient.cancelQueries({ queryKey: chatKeys.lists() });

      // Получаем предыдущие данные для отката
      const previousChats = queryClient.getQueryData(chatKeys.lists());

      // Оптимистично удаляем чат из списка
      queryClient.setQueryData(chatKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.filter((chat: any) => chat.id !== chatId);
      });

      return { previousChats };
    },
    onSuccess: (data, chatId) => {
      // Удаляем детали чата из кэша
      queryClient.removeQueries({ queryKey: chatKeys.detail(chatId) });
      
      // Удаляем сообщения чата из кэша
      queryClient.removeQueries({ queryKey: chatKeys.messages(chatId) });
      
      // Обновляем список чатов
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      
      toast.success("Чат успешно удалён");
    },
    onError: (error, chatId, context) => {
      // Откатываем оптимистичное обновление
      if (context?.previousChats) {
        queryClient.setQueryData(chatKeys.lists(), context.previousChats);
      }
      
      console.error("Ошибка при удалении чата:", error);
      toast.error("Не удалось удалить чат");
    },
    onSettled: () => {
      // Гарантируем обновление списка чатов
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
    ...options,
  });
}

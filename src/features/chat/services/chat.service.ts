import { api } from "@/src/api";
import type {
  Chat,
  GetMessagesResponse,
  GetMessagesParams,
  MarkAsReadResponse,
  DeleteChatResponse,
} from "../types";

/**
 * Chat Service - API для работы с чатами
 * 
 * Endpoints:
 * - GET /chats - Список всех чатов пользователя
 * - GET /chats/:otherUserId - Получить/создать чат с пользователем
 * - GET /chats/:chatId/messages - Получить сообщения с пагинацией
 * - PUT /chats/:chatId/read - Отметить сообщения как прочитанные
 * - DELETE /chats/:chatId - Удалить чат
 */
class ChatService {
  /**
   * Получить список всех чатов пользователя
   * Возвращает чаты с последним сообщением, информацией о собеседнике,
   * количеством непрочитанных сообщений и статусом онлайн
   * 
   * @returns Список чатов
   */
  async getUserChats(): Promise<Chat[]> {
    return api.get<Chat[]>("chats");
  }

  /**
   * Получить или создать чат с пользователем
   * Если чат уже существует - возвращает его,
   * если нет - создает новый
   * 
   * @param otherUserId - ID собеседника
   * @returns Чат с последними 50 сообщениями
   */
  async getOrCreateChat(otherUserId: string): Promise<Chat> {
    return api.get<Chat>(`chats/${otherUserId}`);
  }

  /**
   * Получить сообщения чата с пагинацией
   * 
   * @param chatId - ID чата
   * @param params - Параметры пагинации (page, limit)
   * @returns Сообщения с информацией о пагинации
   */
  async getChatMessages(
    chatId: string,
    params?: GetMessagesParams
  ): Promise<GetMessagesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    const queryString = searchParams.toString();
    const url = `chats/${chatId}/messages${queryString ? `?${queryString}` : ""}`;

    return api.get<GetMessagesResponse>(url);
  }

  /**
   * Отметить все непрочитанные сообщения в чате как прочитанные
   * 
   * @param chatId - ID чата
   * @returns Количество обновленных сообщений
   */
  async markMessagesAsRead(chatId: string): Promise<MarkAsReadResponse> {
    return api.put<MarkAsReadResponse>(`chats/${chatId}/read`, {});
  }

  /**
   * Удалить чат
   * Все сообщения удалятся автоматически (cascade)
   * 
   * @param chatId - ID чата
   * @returns Подтверждение удаления
   */
  async deleteChat(chatId: string): Promise<DeleteChatResponse> {
    return api.delete<DeleteChatResponse>(`chats/${chatId}`);
  }
}

export const chatService = new ChatService();
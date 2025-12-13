/**
 * Типы для чатов и сообщений
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  lastSeen: Date | null;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessageAt: string;
  createdAt: string;
  messages?: Message[];
  otherParticipant?: User;
  unreadCount?: number;
  isOnline?: boolean;
  lastMessage?: string; // Текст последнего сообщения
}

export interface PaginationInfo {
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GetMessagesResponse {
  messages: Message[];
  pagination: PaginationInfo;
}

export interface MarkAsReadResponse {
  message: string;
  count: number;
}

export interface DeleteChatResponse {
  message: string;
}

/**
 * Query параметры для получения сообщений
 */
export interface GetMessagesParams {
  page?: number;
  limit?: number;
}

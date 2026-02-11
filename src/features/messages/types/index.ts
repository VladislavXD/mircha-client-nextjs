/**
 * Интерфейсы для чатов и сообщений
 */

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
    bio?: string;
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
  chatId: string;
  page?: number;
  limit?: number;
}

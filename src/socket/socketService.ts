import { SocketClient } from "./core/SocketClient";
import { MessageSocket } from "./modules/MessageSocket";
import { ChatSocket } from "./modules/ChatSocket";
import { TypingSocket } from "./modules/TypingSocket";
import { PresenceSocket } from "./modules/PresenceSocket";
import { NotificationSocket } from "./modules/Nnotification";

// 1. Создаем единственный инстанс ядра
const socketCore = new SocketClient();

// 2. Инициализируем модули, передавая им ядро
export const socketService = {
  core: socketCore,
  messages: new MessageSocket(socketCore),
  chats: new ChatSocket(socketCore),
  typing: new TypingSocket(socketCore),
  presence: new PresenceSocket(socketCore),
  notifications: new NotificationSocket(socketCore),

  // ============================================
  // Алиасы для обратной совместимости (Facade)
  // Это позволит не переписывать сразу все импорты в проекте
  // ============================================

  // Ядро
  connect: () => socketCore.connect(),
  disconnect: () => socketCore.disconnect(),
  reconnect: () => socketCore.reconnect(),
  get connected() {
    return socketCore.connected;
  },
  off: (event: string, callback?: any) => socketCore.off(event, callback),
  onCustom: (event: string, callback: (...args: any[]) => void) =>
    socketCore.onCustom(event, callback),
  offCustom: (event: string, callback?: (...args: any[]) => void) =>
    socketCore.offCustom(event, callback),

  // Чаты
  joinChat: (chatId: string) => socketService.chats.joinChat(chatId),
  joinDirectChat: (chatId: string) =>
    socketService.chats.joinDirectChat(chatId),
  joinGroupChat: (chatId: string) => socketService.chats.joinGroupChat(chatId),
  joinChannelChat: (chatId: string) =>
    socketService.chats.joinChannelChat(chatId),
  onJoinedChat: (callback: (data: any) => void) =>
    socketService.chats.onJoinedChat(callback),

  // Сообщения
  sendMessage: (chatId: string, content: string) =>
    socketService.messages.sendMessage(chatId, content),
  sendDirectMessage: (chatId: string, content: string) =>
    socketService.messages.sendDirectMessage(chatId, content),
  sendGroupMessage: (chatId: string, content: string) =>
    socketService.messages.sendGroupMessage(chatId, content),
  sendChannelMessage: (chatId: string, content: string) =>
    socketService.messages.sendChannelMessage(chatId, content),
  markAsRead: (messageIds: string[]) =>
    socketService.messages.markAsRead(messageIds),
  onNewMessage: (callback: (message: any) => void) =>
    socketService.messages.onNewMessage(callback),
  onNewDirectMessage: (callback: (message: any) => void) =>
    socketService.messages.onNewDirectMessage(callback),
  onNewGroupMessage: (callback: (message: any) => void) =>
    socketService.messages.onNewGroupMessage(callback),
  onNewChannelMessage: (callback: (message: any) => void) =>
    socketService.messages.onNewChannelMessage(callback),
  onMessageRead: (callback: (data: any) => void) =>
    socketService.messages.onMessageRead(callback),
  onMessagesRead: (callback: (data: any) => void) =>
    socketService.messages.onMessagesRead(callback),

  // Печать
  startTyping: (chatId: string) => socketService.typing.startTyping(chatId),
  startTypingDirect: (chatId: string) =>
    socketService.typing.startTypingDirect(chatId),
  startTypingGroup: (chatId: string) =>
    socketService.typing.startTypingGroup(chatId),
  stopTyping: (chatId: string) => socketService.typing.stopTyping(chatId),
  stopTypingDirect: (chatId: string) =>
    socketService.typing.stopTypingDirect(chatId),
  stopTypingGroup: (chatId: string) =>
    socketService.typing.stopTypingGroup(chatId),
  onTypingStart: (callback: (data: any) => void) =>
    socketService.typing.onTypingStart(callback),
  onTypingStop: (callback: (data: any) => void) =>
    socketService.typing.onTypingStop(callback),

  // Статусы (Presence)
  requestCurrentOnlineStatuses: () =>
    socketService.presence.requestCurrentOnlineStatuses(),
  onUserStatusChange: (callback: (data: any) => void) =>
    socketService.presence.onUserStatusChange(callback),
  onGlobalUserStatusChange: (
    callback: (data: { userId: string; isOnline: boolean }) => void,
  ) => socketService.presence.onGlobalUserStatusChange(callback),
  onCurrentOnlineStatuses: (
    callback: (statuses: Record<string, boolean>) => void,
  ) => socketService.presence.onCurrentOnlineStatuses(callback),
  onGlobalOnlineStatuses: (
    callback: (statuses: Record<string, boolean>) => void,
  ) => socketService.presence.onGlobalOnlineStatuses(callback),

  // Уведомления (Notifications) - добавляем в отдельный модуль для чистоты архитектуры
  onNotificationReceived: (callback: (notification: any) => void) =>
    socketService.notifications.onNotificationReceived(callback),
  offNotificationReceived: (callback?: (...args: any[]) => void) =>
    socketService.notifications.offNotificationReceived(callback),
};

// Для совместимости с default import
export default socketService;

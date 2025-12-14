import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private eventListeners: { [event: string]: ((...args: any[]) => void)[] } = {};

  private SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002' ;

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🔌 [SocketService] connect() called');
      console.log('   Target URL:', this.SOCKET_URL);
      console.log('   Token provided:', !!token);
      console.log('   Token value:', token?.substring(0, 20) + '...');
      console.log('   Already connected:', this.isConnected);
      console.log('   Socket instance exists:', !!this.socket);
      console.log('   Socket.connected:', this.socket?.connected);
      
      // Проверяем реальное состояние сокета
      if (this.socket && this.socket.connected) {
        console.log('✅ Already connected to Socket.IO server');
        this.isConnected = true;
        resolve();
        return;
      }

      // Если есть старый сокет, но он отключен - очищаем
      if (this.socket && !this.socket.connected) {
        console.log('🧹 Cleaning up old disconnected socket...');
        this.socket.removeAllListeners();
        this.socket = null;
        this.isConnected = false;
      }

      console.log('🔄 Creating new Socket.IO connection...');
      
      // Создаем подключение к Socket.IO серверу (отдельный микросервис)
      // Аутентификация происходит через session cookie (httpOnly)
      // Токен не обязателен - основная аутентификация через Redis сессии
      this.socket = io(this.SOCKET_URL, {
        auth: {
          token: token || 'cookie-session' // Маркер для серверного middleware
        },
        withCredentials: true, // ВАЖНО: Отправляем cookies (включая httpOnly session)
        transports: ['websocket', 'polling'],
        
        // Auto-reconnection настройки
        reconnection: true,
        reconnectionDelay: 1000, // Начальная задержка 1 сек
        reconnectionDelayMax: 5000, // Максимальная задержка 5 сек
        reconnectionAttempts: 10, // 10 попыток переподключения
        timeout: 20000 // Таймаут подключения 20 сек
      });
      
      console.log('📡 Socket.IO client created, waiting for connection...');

      this.socket.on('connect', () => {
        console.log('✅ Connected to Socket.IO server:', this.SOCKET_URL);
        this.isConnected = true;
        this.emitCustom('connect');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error.message);
        console.error('   Server URL:', this.SOCKET_URL);
        console.error('   Error details:', error);
        this.isConnected = false;
        this.emitCustom('connect_error', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from server. Reason:', reason);
        this.isConnected = false;
        this.emitCustom('disconnect');
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`✅ Reconnected after ${attemptNumber} attempts`);
        this.isConnected = true;
        this.emitCustom('reconnect', attemptNumber);
      });

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('❌ Reconnection error:', error.message);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('❌ Reconnection failed after all attempts');
        this.isConnected = false;
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Присоединиться к чату
  joinChat(chatId: string) {
    if (this.socket) {
      this.socket.emit('join_chat', { chatId });
    }
  }

  // Отправить сообщение
  sendMessage(chatId: string, content: string) {
    if (this.socket) {
      this.socket.emit('send_message', { chatId, content });
    }
  }

  // Отметить сообщения как прочитанные
  markAsRead(messageIds: string[]) {
    if (this.socket) {
      this.socket.emit('mark_as_read', { messageIds });
    }
  }

  // Начать печатать
  startTyping(chatId: string) {
    if (this.socket) {
      this.socket.emit('typing_start', { chatId });
    }
  }

  // Прекратить печатать
  stopTyping(chatId: string) {
    if (this.socket) {
      this.socket.emit('typing_stop', { chatId });
    }
  }

  // Подписаться на новые сообщения
  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  // Подписаться на событие присоединения к чату
  onJoinedChat(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('joined_chat', callback);
    }
  }

  // Подписаться на прочтение сообщений
  onMessageRead(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('message_read', callback);
    }
  }

  // Подписаться на массовое прочтение сообщений
  onMessagesRead(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('messages_read', callback);
    }
  }

  // Подписаться на начало печати
  onTypingStart(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_typing_start', callback);
    }
  }

  // Подписаться на окончание печати
  onTypingStop(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_typing_stop', callback);
    }
  }

  // Подписаться на изменение статуса пользователя (для чатов)
  onUserStatusChange(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_status_change', callback);
    }
  }

  // Подписаться на глобальное изменение статуса пользователя (для всего сайта)
  onGlobalUserStatusChange(callback: (data: { userId: string; isOnline: boolean }) => void) {
    if (this.socket) {
      this.socket.on('global_user_status_change', callback);
    }
  }

  onCurrentOnlineStatuses(callback: (statuses: Record<string, boolean>) => void) {
    if (this.socket) {
      this.socket.on('current_online_statuses', callback);
    }
  }

  // Подписаться на глобальные онлайн статусы ВСЕХ пользователей
  onGlobalOnlineStatuses(callback: (statuses: Record<string, boolean>) => void) {
    if (this.socket) {
      this.socket.on('global_online_statuses', callback);
    }
  }

  // Запросить текущие онлайн статусы
  requestCurrentOnlineStatuses() {
    if (this.socket && this.isConnected) {
      console.log('📡 Requesting current online statuses...');
      this.socket.emit('request_online_statuses');
    } else {
      console.warn('⚠️ Cannot request statuses: Socket not connected');
    }
  }

  // Отписаться от событий
  off(event: string, callback?: any) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Метод для полной очистки и переподключения при смене пользователя
  reconnect(newToken: string): Promise<void> {
    console.log('Reconnecting with new token...')
    this.disconnect()
    return this.connect(newToken)
  }

  // Проверка текущего соединения
  get connected() {
    return this.isConnected
  }

  // Управление кастомными событиями
  private emitCustom(event: string, ...args: any[]) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(...args));
    }
  }

  onCustom(event: string, callback: (...args: any[]) => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  offCustom(event: string, callback?: (...args: any[]) => void) {
    if (!this.eventListeners[event]) return;
    
    if (callback) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    } else {
      delete this.eventListeners[event];
    }
  }
}

export const socketService = new SocketService();

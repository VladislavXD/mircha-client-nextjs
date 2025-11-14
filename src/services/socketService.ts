import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  private SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002' ;

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.isConnected) {
        resolve();
        return;
      }

      // Создаем подключение к Socket.IO серверу (отдельный микросервис)
      this.socket = io(this.SOCKET_URL, {
        auth: {
          token
        },
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.isConnected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.isConnected = false;
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
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

  // Подписаться на изменение статуса пользователя
  onUserStatusChange(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_status_change', callback);
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
}

export const socketService = new SocketService();

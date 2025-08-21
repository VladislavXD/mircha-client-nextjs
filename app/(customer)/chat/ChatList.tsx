"use client"
import React, { useEffect, useState } from 'react';
import { useGetUserChatsQuery } from '@/src/services/caht.service';
import { useRouter } from 'next/navigation';
import { Card, User, Button, Spinner, Badge } from '@heroui/react';
import { MessageCircle, Users } from 'lucide-react';
import { socketService } from '../../utils/socketService';
import { formatChatTime, formatOnlineStatus } from '../../utils/formatChatTime';
import { Chat } from '@/src/services/caht.service';
import { useAppSelector } from '@/src/hooks/reduxHooks';

export const ChatList: React.FC = () => {
  const router = useRouter()
  const currentUser = useAppSelector(state => state.user.current);
  const token = useAppSelector(state => state.user.token);
  
  const { data: chats, isLoading, error, refetch } = useGetUserChatsQuery(undefined, {
    // Принудительно получаем свежие данные при каждом фокусе
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [chatStatuses, setChatStatuses] = useState<{[key: string]: boolean}>({});

  console.log(chats);

  // Обновляем данные при каждом монтировании компонента
  useEffect(() => {
    if (token) {
      console.log('ChatList mounted, refreshing data...');
      refetch();
    }
  }, []);

  useEffect(() => {
    // Всегда пытаемся подключиться при монтировании компонента
    if (token) {
      if (!socketService.connected) {
        socketService.connect(token).catch(console.error);
      }
      
      // Принудительно обновляем список чатов при монтировании
      refetch();
    }

    // Обновляем список чатов при получении новых сообщений
    const handleNewMessage = () => {
      refetch();
    };

    // Обработка изменения онлайн статуса
    const handleUserStatusChange = (data: { userId: string; isOnline: boolean; chatId: string }) => {
      console.log('User status changed:', data);
      setChatStatuses(prev => ({
        ...prev,
        [data.userId]: data.isOnline
      }));
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onUserStatusChange(handleUserStatusChange);

    return () => {
      socketService.off('new_message', handleNewMessage);
      socketService.off('user_status_change', handleUserStatusChange);
    };
  }, [token, refetch]);

  // Отдельный эффект для инициализации статусов чатов
  useEffect(() => {
    if (chats) {
      const initialStatuses = chats.reduce((acc, chat) => {
        if (chat.otherParticipant) {
          acc[chat.otherParticipant.id] = chat.isOnline;
        }
        return acc;
      }, {} as {[key: string]: boolean});
      setChatStatuses(prev => ({ ...prev, ...initialStatuses }));
    }
  }, [chats]);

  // Эффект для обновления при возврате к компоненту
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && token) {
        // Страница стала видимой - обновляем данные
        console.log('Page became visible, refreshing data...');
        refetch();
        if (!socketService.connected) {
          socketService.connect(token).catch(console.error);
        }
      }
    };

    const handleFocus = () => {
      if (token) {
        console.log('Window focused, refreshing data...');
        refetch();
        if (!socketService.connected) {
          socketService.connect(token).catch(console.error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [token, refetch]);

  const handleChatClick = (chat: any) => {
    router.push(`/chat/${chat.otherParticipant?.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Spinner className="h-full "/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Ошибка загрузки чатов</div>
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <MessageCircle size={64} className="text-gray-400" />
        <div className="text-xl text-gray-600">У вас пока нет чатов</div>
        <div className="text-gray-500 text-center">
          Найдите пользователей и начните общение!
        </div>
        <Button
          color="primary"
          startContent={<Users size={20} />}
          onClick={() => router.push('/search')}
        >
          Найти пользователей
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Сообщения</h1>
        <div className="text-gray-600">{chats.length} чатов</div>
      </div>

      <div className="space-y-3">
        {chats.map((chat) => {
          const isOnline = chat.otherParticipant ? 
            (chatStatuses[chat.otherParticipant.id] ?? chat.isOnline) : 
            chat.isOnline;
            
          return (
            <Card
              key={chat.id}
              isPressable
              className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                chat.unreadCount > 0 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
              onClick={() => handleChatClick(chat)}
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <Badge
                    content=""
                    color={isOnline ? "success" : "default"}
                    variant={isOnline ? "solid" : "flat"}
                    size="sm"
                    isInvisible={!isOnline}
                    placement="bottom-right"
                  >
                    <User
                      name=""
                      description=""
                      avatarProps={{
                        src: chat.otherParticipant?.avatarUrl || undefined,
                        size: 'lg'
                      }}
                    />
                  </Badge>
                </div>

                {/* Левая часть: Имя и описание */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base truncate mb-1">
                    {chat.otherParticipant?.name || 'Неизвестный пользователь'}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-[200px]">
                    {chat.otherParticipant?.bio || (!isOnline ? formatOnlineStatus(isOnline, chat.otherParticipant?.lastSeen) : 'Пользователь')}
                  </div>
                </div>

                {/* Правая часть: Время, последнее сообщение и счетчик */}
                <div className="flex flex-col items-end justify-between min-w-0 max-w-[160px] h-full">
                  <div className="text-xs text-gray-500 mb-2">
                    {formatChatTime(chat.lastMessageAt)}
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-600 truncate w-28 text-right mb-1">
                      {chat.lastMessage || 'Нет сообщений'}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
          </Card>
          );
        })}
      </div>
    </div>
  );
};

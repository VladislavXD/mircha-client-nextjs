"use client"
import React, { useEffect, useState, useMemo } from 'react';
import { useGetUserChats } from '@/src/features/chat';
import { useOnlineStatuses } from '@/src/features/chat/hooks/useOnlineStatus';
import { OnlineBadge } from '@/src/features/chat/components';
import { useRouter } from 'next/navigation';
import { Card, Button, Spinner } from '@heroui/react';
import { MessageCircle, Users } from 'lucide-react';
import { socketService } from '../../../../src/services/socketService';
import { formatChatTime, formatOnlineStatus } from '../../../utils/formatChatTime';
import type { Chat } from '@/src/features/chat/types';
import { useAppSelector } from '@/src/hooks/reduxHooks';
import NotAuthenticated from '@/shared/components/ui/notAuthenticated';
import { queryClient } from '@/lib/queryClient';
import { User as UserType } from '@/src/types/types';


export const ChatList: React.FC = () => {
  const router = useRouter()
    const current = queryClient.getQueryData<UserType>(["profile"]);
  
    
  // Токен больше не нужен - используем сессионную аутентификацию
  // const token = getAuthToken();
  
  const { data: chats, isLoading, error, refetch } = useGetUserChats();
  
  // Мемоизация массива userIds для предотвращения бесконечных перерендеров
  const userIds = useMemo(() => {
    return chats?.map(chat => chat.otherParticipant?.id).filter(Boolean) || [];
  }, [chats]);
  
  const { getStatus } = useOnlineStatuses(userIds);

  // Socket.IO подключается глобально через SocketConnectionManager
  // Статусы обновляются автоматически через Redux

  // Обновляем список чатов при получении новых сообщений
  useEffect(() => {
    if (!current?.id) return;

    const handleNewMessage = () => refetch();
    socketService.onNewMessage(handleNewMessage);
    
    return () => socketService.off('new_message', handleNewMessage);
  }, [current?.id, refetch]);

  // Обновление при возврате к странице
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && current?.id) {
        refetch();
        if (!socketService.connected) {
          socketService.connect().catch(console.error);
        }
      }
    };

    const handleFocus = () => {
      if (current?.id) {
        refetch();
        if (!socketService.connected) {
          socketService.connect().catch(console.error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [current?.id, refetch]);

  const handleChatClick = (chat: any) => {
    router.push(`/chat/${chat.otherParticipant?.id}`);
  };

  if(!current){
    return <NotAuthenticated/>
  }

  if (isLoading) {
    return (
      <>

        <div className="flex justify-center items-center h-64 w-full">
          <Spinner className="h-full "/>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>

        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Ошибка загрузки чатов</div>
        </div>
      </>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <>

        <div className="flex flex-col justify-center items-center h-64 w-full space-y-4">
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
      </>
    );
  }

  return (
    <>

      <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Сообщения</h1>
        <div className="text-gray-600">{chats.length} чатов</div>
      </div>

      <div className="space-y-3">
        {chats.map((chat: Chat) => {
          const isOnline = chat.otherParticipant ? 
            getStatus(chat.otherParticipant.id) : 
            false;
            
          return (
            <Card
              key={chat.id}
              isPressable
              className={`p-4 cursor-pointer transition-all hover:scale-[1.02] w-full max-w-full min-[330px]:w-[310px] ${
              (chat.unreadCount ?? 0) > 0 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
              onClick={() => handleChatClick(chat)}
            >
              <div className="flex items-start space-x-3 w-full overflow-hidden">
              <div className="relative flex-shrink-0">
              <OnlineBadge
                avatarUrl={chat.otherParticipant?.avatarUrl || undefined}
                isOnline={isOnline}
                size="lg"
              />
              </div>

              {/* Левая часть: Имя и описание */}
              <div className="flex-1 min-w-0 overflow-hidden">
              <div className="font-semibold text-base truncate mb-1">
              {chat.otherParticipant?.name || 'Неизвестный пользователь'}
              </div>
              <div className="text-sm text-gray-500 truncate">
              {chat.otherParticipant?.bio || (!isOnline ? formatOnlineStatus(isOnline, chat.otherParticipant?.lastSeen ?? undefined) : 'Пользователь')}
              </div>
              </div>

              {/* Правая часть: Время, последнее сообщение и счетчик */}
              <div className="flex flex-col items-end justify-between min-w-0 flex-shrink-0 w-16 min-[330px]:w-20 sm:w-32 h-full">
              <div className="text-xs text-gray-500 mb-2 whitespace-nowrap">
              {formatChatTime(chat.lastMessageAt)}
              </div>
              
              <div className="flex flex-col items-end w-full">
              <div className="text-sm text-gray-600 truncate w-full text-right mb-1">
                {chat.lastMessage || 'Нет сообщений'}
              </div>
              {(chat.unreadCount ?? 0) > 0 && (
                <div className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {(chat.unreadCount ?? 0) > 99 ? '99+' : chat.unreadCount}
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
    </>
  );
};

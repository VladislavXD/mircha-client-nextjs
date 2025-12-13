'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/src/hooks/reduxHooks';
import { socketService } from '@/src/services/socketService';
import { useProfile } from '@/src/features/profile/hooks/useProfile';
import { setMultipleStatuses, setUserStatus, clearStatuses } from '@/src/store/onlineStatus/onlineStatus.slice';

/**
 * Глобальный менеджер Socket.IO подключения
 * - Автоматически подключает сокет при авторизации
 * - Синхронизирует онлайн-статусы с Redux
 * - Отключает сокет при выходе
 */
export default function SocketConnectionManager() {
  const { user, isLoading } = useProfile();
  const dispatch = useAppDispatch();
  const subscribedRef = useRef(false);

  useEffect(() => {
    // Ждем загрузки пользователя
    if (isLoading) return;
    
    // Нет пользователя - очищаем данные и отключаем сокет
    if (!user) {
      if (socketService.connected) {
        socketService.disconnect();
      }
      dispatch(clearStatuses());
      subscribedRef.current = false;
      return;
    }

    // Подключаем сокет (HttpOnly cookie отправляется автоматически)
    if (!socketService.connected) {
      socketService.connect().then(() => {
        if (subscribedRef.current) return; // Предотвращаем двойную подписку
        subscribedRef.current = true;
        
        // Подписка на глобальные события (один раз)
        socketService.onGlobalOnlineStatuses((statuses) => {
          dispatch(setMultipleStatuses(statuses));
        });
        
        socketService.onGlobalUserStatusChange((data) => {
          dispatch(setUserStatus({ userId: data.userId, isOnline: data.isOnline }));
        });
      }).catch(err => {
        console.error('Socket connection error:', err);
      });
    }
  }, [user, isLoading, dispatch]);

  // Компонент не рендерит ничего видимого
  return null;
}

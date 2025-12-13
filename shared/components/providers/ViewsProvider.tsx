"use client";
import React, { useEffect } from 'react';
import { useAddViewsBatch } from '@/src/features/post';
import { viewsManager } from '@/app/utils/viewsManager';
import { useCurrentUser } from '@/src/features/user';

interface ViewsProviderProps {
  children: React.ReactNode;
}

export const ViewsProvider: React.FC<ViewsProviderProps> = ({ children }) => {
  const addViewsBatchMutation = useAddViewsBatch();
  const { user: current } = useCurrentUser()

 useEffect(() => {
    if (!current) {
      return
    }
  }, [current]);

  useEffect(() => {
    // Устанавливаем callback для отправки батчей
    viewsManager.setAddViewCallback(async (postIds: string[]) => {
      try {
        console.log('Отправляем батч просмотров:', postIds);
        const result = await addViewsBatchMutation.mutateAsync(postIds);
        console.log('Батч успешно отправлен:', result);
      } catch (error) {
        console.error('Ошибка при отправке батча просмотров:', error);
        
        // Логируем детали ошибки для отладки
        if (error && typeof error === 'object') {
          console.error('Детали ошибки:', {
            status: (error as any).status,
            data: (error as any).data,
            error: (error as any).error
          });
        }
      }
    });

    // Очищаем при размонтировании компонента
    return () => {
      viewsManager.flush(); // Отправляем оставшиеся просмотры
    };
  }, [addViewsBatchMutation]);

  // При закрытии страницы отправляем оставшиеся просмотры
  useEffect(() => {
    const handleBeforeUnload = () => {
      viewsManager.flush();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        viewsManager.flush();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
};

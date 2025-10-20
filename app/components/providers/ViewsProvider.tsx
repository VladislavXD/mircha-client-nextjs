"use client";
import React, { useEffect } from 'react';
import { useAddViewsBatchMutation } from '@/src/services/post/post.service';
import { viewsManager } from '@/app/utils/viewsManager';
import { useSelector } from 'react-redux';
import { selectCurrent } from '@/src/store/user/user.slice';

interface ViewsProviderProps {
  children: React.ReactNode;
}

export const ViewsProvider: React.FC<ViewsProviderProps> = ({ children }) => {
  const [addViewsBatch] = useAddViewsBatchMutation();
  const current = useSelector(selectCurrent)

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
        const result = await addViewsBatch({ postIds }).unwrap();
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
  }, [addViewsBatch]);

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

import { useMemo } from "react";

import { socketService } from "@/src/socket/socketService";
import { useAppSelector } from "@/src/hooks/reduxHooks";

/**
 * Хук для получения онлайн-статуса пользователя
 * Читает данные из Redux (обновляются через SocketConnectionManager)
 *
 * @param userId - ID пользователя
 * @param currentUserId - ID текущего авторизованного пользователя
 * @returns Статус онлайн
 */
export function useOnlineStatus(
  userId: string | undefined,
  currentUserId?: string,
) {
  // Для текущего пользователя - статус сокета
  const isCurrentUser = useMemo(
    () => !!userId && !!currentUserId && currentUserId === userId,
    [userId, currentUserId],
  );

  // Получаем статус из Redux
  const statusFromRedux = useAppSelector((state) =>
    userId ? state.onlineStatus.statuses[userId] : undefined,
  );

  const isOnline = isCurrentUser
    ? socketService.connected // Текущий пользователь - статус сокета
    : (statusFromRedux ?? false); // Другие - из Redux

  return { isOnline };
}

/**
 * Хук для получения онлайн-статусов нескольких пользователей
 * Оптимизирован для списков чатов
 * Читает данные из Redux (обновляются через SocketConnectionManager)
 *
 * @param userIds - Массив ID пользователей
 * @returns Объект с методом getStatus для получения статуса по ID
 */
export function useOnlineStatuses(userIds: (string | undefined)[]) {
  const validUserIds = useMemo(
    () => userIds.filter((id): id is string => !!id),
    [userIds],
  );

  // Получаем все статусы из Redux с оптимизированным сравнением
  const statusesFromRedux = useAppSelector(
    (state) => state.onlineStatus.statuses,
    (left, right) => validUserIds.every((id) => left[id] === right[id]),
  );

  // Создаем мемоизированный объект статусов только для нужных пользователей
  const statuses = useMemo(() => {
    const result: Record<string, boolean> = {};

    validUserIds.forEach((userId) => {
      result[userId] = statusesFromRedux[userId] ?? false;
    });

    return result;
  }, [statusesFromRedux, validUserIds.join(",")]);

  // Оптимизированная функция получения статуса
  const getStatus = useMemo(
    () =>
      (userId: string | undefined): boolean =>
        userId ? (statusesFromRedux[userId] ?? false) : false,
    [statusesFromRedux],
  );

  return { statuses, getStatus };
}

import { RootState } from '../store';

/**
 * Селектор для получения всех онлайн статусов
 */
export const selectAllOnlineStatuses = (state: RootState) => state.onlineStatus.statuses;

/**
 * Селектор для получения статуса конкретного пользователя
 */
export const selectUserOnlineStatus = (userId: string | undefined) => (state: RootState): boolean => {
  if (!userId) return false;
  return state.onlineStatus.statuses[userId] ?? false;
};

/**
 * Селектор для получения статусов нескольких пользователей
 */
export const selectMultipleOnlineStatuses = (userIds: (string | undefined)[]) => (state: RootState): Record<string, boolean> => {
  const result: Record<string, boolean> = {};
  
  userIds.forEach(userId => {
    if (userId) {
      result[userId] = state.onlineStatus.statuses[userId] ?? false;
    }
  });
  
  return result;
};

/**
 * Селектор для получения количества онлайн пользователей
 */
export const selectOnlineUsersCount = (state: RootState): number => {
  return Object.values(state.onlineStatus.statuses).filter(status => status === true).length;
};

"use client";

import { useEffect, useRef } from "react";

import { useAppDispatch } from "@/src/hooks/reduxHooks";
import { socketService } from "@/src/socket/socketService";
import { useProfile } from "@/src/features/profile/hooks/useProfile";
import { useRealtimeNotificationsListener } from "@/src/features/notification/hooks/useRealTimeNotifications";
import {
  setMultipleStatuses,
  setUserStatus,
  clearStatuses,
} from "@/src/store/onlineStatus/onlineStatus.slice";

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

  // Инициализируем слушатель реалтайм-уведомлений
  useRealtimeNotificationsListener();

  console.log("🔌 SocketConnectionManager render:", {
    user: !!user,
    isLoading,
    subscribed: subscribedRef.current,
  });

  useEffect(() => {
    console.log("🔌 SocketConnectionManager useEffect:", {
      user: !!user,
      isLoading,
    });

    // Временно подключаем сокет всегда для тестирования
    console.log("🔌 Connecting socket for testing...");
    if (!socketService.connected) {
      socketService
        .connect()
        .then(() => {
          console.log("🔌 Socket connected successfully");
          if (subscribedRef.current) return; // Предотвращаем двойную подписку
          subscribedRef.current = true;

          // Подписка на глобальные события (один раз)
          socketService.onGlobalOnlineStatuses((statuses) => {
            console.log("🔌 Received global online statuses:", statuses);
            dispatch(setMultipleStatuses(statuses));
          });

          socketService.onGlobalUserStatusChange((data) => {
            console.log("🔌 Received user status change:", data);
            dispatch(
              setUserStatus({ userId: data.userId, isOnline: data.isOnline }),
            );
          });
        })
        .catch((err) => {
          console.error("Socket connection error:", err);
        });
    }

    // Ждем загрузки пользователя
    if (isLoading) {
      console.log("🔌 Waiting for user loading...");

      return;
    }

    // Нет пользователя - очищаем данные и отключаем сокет
    if (!user) {
      console.log("🔌 No user, disconnecting socket...");
      if (socketService.connected) {
        socketService.disconnect();
      }
      dispatch(clearStatuses());
      subscribedRef.current = false;

      return;
    }

    console.log("🔌 User loaded, socket already connected");
  }, [user, isLoading, dispatch]);

  // Компонент не рендерит ничего видимого
  return null;
}

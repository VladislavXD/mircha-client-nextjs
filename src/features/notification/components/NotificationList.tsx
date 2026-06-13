"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";

import { useNotifications, useMarkNotificationAsRead } from "../hooks";
import { INotification } from "../types/notificationType";
import { NotificationCard } from "./NotificationCard";

import {
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "../../profile";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread";

interface NotificationListProps {
  page?: number;
  limit?: number;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  page = 1,
  limit = 20,
}) => {
  const [filter, setFilter] = useState<Filter>("all");
  const { data, isLoading, isError, refetch } = useNotifications(page, limit, filter === "unread");
  console.log('notifications', data?.data);
  const markAsRead = useMarkNotificationAsRead();
  const { isAuthenticated } = useProfile();

  if (!isAuthenticated) {
    return (
      <Empty>
        <EmptyIcon icon={Bell} />
        <EmptyTitle>Войдите, чтобы увидеть уведомления</EmptyTitle>
        <EmptyDescription>
          Пожалуйста, войдите в аккаунт, чтобы просматривать уведомления.
        </EmptyDescription>
      </Empty>
    );
  }

  const handleClick = (notification: INotification) => {
    if (!notification.isRead) markAsRead.mutate(notification.id);
  };

  const unreadCount = data?.data?.filter((n) => !n.isRead).length ?? 0;
  const unread = data?.data?.filter((n) => !n.isRead) ?? [];
  const read = data?.data?.filter((n) => n.isRead) ?? [];

  return (
    <div className="flex flex-col h-full px-2 sm:px-0">
      {/* Шапка */}
      <div className="flex items-start sm:items-center justify-between gap-3 pb-4 mb-1 border-b border-zinc-800/60">
        <div>
          <h1 className="text-base sm:text-lg font-medium text-zinc-100 tracking-tight">
            Уведомления
          </h1>
          {unreadCount > 0 && (
            <p className="text-xs text-zinc-600 mt-0.5">{unreadCount} непрочитанных</p>
          )}
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {(["all", "unread"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border",
                filter === f
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-400 active:bg-white/[0.04]",
              )}
            >
              {f === "all" ? "Все" : "Новые"}
            </button>
          ))}
        </div>
      </div>

      {/* Скелетон */}
      {isLoading && (
        <div className="flex flex-col gap-2 mt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 px-4 py-3.5 rounded-2xl border border-[#181818]">
              <Skeleton className="w-10 h-10 rounded-full bg-zinc-800/50 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <Skeleton className="w-3/4 h-3 rounded-full bg-zinc-800/50" />
                <Skeleton className="w-1/3 h-2.5 rounded-full bg-zinc-800/30" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ошибка */}
      {isError && (
        <div className="mt-10 text-center">
          <p className="text-sm text-zinc-600">Не удалось загрузить уведомления</p>
          <button
            className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors"
            onClick={() => refetch()}
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Пусто */}
      {!isLoading && !isError && data?.data?.length === 0 && (
        <Empty>
          <EmptyIcon icon={Bell} />
          <EmptyTitle>Нет уведомлений</EmptyTitle>
          <EmptyDescription>
            Здесь появятся лайки, комментарии и подписки.
          </EmptyDescription>
        </Empty>
      )}

      {/* Список */}
      {!isLoading && !isError && !!data?.data?.length && (
        <div className="flex flex-col mt-3 gap-1.5">
          {/* Непрочитанные */}
          {unread.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {unread.map((n) => (
                <NotificationCard key={n.id} notification={n} onClick={handleClick} />
              ))}
            </div>
          )}

          {/* Разделитель */}
          {unread.length > 0 && read.length > 0 && (
            <div className="flex items-center gap-3 my-2 px-1">
              <div className="flex-1 h-px bg-zinc-800/60" />
              <span className="text-[10px] text-zinc-700 uppercase tracking-widest whitespace-nowrap">
                Прочитанные
              </span>
              <div className="flex-1 h-px bg-zinc-800/60" />
            </div>
          )}

          {/* Прочитанные */}
          {read.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {read.map((n) => (
                <NotificationCard key={n.id} notification={n} onClick={handleClick} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
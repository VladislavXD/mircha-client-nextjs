import React from "react";
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

interface NotificationListProps {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  page = 1,
  limit = 20,
  unreadOnly = false,
}) => {
  const { data, isLoading, isError, refetch } = useNotifications(
    page,
    limit,
    unreadOnly,
  );
  const markAsRead = useMarkNotificationAsRead();

  console.log(data);
  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }

    // Здесь можно добавить маршрутизацию:
    // router.push(`/post/${notification.postId}`)
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-xl">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Не удалось загрузить уведомления.</p>
        <button
          className="text-primary hover:underline mt-2"
          onClick={() => refetch()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Empty>
        <EmptyIcon icon={Bell} />
        <EmptyTitle>Нет уведомлений</EmptyTitle>
        <EmptyDescription>
          Здесь будут отображаться ваши новые лайки, комментарии и подписки.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.data.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onClick={handleNotificationClick}
        />
      ))}
    </div>
  );
};

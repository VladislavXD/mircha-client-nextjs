import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Bell,
  MessageSquare,
  AtSign,
  Info,
} from "lucide-react";

import { INotification, NotificationType } from "../types/notificationType";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NotificationCardProps {
  notification: INotification;
  onClick?: (notification: INotification) => void;
  onActionClick?: (e: React.MouseEvent, notification: INotification) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.LIKE_POST:
    case NotificationType.LIKE_COMMENT:
      return <Heart className="w-4 h-4 text-red-500" />;
    case NotificationType.NEW_COMMENT:
    case NotificationType.REPLY_COMMENT:
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case NotificationType.NEW_FOLLOWER:
      return <UserPlus className="w-4 h-4 text-green-500" />;
    case NotificationType.NEW_MESSAGE:
      return <MessageSquare className="w-4 h-4 text-purple-500" />;
    case NotificationType.POST_MENTION:
    case NotificationType.COMMENT_MENTION:
      return <AtSign className="w-4 h-4 text-orange-500" />;
    case NotificationType.SYSTEM:
      return <Info className="w-4 h-4 text-gray-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const getNotificationText = (notification: INotification) => {
  const name = notification.issuer?.name || "Пользователь";

  switch (notification.type) {
    case NotificationType.LIKE_POST:
      return (
        <span>
          <span className="font-semibold">{name}</span> оценил(а) ваш пост.
        </span>
      );
    case NotificationType.LIKE_COMMENT:
      return (
        <span>
          <span className="font-semibold">{name}</span> оценил(а) ваш
          комментарий.
        </span>
      );
    case NotificationType.NEW_COMMENT:
      return (
        <span>
          <span className="font-semibold">{name}</span> прокомментировал(а) ваш
          пост.
        </span>
      );
    case NotificationType.REPLY_COMMENT:
      return (
        <span>
          <span className="font-semibold">{name}</span> ответил(а) на ваш
          комментарий.
        </span>
      );
    case NotificationType.NEW_FOLLOWER:
      return (
        <span>
          <span className="font-semibold">{name}</span> подписался(лась) на вас.
        </span>
      );
    case NotificationType.NEW_MESSAGE:
      return (
        <span>
          <span className="font-semibold">{name}</span> отправил(а) вам
          сообщение.
        </span>
      );
    case NotificationType.POST_MENTION:
      return (
        <span>
          <span className="font-semibold">{name}</span> упомянул(а) вас в посте.
        </span>
      );
    case NotificationType.COMMENT_MENTION:
      return (
        <span>
          <span className="font-semibold">{name}</span> упомянул(а) вас в
          комментарии.
        </span>
      );
    case NotificationType.SYSTEM:
      return <span>{notification.message || "Системное уведомление."}</span>;
    default:
      return <span>{notification.message || "Новое уведомление."}</span>;
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
  onActionClick,
}) => {
  const isUnread = !notification.isRead;

  const handleClick = () => {
    if (onClick) onClick(notification);
  };

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-xl cursor-pointer transition-colors duration-200 border",
        isUnread
          ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
          : "bg-card border-transparent hover:bg-accent",
      )}
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar className="w-10 h-10 border border-border/50 shadow-sm">
          <AvatarImage
            alt={notification.issuer?.name || "Аватар"}
            src={notification.issuer?.avatar || ""}
          />
          <AvatarFallback>
            {notification.issuer?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full shadow-sm">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="text-sm text-foreground leading-tight">
          {getNotificationText(notification)}
        </div>

        {notification.message &&
          notification.type !== NotificationType.SYSTEM && (
            <div className="text-sm text-muted-foreground line-clamp-2 mt-1 italic border-l-2 pl-2 border-border">
              {notification.message}
            </div>
          )}

        <div className="text-xs text-muted-foreground mt-1 font-medium">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: ru,
          })}
        </div>
      </div>

      {isUnread && (
        <div className="flex-shrink-0 flex items-center justify-center pt-2">
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-sm shadow-primary/50" />
        </div>
      )}
    </div>
  );
};

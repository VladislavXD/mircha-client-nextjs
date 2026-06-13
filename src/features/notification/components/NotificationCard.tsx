"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { INotification, NotificationType } from "../types/notificationType";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: INotification;
  onClick?: (notification: INotification) => void;
}

const typeConfig: Record<
  NotificationType,
  { icon: string; accentColor: string; label: string; bgColor: string }
> = {
  [NotificationType.LIKE_POST]: {
    icon: "ti-heart",
    accentColor: "#f87171",
    bgColor: "#1e0f0f",
    label: "оценили ваш пост",
  },
  [NotificationType.LIKE_COMMENT]: {
    icon: "ti-heart",
    accentColor: "#f87171",
    bgColor: "#1e0f0f",
    label: "оценили ваш комментарий",
  },
  [NotificationType.NEW_COMMENT]: {
    icon: "ti-message-circle",
    accentColor: "#60a5fa",
    bgColor: "#0d1520",
    label: "прокомментировали ваш пост",
  },
  [NotificationType.REPLY_COMMENT]: {
    icon: "ti-message-circle",
    accentColor: "#60a5fa",
    bgColor: "#0d1520",
    label: "ответили на ваш комментарий",
  },
  [NotificationType.NEW_FOLLOWER]: {
    icon: "ti-user-plus",
    accentColor: "#4ade80",
    bgColor: "#0d1a10",
    label: "подписались на вас",
  },
  [NotificationType.NEW_MESSAGE]: {
    icon: "ti-message",
    accentColor: "#c084fc",
    bgColor: "#160d20",
    label: "написали вам",
  },
  [NotificationType.POST_MENTION]: {
    icon: "ti-at",
    accentColor: "#fb923c",
    bgColor: "#1a100a",
    label: "упомянули вас в посте",
  },
  [NotificationType.COMMENT_MENTION]: {
    icon: "ti-at",
    accentColor: "#fb923c",
    bgColor: "#1a100a",
    label: "упомянули вас в комментарии",
  },
  [NotificationType.SYSTEM]: {
    icon: "ti-info-circle",
    accentColor: "#71717a",
    bgColor: "#141414",
    label: "",
  },
};

// Какой href строить для одиночного уведомления
function getSingleHref(notification: INotification, locale: string, actorId: string): string {
  switch (notification.type) {
    case NotificationType.NEW_FOLLOWER:
      return `/${locale}/user/${actorId}`;
    case NotificationType.LIKE_POST:
    case NotificationType.NEW_COMMENT:
    case NotificationType.REPLY_COMMENT:
    case NotificationType.POST_MENTION:
    case NotificationType.COMMENT_MENTION:
      return notification.postId
        ? `/${locale}/posts/${notification.postId}`
        : `/${locale}/user/${actorId}`;
    case NotificationType.LIKE_COMMENT:
      return notification.postId
        ? `/${locale}/posts/${notification.postId}`
        : `/${locale}/user/${actorId}`;
    case NotificationType.NEW_MESSAGE:
      return notification.chatId
        ? `/${locale}/chat/${notification.chatId}`
        : `/${locale}/chat`;
    default:
      return `/${locale}/user/${actorId}`;
  }
}

interface Actor {
  id: string;
  name: string;
  avatarUrl?: string | null;
  username?: string;
}

function ActorAvatar({ actor, size, accentColor }: { actor: Actor; size: number; accentColor: string }) {
  return actor.avatarUrl ? (
    <img
      src={actor.avatarUrl}
      alt={actor.name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #0e0e0e",
        flexShrink: 0,
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid #0e0e0e",
        background: "#222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 600,
        color: accentColor,
        flexShrink: 0,
      }}
    >
      {actor.name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function AvatarStack({ actors, accentColor }: { actors: Actor[]; accentColor: string }) {
  const visible = actors.slice(0, 3);
  const extra = actors.length - 3;

  return (
    <div className="relative flex-shrink-0" style={{ width: 48, height: 40 }}>
      {visible.map((actor, i) => {
        const size = i === 0 ? 38 : 26;
        const left = i === 0 ? 0 : 16 + (i - 1) * 12;
        const zIndex = visible.length - i;
        const opacity = i === 0 ? 1 : 0.6 + i * 0.1;
        return (
          <div key={actor.id} style={{ position: "absolute", left, top: i === 0 ? 1 : 7, zIndex, opacity }}>
            <ActorAvatar actor={actor} size={size} accentColor={accentColor} />
          </div>
        );
      })}
      {extra > 0 && (
        <div
          style={{
            width: 22, height: 22, borderRadius: "50%",
            border: "2px solid #0e0e0e",
            position: "absolute",
            left: 16 + (Math.min(visible.length, 3) - 1) * 12,
            top: 9, zIndex: 0,
            background: "#252525",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 600, color: "#666",
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

function buildText(notification: INotification, actors: Actor[]): React.ReactNode {
  const isSystem = notification.type === NotificationType.SYSTEM;
  if (isSystem) return <span className="text-zinc-400">{notification.message || "Системное уведомление"}</span>;
  if (notification.message) return <span className="text-zinc-300">{notification.message}</span>;

  const config = typeConfig[notification.type];
  const firstName = actors[0]?.name ?? "Пользователь";
  const count = actors.length;

  if (count <= 1) {
    return (
      <span className="text-zinc-300">
        <span className="text-white font-medium">{firstName}</span>{" "}
        {config.label.replace("ли ", "л(а) ")}
      </span>
    );
  }
  return (
    <span className="text-zinc-300">
      <span className="text-white font-medium">{firstName}</span>{" "}
      и ещё {count - 1} {count - 1 === 1 ? "человек" : "человека"} {config.label}
    </span>
  );
}

// Общая внутренность карточки
function CardInner({
  notification,
  actors,
  isUnread,
  isAggregated,
  expanded,
  locale,
}: {
  notification: INotification;
  actors: Actor[];
  isUnread: boolean;
  isAggregated: boolean;
  expanded: boolean;
  locale: string;
}) {
  const isSystem = notification.type === NotificationType.SYSTEM;
  const config = typeConfig[notification.type];

  const hasPreview =
    !isSystem &&
    !isAggregated &&
    !!notification.message &&
    !notification.metadata?.aggregate;

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Аватар(ы) */}
        {isSystem ? (
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border"
            style={{ background: "#141414", borderColor: "#242424" }}
          >
            <i className="ti ti-info-circle" style={{ fontSize: 18, color: "#555" }} aria-hidden="true" />
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <AvatarStack actors={actors} accentColor={isUnread ? config.accentColor : "#444"} />
            <div
              className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center"
              style={{ background: isUnread ? config.bgColor : "#141414", border: "2px solid #0e0e0e" }}
            >
              <i
                className={`ti ${config.icon}`}
                style={{ fontSize: 10, color: isUnread ? config.accentColor : "#333" }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {/* Текст */}
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] leading-snug mb-1">{buildText(notification, actors)}</p>
          {hasPreview && (
            <p className="text-xs text-zinc-600 bg-[#111] rounded-lg px-2.5 py-1.5 border border-[#1e1e1e] mb-1.5 truncate">
              {notification.message}
            </p>
          )}
          <p className={cn("text-[11px]", isUnread ? "text-zinc-600" : "text-zinc-700")}>
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ru })}
          </p>
        </div>

        {/* Правая часть */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 ml-1">
          {isAggregated && (
            <ChevronDown
              size={14}
              className={cn(
                "text-zinc-500 transition-transform duration-200",
                expanded && "rotate-180",
              )}
            />
          )}
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isUnread ? config.accentColor : "transparent",
              boxShadow: isUnread ? `0 0 6px ${config.accentColor}60` : "none",
            }}
          />
        </div>
      </div>

      {/* Раскрытый список */}
      {expanded && isAggregated && (
        <div className="mt-3 flex flex-col gap-0.5 border-t border-zinc-800/50 pt-3">
          {actors.map((actor) => (
            <Link
              key={actor.id}
              href={`/${locale}/user/${actor.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors active:bg-white/[0.07]"
            >
              <ActorAvatar actor={actor} size={30} accentColor={config.accentColor} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 font-medium leading-none mb-0.5 truncate">{actor.name}</p>
                {actor.username && (
                  <p className="text-xs text-zinc-600 truncate">@{actor.username}</p>
                )}
              </div>
              <i className="ti ti-arrow-right text-zinc-700 flex-shrink-0" style={{ fontSize: 13 }} aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  const isUnread = !notification.isRead;
  const isSystem = notification.type === NotificationType.SYSTEM;
  const config = typeConfig[notification.type];
  const locale = pathname?.match(/^\/(ru|en)/)?.[1] ?? "ru";

  const actors: Actor[] =
    notification.metadata?.aggregate?.actors?.length
      ? notification.metadata.aggregate.actors.map((a: any) => ({
          id: a.id,
          name: a.name,
          avatarUrl: a.avatarUrl ?? null,
          username: a.username,
        }))
      : notification.issuer
      ? [{
          id: notification.issuerId ?? "",
          name: notification.issuer.name ?? "",
          avatarUrl: (notification.issuer as any).avatarUrl ?? notification.issuer.avatar ?? null,
        }]
      : [];

  const isAggregated = actors.length > 1;

  const sharedClassName = cn(
    "relative flex flex-col px-4 py-3.5 rounded-2xl transition-all duration-150 select-none",
    "border",
    isUnread
      ? "bg-[#161616] border-white/[0.07] hover:bg-[#1c1c1c] active:bg-[#1f1f1f]"
      : "bg-transparent border-[#181818] hover:bg-white/[0.02] active:bg-white/[0.04]",
  );

  const accentBar = isUnread && (
    <div
      className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
      style={{ background: config.accentColor }}
    />
  );

  const innerProps = { notification, actors, isUnread, isAggregated, expanded, locale };

  // Один актор — оборачиваем в Link
  if (!isAggregated && !isSystem && actors[0]?.id) {
    const href = getSingleHref(notification, locale, actors[0].id);
    return (
      <Link
        href={href}
        onClick={() => onClick?.(notification)}
        className={sharedClassName}
      >
        {accentBar}
        <CardInner {...innerProps} />
      </Link>
    );
  }

  // Несколько акторов или системное — div с раскрытием по клику
  return (
    <div
      onClick={() => {
        onClick?.(notification);
        if (isAggregated) setExpanded((v) => !v);
      }}
      className={cn(sharedClassName, isAggregated && "cursor-pointer")}
    >
      {accentBar}
      <CardInner {...innerProps} />
    </div>
  );
};
"use client";

import type { ProfileData, ProfileStats } from "../types";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  UserPlus,
  UserMinus,
  SendHorizontal,
  Cake,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { formatToClientDate } from "@/app/utils/formatToClientDate";
import { Button } from "@/components/ui/button";

interface ProfileInfoProps {
  data: ProfileData;
  stats: ProfileStats;
  isFollowing: boolean;
  isOwner: boolean;
  isFollowLoading: boolean;
  isDataLoading: boolean;
  isUnfollowLoading: boolean;
  unfollowError: any;
  followError: any;
  onFollow: () => void;
  currentUserId?: string;
}

/**
 * Компонент информации о пользователе в профиле.
 * Отображает имя, bio, статистику, кнопки подписки/сообщений.
 */
export function ProfileInfo({
  data,
  stats,
  isFollowing,
  isOwner,
  isFollowLoading,
  isDataLoading,
  isUnfollowLoading,
  followError,
  unfollowError,
  onFollow,
  currentUserId,
}: ProfileInfoProps) {
  const t = useTranslations("Toasts");

  // Показ ошибок подписки
  React.useEffect(() => {
    if (followError || unfollowError) {
      toast.error(t("subscriptionError"), {
        description: t("subscriptionErrorDesc"),
      });
    }
  }, [followError, unfollowError]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Верхняя часть: имя и кнопки */}
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-between">
        {/* Имя пользователя */}
        <div className="flex-1 w-full text-center sm:text-left">
          <div className="relative inline-block mb-2">
            {data.usernameFrameUrl && data.usernameFrameUrl !== "none" && (
              <div
                className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                style={{
                  backgroundImage: `url(${data.usernameFrameUrl})`,
                  backgroundRepeat: "repeat-x",
                  backgroundSize: "auto 100%",
                  backgroundPosition: "left center",
                }}
              />
            )}
            <h1 className="relative z-0 text-2xl sm:text-3xl lg:text-4xl font-bold px-0">
              {data.name}
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
            @{data.username}
          </p>
        </div>

        {/* Кнопки действий (только для чужого профиля) - мобильная версия в конце */}
        {!isOwner && (
          <div className="hidden sm:flex flex-col gap-2 shrink-0 min-w-[150px]">
            <Button
              className="w-full font-semibold rounded-[1rem] sm:rounded-[1.25rem] text-sm h-10 sm:h-11 px-4 shadow-sm"
              disabled={isDataLoading || isFollowLoading || isUnfollowLoading}
              variant={isFollowing ? "secondary" : "default"}
              onClick={() =>
                !currentUserId
                  ? toast.error(t("notAuthorized"), {
                      description: t("notAuthorizedDesc"),
                    })
                  : onFollow()
              }
            >
              {isFollowing ? (
                <>
                  <UserMinus className="mr-2" size={18} />
                  Отписаться
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" size={18} />
                  Подписаться
                </>
              )}
            </Button>

            <Button
              asChild
              className="w-full rounded-[1rem] sm:rounded-[1.25rem] text-sm h-10 sm:h-11 px-4 border-neutral-200 dark:border-neutral-800/70"
              variant="outline"
            >
              <Link
                href={!currentUserId ? "#" : `/chat/${data.id}`}
                onClick={(e) => {
                  if (!currentUserId) {
                    e.preventDefault();
                    toast.error(t("notAuthorized"), {
                      description: t("notAuthorizedDesc"),
                    });
                  }
                }}
              >
                Сообщение
                <SendHorizontal className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Bio */}
      {data.bio && (
        <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-[15px] max-w-2xl leading-relaxed text-center sm:text-left font-serif whitespace-pre-wrap">
          {data.bio}
        </p>
      )}

      {/* Метаинформация */}
      <div className="flex flex-wrap gap-4 sm:gap-6 text-[13px] sm:text-sm text-neutral-500 dark:text-neutral-400 justify-center sm:justify-start items-center">
        {data.dateOfBirth && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Cake size={16} />
            <span className="truncate">
              {formatToClientDate(data.dateOfBirth)}
            </span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MapPin size={16} />
            <span className="truncate">{data.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <CalendarDays size={16} />
          <span className="truncate">
            Присоединился {formatToClientDate(data.createdAt)}
          </span>
        </div>
      </div>

      {/* Статистика подписок */}
      <div className="flex flex-wrap gap-5 sm:gap-8 justify-center sm:justify-start pt-2">
        <Link className="group" href={`/following/${data.id}`}>
          <div className="flex items-center gap-1.5 hover:underline decoration-neutral-400 transition-all underline-offset-4">
            <span className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg">
              {stats.followingCount}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-[15px]">
              Подписки
            </span>
          </div>
        </Link>
        <Link className="group" href={`/followers/${data.id}`}>
          <div className="flex items-center gap-1.5 hover:underline decoration-neutral-400 transition-all underline-offset-4">
            <span className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg">
              {stats.followersCount}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-[15px]">
              Подписчики
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg">
            {stats.postsCount}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-[15px]">
            Посты
          </span>
        </div>
      </div>

      {/* Кнопки действий - мобильная версия */}
      {!isOwner && (
        <div className="flex flex-col sm:hidden gap-2 w-full mt-2">
          <Button
            className="w-full font-semibold rounded-[1rem] text-sm h-11"
            disabled={isDataLoading || isFollowLoading || isUnfollowLoading}
            variant={isFollowing ? "secondary" : "default"}
            onClick={() =>
              !currentUserId
                ? toast.error(t("notAuthorized"), {
                    description: t("notAuthorizedDesc"),
                  })
                : onFollow()
            }
          >
            {isFollowing ? (
              <>
                <UserMinus className="mr-2" size={18} />
                <span>Отписаться</span>
              </>
            ) : (
              <>
                <UserPlus className="mr-2" size={18} />
                <span>Подписаться</span>
              </>
            )}
          </Button>

          <Button
            asChild
            className="w-full rounded-[1rem] text-sm h-11 border-neutral-200 dark:border-neutral-800/70"
            variant="outline"
          >
            <Link
              href={!currentUserId ? "#" : `/chat/${data.id}`}
              onClick={(e) => {
                if (!currentUserId) {
                  e.preventDefault();
                  toast.error(t("notAuthorized"), {
                    description: t("notAuthorizedDesc"),
                  });
                }
              }}
            >
              <span>Сообщение</span>
              <SendHorizontal className="ml-2" size={16} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProfileInfo;

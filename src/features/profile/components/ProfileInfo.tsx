"use client";

import type { ProfileData, ProfileStats } from "../types";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  UserPlus,
  UserMinus,
  Mail,
  Cake,
  MapPin,
  CalendarDays,
  Edit2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";

import { formatToClientDate } from "@/app/utils/formatToClientDate";
import { Button } from "@/components/ui/button";
import { openSettingsModal } from "@/src/store/settingsModal/settingsModal.slice";

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
  const profileEdit = useTranslations("Profile");
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (followError || unfollowError) {
      toast.error(t("subscriptionError"), {
        description: t("subscriptionErrorDesc"),
      });
    }
  }, [followError, unfollowError]);

  const handleFollowClick = () => {
    if (!currentUserId) {
      toast.error(t("notAuthorized"), { description: t("notAuthorizedDesc") });
    } else {
      onFollow();
    }
  };

  const isActionLoading = isDataLoading || isFollowLoading || isUnfollowLoading;

  const handleMessageClick = (e: React.MouseEvent) => {
    if (!currentUserId) {
      e.preventDefault();
      toast.error(t("notAuthorized"), { description: t("notAuthorizedDesc") });
    }
  };

  return (
    <div className="flex flex-col gap-3 px-1">

      {/* ── Row 1: имя/юзернейм + компактные кнопки действий (как на референсе) ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Name block */}
        <div className="min-w-0">
          {/* username frame decoration — сохранена как есть */}
          <div className="relative inline-block">
            {data.usernameFrameUrl && data.usernameFrameUrl !== "none" && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 select-none"
                style={{
                  backgroundImage: `url(${data.usernameFrameUrl})`,
                  backgroundRepeat: "repeat-x",
                  backgroundSize: "auto 100%",
                  backgroundPosition: "left center",
                }}
              />
            )}
            <h1 className="relative z-0 text-[19px] sm:text-[22px] font-bold leading-tight tracking-tight text-black dark:text-white">
              {data.name}
            </h1>
          </div>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            @{data.username}
          </p>
        </div>

        {/* Action buttons — компактные, видны всегда (не скрываются на мобилке) */}
        {!isOwner ? (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              asChild
              className="h-9 w-9 rounded-full p-0 border-neutral-200 dark:border-neutral-800"
              size="icon"
              variant="outline"
            >
              <Link
                href={!currentUserId ? "#" : `/chat/${data.id}`}
                onClick={handleMessageClick}
              >
                <Mail size={16} />
              </Link>
            </Button>
            <Button
              className="h-9 rounded-full px-4 text-[13px] font-semibold"
              disabled={isActionLoading}
              variant={isFollowing ? "secondary" : "default"}
              onClick={handleFollowClick}
            >
              {isFollowing ? (
                <><UserMinus className="mr-1.5" size={14} />Отписаться</>
              ) : (
                <><UserPlus className="mr-1.5" size={14} />Подписаться</>
              )}
            </Button>
          </div>
        ) : (
          <Button
            className="h-8 shrink-0 rounded-full border-neutral-700 bg-transparent px-4 text-[12px] font-medium text-neutral-600 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            size="sm"
            variant="outline"
            onClick={() => dispatch(openSettingsModal("profile"))}
          >
            <Edit2 className="mr-1.5" size={13} />
            {profileEdit("edit")}
          </Button>
        )}
      </div>

      {/* ── Row 2: bio ── */}
      {data.bio && (
        <p className="text-[14px] leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap font-serif">
          {data.bio}
        </p>
      )}

      {/* ── Row 3: доп. инфо (локация, дата рождения, дата регистрации) ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-neutral-500">
        {data.location && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {data.location}
          </span>
        )}
        {data.dateOfBirth && (
          <span className="flex items-center gap-1">
            <Cake size={14} />
            {formatToClientDate(data.dateOfBirth)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <CalendarDays size={14} />
          {formatToClientDate(data.createdAt)}
        </span>
      </div>

      {/* ── Row 4: статистика (Following / Followers / Posts) ── */}
      <div className="flex items-center gap-5 text-[13px] mt-1">
        <Link
          className="flex items-center gap-1 hover:underline underline-offset-4 decoration-neutral-400 dark:decoration-neutral-600"
          href={`/following/${data.id}`}
        >
          <span className="font-bold text-black dark:text-white">{stats.followingCount}</span>
          <span className="text-neutral-500">Подписки</span>
        </Link>
        <Link
          className="flex items-center gap-1 hover:underline underline-offset-4 decoration-neutral-400 dark:decoration-neutral-600"
          href={`/followers/${data.id}`}
        >
          <span className="font-bold text-black dark:text-white">{stats.followersCount}</span>
          <span className="text-neutral-500">Подписчики</span>
        </Link>
        <div className="flex items-center gap-1">
          <span className="font-bold text-black dark:text-white">{stats.postsCount}</span>
          <span className="text-neutral-500">Посты</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
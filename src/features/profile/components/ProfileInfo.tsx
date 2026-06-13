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

  return (
    <div className="flex flex-col gap-3 px-1">

      {/* ── Row 1: name + action button(s) ── */}
      <div className="flex items-start justify-between gap-3">
        {/* Name block */}
        <div className="min-w-0">
          {/* username frame decoration */}
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
            <h1 className="relative z-0 text-[22px] font-bold leading-tight tracking-tight text-white">
              {data.name}
            </h1>
          </div>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            @{data.username}
          </p>
        </div>

        {/* Action buttons — desktop only, stacked */}
        {!isOwner ? (
          <div className="hidden sm:flex flex-col gap-2 shrink-0 min-w-[140px]">
            <Button
              className="w-full h-9 rounded-full text-[13px] font-semibold"
              disabled={isActionLoading}
              variant={isFollowing ? "secondary" : "default"}
              onClick={handleFollowClick}
            >
              {isFollowing ? (
                <><UserMinus className="mr-1.5" size={15} />Отписаться</>
              ) : (
                <><UserPlus className="mr-1.5" size={15} />Подписаться</>
              )}
            </Button>
            <Button
              asChild
              className="w-full h-9 rounded-full text-[13px] border-neutral-800"
              variant="outline"
            >
              <Link
                href={!currentUserId ? "#" : `/chat/${data.id}`}
                onClick={(e) => {
                  if (!currentUserId) {
                    e.preventDefault();
                    toast.error(t("notAuthorized"), { description: t("notAuthorizedDesc") });
                  }
                }}
              >
                Сообщение
                <SendHorizontal className="ml-1.5" size={14} />
              </Link>
            </Button>
          </div>
        ) : (
          <Button
            className="h-8 shrink-0 rounded-full border-neutral-700 bg-transparent px-4 text-[12px] font-medium text-neutral-200 hover:bg-neutral-800"
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
        <p className="text-[13px] leading-relaxed text-neutral-300 whitespace-pre-wrap font-serif">
          {data.bio}
        </p>
      )}

      {/* ── Row 3: meta (location, birthday, joined) — compact single line ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-neutral-500">
        {data.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {data.location}
          </span>
        )}
        {data.dateOfBirth && (
          <span className="flex items-center gap-1">
            <Cake size={12} />
            {formatToClientDate(data.dateOfBirth)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <CalendarDays size={12} />
          {formatToClientDate(data.createdAt)}
        </span>
      </div>

      {/* ── Row 4: stats ── */}
      <div className="flex items-center gap-5 text-[13px]">
        <Link href={`/following/${data.id}`} className="flex items-center gap-1 hover:underline underline-offset-4 decoration-neutral-600">
          <span className="font-bold text-white">{stats.followingCount}</span>
          <span className="text-neutral-500">Подписки</span>
        </Link>
        <Link href={`/followers/${data.id}`} className="flex items-center gap-1 hover:underline underline-offset-4 decoration-neutral-600">
          <span className="font-bold text-white">{stats.followersCount}</span>
          <span className="text-neutral-500">Подписчики</span>
        </Link>
        <div className="flex items-center gap-1">
          <span className="font-bold text-white">{stats.postsCount}</span>
          <span className="text-neutral-500">Посты</span>
        </div>
      </div>

      {/* ── Row 5: action buttons — mobile only, side by side ── */}
      {!isOwner && (
        <div className="flex sm:hidden gap-2 pt-1">
          <Button
            className="flex-1 h-9 rounded-full text-[13px] font-semibold"
            disabled={isActionLoading}
            variant={isFollowing ? "secondary" : "default"}
            onClick={handleFollowClick}
          >
            {isFollowing ? (
              <><UserMinus className="mr-1.5" size={15} />Отписаться</>
            ) : (
              <><UserPlus className="mr-1.5" size={15} />Подписаться</>
            )}
          </Button>
          <Button
            asChild
            className="flex-1 h-9 rounded-full text-[13px] border-neutral-800"
            variant="outline"
          >
            <Link
              href={!currentUserId ? "#" : `/chat/${data.id}`}
              onClick={(e) => {
                if (!currentUserId) {
                  e.preventDefault();
                  toast.error(t("notAuthorized"), { description: t("notAuthorizedDesc") });
                }
              }}
            >
              Сообщение
              <SendHorizontal className="ml-1.5" size={14} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProfileInfo;
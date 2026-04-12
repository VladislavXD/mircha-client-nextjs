"use client";

import React from "react";
import { Modal, ModalContent, ModalBody, Avatar } from "@heroui/react";
import Link from "next/link";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  currentUserId?: string;
  name?: string;
  avatarUrl?: string;
  description?: string;
  bio?: string;
  backgroundUrl?: string;
  avatarFrameUrl?: string;
  usernameFrameUrl?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isOnline?: boolean;
  createdAt?: Date;
  status?: string;
  onFollowToggle?: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userId,
  currentUserId,
  name = "",
  avatarUrl = "",
  description = "",
  bio = "",
  backgroundUrl = "",
  avatarFrameUrl = "",
  usernameFrameUrl = "",
  followersCount = 0,
  followingCount = 0,
  isFollowing = false,
  isOnline = false,
  createdAt,
  status,
  onFollowToggle,
}) => {
  const profileHref = userId ? `/user/${userId}` : "#";
  const displayBio = bio || description || "";

  const formatDate = (date?: Date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <Modal
      classNames={{
        base: "bg-[#101010] border border-white/10 rounded-2xl shadow-2xl max-w-[340px] mx-auto",
        closeButton:
          "top-3 right-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20",
      }}
      isOpen={isOpen}
      placement="center"
      size="sm"
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="p-0 overflow-hidden rounded-2xl">
          {/* ── Cover ── */}
          <div className="relative h-[90px] w-full shrink-0">
            {backgroundUrl ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={backgroundUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-blue-900/60 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
          </div>

          {/* ── Avatar row ── */}
          <div className="px-5 -mt-9 flex items-end justify-between">
            {/* Avatar */}
            <Link
              className="relative z-10 shrink-0"
              href={profileHref}
              onClick={onClose}
            >
              <div className="relative">
                {avatarFrameUrl && (
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      backgroundImage: `url(${avatarFrameUrl})`,
                      backgroundSize: "auto 250%",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}
                <Avatar
                  isBordered
                  className="w-[68px] h-[68px] ring-[3px] ring-[#101010] transition-opacity hover:opacity-90"
                  color={isOnline ? "success" : "default"}
                  src={avatarUrl || "/default-avatar.png"}
                />
                {isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#101010] z-20" />
                )}
              </div>
            </Link>

            {/* Follow button — always reserve space if callback present */}
            {userId !== currentUserId && (
              <button
                className={`mb-1 px-5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  !onFollowToggle
                    ? "invisible pointer-events-none border-transparent bg-white text-black"
                    : isFollowing
                      ? "border-white/20 text-white/80 hover:border-red-500/60 hover:text-red-400 bg-white/5"
                      : "border-transparent bg-white text-black hover:bg-white/90"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onFollowToggle?.();
                }}
              >
                {isFollowing ? "Отписаться" : "Подписаться"}
              </button>
            )}
          </div>

          {/* ── Status badge ── */}
          {status && status.trim() && (
            <div className="px-5 -mt-1 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/70 text-[12px] leading-snug max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400/80 shrink-0" />
                <span className="truncate">{status.trim()}</span>
              </span>
            </div>
          )}

          {/* ── Name & username ── */}
          <div className="px-5 pt-2 pb-1">
            <Link
              className="group inline-block"
              href={profileHref}
              onClick={onClose}
            >
              {usernameFrameUrl ? (
                <div className="relative inline-block">
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      backgroundImage: `url(${usernameFrameUrl})`,
                      backgroundRepeat: "repeat-x",
                      backgroundSize: "auto 100%",
                      backgroundPosition: "left center",
                    }}
                  />
                  <span className="relative z-0 px-1 text-white font-bold text-[17px] group-hover:underline">
                    {name}
                  </span>
                </div>
              ) : (
                <span className="text-white font-bold text-[17px] group-hover:underline">
                  {name}
                </span>
              )}
            </Link>

            {isOnline && (
              <span className="ml-2 text-xs text-green-400 font-medium align-middle">
                онлайн
              </span>
            )}

            {/* Bio */}
            {displayBio && (
              <p className="text-white/60 text-[13px] leading-relaxed mt-1.5">
                {displayBio}
              </p>
            )}

            {/* Registration date */}
            {createdAt && (
              <div className="flex items-center gap-1 mt-1.5">
                <svg
                  className="w-3 h-3 text-white/30 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-white/30 text-[11px]">
                  С нами с {formatDate(createdAt)}
                </span>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="mx-5 my-3 h-px bg-white/[0.07]" />

          {/* ── Stats ── */}
          <div className="px-5 pb-5 flex gap-6">
            <Link
              className="group flex flex-col"
              href={`${profileHref}?tab=followers`}
              onClick={onClose}
            >
              <span className="text-white font-bold text-sm group-hover:underline">
                {followersCount.toLocaleString()}
              </span>
              <span className="text-white/40 text-xs">подписчиков</span>
            </Link>
            <Link
              className="group flex flex-col"
              href={`${profileHref}?tab=following`}
              onClick={onClose}
            >
              <span className="text-white font-bold text-sm group-hover:underline">
                {followingCount.toLocaleString()}
              </span>
              <span className="text-white/40 text-xs">подписок</span>
            </Link>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserProfileModal;

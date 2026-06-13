"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { useUserProfile } from "../hooks/useUserProfile";
import { useOnlineStatus } from "../../chat";

import { ProfileInfo } from "./ProfileInfo";
import { ProfileStatus } from "./ProfileStatus";
import StatusModal from "./modals/Status.Modals";
import { SelectAppearanceModal } from "./modals/SelectAppearanceModal";
import { ConfirmAppearanceModal } from "./modals/ConfirmAppearanceModal";


interface ProfileHeaderProps {
  userId: string;
  isAuthenticated?: boolean;
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  userId,
  isAuthenticated: externalIsAuthenticated,
  isOwnProfile: externalIsOwnProfile,
}: ProfileHeaderProps) {
  const {
    data,
    currentUser,
    isFollowing,
    isOwnProfile: hookIsOwnProfile,
    isAuthenticated: hookIsAuthenticated,
    isFollowLoading,
    isUnfollowLoading,
    isDataLoading,
    handleFollow,
    followError,
    unfollowError,
    openAppearance,
    appearanceType,
    selectedItem,
    appearanceModal,
    confirmModal,
    FRAME_PRESETS,
    BACKGROUND_PRESETS,
    handleSelectAppearance,
    handleConfirmAppearance,
    isUpdating,
    statusModal,
    updateStatus,
    setUpdateStatus,
    maxLength,
    currentLength,
    isMaxReached,
    isUpdating: isStatusUpdating,
    handleSaveStatus,
    handleOpenStatusModal,
  } = useUserProfile(userId);

  const isOwnProfile = externalIsOwnProfile ?? hookIsOwnProfile;
  const isAuthenticated = externalIsAuthenticated ?? hookIsAuthenticated;

  const t = useTranslations("Profile");
  const { isOnline } = useOnlineStatus(userId, currentUser?.id);

  if (!data) {
    return <div>{t("loading") || "Загрузка..."}</div>;
  }

  const isvideo = data.backgroundUrl?.endsWith(".mp4") || false;

  // Avatar size in px — single source of truth
  const AVATAR_SIZE = 96; // mobile
  const AVATAR_SIZE_LG = 120; // lg

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl">
        {/* ── Background ── */}
        <div className="relative h-48 sm:h-64 md:h-72">
          {data.backgroundUrl && data.backgroundUrl !== "none" ? (
            isvideo ? (
              <video
                autoPlay loop muted playsInline
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={data.backgroundUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                alt="Profile background"
                className="absolute inset-0 h-full w-full object-cover"
                src={data.backgroundUrl}
              />
            )
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-blue-900/60 to-black" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
            </>
          )}
        </div>

        {/* ── Card body ── */}
        <div className="relative -mt-5 rounded-t-[1.5rem] bg-white dark:bg-[#101010] px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">

            {/* ── Avatar column: avatar + status stacked vertically, centered ── */}
            <div className="flex flex-col items-center shrink-0">

              {/* Avatar wrapper — lifted above card */}
              <div
                className="relative shrink-0 -mt-14 lg:-mt-16"
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              >
                {/* Square crop container — forces 1:1 */}
                <div className="relative w-full h-full overflow-hidden rounded-[20px] sm:rounded-[22px]">
                  <img
                    alt={data.name || "User avatar"}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={data.avatarUrl || "/default-avatar.png"}
                  />
                </div>

                {/* Avatar frame — sits on top, same size, pointer-events none */}
                {data.avatarFrameUrl && data.avatarFrameUrl !== "none" && (
                  <img
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain z-10"
                    src={data.avatarFrameUrl}
                  />
                )}

                {/* Border fallback when no frame */}
                {(!data.avatarFrameUrl || data.avatarFrameUrl === "none") && (
                  <div className="pointer-events-none absolute inset-0 rounded-[20px] sm:rounded-[22px] ring-[3px] ring-white dark:ring-[#101010]" />
                )}

                {/* Online dot */}
                {isOnline && (
                  <div
                    className="absolute bottom-1.5 right-1.5 z-20 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-[#101010]"
                    title="Онлайн"
                  />
                )}
              </div>

              {/* Status badge — always below avatar, centered */}
              <div className="mt-2 flex justify-center">
                {!isOwnProfile
                  ? data.status && (
                      <ProfileStatus isOwner={false} status={data.status} />
                    )
                  : isAuthenticated && (
                      <ProfileStatus
                        isOwner={true}
                        status={data.status}
                        onOpen={handleOpenStatusModal}
                      />
                    )}
              </div>
            </div>

            {/* ── Info column ── */}
            <div className="flex-1 min-w-0 lg:pt-2">
              <ProfileInfo
                currentUserId={currentUser?.id}
                data={data}
                followError={followError}
                isDataLoading={isDataLoading}
                isFollowLoading={isFollowLoading}
                isFollowing={isFollowing}
                isOwner={isOwnProfile}
                isUnfollowLoading={isUnfollowLoading}
                stats={{
                  followersCount: data._count?.followers || 0,
                  followingCount: data._count?.following || 0,
                  postsCount: data._count?.post || 0,
                }}
                unfollowError={unfollowError}
                onFollow={handleFollow || (() => {})}
              />
            </div>
          </div>
        </div>
      </div>

      <StatusModal
        currentLength={currentLength}
        isMaxReached={isMaxReached}
        isOpen={statusModal.isOpen}
        isUpdating={isStatusUpdating}
        maxLength={maxLength}
        setUpdateStatus={setUpdateStatus}
        updateStatus={updateStatus}
        userAvatalUrl={data.avatarUrl}
        onOpenChange={statusModal.onOpenChange}
        onSave={handleSaveStatus}
      />

      <SelectAppearanceModal
        appearanceType={appearanceType}
        isOpen={appearanceModal.isOpen}
        items={appearanceType === "frame" ? FRAME_PRESETS : BACKGROUND_PRESETS}
        selectedItem={selectedItem}
        userAvatarUrl={data?.avatarUrl}
        onClose={appearanceModal.onClose}
        onOpenChange={appearanceModal.onOpenChange}
        onSelectAppearance={handleSelectAppearance}
      />

      <ConfirmAppearanceModal
        appearanceType={appearanceType}
        isOpen={confirmModal.isOpen}
        isUpdating={isUpdating}
        onConfirm={handleConfirmAppearance}
        onOpenChange={confirmModal.onOpenChange}
      />
    </>
  );
}

export default ProfileHeader; 
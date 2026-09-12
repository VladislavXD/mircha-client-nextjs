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
  /**
   * Табы + лента постов передаются сюда снаружи (см. UserProfile.tsx).
   * Это обязательно для sticky-эффекта: фон и контент, который должен
   * его "задвигать" при скролле, обязаны жить в одном и том же
   * непрерывном контейнере.
   */
  children?: React.ReactNode;
}

export function ProfileHeader({
  userId,
  isAuthenticated: externalIsAuthenticated,
  isOwnProfile: externalIsOwnProfile,
  children,
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
  const AVATAR_SIZE = 88;
  // Аватар "наезжает" на фон ровно на половину своей высоты — так он всегда
  // одинаково перекрывает фон независимо от брейкпоинта, без подбора чисел
  const AVATAR_OVERLAP = AVATAR_SIZE / 2;

  return (
    <>
      {/*
        Внешняя обёртка НЕ должна иметь overflow-hidden — иначе
        position: sticky у фона просто перестанет работать
        (браузер обрежет "прилипающий" элемент вместо того, чтобы дать
        ему прилипнуть к верху вьюпорта).
      */}
      <div className="relative w-full">
        {/* ── Sticky Header (Background + Profile Info) ── */}
        <div className="sticky top-0 left-0 right-0 z-0 flex flex-col justify-end h-[45vh] min-h-[350px] overflow-hidden md:rounded-t-[2rem]">
          
          {/* Фоновая картинка */}
          <div className="absolute inset-0 z-0">
            {data.backgroundUrl && data.backgroundUrl !== "none" ? (
              isvideo ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
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
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-blue-900/60 to-black" />
            )}

            {/* Зона размытия, которая накладывается поверх нижней части фона */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-64 backdrop-blur-xl [mask-image:linear-gradient(to_top,black,transparent)]"
            />
            {/* Плавный переход фона в цвет страницы для читаемости текста */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#101010] dark:via-[#101010]/80"
            />
          </div>

          {/* Инфо профиля (Аватар, Статус, Имя, Био, Кнопки) - прикреплено к низу sticky блока */}
          <div className="relative z-10 px-4 pb-5 sm:px-6 flex flex-col md:flex-row md:gap-5 md:items-start w-full">
            <div className="shrink-0" style={{ width: AVATAR_SIZE }}>
              <div
                className="relative shrink-0"
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  marginTop: -AVATAR_OVERLAP,
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[20px] sm:rounded-[22px]">
                  <img
                    alt={data.name || "User avatar"}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={data.avatarUrl || "/default-avatar.png"}
                  />
                </div>

                {data.avatarFrameUrl && data.avatarFrameUrl !== "none" && (
                  <img
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-contain"
                    src={data.avatarFrameUrl}
                  />
                )}

                {(!data.avatarFrameUrl || data.avatarFrameUrl === "none") && (
                  <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-[3px] ring-white dark:ring-[#101010] sm:rounded-[22px]" />
                )}

                {isOnline && (
                  <div
                    className="absolute bottom-1.5 right-1.5 z-20 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-[#101010]"
                    title="Онлайн"
                  />
                )}
              </div>

              {/* Статус */}
              <div className="relative z-30 mt-2.5 flex justify-center md:justify-start">
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

            <div className="mt-3 md:mt-0 flex-1 min-w-0 md:pt-2">
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

        {/* ── Скроллящийся контент (Табы + Посты) ── 
            Он следует за sticky-блоком в потоке документа, поэтому при скролле 
            будет наезжать на него снизу. */}
        <div className="relative z-20 w-full">
          {children && (
            <div className="bg-white dark:bg-[#101010] px-4 pt-6 pb-5 sm:px-6 w-full min-h-screen">
              {children}
            </div>
          )}
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
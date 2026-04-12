"use client";

import React from "react";
import { Edit2, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUserProfile } from "../hooks/useUserProfile";
import { useOnlineStatus } from "../../chat";

import { ProfileInfo } from "./ProfileInfo";
import { ProfileStatus } from "./ProfileStatus";
import StatusModal from "./modals/Status.Modals";
import { SelectAppearanceModal } from "./modals/SelectAppearanceModal";
import { ConfirmAppearanceModal } from "./modals/ConfirmAppearanceModal";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import defaultProfileBg from "@/public/images/default_profile_bg.png";

interface ProfileHeaderProps {
  userId: string;
  isAuthenticated?: boolean; // ✅ Флаг авторизации (если передан извне)
  isOwnProfile?: boolean; // ✅ Флаг своего профиля (если передан извне)
}

/**
 * Компонент шапки профиля с аватаром, фоном и основной информацией.
 */
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
    // Appearance из нового хука
    openAppearance,
    appearanceType,
    selectedItem,
    appearanceModal,
    confirmModal,
    FRAME_PRESETS,
    BACKGROUND_PRESETS,
    handleSelectAppearance,
    handleConfirmAppearance,
    isUpdating, // Флаг загрузки обновления appearance
    // Status данные и действия
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

  // ✅ Используем внешние флаги если переданы, иначе из хука
  const isOwnProfile = externalIsOwnProfile ?? hookIsOwnProfile;
  const isAuthenticated = externalIsAuthenticated ?? hookIsAuthenticated;

  const pathname = usePathname();
  const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/);
  const locale = localeMatch?.[1];

  const prefix = locale ? `/${locale}` : "";

  const { isOnline } = useOnlineStatus(userId);

  if (!data) {
    return <div>Загрузка профиля...</div>;
  }

  const isvideo = data.backgroundUrl?.endsWith(".mp4") || false;

  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl"
        style={{
          backgroundImage: `url(${
            data.backgroundUrl === "none" ? defaultProfileBg.src : ""
          })`,
        }}
      >
        {/* Фон профиля */}
        <div className="relative h-64 md:h-80">
          {isvideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={`${data.backgroundUrl}`} type="video/mp4" />
            </video>
          ) : (
            data.backgroundUrl !== "none" && (
              <img
                alt="Profile background"
                className="absolute inset-0 w-full h-full object-cover"
                src={data.backgroundUrl}
              />
            )
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#101010]/80 dark:from-black/80 via-black/20 to-transparent" />

          {/* Кнопки редактирования (только для своего профиля И авторизованных) */}
          {isOwnProfile && isAuthenticated && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                asChild
                className="bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white border-white/20 hover:text-white rounded-[1rem]"
                size="sm"
                variant="outline"
              >
                <Link href={`${prefix}/dashboard/settings/profile`}>
                  <Edit2 className="mr-1.5" size={14} />
                  Редактировать
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white border-white/20 hover:text-white rounded-[1rem]"
                    size="sm"
                    variant="outline"
                  >
                    <LayoutTemplate className="mr-1.5" size={14} />
                    Оформление
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-[1rem]">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openAppearance("frame")}
                  >
                    Рамка аватара
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openAppearance("background")}
                  >
                    Фон профиля
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Основная информация */}
        <div className="relative bg-white dark:bg-[#101010] p-6 rounded-t-[1.5rem] -mt-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Аватар */}
            <div className="relative shrink-0 mx-auto lg:mx-0">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 -mt-16 lg:-mt-20">
                <div className="absolute inset-0 flex items-center justify-center p-3 overflow-hidden">
                  <img
                    alt={data.name || "User avatar"}
                    className={`w-full h-full object-cover rounded-[2rem] sm:rounded-[2.5rem] shadow-xl ${
                      !data.avatarFrameUrl
                        ? "border-[4px] border-white dark:border-[#101010]"
                        : ""
                    }`}
                    src={data.avatarUrl || "/default-avatar.png"}
                    style={{
                      width: "150px",
                      height: "150px",
                    }}
                  />

                  {/* Рамка аватара */}
                  {data.avatarFrameUrl && data.avatarFrameUrl !== "none" && (
                    <img
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full pointer-events-none select-none z-100"
                      src={data.avatarFrameUrl}
                    />
                  )}
                </div>

                {/* Индикатор статуса онлайн */}
                {isOnline && (
                  <div
                    className="absolute bottom-3 right-4 lg:bottom-4 lg:right-4 w-5 h-5 lg:w-6 lg:h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-[#101010] shadow-sm z-20"
                    title="Онлайн"
                  />
                )}
              </div>

              {/* Статус пользователя */}
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
            </div>

            {/* Информация о пользователе */}
            <div className="flex-1">
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

      {/* Модалка выбора оформления */}
      <SelectAppearanceModal
        isOpen={appearanceModal.isOpen}
        onOpenChange={appearanceModal.onOpenChange}
        onClose={appearanceModal.onClose}
        appearanceType={appearanceType}
        selectedItem={selectedItem}
        items={
          appearanceType === "frame" ? FRAME_PRESETS : BACKGROUND_PRESETS
        }
        userAvatarUrl={data?.avatarUrl}
        onSelectAppearance={handleSelectAppearance}
      />

      {/* Модалка подтверждения */}
      <ConfirmAppearanceModal
        isOpen={confirmModal.isOpen}
        onOpenChange={confirmModal.onOpenChange}
        appearanceType={appearanceType}
        isUpdating={isUpdating}
        onConfirm={handleConfirmAppearance}
      />
    </>
  );
}

export default ProfileHeader;

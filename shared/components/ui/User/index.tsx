import { Avatar, Badge, User as NextUser } from "@heroui/react";
import React, { useState } from "react";
import SmartTooltip from "../SmartTooltip";
import { useOnlineStatus } from "@/src/features/chat";
import { UserProfileModal } from "@/src/features/user/components";

type Props = {
  userId?: string;
  name?: string;
  avatarUrl: string;
  description?: string;
  className?: string;
  usernameFrameUrl?: string;
  avatarFrameUrl?: string;
  backgroundUrl?: string;
  dateOfBirth?: Date;
  bio?: string;
  createdAt?: Date;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isOnline?: boolean;
  onFollowToggle?: () => void;
  avatarClassName?: string;
  nameClassName?: string;
  descriptionClassName?: string;
  status?: string;
  /** Режим: default | avatar-only | name-only */
  variant?: "default" | "avatar-only" | "name-only";
  /** Показывать badge с плюсом на аватаре */
  showFollowBadge?: boolean;
  /** id текущего юзера, чтобы не показывать + на своём посте */
  currentUserId?: string;
};

const User = ({
  userId,
  name = "",
  avatarUrl = "",
  description = "",
  className = "",
  usernameFrameUrl = "",
  avatarFrameUrl = "",
  backgroundUrl = "",
  dateOfBirth,
  bio = "",
  createdAt,
  followersCount = 0,
  followingCount = 0,
  isFollowing = false,
  isOnline = false,
  onFollowToggle,
  avatarClassName = "",
  nameClassName = "",
  descriptionClassName = "",
  status,
  variant = "default",
  showFollowBadge = false,
  currentUserId,
}: Props) => {
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const tooltipDescription = bio || description || "Нет описания";

  const tooltipContent = (
    <div className="relative w-[300px] rounded-2xl overflow-hidden bg-[#101010] border border-white/10 shadow-2xl">
      {/* Обложка */}
      <div className="relative h-20 w-full">
        {backgroundUrl ? (
          <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
            <source src={backgroundUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-blue-900/60 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
      </div>

      {/* Аватар — выплывает поверх обложки */}
      <div className="px-4 -mt-8 flex items-end justify-between">
        <div className="relative">
          {avatarFrameUrl && avatarFrameUrl.trim() !== "" && (
            <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-10" style={{ backgroundImage: `url(${avatarFrameUrl})`, backgroundSize: 'auto 250%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
          )}
          <Avatar
            isBordered
            color={isOnline ? "success" : "default"}
            src={avatarUrl || "/default-avatar.png"}
            className="w-16 h-16 ring-2 ring-[#101010]"
          />
          {/* Онлайн-метка */}
          {isOnline && (
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#101010] z-20" />
          )}
        </div>

        {/* Кнопка подписки — справа */}
        {onFollowToggle && (
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onFollowToggle(); }}
            className={`mb-1 px-5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
              isFollowing
                ? "border-white/20 text-white/80 hover:border-red-500/60 hover:text-red-400 bg-white/5"
                : "border-transparent bg-white text-black hover:bg-white/90"
            }`}
          >
            {isFollowing ? "Отписаться" : "Подписаться"}
          </button>
        )}
      </div>

      {/* Имя + онлайн статус */}
      <div className="px-4 pt-2 pb-1">
        <div className="flex items-center gap-2">
          {usernameFrameUrl && usernameFrameUrl.trim() !== "" ? (
            <div className="relative inline-block">
              <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-10" style={{ backgroundImage: `url(${usernameFrameUrl})`, backgroundRepeat: "repeat-x", backgroundSize: "auto 100%", backgroundPosition: "left center" }} />
              <span className="relative z-0 px-1 text-white font-bold text-base">{name}</span>
            </div>
          ) : (
            <span className="text-white font-bold text-base">{name}</span>
          )}
          {isOnline && (
            <span className="text-xs text-green-400 font-medium">онлайн</span>
          )}
        </div>

        {/* Био */}
        {tooltipDescription && tooltipDescription !== "Нет описания" && (
          <p className="text-white/60 text-xs leading-relaxed mt-1">{truncateText(tooltipDescription, 90)}</p>
        )}

        {/* Дата регистрации */}
        {createdAt && (
          <div className="flex items-center gap-1 mt-1.5">
            <svg className="w-3 h-3 text-white/30" fill="none" strokeWidth={2} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white/30 text-[10px]">С нами с {formatDate(createdAt)}</span>
          </div>
        )}
      </div>

      {/* Разделитель */}
      <div className="mx-4 my-2 h-px bg-white/[0.06]" />

      {/* Статистика */}
      <div className="px-4 pb-4 flex gap-5">
        <div>
          <span className="text-white font-bold text-sm">{followersCount.toLocaleString()}</span>
          <span className="text-white/40 text-xs ml-1">подписчиков</span>
        </div>
        <div>
          <span className="text-white font-bold text-sm">{followingCount.toLocaleString()}</span>
          <span className="text-white/40 text-xs ml-1">подписок</span>
        </div>
      </div>
    </div>
  );

  // ====================== AVATAR-ONLY ======================
  if (variant === "avatar-only") {
    const canFollow = showFollowBadge && !!onFollowToggle && currentUserId !== userId;
    return (
      <>
        <div
          className="relative inline-flex shrink-0 cursor-pointer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsModalOpen(true); }}
          title={name || undefined}
        >
          <Badge
            color={isOnline ? "success" : "default"}
            placement="bottom-left"
            shape="circle"
            content=""
            isInvisible={!isOnline}
            className="border-2 border-black"
          >
            <Avatar
              isBordered
              src={avatarUrl || "/default-avatar.png"}
              className={avatarClassName || "w-10 h-10"}
            />
          </Badge>
          {canFollow && (
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onFollowToggle!(); }}
              title={isFollowing ? 'Отписаться' : 'Подписаться'}
              className={`absolute -bottom-1 -right-1 z-10 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold leading-none transition-colors ${
                isFollowing ? 'bg-default-400 hover:bg-default-500 text-black' : 'bg-white hover:bg-gray-100 text-black'
              }`}
            >
              +
            </button>
          )}
        </div>

        <UserProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={userId}
          name={name}
          avatarUrl={avatarUrl}
          description={description}
          bio={bio}
          backgroundUrl={backgroundUrl}
          avatarFrameUrl={avatarFrameUrl}
          usernameFrameUrl={usernameFrameUrl}
          followersCount={followersCount}
          followingCount={followingCount}
          isFollowing={isFollowing}
          isOnline={isOnline}
          createdAt={createdAt}
          status={status}
          onFollowToggle={onFollowToggle}
        />
      </>
    );
  }

  // ====================== NAME-ONLY ======================
  if (variant === "name-only") {
    return (
      <SmartTooltip content={tooltipContent} className="z-50" placement="top" showArrow>
        <span className={`font-semibold truncate hover:underline cursor-pointer ${nameClassName || "text-sm text-white"}`}>
          {usernameFrameUrl && usernameFrameUrl.trim() !== "" ? (
            <span className="relative inline-block">
              <span className="absolute inset-0 w-full h-full pointer-events-none select-none z-10" style={{ backgroundImage: `url(${usernameFrameUrl})`, backgroundRepeat: "repeat-x", backgroundSize: "auto 200%", backgroundPosition: "left center" }} />
              <span className="relative z-0 px-1">{name}</span>
            </span>
          ) : name}
        </span>
      </SmartTooltip>
    );
  }

  // ====================== DEFAULT ======================
  return (
    <SmartTooltip content={tooltipContent} className="z-50" placement="top" showArrow>
      <div className="relative inline-block items-start">
        <Badge color={isOnline ? "success" : "default"} placement="bottom-right" shape="circle" content="" className="mb-1">
          <></>
        </Badge>
        <NextUser
          name={name}
          className={className}
          description={
            description ? (
              usernameFrameUrl && usernameFrameUrl.trim() !== "" ? (
                <div className="relative inline-block">
                  <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-10" style={{ backgroundImage: `url(${usernameFrameUrl})`, backgroundRepeat: "repeat-x", backgroundSize: "auto 200%", backgroundPosition: "left center" }} />
                  <span className="relative z-0 px-1">{description}</span>
                </div>
              ) : description
            ) : undefined
          }
          classNames={{ name: nameClassName || undefined, description: descriptionClassName || undefined }}
          avatarProps={{ isBordered: true, src: avatarUrl || "/default-avatar.png", className: avatarClassName || undefined }}
        />
      </div>
    </SmartTooltip>
  );
};

export default User;

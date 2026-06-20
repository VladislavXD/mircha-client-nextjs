import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";


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
  onAvatarClick?: () => void;
  avatarClassName?: string;
  nameClassName?: string;
  descriptionClassName?: string;
  status?: string;
  /** Режим: default | avatar-only | name-only */
  variant?: "default" | "avatar-only" | "name-only" | "mention";
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
  onAvatarClick,
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


  const canFollow =
    showFollowBadge && !!onFollowToggle && currentUserId !== userId;

  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tooltipDescription = bio || description || "Нет описания";

  const isvideo = backgroundUrl?.endsWith(".mp4") || false;

  const tooltipContent = (
    <div className="relative w-[300px] rounded-2xl overflow-hidden bg-[#101010] border border-white/10 shadow-2xl">
      {/* Обложка */}
      <div className="relative h-20 w-full">
        {/* Градиент обложки */}

        {backgroundUrl && backgroundUrl !== "none" ? (
          isvideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={`${backgroundUrl}`} type="video/mp4" />
            </video>
            
          ) : (
            backgroundUrl !== "none" && (
              <>
              <img
                alt="Profile background"
                className="absolute inset-0 w-full h-full object-cover"
                src={backgroundUrl}
              />
              
              </>
            )
          )
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-blue-900/60 to-black " />

          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />
      </div>

      {/* Аватар — выплывает поверх обложки */}
      <div className="px-4 -mt-8 flex items-end justify-between">
        <div className="relative">
          {avatarFrameUrl && avatarFrameUrl.trim() !== "" && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
              style={{
                backgroundImage: `url(${avatarFrameUrl})`,
                backgroundSize: "auto 250%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
          <Avatar className="w-16 h-16 ring-2 ring-[#101010]">
            <AvatarImage alt={name} src={avatarUrl || "/default-avatar.png"} />
            <AvatarFallback>
              {name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {/* Онлайн-метка */}
          {isOnline && (
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#101010] z-20" />
          )}
        </div>

        {/* Кнопка подписки — справа */}
        {canFollow && onFollowToggle && (
          <button
            className={`mb-1 mt-9 px-5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200  ${
              isFollowing
                ? "border-white/20 text-white/80 hover:border-red-500/60 hover:text-red-400 bg-white/5"
                : "border-transparent bg-white text-black hover:bg-white/90"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onFollowToggle();
            }}
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
              <div
                className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                style={{
                  backgroundImage: `url(${usernameFrameUrl})`,
                  backgroundRepeat: "repeat-x",
                  backgroundSize: "auto 100%",
                  backgroundPosition: "left center",
                }}
              />
              <span className="relative z-0 px-1 text-white font-bold text-base">
                {name}
              </span>
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
          <p className="text-white/60 text-xs leading-relaxed mt-1">
            {truncateText(tooltipDescription, 90)}
          </p>
        )}

        {/* Дата регистрации */}
        {createdAt && (
          <div className="flex items-center gap-1 mt-1.5">
            <svg
              className="w-3 h-3 text-white/30"
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
            <span className="text-white/30 text-[10px]">
              С нами с {formatDate(createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* Разделитель */}
      <div className="mx-4 my-2 h-px bg-white/[0.06]" />

      {/* Статистика */}
      <div className="px-4 pb-4 flex gap-5">
        <div>
          <span className="text-white font-bold text-sm">
            {followersCount.toLocaleString()}
          </span>
          <span className="text-white/40 text-xs ml-1">подписчиков</span>
        </div>
        <div>
          <span className="text-white font-bold text-sm">
            {followingCount.toLocaleString()}
          </span>
          <span className="text-white/40 text-xs ml-1">подписок</span>
        </div>
      </div>
    </div>
  );

  // ====================== AVATAR-ONLY ======================

  if (variant === "avatar-only") {
    return (
      <>
        <div
          className="relative inline-flex shrink-0 cursor-pointer"
          role="button"
          tabIndex={0}
          title={name || undefined}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
             onAvatarClick?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onAvatarClick?.();
            }
          }}
        >
          <div className="relative">
            <Avatar className={`${avatarClassName || "w-10 h-10"} `}>
              <AvatarImage
                alt={name}
                src={avatarUrl || "/default-avatar.png"}
              />
              <AvatarFallback>
                {name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {isOnline && (
              <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
            )}
            {
              currentUserId !== userId && !isFollowing && (
                <span className="absolute bottom-0 bg-white border-2  rounded-full right-0 block w-2.5 h-2.5 z-0 flex items-center justify-center before:absolute before:w-1.5 before:h-0.5 before:bg-black before:rounded-full after:absolute after:w-0.5 after:h-1.5 after:bg-black after:rounded-full" />
              )
            }

            {canFollow && !isFollowing && (
              <button
                className="absolute -bottom-[2px] -right-[2px] z-10 w-4 h-4 rounded-full border-[1.5px] border-[#101010] bg-white flex items-center justify-center text-[12px] font-bold text-black hover:bg-neutral-200 transition-colors"
                title="Подписаться"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onFollowToggle!();
                }}
              >
                <span className="relative -top-[0.5px] leading-none">+</span>
              </button>
            )}
          </div>
        </div>

      </>
    );
  }

  // ====================== NAME-ONLY ======================
  if (variant === "name-only") {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <span
            className={`font-semibold truncate hover:underline cursor-pointer ${nameClassName || "text-sm text-white"}`}
          >
            {usernameFrameUrl && usernameFrameUrl.trim() !== "" ? (
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                  style={{
                    backgroundImage: `url(${usernameFrameUrl})`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "auto 200%",
                    backgroundPosition: "left center",
                  }}
                />
                <span className="relative z-0 px-1">{name}</span>
              </span>
            ) : (
              name
            )}
          </span>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-[300px] p-0 border-none bg-transparent shadow-none z-50"
          side="top"
        >
          {tooltipContent}
        </HoverCardContent>
      </HoverCard>
    );
  }

  // ====================== NAME-ONLY ======================
  if (variant === "mention") {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <span
            className={`font-semibold truncate hover:underline cursor-pointer ${nameClassName || "text-sm"}`}
          >
            {usernameFrameUrl && usernameFrameUrl.trim() !== "" ? (
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                  style={{
                    backgroundImage: `url(${usernameFrameUrl})`,
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "auto 200%",
                    backgroundPosition: "left center",
                  }}
                />
                <span className="relative z-0 px-1">{name}</span>
              </span>
            ) : (
              <Link href={`/user/${userId}`} onClick={e=> e.stopPropagation()} className="!text-blue-500 inline ">{`@${name}`}</Link>
            )}
          </span>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-[300px] p-0 border-none bg-transparent shadow-none z-50"
          side="top"
        >
          {tooltipContent}
        </HoverCardContent>
      </HoverCard>
    );
  }

  // ====================== DEFAULT ======================

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={`relative inline-flex items-center gap-3 cursor-pointer ${className}`}
        >
          <div className="relative">
            <Avatar
              className={`${avatarClassName || "w-10 h-10"} ${isOnline ? "ring-2 ring-green-500" : ""}`}
            >
              <AvatarImage
                alt={name}
                src={avatarUrl || "/default-avatar.png"}
              />
              <AvatarFallback>
                {name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-green-500 border border-[#101010]" />
            )}
            {canFollow && !isFollowing && (
              <button
                className="absolute -bottom-[2px] -right-[2px] z-10 w-4 h-4 rounded-full border-[1.5px] border-[#101010] bg-white flex items-center justify-center text-[12px] font-bold text-black hover:bg-neutral-200 transition-colors"
                title="Подписаться"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onFollowToggle();
                }}
              >
                <span className="relative -top-[0.5px] leading-none">+</span>
              </button>
            )}
          </div>

          <div className="flex flex-col">
            <span
              className={`font-medium ${nameClassName || "text-sm text-foreground"}`}
            >
              {name}
            </span>
            {description && (
              <span
                className={descriptionClassName || "text-xs text-default-500"}
              >
                {usernameFrameUrl && usernameFrameUrl.trim() !== "" ? (
                  <div className="relative inline-block">
                    <div
                      className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                      style={{
                        backgroundImage: `url(${usernameFrameUrl})`,
                        backgroundRepeat: "repeat-x",
                        backgroundSize: "auto 200%",
                        backgroundPosition: "left center",
                      }}
                    />
                    <span className="relative z-0 px-1">{description}</span>
                  </div>
                ) : (
                  description
                )}
              </span>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[300px] p-0 border-none bg-transparent shadow-none z-50"
        side="top"
      >
        {tooltipContent}
      </HoverCardContent>
    </HoverCard>
  );
};

export default User;

import React, { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useFollow,
  useUnfollow,
} from "@/src/features/follow/hooks/useFollowMutations";

type RecommendedUserProps = {
  user: any;
  onRemove: (userId: string) => void;
};

export const RecommendedUserCard = ({
  user,
  onRemove,
}: RecommendedUserProps) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollow || false);
  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFollowing) {
      setIsFollowing(false);
      unfollowMutation.mutate(user.id);
    } else {
      setIsFollowing(true);
      followMutation.mutate(user.id);
    }
  };

  return (
    <div className="group relative flex flex-col items-center px-3 py-4 sm:p-4 w-full h-full rounded-[1.25rem] bg-[#f7f7f7] dark:bg-[#161616] shrink-0 transition-transform duration-200 active:scale-[0.96] cursor-pointer select-none">
      {/* Удалить карточку */}
      <button
        className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 bg-black/5 dark:bg-white/10 rounded-full transition-colors z-20"
        title="Скрыть"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(user.id);
        }}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Аватар */}
      <Link
        className="relative z-10 mt-2 mb-3 cursor-pointer"
        href={`/user/${user.id}`}
      >
        <Avatar className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] ring-2 ring-transparent">
          <AvatarImage
            alt={user.name || "User"}
            src={user.avatarUrl || "/default-avatar.png"}
          />
          <AvatarFallback>
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* Инфо */}
      <div className="flex flex-col items-center text-center w-full mb-4 z-10">
        <Link
          className="font-bold text-[13px] sm:text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1 hover:underline w-full cursor-pointer"
          href={`/user/${user.id}`}
        >
          {user.name || "User"}
        </Link>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5 w-full">
          {user.usernameFrameUrl ? (
            <span className="relative inline-block w-full">
              <span
                className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                style={{
                  backgroundImage: `url(${user.usernameFrameUrl})`,
                  backgroundRepeat: "repeat-x",
                  backgroundSize: "auto 200%",
                  backgroundPosition: "left center",
                }}
              />
              <span className="relative z-0 px-1">
                @{user.id.substring(0, 8)}
              </span>
            </span>
          ) : (
            `@${user.id.substring(0, 8)}`
          )}
        </span>
      </div>

      {/* Кнопка подписки */}
      <div className="mt-auto w-full z-10">
        <Button
          className={`w-full h-[34px] text-[13px] font-bold rounded-[14px] transition-colors ${
            isFollowing
              ? "bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700"
              : "bg-white hover:bg-neutral-100 text-black border border-neutral-200 dark:border-transparent shadow-sm"
          }`}
          onClick={handleFollowToggle}
        >
          {isFollowing ? "Отписаться" : "Подписаться"}
        </Button>
      </div>
    </div>
  );
};

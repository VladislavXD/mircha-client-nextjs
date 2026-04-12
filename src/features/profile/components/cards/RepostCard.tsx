"use client";
import type { Post, User } from "@/src/features/post/types";

import React from "react";
import { Repeat } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import PostCard from "@/src/features/post/components/PostCard";
import { formatToClientDate } from "@/app/utils/formatToClientDate";

interface RepostCardProps {
  post: Post;
  repostComment?: string;
  repostCreatedAt?: string;
  repostId: string;
}

/**
 * RepostCard - минималистичная карточка репоста
 * Показывает профиль пользователя с комментарием, затем оригинальный пост
 */
const RepostCard: React.FC<RepostCardProps> = ({
  post,
  repostComment,
  repostCreatedAt,
  repostId,
}) => {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<User>(["profile"]);

  return (
    <div className="w-full bg-transparent border-none rounded-xl shadow-sm">
      <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
        {/* Ваш профиль с иконкой репоста */}
        <div className="flex items-start gap-2 sm:gap-3">
          <img
            alt={currentUser?.name || "Avatar"}
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            src={currentUser?.avatarUrl || "/default-avatar.png"}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-xs sm:text-sm truncate text-neutral-900 dark:text-neutral-100">
                {currentUser?.name}
              </span>
              <Repeat
                className="text-emerald-600 dark:text-emerald-500 flex-shrink-0 sm:w-3.5 sm:h-3.5"
                size={12}
              />
              <span className="text-[10px] sm:text-xs text-neutral-500 shrink-0">
                {repostCreatedAt && formatToClientDate(repostCreatedAt)}
              </span>
            </div>

            {/* Комментарий к репосту */}
            {repostComment && (
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 mt-1 break-words">
                {repostComment}
              </p>
            )}
          </div>
        </div>

        {/* Оригинальный пост с другим фоном */}
        <div
          className="mt-1 sm:mt-2 p-2 sm:p-3 bg-neutral-100/50 dark:bg-neutral-800/20 rounded-lg repost-wrapper"
          data-repost-id={repostId}
        >
          <PostCard cardFor="post" post={post} />
        </div>
      </div>

      {/* Стили для вложенных карточек */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Блокируем кнопку репоста внутри репоста */
        .repost-wrapper [data-repost-button] {
          pointer-events: none;
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Убираем тень и границу у вложенной карточки, но не затираем фон */
        .repost-wrapper > div > div {
          box-shadow: none !important;
          border: none !important;
        }
      `,
        }}
      />
    </div>
  );
};

export default RepostCard;

"use client";

import type { Post, User } from "../../types";

import React, { useState } from "react";
import { Repeat, Loader2 } from "lucide-react";

import { useCreateRepost, useDeleteRepost } from "../../hooks/useRepost";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { EmojiText } from "@/shared/components/ui/EmojiText";
import { useDispatch } from "react-redux";
import { useModals } from "@/src/hooks/useModals";
import { openAuthModal } from "@/src/store/authModal/authModal.slice";

interface RepostButtonProps {
  postId: string;
  repostedByUser?: boolean;
  repostCount?: number;
  showCount?: boolean;
  post?: Post; // Добавляем данные о посте для превью
  author?: User;
  isAtuhenticated?: boolean;
}

/**
 * Кнопка репоста с оптимистичным обновлением.
 *
 * Features:
 * - Мгновенный отклик UI (optimistic updates)
 * - Модалка для добавления комментария к репосту
 * - Fire-and-forget паттерн (без async/await)
 *
 * Usage:
 * ```tsx
 * <RepostButton
 *   postId="post-id"
 *   repostedByUser={false}
 *   repostCount={5}
 * />
 * ```
 */
export const RepostButton: React.FC<RepostButtonProps> = ({
  postId,
  repostedByUser = false,
  repostCount = 0,
  showCount = true,
  isAtuhenticated,
  post,
  author,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");

  const { mutate: createRepost, isPending: isCreating } = useCreateRepost();
  const { mutate: deleteRepost, isPending: isDeleting } = useDeleteRepost();

  const isPending = isCreating || isDeleting;

  const dispatch = useDispatch();
  const { isAuthModal } = useModals();
  /**
   * ✅ Fire-and-forget: немедленный UI отклик
   * ❌ НЕ используй async/await - это задерживает optimistic update
   */
  const handleRepost = () => {
    if (repostedByUser) {
      // Удаляем репост
      deleteRepost(postId);
    } else {
      // Открываем модалку для комментария (опционально)
      setIsModalOpen(true);
    }
  };

  const handleConfirmRepost = () => {
    createRepost({
      postId,
      comment: comment.trim() || undefined,
    });
    setIsModalOpen(false);
    setComment("");
  };

  const handleQuickRepost = (e: React.MouseEvent) => {
    // Shift+Click для быстрого репоста без комментария
    if (e.shiftKey) {
      e.stopPropagation();
      createRepost({ postId });
    }
  };

  return (
    <>
      <button
        data-repost-button
        className={`
          flex items-center justify-center gap-2 cursor-pointer 
          bg-transparent hover:bg-gray-50/80 dark:hover:bg-gray-700/50 
          px-2 py-1 rounded-2xl select-none 
          active:scale-95 transition-all duration-200 hover:scale-105
          ${isPending ? "opacity-50 cursor-not-allowed" : ""}
        `}
        disabled={isPending}
        title={
          repostedByUser
            ? "Отменить репост"
            : "Репостнуть (Shift+Click для быстрого репоста)"
        }
        onClick={(e) => {
          e.stopPropagation(); // Предотвращаем всплытие, чтобы не открывать пост
          if (isAtuhenticated) handleRepost();
          else
            dispatch(
              openAuthModal({
                title: "Войдите, чтобы репостить",
                description: "присоединяйтесь, чтобы делиться идеями и общаться.",
                icon: "Repeat"
              }),
            );
        }}
        onClickCapture={handleQuickRepost}
      >
        <Repeat
          className={`
            w-5 h-5 sm:w-5 sm:h-6 stroke-1 transition-colors
            ${repostedByUser ? "text-green-500" : "text-muted-foreground"}
          `}
          size={24}
        />
        {showCount && repostCount > 0 && (
          <span
            className={`
            font-normal text-l
            ${repostedByUser ? "text-green-500" : "text-muted-foreground"}
          `}
          >
            {repostCount}
          </span>
        )}
      </button>

      {/* Модалка для добавления комментария к репосту */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-[500px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Добавить комментарий к репосту</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Textarea
                className="min-h-[80px]"
                maxLength={280}
                placeholder="Ваш комментарий (опционально)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/280
              </p>
            </div>

            {/* Превью поста */}
            {post && (
              <Card className="mt-2 border border-border">
                <CardContent className="p-4">
                  {/* Автор поста */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        alt={post.author?.name || post.author?.username || ""}
                        src={post.author?.avatarUrl || ""}
                      />
                      <AvatarFallback>
                        {(
                          post.author?.name?.[0] ||
                          post.author?.username?.[0] ||
                          "U"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {post.author?.name || post.author?.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{post.author?.username}
                      </span>
                    </div>
                  </div>

                  {/* Содержимое поста с правильным рендерингом */}
                  <div className="text-sm line-clamp-6">
                    <EmojiText
                      className="text-foreground/80"
                      emojiUrls={post.emojiUrls || []}
                      text={
                        typeof post.content === "string"
                          ? post.content
                          : JSON.stringify(post.content)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button
              disabled={isPending}
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Отмена
            </Button>
            <Button disabled={isPending} onClick={handleConfirmRepost}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Репостнуть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

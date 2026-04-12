"use client";

import type { Post } from "../types";

import React, { useState } from "react";
import { Repeat } from "lucide-react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Avatar,
  Card,
  CardBody,
} from "@heroui/react";

import { useCreateRepost, useDeleteRepost } from "../hooks/useRepost";

import { EmojiText } from "@/shared/components/ui/EmojiText";

interface RepostButtonProps {
  postId: string;
  repostedByUser?: boolean;
  repostCount?: number;
  showCount?: boolean;
  post?: Post; // Добавляем данные о посте для превью
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
  post,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");

  const { mutate: createRepost, isPending: isCreating } = useCreateRepost();
  const { mutate: deleteRepost, isPending: isDeleting } = useDeleteRepost();

  const isPending = isCreating || isDeleting;

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
          handleRepost();
        }}
        onClickCapture={handleQuickRepost}
      >
        <Repeat
          className={`
            w-5 h-5 sm:w-5 sm:h-6 stroke-1 transition-colors
            ${repostedByUser ? "text-green-500" : "text-default-600"}
          `}
          size={24}
        />
        {showCount && repostCount > 0 && (
          <span
            className={`
            font-normal text-l
            ${repostedByUser ? "text-green-500" : "text-default-600"}
          `}
          >
            {repostCount}
          </span>
        )}
      </button>

      {/* Модалка для добавления комментария к репосту */}
      <Modal
        isOpen={isModalOpen}
        scrollBehavior="inside"
        size="lg"
        onClose={() => setIsModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Добавить комментарий к репосту
          </ModalHeader>
          <ModalBody>
            <Textarea
              maxLength={280}
              maxRows={6}
              minRows={3}
              placeholder="Ваш комментарий (опционально)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <p className="text-xs text-default-400">{comment.length}/280</p>

            {/* Превью поста */}
            {post && (
              <Card className="mt-4 border border-default-200 dark:border-default-100">
                <CardBody className="p-4">
                  {/* Автор поста */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar
                      className="flex-shrink-0"
                      name={post.author?.name || post.author?.username}
                      size="sm"
                      src={post.author?.avatarUrl}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-default-900">
                        {post.author?.name || post.author?.username}
                      </span>
                      <span className="text-xs text-default-500">
                        @{post.author?.username}
                      </span>
                    </div>
                  </div>

                  {/* Содержимое поста с правильным рендерингом */}
                  <div className="text-sm line-clamp-6">
                    <EmojiText
                      className="text-default-700"
                      emojiUrls={post.emojiUrls || []}
                      text={
                        typeof post.content === "string"
                          ? post.content
                          : JSON.stringify(post.content)
                      }
                    />
                  </div>
                </CardBody>
              </Card>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setIsModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              color="primary"
              isLoading={isPending}
              onPress={handleConfirmRepost}
            >
              Репостнуть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

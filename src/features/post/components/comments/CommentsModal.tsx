"use client";

import type { Post } from "../../types";

import React, { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateComment,
  useCreateReply,
  useDeleteComment,
} from "../../comment/hooks/useComment";
import { usePostComments } from "../../comment/hooks/usePostComments";
import { useLikeComment, useUnlikeComment } from "../../like/hooks";

import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/ui/drawer";
import { PostCard } from "../..";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

  interface CommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post;
  }

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<any>(["profile"]);

  const { mutate: createComment } = useCreateComment();
  const { mutate: createReply } = useCreateReply();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: likeComment } = useLikeComment(post.id);
  const { mutate: unlikeComment } = useUnlikeComment(post.id);

  const { data: commentsData, isLoading: isLoadingComments } = usePostComments(
    post.id,
    currentUser?.id,
  );

  const handleReply = (commentId: string, content: string) => {
    createReply({ postId: post.id, content, replyToId: commentId });
  };

  const handleLikeComment = (commentId: string, isLiked: boolean) => {
    if (isLiked) unlikeComment(commentId);
    else likeComment(commentId);
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Удалить комментарий?")) {
      deleteComment({ id: commentId, postId: post.id });
    }
  };

  const comments = commentsData || post.comments || [];
  const commentsCount = comments.length || post.commentsCount || 0;

  const [sortKey, setSortKey] = useState<"newest" | "oldest" | "mostLiked">(
    "newest",
  );

  // Опции сортировки
  const sortOptions = [
    { key: "newest", label: "Новые" },
    { key: "oldest", label: "Старые" },
    { key: "mostLiked", label: "Популярные" },
  ] as const;

  // Сортируем комментарии в зависимости от выбранного ключа сортировки
  const sortedComments = useMemo(() => {
    const raw = (commentsData || post.comments || []).filter(
      (c: any) => !!c.user,
    );
    return [...raw].sort((a: any, b: any) => {
      if (sortKey === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortKey === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return (b.score ?? b.likeCount ?? 0) - (a.score ?? a.likeCount ?? 0);
    });
  }, [commentsData, post.comments, sortKey]);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerOverlay onClick={(e) => e.stopPropagation()}/>
      <DrawerContent
        className="flex flex-col h-[82dvh] rounded-t-[1.5rem] border-none bg-white dark:bg-[#101010] p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <DrawerHeader onClick={(e) => e.stopPropagation()} className="shrink-0 flex flex-row items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800/70">
          <DrawerTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            <MessageCircle className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <span>Комментарии</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              ({commentsCount})
            </span>
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto bg-white dark:bg-[#101010]">
          <PostCard cardFor="current-post" post={post} />

          {/* Хедер комментариев с фильтром */}
          <div className="px-3 py-2.5 flex items-center justify-between border-y border-neutral-200 dark:border-neutral-800/70 bg-neutral-50 dark:bg-[#161616]">
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
              <MessageCircle size={15} strokeWidth={2} />
              <span className="text-[13px] font-semibold">Комментарии</span>
              <span className="text-xs font-medium text-neutral-400">
                ({sortedComments.length || post.commentsCount || 0})
              </span>
            </div>
            <Select
              defaultValue="newest"
              onValueChange={(value) => setSortKey(value as any)}
            >
              <SelectTrigger className="w-[130px] h-7 bg-transparent border-neutral-200 dark:border-neutral-800 focus:ring-0 focus:ring-offset-0 rounded-full text-xs font-medium cursor-pointer">
                <SelectValue placeholder="Сортировать" />
              </SelectTrigger>
              <SelectContent className="rounded-[1rem] border-neutral-200 dark:border-neutral-800/70">
                {sortOptions.map((o) => (
                  <SelectItem
                    key={o.key}
                    value={o.key}
                    className="cursor-pointer rounded-[0.75rem] text-sm"
                  >
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Список комментариев */}
          <div className="px-2 py-2">
            {isLoadingComments ? (
              <div className="flex justify-center py-10 text-neutral-400 text-sm">
                Загрузка...
              </div>
            ) : sortedComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 dark:text-neutral-400">
                <MessageCircle
                  className="text-neutral-300 dark:text-neutral-600 mb-3"
                  size={40}
                  strokeWidth={1}
                />
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  Пока нет комментариев
                </p>
                <p className="text-sm mt-1">Станьте первым!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {sortedComments.map((comment: any) => (
                  <CommentItem
                    key={comment.id}
                    {...comment}
                    currentUser={currentUser}
                    user={comment.user}
                    onDelete={handleDeleteComment}
                    onLike={handleLikeComment}
                    onReply={handleReply}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Форма */}
        <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800/70 bg-white dark:bg-[#101010] p-3">
          <CommentForm
            currentUser={currentUser}
            onSubmit={(content) => createComment({ postId: post.id, content })}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

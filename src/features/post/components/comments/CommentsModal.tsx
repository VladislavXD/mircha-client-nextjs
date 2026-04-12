"use client";

import type { Post } from "../../types";

import React from "react";
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
import { PostPreview } from "./PostPreview";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  // Мутации
  const { mutate: createComment, isPending: isCreating } = useCreateComment();
  const { mutate: createReply } = useCreateReply();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: likeComment } = useLikeComment(post.id);
  const { mutate: unlikeComment } = useUnlikeComment(post.id);

  // Загрузка комментариев
  const { data: commentsData, isLoading: isLoadingComments } = usePostComments(
    post.id,
    currentUser?.id,
  );

  const handleSubmitComment = async (content: string) => {
    createComment(
      {
        postId: post.id,
        content,
      },
      {
        onSuccess: () => {
          // Успешно создан
        },
      },
    );
  };

  const handleReply = (commentId: string, content: string) => {
    createReply({
      postId: post.id,
      content,
      replyToId: commentId,
    });
  };

  const handleLikeComment = (commentId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikeComment(commentId);
    } else {
      likeComment(commentId);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Удалить комментарий?")) {
      deleteComment({ id: commentId, postId: post.id });
    }
  };

  // Преобразуем комментарии в правильную структуру с вложенностью
  const comments = commentsData || post.comments || [];
  const commentsCount = comments.length || post.commentsCount || 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 flex flex-col max-h-[90vh] overflow-hidden rounded-t-[1.5rem] sm:rounded-[1.5rem] bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70"
        showCloseButton={true}
      >
        {/* Header */}
        <DialogHeader className="flex-shrink-0 flex flex-row items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 dark:border-neutral-800/70 m-0">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 m-0">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500 dark:text-neutral-400" />
            <span>Комментарии</span>
            <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              ({commentsCount})
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Прокручиваемая область с постом и комментариями */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 bg-white dark:bg-[#101010]">
          {/* Post Preview */}
          <div className="mb-4 sm:mb-6">
            <PostPreview post={post} />
          </div>

          {/* Divider */}
          <div className="border-b border-neutral-200 dark:border-neutral-800/70 mb-4 sm:mb-6" />

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-neutral-500 dark:text-neutral-400">
                Загрузка комментариев...
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 dark:text-neutral-400">
              <MessageCircle
                className="text-neutral-300 dark:text-neutral-600 mb-4"
                size={48}
              />
              <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Пока нет комментариев
              </p>
              <p className="text-sm mt-1">
                Станьте первым, кто оставит комментарий!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {comments.map((comment) => (
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

        {/* Comment Form - прижата к низу */}
        <div className="flex-shrink-0 border-t border-neutral-200 dark:border-neutral-800/70 bg-white dark:bg-[#101010] p-3 sm:p-4">
          <CommentForm
            currentUser={currentUser}
            onSubmit={handleSubmitComment}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

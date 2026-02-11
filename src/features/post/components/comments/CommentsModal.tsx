"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
} from "@heroui/react";
import { MessageCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { PostPreview } from "./PostPreview";
import type { Post } from "../../types";
import { useCreateComment, useCreateReply, useDeleteComment } from "../../comment/hooks/useComment";
import { usePostComments } from "../../comment/hooks/usePostComments";

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
  
  // Загрузка комментариев
  const { data: commentsData, isLoading: isLoadingComments } = usePostComments(
    post.id,
    currentUser?.id
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
      }
    );
  };

  const handleReply = (commentId: string, content: string) => {
    createReply({
      postId: post.id,
      content,
      replyToId: commentId,
    });
  };

  const handleLikeComment = (commentId: string) => {
    console.log("Like comment:", commentId);
    // TODO: Подключить мутацию лайка комментария (если есть)
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] mx-2 sm:mx-4",
        body: "p-0",
      }}
    >
      <ModalContent className="flex flex-col">
        {(onClose) => (
          <>
            {/* Header */}
            <ModalHeader className="flex-shrink-0 flex flex-col gap-1 px-4 sm:px-6 py-3 sm:py-4 border-b border-divider">
              <div className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                <span>Комментарии</span>
                <span className="text-xs sm:text-sm text-default-400">({commentsCount})</span>
              </div>
            </ModalHeader>

            {/* Прокручиваемая область с постом и комментариями */}
            <ModalBody className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4">
              {/* Post Preview */}
              <div className="mb-4 sm:mb-6">
                <PostPreview post={post} />
              </div>

              {/* Divider */}
              <div className="border-b border-divider mb-4 sm:mb-6"></div>

              {/* Comments List */}
              {isLoadingComments ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-default-500">Загрузка комментариев...</div>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle size={48} className="text-default-300 mb-4" />
                  <p className="text-default-500 text-lg font-medium">
                    Пока нет комментариев
                  </p>
                  <p className="text-default-400 text-sm mt-1">
                    Станьте первым, кто оставит комментарий!
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      {...comment}
                      user={comment.user}
                      onReply={handleReply}
                      onLike={handleLikeComment}
                      onDelete={handleDeleteComment}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              )}
            </ModalBody>

            {/* Comment Form - прижата к низу */}
            <div className="flex-shrink-0 border-t border-divider">
              <CommentForm
                onSubmit={handleSubmitComment}
                currentUser={currentUser}
              />
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

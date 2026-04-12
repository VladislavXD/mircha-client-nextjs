"use client";

import type { Post } from "../types";

import React from "react";

import { ReportModal, FeedbackType } from "@/src/features/feedback";

interface ReportPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: Post;
  postId?: string;
  postContent?: string;
}

/**
 * ReportPostModal - обертка над ReportModal для жалоб на посты
 *
 * @param isOpen - открыта ли модалка
 * @param onClose - callback для закрытия
 * @param post - объект поста (приоритет)
 * @param postId - ID поста (fallback)
 * @param postContent - контент поста (fallback)
 */
const ReportPostModal: React.FC<ReportPostModalProps> = ({
  isOpen,
  onClose,
  post,
  postId,
  postContent,
}) => {
  const targetId = post?.id || postId || "";
  const targetTitle = post?.content || postContent || "";

  // Преобразуем content в строку, если это объект
  const contentString =
    typeof targetTitle === "string" ? targetTitle : JSON.stringify(targetTitle);

  const displayTitle =
    contentString.length > 100
      ? `${contentString.slice(0, 100)}...`
      : contentString;

  return (
    <ReportModal
      defaultType={FeedbackType.POST_REPORT}
      isOpen={isOpen}
      targetId={targetId}
      targetTitle={displayTitle}
      targetType="post"
      onClose={onClose}
    />
  );
};

export default ReportPostModal;

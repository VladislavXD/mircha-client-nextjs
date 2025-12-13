"use client";

import React from "react";
import { ReportModal, FeedbackType } from "@/src/features/feedback";
import type { Post } from "../types";

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
  
  const displayTitle =
    targetTitle.length > 100
      ? `${targetTitle.slice(0, 100)}...`
      : targetTitle;

  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      targetId={targetId}
      targetType="post"
      targetTitle={displayTitle}
      defaultType={FeedbackType.POST_REPORT}
    />
  );
};

export default ReportPostModal;

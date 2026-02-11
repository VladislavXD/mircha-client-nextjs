"use client";

import React, { useState } from "react";
import { Avatar, Button } from "@heroui/react";
import { Heart, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/src/utils/timeAgo";
import { EmojiText } from "@/shared/components/ui/EmojiText";
import { CommentForm } from "./CommentForm";

interface CommentUser {
  id: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
}

interface CommentItemProps {
  id: string;
  content: string;
  emojiUrls?: string[];
  user: CommentUser;
  createdAt: string;
  likeCount?: number;
  likedByUser?: boolean;
  replies?: CommentItemProps[];
  onReply?: (commentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  currentUser?: {
    id?: string;
    name?: string;
    avatarUrl?: string;
  };
  depth?: number; // Глубина вложенности
}

export const CommentItem: React.FC<CommentItemProps> = ({
  id,
  content,
  emojiUrls = [],
  user,
  createdAt,
  likeCount = 0,
  likedByUser = false,
  replies = [],
  onReply,
  onLike,
  onDelete,
  currentUser,
  depth = 0,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const maxDepth = 4; // Максимальная глубина вложенности

  const handleReplySubmit = (replyContent: string) => {
    if (onReply) {
      onReply(id, replyContent);
      setShowReplyForm(false);
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
    // Автоматически показываем ответы когда открываем форму
    if (!showReplyForm && replies.length > 0) {
      setShowReplies(true);
    }
  };

  return (
    <div className="relative">
      {/* Вертикальная линия для вложенных комментариев */}
      {depth > 0 && (
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary-400 via-primary-300 to-transparent rounded-full hidden sm:block"
          style={{ left: `${(depth - 1) * 32 + 20}px` }}
        />
      )}

      <div 
        className={`flex gap-2 sm:gap-3 py-2 sm:py-3 transition-colors hover:bg-default-50 dark:hover:bg-default-100/30 rounded-lg ${
          depth > 0 ? 'pl-4 sm:pl-8' : ''
        }`}
        style={{ paddingLeft: depth > 0 ? `${depth * 20}px` : '0' }}
      >
        {/* Avatar */}
        <Link href={`/profile/${user.id}`}>
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            size="sm"
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity w-8 h-8 sm:w-10 sm:h-10"
          />
        </Link>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
            <Link 
              href={`/profile/${user.id}`}
              className="font-semibold text-xs sm:text-sm hover:underline truncate"
            >
              {user.name}
            </Link>
            <Link 
              href={`/profile/${user.id}`}
              className="text-[10px] sm:text-xs text-default-400 hover:underline truncate"
            >
              @{user.username}
            </Link>
            <span className="text-xs text-default-400 hidden sm:inline">•</span>
            <span className="text-[10px] sm:text-xs text-default-400 shrink-0">
              {timeAgo(createdAt)}
            </span>
          </div>

          {/* Comment Text */}
          <div className="text-xs sm:text-sm mb-2 break-words">
            <EmojiText text={content} emojiUrls={emojiUrls} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Like Button */}
            <button
              onClick={() => onLike?.(id)}
              className="flex items-center gap-1 text-[10px] sm:text-xs text-default-500 hover:text-danger transition-colors"
            >
              <Heart
                size={12}
                className={`sm:w-3.5 sm:h-3.5 ${likedByUser ? "fill-danger text-danger" : ""}`}
              />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {/* Reply Button */}
            {depth < maxDepth && onReply && user.username && (
              <button
                onClick={handleReplyClick}
                className="flex items-center gap-1 text-[10px] sm:text-xs text-default-500 hover:text-primary transition-colors"
              >
                <MessageCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Ответить</span>
                <span className="sm:hidden">Отв.</span>
              </button>
            )}

            {/* Delete Button (only for own comments) */}
            {currentUser?.id === user.id && onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="text-[10px] sm:text-xs text-default-400 hover:text-danger transition-colors"
              >
                Удалить
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-2 sm:mt-3">
              <CommentForm
                onSubmit={handleReplySubmit}
                currentUser={currentUser}
                placeholder={`Ответить @${user.username}...`}
                onCancelReply={() => setShowReplyForm(false)}
                replyingTo={{ id, username: user.username || '' }}
                compact
              />
            </div>
          )}

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-2 sm:mt-3">
              {/* Toggle Replies Button */}
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-primary hover:underline mb-2 font-medium"
              >
                {showReplies ? (
                  <>
                    <ChevronUp size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>Скрыть ({replies.length})</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>Ответы ({replies.length})</span>
                  </>
                )}
              </button>

              {/* Replies List */}
              {showReplies && (
                <div className="space-y-0">
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      {...reply}
                      depth={depth + 1}
                      onReply={onReply}
                      onLike={onLike}
                      onDelete={onDelete}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

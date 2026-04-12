"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

import { CommentForm } from "./CommentForm";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeAgo } from "@/src/utils/timeAgo";
import { EmojiText } from "@/shared/components/ui/EmojiText";

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
  onLike?: (commentId: string, likedByUser: boolean) => void;
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
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-neutral-200 via-neutral-200/50 dark:from-neutral-800 dark:via-neutral-800/50 to-transparent rounded-full hidden sm:block"
          style={{ left: `${(depth - 1) * 32 + 20}px` }}
        />
      )}

      <div
        className={`flex gap-2 sm:gap-3 py-2 sm:py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-[#161616] rounded-[1rem] ${
          depth > 0 ? "pl-4 sm:pl-8" : "px-2"
        }`}
        style={depth > 0 ? { paddingLeft: `${depth * 20}px` } : {}}
      >
        {/* Avatar */}
        <Link href={`/profile/${user.id}`}>
          <Avatar className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity w-8 h-8 sm:w-10 sm:h-10 border border-neutral-200 dark:border-neutral-800/70">
            <AvatarImage
              alt={user.name || "User"}
              className="object-cover"
              src={user.avatarUrl}
            />
            <AvatarFallback className="bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-400">
              {user.name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
            <Link
              className="font-semibold text-xs sm:text-sm hover:underline truncate text-neutral-900 dark:text-neutral-100"
              href={`/profile/${user.id}`}
            >
              {user.name}
            </Link>
            <Link
              className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 hover:underline truncate"
              href={`/profile/${user.id}`}
            >
              @{user.username}
            </Link>
            <span className="text-xs text-neutral-300 dark:text-neutral-700 hidden sm:inline">
              •
            </span>
            <span className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 shrink-0">
              {timeAgo(createdAt)}
            </span>
          </div>

          {/* Comment Text */}
          <div className="text-xs sm:text-[15px] mb-2 break-words text-neutral-800 dark:text-neutral-200">
            <EmojiText emojiUrls={emojiUrls} text={content} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4 mt-1">
            {/* Like Button */}
            <button
              className={`flex items-center gap-1.5 text-[11px] sm:text-xs transition-colors font-medium ${
                likedByUser
                  ? "text-red-500"
                  : "text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-500"
              }`}
              onClick={() => onLike?.(id, likedByUser)}
            >
              <Heart
                className={likedByUser ? "fill-red-500" : ""}
                size={14}
                strokeWidth={likedByUser ? 0 : 2}
              />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {/* Reply Button */}
            {depth < maxDepth && onReply && user.username && (
              <button
                className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-medium"
                onClick={handleReplyClick}
              >
                <MessageCircle size={14} strokeWidth={2} />
                <span className="hidden sm:inline">Ответить</span>
                <span className="sm:hidden">Отв.</span>
              </button>
            )}

            {/* Delete Button (only for own comments) */}
            {currentUser?.id === user.id && onDelete && (
              <button
                className="text-[11px] sm:text-xs text-neutral-400 hover:text-red-500 transition-colors font-medium"
                onClick={() => onDelete(id)}
              >
                Удалить
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3 sm:mt-4">
              <CommentForm
                compact
                currentUser={currentUser}
                placeholder={`Ответить @${user.username}...`}
                replyingTo={{ id, username: user.username || "" }}
                onCancelReply={() => setShowReplyForm(false)}
                onSubmit={handleReplySubmit}
              />
            </div>
          )}

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-3">
              {/* Toggle Replies Button */}
              <button
                className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-3 font-medium"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <>
                    <ChevronUp size={14} strokeWidth={2} />
                    <span>Скрыть ({replies.length})</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} strokeWidth={2} />
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
                      currentUser={currentUser}
                      depth={depth + 1}
                      onDelete={onDelete}
                      onLike={onLike}
                      onReply={onReply}
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

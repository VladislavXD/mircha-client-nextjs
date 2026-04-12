"use client";

import React, { useState } from "react";
import { Send, X, Loader2 } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  onSubmit: (content: string, replyToId?: string) => void;
  currentUser?: {
    name?: string;
    avatarUrl?: string;
  };
  replyingTo?: {
    id: string;
    username: string;
  } | null;
  onCancelReply?: () => void;
  placeholder?: string;
  maxLength?: number;
  compact?: boolean; // Компактный режим для вложенных форм
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  currentUser,
  replyingTo,
  onCancelReply,
  placeholder = "Написать комментарий...",
  maxLength = 500,
  compact = false,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), replyingTo?.id);
      setContent("");
      onCancelReply?.();
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`${
        compact
          ? "bg-neutral-100 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800/70 rounded-[1.25rem] p-3 sm:p-4 shadow-sm"
          : ""
      }`}
    >
      {/* Reply Indicator */}
      {replyingTo && !compact && (
        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-neutral-100 dark:bg-[#161616] rounded-xl border border-neutral-200 dark:border-neutral-800/70">
          <span className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 flex-1 font-medium">
            Ответ на комментарий{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-200">
              @{replyingTo.username}
            </span>
          </span>
          <button
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            onClick={onCancelReply}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex gap-3 sm:gap-4 items-start">
        {/* User Avatar */}
        {currentUser && !compact && (
          <Avatar className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 hidden sm:block border border-neutral-200 dark:border-neutral-800/70">
            <AvatarImage
              alt={currentUser.name || "User"}
              className="object-cover"
              src={currentUser.avatarUrl}
            />
            <AvatarFallback className="bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-400">
              {currentUser.name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Input Area */}
        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            className={`resize-none whitespace-pre-wrap break-words bg-neutral-50 dark:bg-[#161616] border-neutral-200 dark:border-neutral-800/70 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-600 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-[1rem] px-4 py-3 min-h-[44px]`}
            maxLength={maxLength}
            placeholder={placeholder}
            rows={compact ? 2 : 3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown as any}
          />

          <div className="flex justify-between items-center sm:pl-1">
            {!compact ? (
              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium hidden sm:block">
                Ctrl + Enter для отправки
              </div>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              {compact && onCancelReply && (
                <Button
                  className="rounded-full text-xs font-medium px-4 h-8 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#202020]"
                  size="sm"
                  variant="ghost"
                  onClick={onCancelReply}
                >
                  <span className="hidden sm:inline">Отмена</span>
                  <span className="sm:hidden">
                    <X size={14} />
                  </span>
                </Button>
              )}

              <Button
                className="rounded-full text-xs font-semibold px-4 h-8 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-50"
                disabled={!content.trim() || isSubmitting}
                size="sm"
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mr-1.5" size={14} />
                ) : (
                  <Send className="mr-1.5" size={14} />
                )}
                {replyingTo ? "Ответить" : "Отправить"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

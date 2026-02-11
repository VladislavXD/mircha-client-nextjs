"use client";

import React, { useState } from "react";
import { Button, Textarea, Avatar } from "@heroui/react";
import { Send, X } from "lucide-react";

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
    <div className={`${
      compact 
        ? 'bg-default-100 dark:bg-default-50/10 border border-default-200 dark:border-default-100/20 rounded-lg p-2 sm:p-3 shadow-sm' 
        : 'bg-background border-t border-divider p-3 sm:p-4'
    }`}>
      {/* Reply Indicator */}
      {replyingTo && !compact && (
        <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <span className="text-[10px] sm:text-xs text-primary flex-1">
            Ответ на комментарий @{replyingTo.username}
          </span>
          <button
            onClick={onCancelReply}
            className="text-default-400 hover:text-default-600 transition-colors"
          >
            <X size={12} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      )}

      <div className="flex gap-2 sm:gap-3 items-start">
        {/* User Avatar */}
        {currentUser && !compact && (
          <Avatar
            src={currentUser.avatarUrl}
            name={currentUser.name}
            size="sm"
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 hidden sm:block"
          />
        )}

        {/* Input Area */}
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown as any}
            placeholder={placeholder}
            minRows={compact ? 1 : 1}
            maxRows={compact ? 3 : 4}
            maxLength={maxLength}
            classNames={{
              input: "text-xs sm:text-sm",
              inputWrapper: "bg-default-100 group-data-[focus=true]:bg-default-100",
            }}
          />
          <div className="flex justify-between items-center mt-1 sm:mt-2">
            <span className="text-[10px] sm:text-xs text-default-400">
              {content.length}/{maxLength}
            </span>
            <div className="flex gap-1 sm:gap-2">
              {compact && onCancelReply && (
                <Button
                  size="sm"
                  variant="flat"
                  onClick={onCancelReply}
                  className="text-xs sm:text-sm min-w-unit-16"
                >
                  <span className="hidden sm:inline">Отмена</span>
                  <span className="sm:hidden">✕</span>
                </Button>
              )}
              <Button
                size="sm"
                color="primary"
                isDisabled={!content.trim() || isSubmitting}
                isLoading={isSubmitting}
                onClick={handleSubmit}
                endContent={!isSubmitting && <Send size={12} className="sm:w-3.5 sm:h-3.5" />}
                className="text-xs sm:text-sm"
              >
                {replyingTo ? "Ответить" : "Отправить"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Hint */}
      {!compact && (
        <div className="text-[10px] sm:text-xs text-default-400 mt-1 sm:mt-2 text-center hidden sm:block">
          Ctrl + Enter для отправки
        </div>
      )}
    </div>
  );
};

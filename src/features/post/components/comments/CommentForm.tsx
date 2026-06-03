"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, Loader2, Maximize2 } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ExpandedEditorModal } from "./ExpandedEditorModal"; 



// ─── CommentForm ──────────────────────────────────────────────────────────────

interface CommentFormProps {
  onSubmit: (content: string, replyToId?: string) => void;
  currentUser?: { name?: string; avatarUrl?: string };
  replyingTo?: { id: string; username: string } | null;
  onCancelReply?: () => void;
  placeholder?: string;
  maxLength?: number;
  compact?: boolean;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasContent = content.trim().length > 0;

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), replyingTo?.id);
      setContent("");
      onCancelReply?.();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <ExpandedEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={content}
        setContent={setContent}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        replyingTo={replyingTo}
        currentUser={currentUser}
        placeholder={placeholder}
        maxLength={maxLength}
      />

      <div className={
        compact
          ? "bg-neutral-100 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800/70 rounded-[1.25rem] p-2 shadow-sm"
          : ""
      }>
        {/* Reply indicator */}
        {replyingTo && compact && (
          <div className="flex items-center gap-2 mb-1.5 px-2 py-1 bg-white dark:bg-[#101010] rounded-xl border border-neutral-200 dark:border-neutral-800/70">
            <span className="text-[11px] text-neutral-600 dark:text-neutral-400 flex-1 font-medium">
              Ответ{" "}
              <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                @{replyingTo.username}
              </span>
            </span>
            <button
              onClick={onCancelReply}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Row: avatar + input + icon */}
        <div className="flex items-center gap-2">

          {/* Avatar — компактная, вровень с полем */}
          {currentUser && (
            <Avatar className="flex-shrink-0 w-7 h-7 border border-neutral-200 dark:border-neutral-800/70">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name || "User"} className="object-cover" />
              <AvatarFallback className="bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-400 text-[10px]">
                {currentUser.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Input + right icon */}
          <div className="relative flex-1">
            <Textarea
              className="resize-none w-full bg-white dark:bg-[#1a1a1a] border-neutral-200 dark:border-neutral-800/70 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-600 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-[1rem] pl-3 pr-9 py-2 min-h-[38px] leading-snug"
              maxLength={maxLength}
              placeholder={
                compact && replyingTo
                  ? `Ответить @${replyingTo.username}...`
                  : placeholder
              }
              rows={1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* Иконки справа — с плавной анимацией */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">

              {/* Loader */}
              <span
                className="absolute inset-0 flex items-center justify-center transition-all duration-200"
                style={{
                  opacity: isSubmitting ? 1 : 0,
                  transform: isSubmitting ? "scale(1)" : "scale(0.6)",
                  pointerEvents: isSubmitting ? "auto" : "none",
                }}
              >
                <Loader2 className="animate-spin text-neutral-400" size={16} />
              </span>

              {/* Send */}
              <span
                className="absolute inset-0 flex items-center justify-center transition-all duration-200"
                style={{
                  opacity: hasContent && !isSubmitting ? 1 : 0,
                  transform: hasContent && !isSubmitting ? "scale(1)" : "scale(0.6)",
                  pointerEvents: hasContent && !isSubmitting ? "auto" : "none",
                }}
              >
                <button
                  onClick={handleSubmit}
                  className="text-neutral-900 dark:text-white hover:opacity-60 transition-opacity"
                  title="Отправить"
                >
                  <Send size={15} />
                </button>
              </span>

              {/* Expand */}
              <span
                className="absolute inset-0 flex items-center justify-center transition-all duration-200"
                style={{
                  opacity: !hasContent && !isSubmitting ? 1 : 0,
                  transform: !hasContent && !isSubmitting ? "scale(1)" : "scale(0.6)",
                  pointerEvents: !hasContent && !isSubmitting ? "auto" : "none",
                }}
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  title="Расширенный редактор"
                >
                  <Maximize2 size={15} />
                </button>
              </span>

              {/* Spacer — держит размер блока */}
              <span className="invisible flex items-center justify-center w-4 h-4" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// ExpandedEditorModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Send, X, Loader2 } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface ExpandedEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  setContent: (val: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  replyingTo?: { id: string; username: string } | null;
  currentUser?: { name?: string; avatarUrl?: string };
  placeholder?: string;
  maxLength?: number;
}

export const ExpandedEditorModal: React.FC<ExpandedEditorModalProps> = ({
  isOpen,
  onClose,
  content,
  setContent,
  onSubmit,
  isSubmitting,
  replyingTo,
  currentUser,
  placeholder,
  maxLength = 500,
}) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />

      <div
        className="relative w-full sm:max-w-lg mx-0 sm:mx-4 bg-white dark:bg-[#101010] rounded-t-[1.5rem] sm:rounded-[1.5rem] border border-neutral-200 dark:border-neutral-800/70 shadow-2xl p-4 sm:p-6 space-y-4 transition-all duration-300"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Handle (mobile) */}
        <div className="sm:hidden flex justify-center -mt-1 mb-1">
          <div className="w-8 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentUser && (
              <Avatar className="w-6 h-6 border border-neutral-200 dark:border-neutral-800/70 flex-shrink-0">
                <AvatarImage
                  src={currentUser.avatarUrl}
                  alt={currentUser.name || "User"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-600 dark:text-neutral-400 text-[10px]">
                  {currentUser.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {replyingTo ? `Ответ @${replyingTo.username}` : "Новый комментарий"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X size={15} />
          </button>
        </div>

        {/* Textarea */}
        <Textarea
          autoFocus
          className="resize-none bg-neutral-50 dark:bg-[#161616] border-neutral-200 dark:border-neutral-800/70 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-600 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-[1rem] px-4 py-3 min-h-[140px]"
          maxLength={maxLength}
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 tabular-nums">
            {content.length}/{maxLength}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-400 hidden sm:block">
              Ctrl+Enter
            </span>
            <button
              disabled={!content.trim() || isSubmitting}
              onClick={onSubmit}
              className="flex items-center gap-1.5 rounded-full text-xs font-semibold px-4 h-8 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-40 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={13} />
              ) : (
                <Send size={13} />
              )}
              {replyingTo ? "Ответить" : "Отправить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
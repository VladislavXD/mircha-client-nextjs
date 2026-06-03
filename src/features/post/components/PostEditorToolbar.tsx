"use client";

import React from "react";
import {
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  BarChart2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import EmojiPicker from "@/shared/components/ui/inputs/EmojiPicker";
import { cn } from "@/lib/utils";

interface PostEditorToolbarProps {
  activeFormats: Set<string>;
  isLoading: boolean;
  mediaFiles: any[];
  maxMedia: number;
  hasPoll?: boolean;
  onTogglePoll?: () => void;
  onFormat: (command: string, value?: string) => void;
  onMediaSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmojiSelect: (url: string) => void;
}

/**
 * PostEditorToolbar - панель инструментов для редактора постов
 * Включает: форматирование текста, загрузку медиа, выбор эмодзи
 */
const PostEditorToolbar: React.FC<PostEditorToolbarProps> = ({
  activeFormats,
  isLoading,
  mediaFiles,
  maxMedia,
  onFormat,
  onMediaSelect,
  onEmojiSelect,
  hasPoll = false,
  onTogglePoll,
}) => {
  return (
    <div className="mb-5 flex gap-2 flex-wrap items-center">
      {/* Formatting Buttons */}
      <Button
        className={cn(
          "h-8 w-8 rounded-full",
          activeFormats.has("bold") &&
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
        )}
        disabled={isLoading}
        size="icon"
        title="Жирный (Ctrl+B)"
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat("bold");
        }}
      >
        <Bold size={16} />
      </Button>
      <Button
        className={cn(
          "h-8 w-8 rounded-full",
          activeFormats.has("italic") &&
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
        )}
        disabled={isLoading}
        size="icon"
        title="Курсив (Ctrl+I)"
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat("italic");
        }}
      >
        <Italic size={16} />
      </Button>
      <Button
        className={cn(
          "h-8 w-8 rounded-full",
          activeFormats.has("underline") &&
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
        )}
        disabled={isLoading}
        size="icon"
        title="Подчеркнутый (Ctrl+U)"
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat("underline");
        }}
      >
        <Underline size={16} />
      </Button>
      <Button
        className={cn(
          "h-8 w-8 rounded-full",
          activeFormats.has("strikeThrough") &&
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
        )}
        disabled={isLoading}
        size="icon"
        title="Зачеркнутый"
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat("strikeThrough");
        }}
      >
        <Strikethrough size={16} />
      </Button>
      <Button
        className={cn(
          "h-8 w-8 rounded-full",
          activeFormats.has("highlight") &&
            "bg-yellow-200 dark:bg-yellow-900/50 text-neutral-900 dark:text-yellow-500",
        )}
        disabled={isLoading}
        size="icon"
        title="Выделить маркером"
        type="button"
        variant="ghost"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat("hiliteColor", "#fff59d");
        }}
      >
        <Highlighter size={16} />
      </Button>
      <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />{" "}
      {/* Разделитель */}
      {/* Media Upload Button */}
      <label htmlFor="media-upload">
        <Button
          asChild
          aria-label="Upload media"
          className={cn(
            "h-8 w-8 rounded-full cursor-pointer",
            (isLoading || mediaFiles.length >= maxMedia) &&
              "opacity-50 cursor-not-allowed",
          )}
          size="icon"
          type="button"
          variant="ghost"
        >
          <span>
            <ImageIcon size={16} />
          </span>
        </Button>
      </label>
      <input
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg"
        className="hidden"
        disabled={isLoading || mediaFiles.length >= maxMedia}
        id="media-upload"
        type="file"
        onChange={onMediaSelect}
      />
      {/* Emoji Picker */}
      <EmojiPicker disabled={isLoading} onEmojiSelect={onEmojiSelect} />

      {/* Poll Button */}
      <Button
        className={cn(
          "h-8 w-8 rounded-full",
          hasPoll &&
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
        )}
        disabled={isLoading}
        size="icon"
        title="Добавить опрос"
        type="button"
        variant="ghost"
        onClick={onTogglePoll}
      >
        <BarChart2 size={16} />
      </Button>
    </div>
  );
};

export default PostEditorToolbar;

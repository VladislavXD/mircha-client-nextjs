"use client";

import React from "react";
import { Button } from "@heroui/react";
import { IoMdImage } from "react-icons/io";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatStrikethrough,
  MdHighlight,
} from "react-icons/md";
import EmojiPicker from "@/shared/components/ui/inputs/EmojiPicker";

interface PostEditorToolbarProps {
  activeFormats: Set<string>;
  isLoading: boolean;
  mediaFiles: any[];
  maxMedia: number;
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
}) => {
  return (
    <div className="mb-5 flex gap-2 flex-wrap items-center">
      {/* Formatting Buttons */}
      <Button
        isIconOnly
        size="sm"
        variant={activeFormats.has('bold') ? 'solid' : 'flat'}
        color={activeFormats.has('bold') ? 'primary' : 'default'}
        className="rounded-full"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat('bold');
        }}
        isDisabled={isLoading}
        title="Жирный (Ctrl+B)"
      >
        <MdFormatBold size={18} />
      </Button>
      
      <Button
        isIconOnly
        size="sm"
        variant={activeFormats.has('italic') ? 'solid' : 'flat'}
        color={activeFormats.has('italic') ? 'primary' : 'default'}
        className="rounded-full"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat('italic');
        }}
        isDisabled={isLoading}
        title="Курсив (Ctrl+I)"
      >
        <MdFormatItalic size={18} />
      </Button>
      
      <Button
        isIconOnly
        size="sm"
        variant={activeFormats.has('underline') ? 'solid' : 'flat'}
        color={activeFormats.has('underline') ? 'primary' : 'default'}
        className="rounded-full"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat('underline');
        }}
        isDisabled={isLoading}
        title="Подчеркнутый (Ctrl+U)"
      >
        <MdFormatUnderlined size={18} />
      </Button>
      
      <Button
        isIconOnly
        size="sm"
        variant={activeFormats.has('strikeThrough') ? 'solid' : 'flat'}
        color={activeFormats.has('strikeThrough') ? 'primary' : 'default'}
        className="rounded-full"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat('strikeThrough');
        }}
        isDisabled={isLoading}
        title="Зачеркнутый"
      >
        <MdFormatStrikethrough size={18} />
      </Button>
      
      <Button
        isIconOnly
        size="sm"
        variant={activeFormats.has('highlight') ? 'solid' : 'flat'}
        color={activeFormats.has('highlight') ? 'warning' : 'default'}
        className="rounded-full"
        onMouseDown={(e) => {
          e.preventDefault();
          onFormat('hiliteColor', '#fff59d');
        }}
        isDisabled={isLoading}
        title="Выделить маркером"
      >
        <MdHighlight size={18} />
      </Button>

      <div className="w-px h-6 bg-default-300" /> {/* Разделитель */}

      {/* Media Upload Button */}
      <label htmlFor="media-upload">
        <Button
          as="span"
          isIconOnly
          size="sm"
          variant="flat"
          className="rounded-full cursor-pointer"
          isDisabled={isLoading || mediaFiles.length >= maxMedia}
          aria-label="Upload media"
        >
          <IoMdImage size={18} />
        </Button>
      </label>
      <input
        id="media-upload"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg"
        multiple
        onChange={onMediaSelect}
        disabled={isLoading || mediaFiles.length >= maxMedia}
        className="hidden"
      />

      {/* Emoji Picker */}
      <EmojiPicker onEmojiSelect={onEmojiSelect} disabled={isLoading} />
    </div>
  );
};

export default PostEditorToolbar;

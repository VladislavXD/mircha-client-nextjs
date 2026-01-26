"use client";

import React, { useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import { IoMdCreate } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { useCreatePost } from "../hooks/usePostMutations";
import type { User } from "../types";

import MediaPreviewSlider from "./MediaPreviewSlider";
import PostEditorToolbar from "./PostEditorToolbar";
import Mention from "@/shared/components/ui/inputs/Mention";

// Custom hooks
import { useMediaUpload } from "../hooks/useMediaUpload";
import { useMentions } from "../hooks/useMentions";
import { useTextFormatting } from "../hooks/useTextFormatting";
import { useSpoilerSelection } from "../hooks/useSpoilerSelection";
import { useContentEditor } from "../hooks/useContentEditor";

interface FormData {
  post: string;
}

const MAX_MEDIA = 30;

const CreatePost = () => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<User>(["profile"]);
  
  const { mutate: createPost, isPending: isLoading } = useCreatePost();

  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const { handleSubmit } = useForm<FormData>();

  // Custom hooks
  const {
    mediaFiles,
    handleMediaSelect,
    handleRemoveMedia,
    handleToggleSpoiler,
    clearMedia,
  } = useMediaUpload();

  const {
    mention,
    showHit,
    detectMention,
    resetMention,
  } = useMentions();

  const {
    postContent,
    setPostContent,
    editorRef,
    handleInput,
    clearContent,
    serializeDOM,
  } = useContentEditor(selectedEmojis);

  const {
    activeFormats,
    applyFormat,
    handleKeyDown,
  } = useTextFormatting(editorRef);

  // Callback для обновления контента после применения спойлера
  const handleSpoilerApplied = useCallback(() => {
    if (editorRef.current) {
      const next = serializeDOM(editorRef.current.childNodes as unknown as NodeListOf<ChildNode>);
      setPostContent(next);
    }
  }, [editorRef, serializeDOM, setPostContent]);

  const {
    showSpoilerButton,
    spoilerBtnPos,
    applySpoilerToSelection,
    toggleSpoilerClick,
    handleMouseUp,
    spoilerButtonRef,
  } = useSpoilerSelection(editorRef, containerRef, handleSpoilerApplied);

  // Обработчик выбора эмодзи
  const handleEmojiSelect = (emojiUrl: string) => {
    setSelectedEmojis((prev) => [...prev, emojiUrl]);
    
    const editor = editorRef.current;
    if (!editor) return;

    const emojiIndex = selectedEmojis.length;
    const token = `[emoji:${emojiIndex}]`;
    
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(token);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    
    // Trigger input event for serialization
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  };

  // Обработка ввода с обнаружением упоминаний
  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    handleInput(e);
    const editor = editorRef.current;
    if (!editor) return;
    const text = editor.textContent || "";
    detectMention(text);
  };

  // Обработчик выбора упоминания
  const handleSelectMention = (user: { id: string; name?: string | null }) => {
    const editor = editorRef.current;
    const name = (user.name || "").trim();
    
    if (!editor) return;

    const token = `[mention:${user.id}|${name || "user"}]`;
    
    // Получаем текущий текст
    const currentText = editor.textContent || "";
    const mentionQuery = mention;
    const lastAtIndex = currentText.lastIndexOf(`@${mentionQuery}`);
    
    if (lastAtIndex !== -1) {
      const before = currentText.slice(0, lastAtIndex);
      const after = currentText.slice(lastAtIndex + mentionQuery.length + 1);
      const newContent = `${before}${token}${after}`;
      
      setPostContent(newContent);
    }
    
    resetMention();

    setTimeout(() => {
      editor.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      if (sel && editor.lastChild) {
        range.setStartAfter(editor.lastChild);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 0);
  };

  const onSubmit = handleSubmit(async () => {
    if (!currentUser) {
      toast.error("Вы не авторизованы");
      return;
    }

    if (!postContent.trim() && mediaFiles.length === 0) {
      toast.error("Пост не может быть пустым");
      return;
    }

    const formData = new FormData();
    formData.append("content", postContent);
    
    // NestJS ожидает массив файлов с именем 'media'
    mediaFiles.forEach((mediaFile) => {
      formData.append("media", mediaFile.file);
    });
    
    // Отправляем информацию о spoiler для каждого медиа файла
    if (mediaFiles.length > 0) {
      const spoilerData = mediaFiles.map((m) => m.spoiler || false);
      formData.append("mediaSpoilers", JSON.stringify(spoilerData));
    }
    
    if (selectedEmojis?.length) {
      formData.append("emojiUrls", JSON.stringify(selectedEmojis));
    }

    createPost(formData, {
      onSuccess: () => {
        clearContent();
        clearMedia();
        setSelectedEmojis([]);
        resetMention();
      },
    });
  });

  if (!currentUser) {
    return null;
  }

  return (
    <form className="flex-grow p-3" onSubmit={onSubmit}>
      <div className="mb-5 relative " ref={containerRef}>
        {/* contentEditable editor */}
        <div className="relative min-h-[120px] max-h-[400px] overflow-y-auto overflow-x-hidden rounded-xl border-2 transition-all duration-200 bg-gradient-to-br from-default-50 to-default-100/50 border-default-200 hover:border-default-300">
          <div
            ref={editorRef}
            contentEditable={!isLoading}
            suppressContentEditableWarning
            onInput={handleEditorInput}
            onKeyDown={handleKeyDown}
            onMouseUp={handleMouseUp}
            onClick={toggleSpoilerClick}
            className={
              "outline-none p-4 leading-relaxed text-default-700 max-w-full min-w-0 w-full whitespace-pre-wrap break-words " +
              "font-serif text-[17px] tracking-wide " +
              "[overflow-wrap:anywhere] [word-break:break-word] " +
              "[&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-default-400 [&:empty:before]:pointer-events-none"
            }
            data-placeholder={t("CreatePost.CreatePostInput")}
            aria-label="Post editor"
            role="textbox"
            aria-multiline="true"
          />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-40" />
        </div>

        {/* Spoiler button (shows on selection) */}
        {showSpoilerButton && !isLoading && (
          <div
            ref={spoilerButtonRef}
            className="absolute z-[10000]"
            style={{ 
              top: `${spoilerBtnPos.top}px`, 
              left: `${spoilerBtnPos.left}px`,
            }}
          >
            {/* Стрелка вверх */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-default-900 dark:border-b-default-800" />
            <Button
              size="sm"
              color="default"
              variant="solid"
              className="shadow-xl font-medium"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                applySpoilerToSelection();
              }}
            >
              Spoiler
            </Button>
          </div>
        )}
      </div>
      
      {showHit && (
        <Mention
          showHit={showHit}
          mention={mention}
          onSelect={handleSelectMention}
        />
      )}

      {/* Media Preview Slider */}
      <MediaPreviewSlider 
        media={mediaFiles} 
        onRemove={handleRemoveMedia} 
        onToggleSpoiler={handleToggleSpoiler}
        disabled={isLoading} 
      />

      {/* Toolbar: Formatting, Media Upload, Emoji Picker */}
      <PostEditorToolbar
        activeFormats={activeFormats}
        isLoading={isLoading}
        mediaFiles={mediaFiles}
        maxMedia={MAX_MEDIA}
        onFormat={applyFormat}
        onMediaSelect={handleMediaSelect}
        onEmojiSelect={handleEmojiSelect}
      />

      <Button
        color="success"
        isLoading={isLoading}
        className="flex-end relative rounded-full hover:-translate-y-1 px-12 shadow-xl after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0 transition-transform"
        endContent={<IoMdCreate />}
        type="submit"
      >
        {t("CreatePost.addPost")}
      </Button>

      {/* Локальные стили спойлера */}
      <style jsx>{`
        :global(.mc-spoiler) {
          filter: blur(5px);
          cursor: pointer;
          transition: filter 0.2s;
          border-radius: 0.25rem;
          padding: 0 0.125rem;
          background: rgba(0, 0, 0, 0.06);
        }
        :global(.mc-spoiler.mc-spoiler--revealed) {
          filter: none;
        }
        :global(.dark .mc-spoiler) {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </form>
  );
};

export default CreatePost;

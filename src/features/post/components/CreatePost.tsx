"use client";

import type { User } from "../types";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Pencil, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useCreatePost } from "../hooks/usePostMutations";

// Custom hooks
import { useMediaUpload } from "../hooks/useMediaUpload";
import { useMentions } from "../hooks/useMentions";
import { useTextFormatting } from "../hooks/useTextFormatting";
import { useSpoilerSelection } from "../hooks/useSpoilerSelection";
import { useContentEditor } from "../hooks/useContentEditor";

import PostEditorToolbar from "./PostEditorToolbar";
import MediaPreviewSlider from "./MediaPreviewSlider";

import { Button } from "@/components/ui/button";
import Mention from "@/shared/components/ui/inputs/Mention";
import { useAppDispatch } from "@/src/hooks/reduxHooks";
import { setCreatePostView } from "@/src/store/CreatePostModal/CreatePostModal.slice";

import { PollCreator, PollDraft } from "./Poll/components/PollCreator";

interface FormData {
  post: string;
}

const MAX_MEDIA = 30;

const CreatePost = ({
  className,
  onSuccessComplete,
  disableViewportTracking = false,
}: {
  className?: string;
  onSuccessComplete?: () => void;
  disableViewportTracking?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<User>(["profile"]);

  const { ref, inView } = useInView({
    threshold: 0.1,
    initialInView: true,
  });

  useEffect(() => {
    if (!disableViewportTracking) {
      dispatch(setCreatePostView(inView));
    }
  }, [inView, disableViewportTracking, dispatch]);

  const { mutateAsync: createPostAsync, isPending: isLoading } =
    useCreatePost();

  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [showPoll, setShowPoll] = useState(false);
  const [pollDraft, setPollDraft] = useState<PollDraft | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const { handleSubmit } = useForm<FormData>();

  // Custom hooks
  const {
    mediaFiles,
    handleMediaSelect,
    handleFilesDrop,
    handleRemoveMedia,
    handleToggleSpoiler,
    clearMedia,
  } = useMediaUpload();

  const { mention, showHit, detectMention, resetMention } = useMentions();

  const {
    postContent,
    setPostContent,
    editorRef,
    handleInput,
    clearContent,
    serializeDOM,
  } = useContentEditor(selectedEmojis);

  const { activeFormats, applyFormat, handleKeyDown } =
    useTextFormatting(editorRef);

  // Callback для обновления контента после применения спойлера
  const handleSpoilerApplied = useCallback(() => {
    if (editorRef.current) {
      const next = serializeDOM(
        editorRef.current.childNodes as unknown as NodeListOf<ChildNode>,
      );

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
    const newIndex = selectedEmojis.length;

    setSelectedEmojis((prev) => [...prev, emojiUrl]);

    setTimeout(() => {
      const editor = editorRef.current;

      if (!editor) return;

      editor.focus();

      const sel = window.getSelection();

      if (!sel || sel.rangeCount === 0) {
        // Fallback: just append to the end of editor
        const span = document.createElement("span");

        span.className = "inline-block align-middle mx-0.5";
        span.contentEditable = "false";
        span.setAttribute("data-emoji-index", String(newIndex));

        const img = document.createElement("img");

        img.src = emojiUrl;
        img.alt = "emoji";
        img.className = "w-6 h-6 object-contain";
        img.width = 24;
        img.height = 24;
        span.appendChild(img);

        editor.appendChild(span);
        const serialized = serializeDOM(
          editor.childNodes as unknown as NodeListOf<ChildNode>,
        );

        setPostContent(serialized);
        editor.dispatchEvent(new Event("input", { bubbles: true }));

        return;
      }

      const range = sel.getRangeAt(0);

      const span = document.createElement("span");

      span.className = "inline-block align-middle mx-0.5";
      span.contentEditable = "false";
      span.setAttribute("data-emoji-index", String(newIndex));

      const img = document.createElement("img");

      img.src = emojiUrl;
      img.alt = "emoji";
      img.className = "w-6 h-6 object-contain";
      img.width = 24;
      img.height = 24;

      span.appendChild(img);

      if (editor.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(span);
        range.setStartAfter(span);
        range.collapse(true);
      } else {
        editor.appendChild(span);
        const newRange = document.createRange();

        newRange.setStartAfter(span);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }

      const serialized = serializeDOM(
        editor.childNodes as unknown as NodeListOf<ChildNode>,
      );

      setPostContent(serialized);

      editor.dispatchEvent(new Event("input", { bubbles: true }));
    }, 0);
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

    // Получаем текущую позицию курсора и текст
    const sel = window.getSelection();

    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const textContent = editor.textContent || "";

    // Находим позицию последнего @
    const lastAtIndex = textContent.lastIndexOf(`@${mention}`);

    if (lastAtIndex === -1) return;

    // Создаём mention элемент
    const mentionSpan = document.createElement("span");

    mentionSpan.className =
      "inline-block px-2 py-0.5 mx-0.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors cursor-pointer";
    mentionSpan.contentEditable = "false";
    mentionSpan.setAttribute("data-mention-id", user.id);
    mentionSpan.textContent = `@${name || "user"}`;

    // Находим текстовый узел с @mention
    let targetNode: Text | null = null;
    let nodeOffset = 0;
    let currentOffset = 0;

    const findTextNode = (node: Node): boolean => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";

        if (currentOffset + text.length > lastAtIndex) {
          targetNode = node as Text;
          nodeOffset = lastAtIndex - currentOffset;

          return true;
        }
        currentOffset += text.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const child of Array.from(node.childNodes)) {
          if (findTextNode(child)) return true;
        }
      }

      return false;
    };

    findTextNode(editor);

    if (targetNode) {
      // Разделяем текстовый узел и вставляем mention
      const mentionLength = mention.length + 1; // +1 для @
      const textLength = (targetNode as Text).length;

      // Создаём новый range для удаления @mention
      const deleteRange = document.createRange();

      deleteRange.setStart(targetNode as Text, nodeOffset);
      deleteRange.setEnd(
        targetNode as Text,
        Math.min(nodeOffset + mentionLength, textLength),
      );
      deleteRange.deleteContents();

      // Вставляем mention элемент
      deleteRange.insertNode(mentionSpan);

      // Добавляем пробел после mention
      const spaceNode = document.createTextNode(" ");

      deleteRange.setStartAfter(mentionSpan);
      deleteRange.insertNode(spaceNode);

      // Перемещаем курсор после пробела
      deleteRange.setStartAfter(spaceNode);
      deleteRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(deleteRange);
    }

    resetMention();

    // Сериализуем обновлённый DOM
    setTimeout(() => {
      if (editor) {
        const serialized = serializeDOM(
          editor.childNodes as unknown as NodeListOf<ChildNode>,
        );

        setPostContent(serialized);
        editor.focus();
      }
    }, 0);
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Проверяем, что курсор действительно покинул форму
    const rect = e.currentTarget.getBoundingClientRect();

    if (
      e.clientX < rect.left ||
      e.clientX >= rect.right ||
      e.clientY < rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);

        handleFilesDrop(files);
      }
    },
    [handleFilesDrop],
  );

  const onSubmit = handleSubmit(async () => {
    if (!currentUser) {
      toast.error("Вы не авторизованы");

      return;
    }

    if (!postContent.trim() && mediaFiles.length === 0 && !pollDraft) {
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
    if (pollDraft) {
      formData.append("poll", JSON.stringify(pollDraft));
    }
    console.log("poll draft", pollDraft);

    toast.promise(createPostAsync(formData), {
      loading: "Публикация поста",
      success: () => {
        clearContent();
        clearMedia();
        setSelectedEmojis([]);
        resetMention();
        setShowPoll(false);
        setPollDraft(null);

        if (onSuccessComplete) {
          onSuccessComplete();
        }

        return "Пост успешно опубликован!";
      },
      error: (err) => {
        return err.message || "Ошибка при создании поста";
      },
    });
  });

  const handleTogglePoll = () => {
    setShowPoll((prev) => {
      if (prev) setPollDraft(null); // сбрасываем при закрытии
      return !prev;
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <form
      ref={disableViewportTracking ? undefined : ref}
      className={`bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70 p-4 sm:p-5 rounded-[1.5rem] mb-6 flex flex-col gap-4 shadow-sm relative ${className || ""}`}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onSubmit={onSubmit}
    >
      {/* Overlay for Drag and Drop */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-neutral-100/90 dark:bg-[#101010]/90 backdrop-blur-sm rounded-[1.5rem] flex items-center justify-center border-2 border-dashed border-primary transition-all duration-200 pointer-events-none">
          <div className="flex flex-col items-center text-primary">
            <svg
              className="w-12 h-12 mb-2 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <span className="font-semibold text-lg">
              {t("CreatePost.dropFilesHere")}
            </span>
          </div>
        </div>
      )}

      <div ref={containerRef} className="relative">
        {/* contentEditable editor */}
        <div className="group relative min-h-[100px] max-h-[400px] overflow-y-auto overflow-x-hidden rounded-[1.25rem] transition-colors bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800/70 focus-within:border-neutral-400 dark:focus-within:border-neutral-600">
          <div
            ref={editorRef}
            suppressContentEditableWarning
            aria-label="Post editor"
            aria-multiline="true"
            className={
              "outline-none p-4 leading-relaxed text-neutral-900 dark:text-neutral-100 max-w-full min-w-0 w-full whitespace-pre-wrap break-words " +
              "font-serif text-[16px] tracking-wide " +
              "[overflow-wrap:anywhere] [word-break:break-word] " +
              "[&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-neutral-400 dark:[&:empty:before]:text-neutral-500 [&:empty:before]:pointer-events-none"
            }
            contentEditable={!isLoading}
            data-placeholder={t("CreatePost.CreatePostInput")}
            role="textbox"
            onClick={toggleSpoilerClick}
            onInput={handleEditorInput}
            onKeyDown={handleKeyDown}
            onMouseUp={handleMouseUp}
          />
          <div className="absolute top-0 left-0 w-full h-px overflow-hidden opacity-50 group-focus-within:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/20 dark:via-white/60 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Spoiler button (shows on selection) */}
        {showSpoilerButton && !isLoading && (
          <div
            ref={spoilerButtonRef}
            className="absolute z-50 flex flex-col items-center"
            style={{
              top: `${spoilerBtnPos.top}px`,
              left: `${spoilerBtnPos.left}px`,
            }}
          >
            {/* Стрелка вверх */}
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-neutral-900 dark:border-b-white" />
            <Button
              className="h-8 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-medium px-4 shadow-xl"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                applySpoilerToSelection();
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              Скрыть за спойлером
            </Button>
          </div>
        )}
      </div>

      {showHit && (
        <Mention
          mention={mention}
          showHit={showHit}
          onSelect={handleSelectMention}
        />
      )}

      {/* Media Preview Slider */}
      <MediaPreviewSlider
        disabled={isLoading}
        media={mediaFiles}
        onRemove={handleRemoveMedia}
        onToggleSpoiler={handleToggleSpoiler}
      />

      {showPoll && (
        <PollCreator
          onChange={setPollDraft}
          onClose={handleTogglePoll}
          disabled={isLoading}
        />
      )}
      {/* Toolbar: Formatting, Media Upload, Emoji Picker */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center pt-2">
        <PostEditorToolbar
          activeFormats={activeFormats}
          isLoading={isLoading}
          maxMedia={MAX_MEDIA}
          mediaFiles={mediaFiles}
          onEmojiSelect={handleEmojiSelect}
          onFormat={applyFormat}
          onMediaSelect={handleMediaSelect}
          hasPoll={showPoll}
          onTogglePoll={handleTogglePoll}
        />

        <Button
          className="rounded-full font-semibold px-6 h-10 w-full sm:w-auto bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-transform hover:-translate-y-0.5 shadow-sm"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-2" size={16} />
          ) : (
            <Pencil className="mr-2" size={16} />
          )}
          {t("CreatePost.addPost")}
        </Button>
      </div>

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

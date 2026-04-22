"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import EmojiPicker from "../../inputs/EmojiPicker";
import ErrorMessage from "../../ErrorMessage";
// TODO: Migrate to React Query - Create useUpdatePost mutation
import Mention from "../../inputs/Mention";

import { useUpdatePost } from "@/src/features/post";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// NOTE: avoid module-level /g regex reuse with .exec() – always create fresh per call
const EMOJI_MARKER_REGEX = () => /\[emoji:(\d+)\]/g;

function normalizeEmojis(text: string, emojis: string[]) {
  const used: number[] = [];

  let m: RegExpExecArray | null;
  const re = EMOJI_MARKER_REGEX();

  while ((m = re.exec(text)) !== null) {
    const idx = Number(m[1]);

    if (!Number.isNaN(idx) && emojis[idx] !== undefined && !used.includes(idx))
      used.push(idx);
  }

  const map = new Map<number, number>();

  used.forEach((oldIdx, i) => map.set(oldIdx, i));

  const newText = text.replace(EMOJI_MARKER_REGEX(), (_, p1: string) => {
    const oldIdx = Number(p1);
    const newIdx = map.get(oldIdx);

    return newIdx === undefined ? "" : `[emoji:${newIdx}]`;
  });

  const newEmojiUrls = used.map((i) => emojis[i]).filter(Boolean) as string[];

  return { newText, newEmojiUrls };
}

function removeEmojiFromText(text: string, removedIndex: number) {
  // Удаляем первый маркер [emoji:removedIndex]
  let updated = text.replace(new RegExp(`\\[emoji:${removedIndex}\\]`), "");

  // Сдвигаем все > removedIndex на -1
  updated = updated.replace(EMOJI_MARKER_REGEX(), (match, p1) => {
    const k = Number(p1);

    return k > removedIndex ? `[emoji:${k - 1}]` : match;
  });

  return updated;
}

// ===== Component =====
interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  initialContent: string;
  initialEmojiUrls?: string[];
  onUpdated?: () => Promise<void> | void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  postId,
  initialContent,
  initialEmojiUrls = [],
  onUpdated,
}) => {
  const [content, setContent] = useState(initialContent);
  const [emojis, setEmojis] = useState<string[]>(initialEmojiUrls || []);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [mention, setMention] = useState<string>("");
  const [showHit, setShowHit] = useState<boolean>(false);
  const [atStartIndex, setAtStartIndex] = useState<number | null>(null);

  // Сброс при открытии
  useEffect(() => {
    if (!isOpen) return;
    setContent(initialContent);
    setEmojis(initialEmojiUrls || []);
    setError("");
  }, [isOpen, initialContent, initialEmojiUrls]);

  const handleEmojiSelect = useCallback(
    (emojiUrl: string) => {
      const textarea = textareaRef.current;

      if (!textarea) return;
      const cursor = textarea.selectionStart || 0;
      const marker = `[emoji:${emojis.length}]`;

      setContent((prev) => {
        const before = prev.substring(0, cursor);
        const after = prev.substring(cursor);

        return before + marker + after;
      });
      setEmojis((prev) => [...prev, emojiUrl]);

      // восстановить позицию курсора
      setTimeout(() => {
        const pos = cursor + marker.length;

        textarea.setSelectionRange(pos, pos);
        textarea.focus();
      }, 0);
    },
    [emojis.length],
  );

  const removeEmojiAt = useCallback((index: number) => {
    setContent((prev) => removeEmojiFromText(prev, index));
    setEmojis((prev) => {
      const next = [...prev];

      next.splice(index, 1);

      return next;
    });
  }, []);

  const { mutate, isPending } = useUpdatePost();

  const handleSave = useCallback(async () => {
    if (!postId) return;
    setError("");

    // Валидация: контент или эмодзи должны быть
    if (!content.trim() && emojis.length === 0) {
      setError("Пост не может быть пустым");

      return;
    }

    try {
      const { newText, newEmojiUrls } = normalizeEmojis(content, emojis);

      mutate({
        id: postId,
        data: { content: newText, emojiUrls: newEmojiUrls },
      });

      if (onUpdated) await onUpdated();
      onClose();
    } catch (err: any) {
      setError(
        String(err?.data?.error || err?.message || "Не удалось обновить пост"),
      );
    }
  }, [postId, content, emojis, mutate, onUpdated, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value;
    const atIndex = newValue.lastIndexOf("@");

    setContent(newValue);

    if (atIndex !== -1) {
      console.log("atIndex", atIndex);
      // берём всё, что после последнего @
      const query = newValue.slice(atIndex + 1);

      // проверяем: если query пустой или содержит пробел/новый @ — скрываем меню

      if (!query || query.includes(" ") || query.includes("@")) {
        setShowHit(false);
      } else {
        setMention(query);
        setShowHit(true);
        setAtStartIndex(atIndex);
        console.log("ищем пользователя:", query);

        // здесь запрос к серверу
        // fetch(`/api/search?username=${query}`).then(...)
      }
    } else {
      // если @ нет в строке — скрываем меню
      setShowHit(false);
      setAtStartIndex(null);
    }
  };

  const handleSelectMention = (user: { id: string; name?: string | null }) => {
    const textarea = textareaRef.current;
    const name = (user.name || "").trim();

    if (!textarea || atStartIndex === null) return;

    const token = `[mention:${user.id}|${name || "user"}]`;
    const cursor = textarea.selectionStart ?? atStartIndex + 1;

    const before = content.slice(0, atStartIndex);
    const after = content.slice(cursor);
    const next = `${before}${token}${after}`;

    setContent(next);
    setShowHit(false);
    setMention("");
    setAtStartIndex(null);

    // курсор после токена
    const newPos = before.length + token.length;

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать пост</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Textarea
            ref={textareaRef}
            className="min-h-[100px] resize-none"
            placeholder="Измените текст поста"
            value={content}
            onChange={(e) => handleChange(e as any)}
          />
          {/* отображение отмеченных людей */}
          {showHit && (
            <Mention
              mention={mention}
              showHit={showHit}
              onSelect={handleSelectMention}
            />
          )}

          <div className="flex gap-3 items-center">
            <EmojiPicker
              disabled={isPending}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>

          <ErrorMessage error={error} />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button disabled={isPending} onClick={handleSave}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostModal;

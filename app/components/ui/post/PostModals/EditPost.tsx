"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import EmojiPicker from "../EmojiPicker";
import { EmojiText } from "../../EmojiText";
import ErrorMessage from "../../ErrorMessage";
import { useUpdatePostMutation } from "@/src/services/post/post.service";
import Mention from "../CreatePost/Mention";

// ===== Utils =====
const EMOJI_MARKER_REGEX = /\[emoji:(\d+)\]/g;

function normalizeEmojis(text: string, emojis: string[]) {
  const used: number[] = [];

  let m: RegExpExecArray | null;

  while ((m = EMOJI_MARKER_REGEX.exec(text)) !== null) {
    const idx = Number(m[1]);
    if (!Number.isNaN(idx) && emojis[idx] !== undefined && !used.includes(idx))
      used.push(idx);
  }

  const map = new Map<number, number>();
  used.forEach((oldIdx, i) => map.set(oldIdx, i));

  const newText = text.replace(EMOJI_MARKER_REGEX, (_, p1: string) => {
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
  updated = updated.replace(EMOJI_MARKER_REGEX, (match, p1) => {
    const k = Number(p1);
    return k > removedIndex ? `[emoji:${k - 1}]` : match;
  });
  return updated;
}

// ===== Small UI pieces =====
const PreviewSection: React.FC<{ content: string; emojis: string[] }> = ({
  content,
  emojis,
}) => {
  if (!content && emojis.length === 0) return null;
  return (
    <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-default-50 to-default-100 border border-default-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-sm font-medium text-default-600">Превью</span>
      </div>
      <div className="bg-background/70 backdrop-blur-sm rounded-lg p-3 border border-default-200/50">
        <EmojiText
          text={content || ""}
          emojiUrls={emojis}
          className="text-default-700 leading-relaxed"
        />
        {content === "" && (
          <div className="text-default-400 italic">Здесь появится ваш пост</div>
        )}
      </div>
    </div>
  );
};

const EmojiList: React.FC<{
  emojis: string[];
  onRemove: (i: number) => void;
}> = ({ emojis, onRemove }) => {
  if (emojis.length === 0) return null;
  return (
    <div>
      <div className="text-sm text-default-500 mb-2">Эмодзи в посте</div>
      <div className="grid grid-cols-6 gap-3">
        {emojis.map((url, idx) => (
          <div key={`emoji-${idx}`} className="relative group">
            <img
              src={url}
              alt={`emoji-${idx}`}
              className="w-12 h-12 rounded-md object-cover border border-default-200"
            />
            <Button
              size="sm"
              color="danger"
              variant="flat"
              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onPress={() => onRemove(idx)}
            >
              ×
            </Button>
            <div className="text-[10px] text-default-400 mt-1 text-center">
              [{`emoji:${idx}`}]
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
  const [updatePost, { isLoading }] = useUpdatePostMutation();

  const [mention, setMention] = useState<string>("");
  const [postValue, setPostValue] = useState<string>("");
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
    [emojis.length]
  );

  const removeEmojiAt = useCallback((index: number) => {
    setContent((prev) => removeEmojiFromText(prev, index));
    setEmojis((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!postId) return;
    setError("");
    try {
      const { newText, newEmojiUrls } = normalizeEmojis(content, emojis);
      await updatePost({
        id: postId,
        content: newText,
        emojiUrls: newEmojiUrls,
      }).unwrap();
      if (onUpdated) await onUpdated();
      onClose();
    } catch (err: any) {
      setError(
        String(err?.data?.error || err?.message || "Не удалось обновить пост")
      );
    }
  }, [postId, content, emojis, updatePost, onUpdated, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <>
          <ModalHeader>Редактировать пост</ModalHeader>
          <ModalBody>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleChange(e)}
              labelPlacement="outside"
              placeholder="Измените текст поста"
              className="mb-2"
            />
            {/* отображение отмеченных людей */}
            {showHit && (
              <Mention
                showHit={showHit}
                mention={mention}
                onSelect={handleSelectMention}
              />
            )}

            <div className="mb-3 flex gap-3 items-center">
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                disabled={isLoading}
              />
            </div>

            <PreviewSection content={content} emojis={emojis} />
            <EmojiList emojis={emojis} onRemove={removeEmojiAt} />

            <ErrorMessage error={error} />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Отмена
            </Button>
            <Button color="primary" isLoading={isLoading} onPress={handleSave}>
              Сохранить
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default EditPostModal;

"use client";

import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Textarea } from "@heroui/react";
import { IoMdCreate } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { useCreatePost } from "../hooks/usePostMutations";
import type { User } from "../types";

import ImageUpload from "@/shared/components/ui/post/ImageUpload";
import EmojiPicker from "@/shared/components/ui/inputs/EmojiPicker";
import { EmojiText } from "@/shared/components/ui/EmojiText";
import Mention from "@/shared/components/ui/inputs/Mention";

import {
  createImagePreview,
  revokeImagePreview,
} from "@/shared/components/ui/post/ImageUpload/utils";

interface FormData {
  post: string;
}

const CreatePost = () => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<User>(["profile"]);
  
  const { mutate: createPost, isPending: isLoading, error } = useCreatePost();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  
  // Mention functionality
  const [mention, setMention] = useState<string>("");
  const [showHit, setShowHit] = useState<boolean>(false);
  const [atStartIndex, setAtStartIndex] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const currentText = watch("post");

  const handleImageSelect = (file: File | null) => {
    if (imagePreview) {
      revokeImagePreview(imagePreview);
    }
    setSelectedImage(file);
    if (file) {
      setImagePreview(createImagePreview(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleEmojiSelect = (emojiUrl: string) => {
    const emojiIndex = selectedEmojis.length;
    const emojiMarker = `[emoji:${emojiIndex}]`;

    setSelectedEmojis((prev) => [...prev, emojiUrl]);

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const text = textarea.value;

    const before = text.slice(0, start);
    const after = text.slice(end);
    const newText = `${before}${emojiMarker}${after}`;

    setValue("post", newText, { shouldDirty: true, shouldValidate: true });

    setTimeout(() => {
      const newPos = start + emojiMarker.length;
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue("post", newValue, { shouldDirty: true, shouldValidate: true });

    const atIndex = newValue.lastIndexOf("@");

    if (atIndex !== -1) {
      const query = newValue.slice(atIndex + 1);

      if (!query || query.includes(" ") || query.includes("@")) {
        setShowHit(false);
      } else {
        setMention(query);
        setShowHit(true);
        setAtStartIndex(atIndex);
      }
    } else {
      setShowHit(false);
      setAtStartIndex(null);
    }
  };

  const handleSelectMention = (user: { id: string; name?: string | null }) => {
    const textarea = textareaRef.current;
    const name = (user.name || "").trim();
    if (!textarea || atStartIndex === null) return;

    const token = `[mention:${user.id}|${name || "user"}]`;

    const before = currentText.slice(0, atStartIndex);
    const cursor = textarea.selectionStart || atStartIndex + 1;
    const after = currentText.slice(cursor);
    const next = `${before}${token}${after}`;

    setValue("post", next, { shouldDirty: true, shouldValidate: true });
    setShowHit(false);
    setMention("");
    setAtStartIndex(null);

    const newPos = before.length + token.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!currentUser) {
      toast.error("Вы не авторизованы");
      return;
    }

    if (!data.post.trim() && !selectedImage) {
      toast.error("Пост не может быть пустым");
      return;
    }

    createPost(
      {
        content: data.post,
        image: selectedImage || undefined,
        emojiUrls: selectedEmojis,
      },
      {
        onSuccess: () => {
          // Clear form
          setValue("post", "");
          setSelectedImage(null);
          setSelectedEmojis([]);
          if (imagePreview) {
            revokeImagePreview(imagePreview);
            setImagePreview(null);
          }
          setMention("");
          setShowHit(false);
          setAtStartIndex(null);
        },
      }
    );
  });

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        revokeImagePreview(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!currentUser) {
    return null;
  }

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="post"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <>
            <Textarea
              {...field}
              ref={textareaRef}
              labelPlacement="outside"
              placeholder={t("CreatePost.CreatePostInput")}
              className="mb-5 whitespace-pre-wrap"
              onChange={(e) => {
                field.onChange(e);
                const evt =
                  e as unknown as React.ChangeEvent<HTMLTextAreaElement>;
                handleChange(evt);
              }}
            />
          </>
        )}
      />
      
      {showHit && (
        <Mention
          showHit={showHit}
          mention={mention}
          onSelect={handleSelectMention}
        />
      )}

      <div className="mb-5 flex gap-3">
        <ImageUpload
          onImageSelect={handleImageSelect}
          preview={imagePreview}
          disabled={isLoading}
        />
        <EmojiPicker onEmojiSelect={handleEmojiSelect} disabled={isLoading} />
      </div>

      {(selectedEmojis.length > 0 || currentText) && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-default-50 to-default-100 border border-default-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-sm font-medium text-default-600">
              {t("CreatePost.previewPost")}
            </span>
          </div>
          <div className="bg-background/70 backdrop-blur-sm rounded-lg p-3 border border-default-200/50">
            <EmojiText
              key={currentText}
              text={currentText || "Начните писать..."}
              emojiUrls={selectedEmojis}
              className="text-default-700 leading-relaxed"
            />
            {currentText === "" && (
              <div className="text-default-400 italic">
                Ваш пост будет отображаться здесь
              </div>
            )}
          </div>
        </div>
      )}

      <Button
        color="success"
        isLoading={isLoading}
        className="flex-end relative rounded-full hover:-translate-y-1 px-12 shadow-xl after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
        endContent={<IoMdCreate />}
        type="submit"
      >
        {t("CreatePost.addPost")}
      </Button>
    </form>
  );
};

export default CreatePost;

import React, { useState, useEffect, useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { addToast, Button, Textarea } from "@heroui/react";
import ErrorMessage from "../../ErrorMessage";
import { IoMdCreate } from "react-icons/io";
import {
  useCreatePostMutation,
  useLazyGetAllPostsQuery,
} from "@/src/services/post/post.service";
import ImageUpload from "../ImageUpload";
import EmojiPicker from "../EmojiPicker";
import { EmojiText } from "../../EmojiText";
import { createImagePreview, revokeImagePreview } from "../ImageUpload/utils";
import { useTranslations } from "next-intl";
import Mention from "./Mention";
import { useSelector } from "react-redux";
import { selectCurrent } from "@/src/store/user/user.slice";

type Props = {};

const CreatePost = (props: Props) => {
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [triggerAllPosts] = useLazyGetAllPostsQuery();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const current = useSelector(selectCurrent);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const currentText = watch("post", "");
  const error = errors?.post?.message as string;

  // Очистка URL предпросмотра при размонтировании компонента
  useEffect(() => {
    return () => {
      if (imagePreview) {
        revokeImagePreview(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageSelect = (file: File | null) => {
    // Очистка предыдущего предпросмотра
    if (imagePreview) {
      revokeImagePreview(imagePreview);
      setImagePreview(null);
    }

    setSelectedImage(file);

    if (file) {
      const preview = createImagePreview(file);
      setImagePreview(preview);
    }
  };

  const handleEmojiSelect = (emojiUrl: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart || 0;
    const textBefore = currentText.substring(0, cursorPosition);
    const textAfter = currentText.substring(cursorPosition);

    // Создаем маркер для emoji с индексом
    const emojiIndex = selectedEmojis.length;
    const emojiMarker = `[emoji:${emojiIndex}]`;
    const newText = textBefore + emojiMarker + textAfter;

    // Обновляем текст и список emoji
    setValue("post", newText);
    setSelectedEmojis((prev) => [...prev, emojiUrl]);

    // Восстанавливаем курсор после маркера
    setTimeout(() => {
      const newCursorPosition = cursorPosition + emojiMarker.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  };

  const createPostFormDataWithEmojis = (content: string, image?: File) => {
    const formData = new FormData();
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    if (selectedEmojis.length > 0) {
      formData.append("emojiUrls", JSON.stringify(selectedEmojis));
    }

    return formData;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!current) {
        addToast({
          title: "Вы не авторизованы",
          description: "Пожалуйста, войдите в систему.",

          color: "danger",

        });
        setValue("post", "");
        setSelectedImage(null);
        setSelectedEmojis([]);
        if (imagePreview) {
          revokeImagePreview(imagePreview);
          setImagePreview(null);
        }
        return;
      }
      const formData = createPostFormDataWithEmojis(
        data.post,
        selectedImage || undefined
      );
      await createPost(formData).unwrap();

      // Очистка формы
      setValue("post", "");
      setSelectedImage(null);
      setSelectedEmojis([]);
      if (imagePreview) {
        revokeImagePreview(imagePreview);
        setImagePreview(null);
      }

      await triggerAllPosts().unwrap();
    } catch (err) {
      console.log(err);
    }
  });

  const t = useTranslations("HomePage");

  const [mention, setMention] = useState<string>("");
  const [showHit, setShowHit] = useState<boolean>(false);
  const [atStartIndex, setAtStartIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // синхронизируем с react-hook-form
    const atIndex = newValue.lastIndexOf("@");
    setValue("post", newValue, { shouldDirty: true, shouldValidate: true });

    if (atIndex !== -1) {
      // берём всё, что после последнего @
      const query = newValue.slice(atIndex + 1);

      // проверяем: если query пустой или содержит пробел/новый @ — скрываем меню

      if (!query || query.includes(" ") || query.includes("@")) {
        setShowHit(false);
      } else {
        setMention(query);
        setShowHit(true);
        setAtStartIndex(atIndex);

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

    // формируем токен упоминания: [mention:<id>|<name>]
    const token = `[mention:${user.id}|${name || "user"}]`;

    const before = currentText.slice(0, atStartIndex);
    // пропускаем @ и текущий ввод после него до текущей позиции курсора
    const cursor = textarea.selectionStart || atStartIndex + 1;
    const after = currentText.slice(cursor);
    const next = `${before}${token}${after}`;

    setValue("post", next, { shouldDirty: true, shouldValidate: true });
    setShowHit(false);
    setMention("");
    setAtStartIndex(null);

    // ставим курсор сразу после вставленного токена
    const newPos = before.length + token.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

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
              className="mb-5"
              onChange={(e) => {
                // обновляем RHF и локальную логику подсказок одновременно
                field.onChange(e);
                const evt =
                  e as unknown as React.ChangeEvent<HTMLTextAreaElement>;
                handleChange(evt);
              }}
            />
          </>
        )}
      />
      {/* отображение отмеченных людей */}
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

      {error && <ErrorMessage error={error} />}

      <Button
        color="success"
        isLoading={isLoading}
        className=" flex-end relative  rounded-full hover:-translate-y-1 px-12 shadow-xl  after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
        endContent={<IoMdCreate />}
        type="submit"
      >
        {t("CreatePost.addPost")}
      </Button>
    </form>
  );
};

export default CreatePost;

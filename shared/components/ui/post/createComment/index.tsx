"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import { IoMdCreate } from "react-icons/io";
import { useParams } from "next/navigation";

import ErrorMessage from "../../ErrorMessage";
import RichTextarea, {
  createEmojiPlugin,
  createMentionPlugin,
} from "../../inputs/RichTextarea";

import { useCreateComment } from "@/src/features/post/comment/hooks/useComment";

type Props = {};

const CreateComment = (props: Props) => {
  const { id } = useParams() as { id: string };
  const { mutate, isPending } = useCreateComment();
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const error = errors?.post?.message as string;
  const currentText = watch("comment", "");

  const onSubmit = handleSubmit(async (data) => {
    if (!id) return;
    const content = data.comment || "";

    mutate(
      { postId: id, content, emojiUrls: selectedEmojis },
      {
        onSuccess: async () => {
          setValue("comment", "");
          setSelectedEmojis([]);
          // EmojiMentionTextarea управляет показом подсказок упоминаний
        },
      },
    );
  });

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        control={control}
        defaultValue=""
        name="comment"
        render={({ field }) => (
          <RichTextarea
            disabled={isPending}
            placeholder="Напишите комментарий..."
            plugins={[
              createMentionPlugin(),
              createEmojiPlugin({ onUrlsChange: setSelectedEmojis }),
            ]}
            value={field.value}
            onChange={(v) =>
              setValue("comment", v, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        )}
        rules={{ required: "Обязательное поле" }}
      />

      <div className="flex items-center justify-between">
        {/* {(selectedEmojis.length > 0 || currentText) && (
                    <div className='flex-1 mb-3 p-3 rounded-xl bg-gradient-to-br from-default-50 to-default-100 border border-default-200 shadow-sm'>
                        <EmojiText
                            key={currentText}
                            text={currentText || 'Начните писать...'}
                            emojiUrls={selectedEmojis}
                            className='text-default-700 leading-relaxed'
                        />
                    </div>
                )} */}

        <div className="flex items-center gap-3 ml-auto">
          <Button
            color="primary"
            endContent={<IoMdCreate />}
            isLoading={isPending}
            type="submit"
          >
            Оставить комментарий
          </Button>
        </div>
      </div>

      {error && <ErrorMessage error={error} />}
    </form>
  );
};

export default CreateComment;

"use client";
import type { User } from "@/src/types/types";

import React, { useMemo, useState, useTransition } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
} from "@heroui/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClosse?: () => void;
};

type FormValues = {
  subject: string;
  description: string;
};

const MAX_LEN = 1000;

const FeedBackModal: React.FC<Props> = ({ isOpen, onOpenChange, onClosse }) => {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<User>(["profile"]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { subject: "", description: "" },
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const description = watch("description") || "";
  const left = useMemo(
    () => Math.max(0, MAX_LEN - description.length),
    [description],
  );

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      // Создаем FormData для отправки
      const formData = new FormData();

      formData.append("type", "GENERAL_FEEDBACK");
      formData.append("subject", data.subject);
      formData.append("description", data.description);

      // Добавляем информацию о пользователе
      if (currentUser?.username || currentUser?.name) {
        formData.append(
          "userName",
          currentUser.username || currentUser.name || "Аноним",
        );
      }
      if (currentUser?.email) {
        formData.append("userEmail", currentUser.email);
      }

      const res = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        throw new Error(err?.error || "Ошибка отправки");
      }

      startTransition(() => {
        reset();
        if (onClosse) {
          onClosse();
        }
        toast.success("Ваше сообщение отправлено в Telegram!");
      });
    } catch (e: any) {
      setServerError(e?.message || "Не удалось отправить сообщение");
    }
  });

  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 ",
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="lg"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              <h2 className="text-xl font-semibold">📧 Обратная связь</h2>
              <p className="text-foreground/80 text-sm">
                Опишите проблему, идею или пожелания — мы получим это в
                Telegram.
              </p>
              {currentUser && (
                <p className="text-foreground/60 text-xs">
                  От: {currentUser.username || currentUser.name || "Аноним"}
                </p>
              )}
            </ModalHeader>
            <ModalBody className="pb-6">
              <form className="space-y-4" onSubmit={onSubmit}>
                <Input
                  label="Тема"
                  placeholder="Краткое описание"
                  {...register("subject", {
                    required: "Тема обязательна",
                    minLength: { value: 5, message: "Минимум 5 символов" },
                    maxLength: { value: 100, message: "Максимум 100 символов" },
                  })}
                  errorMessage={errors.subject?.message}
                  isInvalid={!!errors.subject}
                />

                <div>
                  <Textarea
                    label="Сообщение"
                    labelPlacement="outside"
                    minRows={5}
                    placeholder="Опишите суть обратной связи подробно…"
                    {...register("description", {
                      required: "Сообщение обязательно",
                      minLength: { value: 20, message: "Минимум 20 символов" },
                      maxLength: {
                        value: MAX_LEN,
                        message: `Максимум ${MAX_LEN} символов`,
                      },
                    })}
                    isInvalid={!!errors.description}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-foreground/60">
                    <span className="text-danger">
                      {errors.description?.message}
                    </span>
                    <span>{left} символов</span>
                  </div>
                </div>

                {serverError && (
                  <div className="text-danger text-sm">{serverError}</div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="flat" onPress={() => onClose()}>
                    Отмена
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={description.length < 20}
                    isLoading={isSubmitting || isPending}
                    type="submit"
                  >
                    Отправить
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FeedBackModal;

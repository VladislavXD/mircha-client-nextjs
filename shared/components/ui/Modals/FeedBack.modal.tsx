"use client";
import type { User } from "@/src/types/types";

import React, { useMemo, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
      const formData = new FormData();

      formData.append("type", "GENERAL_FEEDBACK");
      formData.append("subject", data.subject);
      formData.append("description", data.description);

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
        if (onClosse) onClosse();
        toast.success("Ваше сообщение отправлено в Telegram!");
      });
    } catch (e: any) {
      setServerError(e?.message || "Не удалось отправить сообщение");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">
            📧 Обратная связь
          </DialogTitle>
          <DialogDescription className="text-sm">
            Опишите проблему, идею или пожелания — мы получим это в Telegram.
          </DialogDescription>
          {currentUser && (
            <p className="text-muted-foreground text-xs">
              От: {currentUser.username || currentUser.name || "Аноним"}
            </p>
          )}
        </DialogHeader>

        <form className="space-y-4 pb-2" onSubmit={onSubmit}>
          {/* Тема */}
          <div className="space-y-1">
            <Label htmlFor="subject">Тема</Label>
            <Input
              id="subject"
              placeholder="Краткое описание"
              {...register("subject", {
                required: "Тема обязательна",
                minLength: { value: 5, message: "Минимум 5 символов" },
                maxLength: { value: 100, message: "Максимум 100 символов" },
              })}
              className={errors.subject ? "border-destructive" : ""}
            />
            {errors.subject && (
              <p className="text-destructive text-xs">{errors.subject.message}</p>
            )}
          </div>

          {/* Сообщение */}
          <div className="space-y-1">
            <Label htmlFor="description">Сообщение</Label>
            <Textarea
              id="description"
              placeholder="Опишите суть обратной связи подробно…"
              rows={5}
              {...register("description", {
                required: "Сообщение обязательно",
                minLength: { value: 20, message: "Минимум 20 символов" },
                maxLength: {
                  value: MAX_LEN,
                  message: `Максимум ${MAX_LEN} символов`,
                },
              })}
              className={errors.description ? "border-destructive" : ""}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-destructive">
                {errors.description?.message}
              </span>
              <span>{left} символов</span>
            </div>
          </div>

          {serverError && (
            <p className="text-destructive text-sm">{serverError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={description.length < 20 || isSubmitting || isPending}
            >
              {(isSubmitting || isPending) ? "Отправка…" : "Отправить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedBackModal;
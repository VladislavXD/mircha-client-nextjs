"use client";

import type { CreateFeedbackDto } from "../types";
import type { User } from "@/src/types/types";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Upload, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateFeedback } from "../hooks/useFeedbackMutations";
import { FeedbackType, ReportReason } from "../types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId?: string;
  targetType?: "post" | "comment" | "user";
  targetTitle?: string;
  defaultType?: FeedbackType;
}

interface FormData {
  reason: ReportReason;
  subject: string;
  description: string;
}

const ReportModal = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
  defaultType = FeedbackType.POST_REPORT,
}: ReportModalProps) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<User>(["profile"]);

  const { mutate: createFeedback, isPending: isLoading } = useCreateFeedback();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      reason: ReportReason.OTHER,
      subject: "",
      description: "",
    },
  });

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const removeScreenshot = () => {
    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  const onSubmit = handleSubmit((data) => {
    const feedbackData: CreateFeedbackDto & {
      userName?: string;
      userEmail?: string;
    } = {
      type: defaultType,
      reason: data.reason,
      subject: data.subject,
      description: data.description,
      targetId,
      targetType,
      screenshot: screenshot || undefined,
      userName: currentUser?.username || currentUser?.name || "Аноним",
      userEmail: currentUser?.email,
    };

    createFeedback(feedbackData, {
      onSuccess: () => {
        onClose();
        reset();
        setScreenshot(null);
        if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
        setScreenshotPreview(null);
      },
      onError: (error) => {
        console.error("Failed to submit feedback:", error);
      },
    });
  });

  const reasonOptions = [
    { value: ReportReason.SPAM, label: "Спам" },
    { value: ReportReason.HARASSMENT, label: "Домогательство" },
    { value: ReportReason.HATE_SPEECH, label: "Разжигание ненависти" },
    { value: ReportReason.VIOLENCE, label: "Насилие" },
    { value: ReportReason.NUDITY, label: "Обнаженка" },
    { value: ReportReason.FALSE_INFORMATION, label: "Ложная информация" },
    { value: ReportReason.SCAM, label: "Мошенничество" },
    { value: ReportReason.INTELLECTUAL_PROPERTY, label: "Нарушение авторских прав" },
    { value: ReportReason.OTHER, label: "Другое" },
  ];

  const getModalTitle = () => {
    switch (defaultType) {
      case FeedbackType.POST_REPORT: return "Пожаловаться на пост";
      case FeedbackType.COMMENT_REPORT: return "Пожаловаться на комментарий";
      case FeedbackType.USER_REPORT: return "Пожаловаться на пользователя";
      case FeedbackType.BUG_REPORT: return "Сообщить об ошибке";
      case FeedbackType.FEATURE_REQUEST: return "Предложить функцию";
      default: return "Обратная связь";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-500 shrink-0" size={22} />
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Цель жалобы */}
          {targetId && targetTitle && (
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                {targetType === "post" && "Пост: "}
                {targetType === "comment" && "Комментарий: "}
                {targetType === "user" && "Пользователь: "}
                <span className="font-medium text-foreground">{targetTitle}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">ID: {targetId}</p>
            </div>
          )}

          {/* Отправитель */}
          {currentUser && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm">
                <span className="text-muted-foreground">Отправитель: </span>
                <span className="font-medium text-primary">
                  {currentUser.name || currentUser.email}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ID: {currentUser.id}
              </p>
            </div>
          )}

          {/* Причина */}
          <div className="space-y-1.5">
            <Label>Причина жалобы *</Label>
            <Controller
              control={control}
              name="reason"
              rules={{ required: "Выберите причину" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.reason ? "border-destructive" : ""}>
                    <SelectValue placeholder="Выберите причину" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.reason && (
              <p className="text-xs text-destructive">{errors.reason.message}</p>
            )}
          </div>

          {/* Тема */}
          <div className="space-y-1.5">
            <Label htmlFor="subject">Тема *</Label>
            <Controller
              control={control}
              name="subject"
              rules={{
                required: "Укажите тему",
                minLength: { value: 5, message: "Минимум 5 символов" },
                maxLength: { value: 100, message: "Максимум 100 символов" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="subject"
                  placeholder="Краткое описание проблемы"
                  className={errors.subject ? "border-destructive" : ""}
                />
              )}
            />
            {errors.subject && (
              <p className="text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>

          {/* Описание */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Подробное описание *</Label>
            <Controller
              control={control}
              name="description"
              rules={{
                required: "Опишите проблему",
                minLength: { value: 20, message: "Минимум 20 символов" },
                maxLength: { value: 1000, message: "Максимум 1000 символов" },
              }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Расскажите подробнее о проблеме..."
                  rows={5}
                  className={errors.description ? "border-destructive" : ""}
                />
              )}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Скриншот */}
          <div className="space-y-2">
            <Label>Скриншот (опционально)</Label>
            {!screenshot ? (
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="text-muted-foreground" size={20} />
                <span className="text-sm text-muted-foreground">
                  Загрузить скриншот
                </span>
                <input
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handleScreenshotChange}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  alt="Screenshot preview"
                  className="w-full h-auto rounded-lg border"
                  src={screenshotPreview!}
                />
                <Button
                  className="absolute top-2 right-2 h-7 w-7 p-0"
                  size="sm"
                  type="button"
                  variant="destructive"
                  onClick={removeScreenshot}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
          </div>

          {/* Предупреждение */}
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30">
            <p className="text-xs text-yellow-700 dark:text-yellow-500">
              ⚠️ Ложные жалобы могут привести к блокировке вашего аккаунта.
              Модераторы рассмотрят вашу жалобу в течение 24 часов.
            </p>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              disabled={isLoading}
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button disabled={isLoading} type="submit" variant="destructive">
              {isLoading ? (
                "Отправка..."
              ) : (
                <>
                  <AlertTriangle size={16} className="mr-1.5" />
                  Отправить жалобу
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
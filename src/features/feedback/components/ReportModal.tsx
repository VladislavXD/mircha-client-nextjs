"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Upload, X } from "lucide-react";

import { useCreateFeedback } from "../hooks/useFeedbackMutations";
import { FeedbackType, ReportReason } from "../types";
import type { CreateFeedbackDto } from "../types";
import type { User } from "@/src/types/types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId?: string;
  targetType?: "post" | "comment" | "user";
  targetTitle?: string; // Заголовок/имя того на что жалуемся
  defaultType?: FeedbackType;
}

interface FormData {
  reason: ReportReason;
  subject: string;
  description: string;
}

/**
 * ReportModal - универсальная модалка для жалоб
 * 
 * Может использоваться для:
 * - Жалобы на посты
 * - Жалобы на комментарии
 * - Жалобы на пользователей
 * - Баг-репорты
 * - Запросы функций
 * - Общая обратная связь
 */
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
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const removeScreenshot = () => {
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  const onSubmit = handleSubmit((data) => {
    const feedbackData: CreateFeedbackDto & { userName?: string; userEmail?: string } = {
      type: defaultType,
      reason: data.reason,
      subject: data.subject,
      description: data.description,
      targetId,
      targetType,
      screenshot: screenshot || undefined,
      userName: currentUser?.username || currentUser?.name || 'Аноним',
      userEmail: currentUser?.email,
    };

    createFeedback(feedbackData, {
      onSuccess: () => {
        // Закрываем модалку после успешной отправки
        onClose();
        reset();
        setScreenshot(null);
        if (screenshotPreview) {
          URL.revokeObjectURL(screenshotPreview);
        }
        setScreenshotPreview(null);
      },
      onError: (error) => {
        // Toast уже показан в хуке, просто логируем
        console.error('Failed to submit feedback:', error);
      }
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
    {
      value: ReportReason.INTELLECTUAL_PROPERTY,
      label: "Нарушение авторских прав",
    },
    { value: ReportReason.OTHER, label: "Другое" },
  ];

  const getModalTitle = () => {
    switch (defaultType) {
      case FeedbackType.POST_REPORT:
        return "Пожаловаться на пост";
      case FeedbackType.COMMENT_REPORT:
        return "Пожаловаться на комментарий";
      case FeedbackType.USER_REPORT:
        return "Пожаловаться на пользователя";
      case FeedbackType.BUG_REPORT:
        return "Сообщить об ошибке";
      case FeedbackType.FEATURE_REQUEST:
        return "Предложить функцию";
      default:
        return "Обратная связь";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-background",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        {(onModalClose) => (
          <form onSubmit={onSubmit}>
            <ModalHeader className="flex items-center gap-2">
              <AlertTriangle className="text-warning" size={24} />
              <span>{getModalTitle()}</span>
            </ModalHeader>

          <ModalBody>
            {/* Информация о цели жалобы */}
            {targetId && targetTitle && (
              <div className="mb-4 p-3 rounded-lg bg-default-100">
                <p className="text-sm text-default-600">
                  {targetType === "post" && "Пост: "}
                  {targetType === "comment" && "Комментарий: "}
                  {targetType === "user" && "Пользователь: "}
                  <span className="font-medium text-default-900">
                    {targetTitle}
                  </span>
                </p>
                {targetId && (
                  <p className="text-xs text-default-500 mt-1">ID: {targetId}</p>
                )}
              </div>
            )}

            {/* Информация о отправителе */}
            {currentUser && (
              <div className="mb-4 p-3 rounded-lg bg-primary-50 dark:bg-primary-100/10">
                <p className="text-sm">
                  <span className="text-default-600">Отправитель: </span>
                  <span className="font-medium text-primary">
                    {currentUser.name || currentUser.email}
                  </span>
                </p>
                <p className="text-xs text-default-500 mt-1">
                  ID: {currentUser.id}
                </p>
              </div>
            )}

            {/* Причина жалобы */}
            <Controller
              name="reason"
              control={control}
              rules={{ required: "Выберите причину" }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Причина жалобы"
                  placeholder="Выберите причину"
                  errorMessage={errors.reason?.message}
                  isInvalid={!!errors.reason}
                  isRequired
                  classNames={{
                    label: "font-medium",
                  }}
                >
                  {reasonOptions.map((option) => (
                    <SelectItem key={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            {/* Тема */}
            <Controller
              name="subject"
              control={control}
              rules={{
                required: "Укажите тему",
                minLength: { value: 5, message: "Минимум 5 символов" },
                maxLength: { value: 100, message: "Максимум 100 символов" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Тема"
                  placeholder="Краткое описание проблемы"
                  errorMessage={errors.subject?.message}
                  isInvalid={!!errors.subject}
                  isRequired
                  classNames={{
                    label: "font-medium",
                  }}
                />
              )}
            />

            {/* Подробное описание */}
            <Controller
              name="description"
              control={control}
              rules={{
                required: "Опишите проблему",
                minLength: { value: 20, message: "Минимум 20 символов" },
                maxLength: { value: 1000, message: "Максимум 1000 символов" },
              }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Подробное описание"
                  placeholder="Расскажите подробнее о проблеме..."
                  errorMessage={errors.description?.message}
                  isInvalid={!!errors.description}
                  isRequired
                  minRows={4}
                  maxRows={8}
                  classNames={{
                    label: "font-medium",
                  }}
                />
              )}
            />

            {/* Скриншот (опционально) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-default-700">
                Скриншот (опционально)
              </label>

              {!screenshot ? (
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-default-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload size={20} className="text-default-500" />
                  <span className="text-sm text-default-600">
                    Загрузить скриншот
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={screenshotPreview!}
                    alt="Screenshot preview"
                    className="w-full h-auto rounded-lg border border-default-200"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="flat"
                    className="absolute top-2 right-2"
                    onClick={removeScreenshot}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
            </div>

            {/* Предупреждение */}
            <div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-100/10 border border-warning-200">
              <p className="text-xs text-warning-700 dark:text-warning-600">
                ⚠️ Ложные жалобы могут привести к блокировке вашего аккаунта.
                Модераторы рассмотрят вашу жалобу в течение 24 часов.
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={onModalClose} isDisabled={isLoading}>
              Отмена
            </Button>
            <Button
              color="danger"
              type="submit"
              isLoading={isLoading}
              startContent={!isLoading && <AlertTriangle size={16} />}
            >
              {isLoading ? "Отправка..." : "Отправить жалобу"}
            </Button>
          </ModalFooter>
        </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;

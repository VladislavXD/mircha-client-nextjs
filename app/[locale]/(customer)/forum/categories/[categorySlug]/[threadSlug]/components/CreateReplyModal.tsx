"use client";

import type { Thread } from "@/src/features/forum/types/forum.types";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Input,
  Chip,
} from "@heroui/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useCreateReplyInCategory } from "@/src/features/forum/hooks/useForum";

interface CreateReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorySlug: string;
  threadId: string;
  thread: Thread;
}

const CreateReplyModal: React.FC<CreateReplyModalProps> = ({
  isOpen,
  onClose,
  categorySlug,
  threadId,
  thread,
}) => {
  const t = useTranslations("Forum.createReply");
  const { mutateAsync: createReply, isPending: isLoading } =
    useCreateReplyInCategory();

  const [formData, setFormData] = useState({
    content: "",
    authorName: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error(t("errorRequired"));

      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("content", formData.content);
      formDataToSend.append("authorName", formData.authorName || "Аноним");

      // Добавляем все выбранные файлы
      selectedFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await createReply({
        categorySlug,
        threadId,
        formData: formDataToSend,
      });

      toast.success("Ответ отправлен!");
      onClose();
      setFormData({
        content: "",
        authorName: "",
      });
      setSelectedFiles([]);
    } catch (error: any) {
      toast.error(error?.message || t("errorCreate"));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Проверяем количество файлов
    if (selectedFiles.length + files.length > 5) {
      toast.error("Максимум 5 файлов");

      return;
    }

    const validFiles: File[] = [];

    for (const file of files) {
      // Проверка размера файла (5MB по умолчанию)
      if (file.size > 5242880) {
        toast.error(
          `Файл "${file.name}" слишком большой. Максимальный размер: 5MB`,
        );
        continue;
      }

      // Проверка типа файла
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp", "webm", "mp4"];

      if (fileExt && !allowedTypes.includes(fileExt)) {
        toast.error(
          `Тип файла "${file.name}" не поддерживается. Разрешённые типы: ${allowedTypes.join(", ")}`,
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);

    return mb >= 1 ? `${mb.toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`;
  };

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">{t("title")}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {thread.subject || `Тред #${thread.id}`}
            </p>
          </ModalHeader>

          <ModalBody className="gap-4">
            {/* Имя автора */}
            <Input
              description={t("nameDescription")}
              label={t("nameLabel")}
              placeholder={t("namePlaceholder")}
              value={formData.authorName}
              variant="bordered"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, authorName: e.target.value }))
              }
            />

            {/* Содержание */}
            <Textarea
              isRequired
              label={t("contentLabel")}
              maxRows={8}
              minRows={3}
              placeholder="Введите ваш ответ..."
              value={formData.content}
              variant="bordered"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
            />

            {/* Загрузка файлов */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("fileLabel")}</label>
              <input
                multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.webm,.mp4"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
                type="file"
                onChange={handleFileChange}
              />

              {/* Список выбранных файлов */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Выбранные файлы ({selectedFiles.length}/5):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedFiles.map((file, index) => {
                      const fileURL = URL.createObjectURL(file);
                      const isImage = file.type.startsWith("image/");
                      const isVideo = file.type.startsWith("video/");

                      return (
                        <div
                          key={index}
                          className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          {/* Превью медиа */}
                          <div className="aspect-square relative bg-gray-200 dark:bg-gray-700">
                            {isImage ? (
                              <img
                                alt={file.name}
                                className="w-full h-full object-cover"
                                src={fileURL}
                                onLoad={() => URL.revokeObjectURL(fileURL)}
                              />
                            ) : isVideo ? (
                              <video
                                muted
                                className="w-full h-full object-cover"
                                src={fileURL}
                                onLoadedData={() =>
                                  URL.revokeObjectURL(fileURL)
                                }
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">📄</span>
                                  </div>
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {file.name.split(".").pop()?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Кнопка удаления */}
                            <Button
                              className="absolute top-1 right-1 min-w-unit-6 w-6 h-6 p-0"
                              color="danger"
                              size="sm"
                              variant="solid"
                              onPress={() => removeFile(index)}
                            >
                              ×
                            </Button>

                            {/* Индикатор типа файла */}
                            {isVideo && (
                              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                                ▶
                              </div>
                            )}
                          </div>

                          {/* Информация о файле */}
                          <div className="p-2">
                            <p
                              className="text-xs text-gray-600 dark:text-gray-400 truncate"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Информация о лимитах */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Максимальный размер файла: 5MB</p>
                <p>Максимум файлов: 5</p>
                <div className="flex flex-wrap gap-1">
                  <span>Поддерживаемые форматы:</span>
                  {["JPG", "PNG", "GIF", "WEBP", "WEBM", "MP4"].map((type) => (
                    <Chip key={type} color="default" size="sm" variant="flat">
                      {type}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              color="danger"
              disabled={isLoading}
              variant="light"
              onPress={onClose}
            >
              {t("cancel")}
            </Button>
            <Button color="primary" isLoading={isLoading} type="submit">
              {t("submit")}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateReplyModal;

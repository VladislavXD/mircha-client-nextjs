"use client";

import type { Thread } from "@/src/features/forum";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

import { useCreateReply } from "@/src/features/forum";

interface CreateReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardName: string;
  threadId: string;
  thread: Thread;
}

const CreateReplyModal: React.FC<CreateReplyModalProps> = ({
  isOpen,
  onClose,
  boardName,
  threadId,
  thread,
}) => {
  const t = useTranslations("Forum.createReply");
  const createReply = useCreateReply();

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
      await createReply.mutateAsync({
        boardName,
        threadId,
        data: {
          content: formData.content,
          authorName: formData.authorName || "Аноним",
        },
        files: selectedFiles,
      });

      toast.success("Ответ отправлен!");
      onClose();
      setFormData({
        content: "",
        authorName: "",
      });
      setSelectedFiles([]);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("errorCreate"));
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
      // Проверка размера файла (используем дефолтное значение)
      const maxFileSize = 5242880; // 5MB default

      if (file.size > maxFileSize) {
        toast.error(
          `Файл "${file.name}" слишком большой. Максимальный размер: ${Math.round(maxFileSize / 1024 / 1024)}MB`,
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
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-full sm:max-w-xl p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">{t("title")}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{thread.subject || `Тред #${thread.id}`}</p>
          </DialogHeader>

          <div className="gap-4 p-4">
            {/* Имя автора */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t("nameLabel")}</label>
              <Input
                placeholder={t("namePlaceholder")}
                value={formData.authorName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, authorName: e.target.value }))
                }
              />
              <p className="text-xs text-gray-500">{t("nameDescription")}</p>
            </div>

            {/* Содержание */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t("contentLabel")} <span className="text-red-500">*</span></label>
              <Textarea
                required
                maxLength={10000}
                rows={4}
                placeholder="Введите ваш ответ..."
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
              />
            </div>

            {/* Загрузка файлов */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("fileLabel")}{" "}
                {selectedFiles.length > 0 && `(${selectedFiles.length}/5)`}
              </label>
              <input
                multiple
                accept="image/*,video/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
                type="file"
                onChange={handleFileChange}
              />

              {/* Список выбранных файлов с превью */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Выбранные файлы ({selectedFiles.length}/5):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {selectedFiles.map((file, index) => {
                      const fileURL = URL.createObjectURL(file);
                      const isImage = file.type.startsWith("image/");
                      const isVideo = file.type.startsWith("video/");

                      return (
                        <div
                          key={`${file.name}-${index}`}
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
                              className="absolute top-1 right-1 w-6 h-6 p-0"
                              size="icon-sm"
                              variant="destructive"
                              onClick={() => removeFile(index)}
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
                <p>Поддерживаемые форматы: JPG, PNG, GIF, WEBP, MP4, WEBM</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={createReply.isPending} onClick={onClose}>{t("cancel")}</Button>
            <Button type="submit" disabled={createReply.isPending}>{t("submit")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReplyModal;

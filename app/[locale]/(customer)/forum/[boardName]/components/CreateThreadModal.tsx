"use client";

import type { Board } from "@/src/features/forum";

import React, { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useCreateThread } from "@/src/features/forum";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardName: string;
  board: Board;
}

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({
  isOpen,
  onClose,
  boardName,
  board,
}) => {
  const t = useTranslations("Forum.createThread");
  const createThread = useCreateThread();

  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    authorName: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.warning(t("errorRequired"));

      return;
    }

    if (selectedFiles.length > 5) {
      toast.warning("Максимум 5 файлов");

      return;
    }

    try {
      await createThread.mutateAsync({
        boardName,
        data: {
          subject: formData.subject,
          content: formData.content,
          authorName: formData.authorName || "Аноним",
        },
        files: selectedFiles,
      });

      toast.success("Тред создан успешно!");
      onClose();
      setFormData({
        subject: "",
        content: "",
        authorName: "",
      });
      setSelectedFiles([]);
    } catch (error: any) {
      toast.warning(error?.response?.data?.message || t("errorCreate"));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Проверка количества файлов
    if (selectedFiles.length + files.length > 5) {
      toast.warning("Максимум 5 файлов");

      return;
    }

    // Проверка каждого файла
    for (const file of files) {
      // Проверка размера файла
      if (file.size > (board.maxFileSize || 5242880)) {
        toast.warning(
          `Файл ${file.name} слишком большой. Максимальный размер: ${Math.round(
            (board.maxFileSize || 5242880) / 1024 / 1024,
          )}MB`,
        );

        return;
      }

      // Проверка типа файла
      const fileExt = file.name.split(".").pop()?.toLowerCase();

      if (
        fileExt &&
        board.allowedFileTypes &&
        !board.allowedFileTypes.includes(fileExt)
      ) {
        toast.warning(
          `Тип файла ${fileExt} не поддерживается. Разрешённые типы: ${board.allowedFileTypes.join(
            ", ",
          )}`,
        );

        return;
      }
    }

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 flex flex-col overflow-hidden rounded-t-[1.5rem] sm:rounded-[1.5rem] bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800/70"
        showCloseButton={true}
      >
        <form className="flex flex-col max-h-[90vh]" onSubmit={handleSubmit}>
          {/* Header */}
          <DialogHeader className="flex-shrink-0 flex flex-col gap-1 px-4 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800/70 m-0">
            <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {t("title")} /{boardName}/
            </DialogTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Создайте новую тему для обсуждения
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 bg-white dark:bg-[#101010]">
            {/* Имя автора */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {t("nameLabel")}
              </label>
              <Input
                className="bg-neutral-50 dark:bg-[#161616] border-neutral-200 dark:border-neutral-800/70 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 h-10 w-full"
                placeholder={t("namePlaceholder")}
                value={formData.authorName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    authorName: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-neutral-500">{t("nameDescription")}</p>
            </div>

            {/* Тема треда */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {t("subjectLabel")}
              </label>
              <Input
                className="bg-neutral-50 dark:bg-[#161616] border-neutral-200 dark:border-neutral-800/70 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 h-10 w-full"
                placeholder={t("subjectPlaceholder")}
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
              />
            </div>

            {/* Содержание */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {t("contentLabel")} <span className="text-red-500">*</span>
              </label>
              <Textarea
                required
                className="min-h-[120px] bg-neutral-50 dark:bg-[#161616] border-neutral-200 dark:border-neutral-800/70 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 w-full resize-y"
                placeholder="Введите содержание треда..."
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
              />
            </div>

            {/* Загрузка файла */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {t("fileLabel")}
              </label>
              <input
                multiple
                accept={board.allowedFileTypes
                  ?.map((type) => `.${type}`)
                  .join(",")}
                className="block w-full text-sm text-neutral-500 dark:text-neutral-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-neutral-100 file:text-neutral-900
                    dark:file:bg-neutral-800 dark:file:text-neutral-100
                    hover:file:bg-neutral-200 dark:hover:file:bg-neutral-700 transition-colors cursor-pointer"
                type="file"
                onChange={handleFileChange}
              />

              {/* Список выбранных файлов */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3 bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800/70 rounded-xl p-4">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Выбранные файлов ({selectedFiles.length}/5):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedFiles.map((file, index) => {
                      const fileURL = URL.createObjectURL(file);
                      const isImage = file.type.startsWith("image/");
                      const isVideo = file.type.startsWith("video/");

                      return (
                        <div
                          key={index}
                          className="relative bg-white dark:bg-[#101010] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800/70"
                        >
                          {/* Превью медиа */}
                          <div className="aspect-square relative bg-neutral-100 dark:bg-neutral-900">
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
                              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                <div className="w-12 h-12 mb-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                                  <span className="text-xl">📄</span>
                                </div>
                                <span className="text-xs text-neutral-600 dark:text-neutral-400 text-center font-medium">
                                  {file.name.split(".").pop()?.toUpperCase()}
                                </span>
                              </div>
                            )}

                            {/* Кнопка удаления */}
                            <Button
                              className="absolute top-2 right-2 w-7 h-7 rounded-full p-0 flex items-center justify-center shadow-lg bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm border border-white/10"
                              type="button"
                              onClick={() => removeFile(index)}
                            >
                              <span className="text-base leading-none mb-0.5">
                                ×
                              </span>
                            </Button>

                            {/* Индикатор типа файла */}
                            {isVideo && (
                              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm border border-white/10">
                                ▶ VIDEO
                              </div>
                            )}
                          </div>

                          {/* Информация о файле */}
                          <div className="p-2.5">
                            <p
                              className="text-xs text-neutral-800 dark:text-neutral-200 truncate font-medium"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              {(file.size / 1024 / 1024).toFixed(1)}MB
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Информация о лимитах */}
              <div className="text-[13px] text-neutral-500 dark:text-neutral-400 space-y-1.5 pt-2">
                <p>
                  • Максимальный размер файла:{" "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {Math.round((board.maxFileSize || 5242880) / 1024 / 1024)}MB
                  </span>
                </p>
                <p>
                  • Максимум файлов:{" "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    5
                  </span>
                </p>
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <span>Поддерживаемые форматы:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {board.allowedFileTypes?.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded text-[11px] font-medium"
                      >
                        {type.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-neutral-200 dark:border-neutral-800/70 bg-neutral-50 dark:bg-neutral-900/30">
            <Button
              className="rounded-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              disabled={createThread.isPending}
              type="button"
              variant="outline"
              onClick={onClose}
            >
              {t("cancel")}
            </Button>
            <Button
              className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              disabled={createThread.isPending}
              type="submit"
            >
              {createThread.isPending ? "Создание..." : t("submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateThreadModal;

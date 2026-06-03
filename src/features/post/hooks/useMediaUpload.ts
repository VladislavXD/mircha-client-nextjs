import type { MediaFile } from "../components/MediaPreviewSlider";

import { useState, useCallback } from "react";

const MAX_MEDIA = 30;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * Hook для управления загрузкой медиа файлов
 */
export const useMediaUpload = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const addFiles = useCallback(
    (files: File[]) => {
      if (!files.length) return;

      // Проверка количества файлов
      if (mediaFiles.length + files.length > MAX_MEDIA) {
        alert(`Максимум ${MAX_MEDIA} медиа файлов`);

        return;
      }

      const newMediaFiles: MediaFile[] = [];

      files.forEach((file) => {
        // Проверка размера
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) return; // Ignore unsupported files

        const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

        if (file.size > maxSize) {
          alert(
            `Файл ${file.name} слишком большой. Максимум: ${
              isImage ? "10MB" : "100MB"
            }`,
          );

          return;
        }

        // Создаем URL для превью
        const preview = URL.createObjectURL(file);
        const type = isVideo ? "video" : "image";

        newMediaFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview,
          type,
          spoiler: false,
        });
      });

      setMediaFiles((prev) => [...prev, ...newMediaFiles]);
    },
    [mediaFiles.length],
  );

  const handleMediaSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      addFiles(files);
      e.target.value = "";
    },
    [addFiles],
  );

  const handleFilesDrop = useCallback(
    (files: File[]) => {
      addFiles(files);
    },
    [addFiles],
  );

  const handleRemoveMedia = useCallback((id: string) => {
    setMediaFiles((prev) => {
      const removed = prev.find((m) => m.id === id);

      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }

      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const handleToggleSpoiler = useCallback((id: string) => {
    setMediaFiles((prev) =>
      prev.map((m) => (m.id === id ? { ...m, spoiler: !m.spoiler } : m)),
    );
  }, []);

  const clearMedia = useCallback(() => {
    mediaFiles.forEach((m) => URL.revokeObjectURL(m.preview));
    setMediaFiles([]);
  }, [mediaFiles]);

  return {
    mediaFiles,
    handleMediaSelect,
    handleFilesDrop,
    handleRemoveMedia,
    handleToggleSpoiler,
    clearMedia,
    MAX_MEDIA,
  };
};

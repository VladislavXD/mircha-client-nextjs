"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface PostContentProps {
  content: string;
  imageUrl?: string;
  imageName?: string;
  thumbnailUrl?: string;
}

const PostContent: React.FC<PostContentProps> = ({
  content,
  imageUrl,
  imageName,
  thumbnailUrl,
}) => {
  const [showFullImage, setShowFullImage] = useState(false);

  // Обработка текста для поддержки цитат и ссылок
  const formatContent = (text: string) => {
    return text.split("\n").map((line, index) => {
      // Обработка цитат (строки, начинающиеся с >)
      if (line.startsWith(">")) {
        return (
          <div
            key={index}
            className="text-green-600 dark:text-green-400 border-l-2 border-green-500 pl-2 my-1"
          >
            {line}
          </div>
        );
      }

      // Обычный текст
      return (
        <div key={index} className="my-1">
          {line}
        </div>
      );
    });
  };

  const isVideo = (url?: string) => {
    if (!url) return false;

    return (
      url.includes(".mp4") || url.includes(".webm") || url.includes(".mov")
    );
  };

  return (
    <div className="space-y-3">
      {/* Изображение/Видео */}
      {imageUrl && (
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {isVideo(imageUrl) ? (
              <video
                controls
                className="max-w-xs max-h-64 rounded-lg"
                poster={thumbnailUrl}
              >
                <source src={imageUrl} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => setShowFullImage(true)}
              >
                <Image
                  unoptimized
                  alt={imageName || "Изображение поста"}
                  className="max-w-xs max-h-64 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  height={200}
                  src={thumbnailUrl || imageUrl}
                  width={200}
                />
              </div>
            )}

            {imageName && (
              <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                {imageName}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {formatContent(content)}
            </div>
          </div>
        </div>
      )}

      {/* Только текст */}
      {!imageUrl && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {formatContent(content)}
        </div>
      )}

      {/* Модальное окно для полноразмерного изображения */}
      {imageUrl && !isVideo(imageUrl) && (
        <Dialog open={showFullImage} onOpenChange={(open) => { if (!open) setShowFullImage(false); }}>
          <DialogContent className="bg-transparent shadow-none">
            <div className="flex items-center justify-center p-4">
              <div className="relative max-w-full max-h-full">
                <Image
                  unoptimized
                  alt={imageName || "Изображение поста"}
                  className="max-w-full max-h-full object-contain"
                  height={800}
                  src={imageUrl}
                  width={1200}
                />
                <Button className="absolute top-4 right-4" variant="ghost" onClick={() => setShowFullImage(false)}>
                  Закрыть
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PostContent;

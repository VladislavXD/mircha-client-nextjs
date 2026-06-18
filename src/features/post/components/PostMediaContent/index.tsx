"use client";

import type { MediaSliderProps } from "./types";

import React, { useState } from "react";
import { Gallery } from "react-photoswipe-gallery";
import "photoswipe/style.css";

import { SingleMedia } from "./SingleMedia";
import { MediaCarousel } from "./MediaCarousel";

/**
 * PostMediaSlider — медиа-блок поста.
 *
 * <Gallery> оборачивает весь блок — PhotoSwipe сам находит все <Item> внутри
 * и открывает лайтбокс по клику, со свайпом вниз/вверх для закрытия,
 * листанием между фото и pinch-zoom.
 *
 * FullscreenViewer и startIndex больше не нужны.
 */
const PostMediaSlider: React.FC<MediaSliderProps> = ({ media, className = "" }) => {
  const [revealedIndexes, setRevealedIndexes] = useState<Set<number>>(new Set());

  if (!media?.length) return null;

  const hasMultiple = media.length > 1;

  const handleReveal = (index: number) => {
    setRevealedIndexes((prev) => new Set(prev).add(index));
  };

  return (
    <Gallery
      withCaption={false}
      options={{
        bgOpacity: 0.95,
        // Закрытие вертикальным свайпом — встроено в PhotoSwipe 5 по умолчанию
        closeOnVerticalDrag: true,
        // Красивая анимация открытия от элемента
        showHideAnimationType: "zoom",
        // Двойной тап = зум
        doubleTapAction: "zoom",
        
      }}
    >
      <div
        className={`relative w-full pt-1.5 pb-1 ${className}`}
        data-no-redirect="true"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMultiple ? (
          <MediaCarousel
            media={media}
            revealedIndexes={revealedIndexes}
            onReveal={handleReveal}
          />
        ) : (
          <SingleMedia
            isRevealed={revealedIndexes.has(0)}
            item={media[0]}
            onReveal={() => handleReveal(0)}
          />
        )}
      </div>
    </Gallery>
  );
};

export default PostMediaSlider;
export type { PostMedia } from "./types";
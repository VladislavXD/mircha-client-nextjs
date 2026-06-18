"use client";

import React from "react";
import { Item } from "react-photoswipe-gallery";

import type { PostMedia } from "./types";

import { ImageWithLoader } from "./ImageWithLoader";
import { VideoPlayerItem } from "./VideoPlayerItem";
import { SpoilerOverlay } from "./SpoilerOverlay";
import { SINGLE_MEDIA_MAX_HEIGHT_CLASSES, getSingleMediaContainerStyle } from "./utils";

type SingleMediaProps = {
  item: PostMedia;
  isRevealed: boolean;
  onReveal: () => void;
};

export const SingleMedia = ({ item, isRevealed, onReveal }: SingleMediaProps) => {
  const containerClasses = `relative flex items-center justify-center overflow-hidden rounded-[16px] border border-neutral-200 dark:border-neutral-800/80 bg-neutral-100 dark:bg-neutral-900/50 ${SINGLE_MEDIA_MAX_HEIGHT_CLASSES}`;
  const containerStyle = getSingleMediaContainerStyle(item);

  if (item.spoiler && !isRevealed) {
    return (
      <div className={containerClasses} style={containerStyle}>
        <SpoilerOverlay item={item} onReveal={onReveal} />
      </div>
    );
  }

  if (item.type === "image") {
    return (
      // Item регистрирует фото в Gallery — клик на children открывает PhotoSwipe
      <Item
        original={item.url}
        width={item.width ?? 1200}
        height={item.height ?? 900}
        thumbnail={item.url}  
      >
        {({ ref, open }) => (
          <button
            ref={ref as unknown as React.RefObject<HTMLButtonElement>}
            className={`${containerClasses} cursor-zoom-in block active:scale-[0.98] active:opacity-90 transition-all duration-200`}
            style={containerStyle}
            type="button"
            onClick={(e) => { e.stopPropagation(); open(e); }}
          >
            <ImageWithLoader
              alt="Изображение поста"
              className="w-full h-full object-contain block rounded-[16px]"
              height={item.height}
              loading="eager"
              priority
              sizes="(max-width: 640px) 100vw, 600px"
              src={item.url}
              width={item.width}
            />
          </button>
        )}
      </Item>
    );
  }

  // Видео — лайтбокс не открывается
  return (
    <div
      className={`${containerClasses} active:scale-[0.98] active:opacity-90 transition-all duration-200`}
      style={containerStyle}
    >
      <VideoPlayerItem isSingle src={item.url} />
    </div>
  );
};
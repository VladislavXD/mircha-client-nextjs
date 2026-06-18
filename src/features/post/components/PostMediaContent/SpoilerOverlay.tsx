"use client";

import React from "react";

import type { PostMedia } from "./types";

type SpoilerOverlayProps = {
  item: PostMedia;
  onReveal: () => void;
};

/**
 * Размытый превью медиа со спойлером. Картинка/видео внутри занимают
 * w-full h-full object-cover, потому что родительский контейнер уже имеет
 * зафиксированный размер (через aspectRatio из utils.ts) — здесь мы просто
 * заполняем его, не задавая собственных размеров.
 */
export const SpoilerOverlay = ({ item, onReveal }: SpoilerOverlayProps) => (
  <button
    className="w-full h-full relative flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 overflow-hidden cursor-pointer group active:scale-[0.98] active:opacity-90 transition-all duration-200"
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onReveal();
    }}
  >
    {item.type === "image" ? (
      // eslint-disable-next-line @next/next/no-img-element -- блюр-превью, не нужен Next/Image
      <img
        alt=""
        className="w-full h-full object-cover blur-[30px] opacity-80 group-hover:opacity-100 transition-opacity"
        src={item.url}
      />
    ) : (
      <video
        className="w-full h-full object-cover blur-[30px] opacity-80 group-hover:opacity-100 transition-opacity"
        muted
        src={item.url}
      />
    )}
    <div className="absolute z-10 px-4 py-2.5 bg-black/60 backdrop-blur-md rounded-xl text-sm font-medium text-white shadow-lg transition-transform group-hover:scale-105">
      Нажмите чтобы показать
    </div>
  </button>
);

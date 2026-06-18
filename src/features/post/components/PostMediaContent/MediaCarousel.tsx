"use client";

import React, { useEffect, useState } from "react";
import { Item } from "react-photoswipe-gallery";

import type { PostMedia } from "./types";

import { ImageWithLoader } from "./ImageWithLoader";
import { VideoPlayerItem } from "./VideoPlayerItem";
import { SpoilerOverlay } from "./SpoilerOverlay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type MediaCarouselProps = {
  media: PostMedia[];
  revealedIndexes: Set<number>;
  onReveal: (index: number) => void;
};

/**
 * Карусель для постов с несколькими медиа. Высота каждого слайда фиксирована
 * через h-[200px] sm:h-[300px] на CarouselItem — это стабильная, заранее
 * известная высота (в отличие от одиночного медиа, где высота зависит от
 * пропорций конкретной картинки), поэтому отдельный aspectRatio тут не нужен.
 *
 * Фото оборачиваются в <Item> из react-photoswipe-gallery — клик открывает
 * лайтбокс (свайп вниз/вверх для закрытия, листание, зум — всё из коробки).
 * Видео в лайтбокс не открывается.
 */
export const MediaCarousel = ({
  media,
  revealedIndexes,
  onReveal,
}: MediaCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const renderItem = (item: PostMedia, index: number) => {
    if (item.spoiler && !revealedIndexes.has(index)) {
      return <SpoilerOverlay item={item} onReveal={() => onReveal(index)} />;
    }

    if (item.type === "image") {
      return (
        <Item
          height={item.height ?? 900}
          original={item.url}
          width={item.width ?? 1200}
          thumbnail={item.url}
        >
          {({ ref, open }) => (
            <button
              ref={(node) => { ref(node); }}
              className="w-full h-full cursor-pointer block active:scale-[0.98] active:opacity-90 transition-all duration-200"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                open(e);
              }}
            >
              <ImageWithLoader
                alt={`Медиа ${index + 1}`}
                className="w-auto h-full object-contain min-w-[140px] rounded-[16px]"
                height={item.height}
                loading={index <= 1 ? "eager" : "lazy"}
                src={item.url}
                width={item.width}
              />
            </button>
          )}
        </Item>
      );
    }

    return <VideoPlayerItem isSingle={false} src={item.url} />;
  };

  const slideCount = api?.scrollSnapList().length ?? 0;

  return (
    <>
      <Carousel
        className="w-full"
        opts={{
          dragFree: true,
          align: "start",
          containScroll: "trimSnaps",
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-2">
          {media.map((item, index) => (
            <CarouselItem
              key={`${item.url}-${index}`}
              className="pl-2 basis-auto h-[200px] sm:h-[300px] flex-shrink-0"
            >
              <div className="relative flex items-center justify-center overflow-hidden rounded-[16px] border border-neutral-200 dark:border-neutral-800/80 bg-neutral-100 dark:bg-neutral-900/50 w-auto h-full">
                {renderItem(item, index)}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {slideCount > 1 && (
        <div className="flex justify-center mt-3 gap-1.5 z-20 pointer-events-none">
          {Array.from({ length: slideCount }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-neutral-800 dark:bg-neutral-200"
                  : "bg-neutral-300 dark:bg-neutral-700"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
};
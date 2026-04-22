"use client";

import type { MediaSliderProps, PostMedia } from "./types";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { X, Volume2, VolumeX } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const VideoPlayerItem = ({
  src,
  isSingle,
}: {
  src: string;
  isSingle: boolean;
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.6, rootMargin: "-20% 0px" });
  const videoRef = useRef<HTMLVideoElement>(null);

  const pathname = usePathname();
  const mountedPathname = useRef(pathname);
  const isActiveRoute = pathname === mountedPathname.current;

  useEffect(() => {
    const video = videoRef.current;

    if (inView && isActiveRoute && video) {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else if (video) {
      video.pause();
    }

    return () => {
      if (video) {
        video.pause();
      }
    };
  }, [inView, isActiveRoute]);

  // Pause this video if another video starts playing anywhere on the page
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      if (
        e.target instanceof HTMLVideoElement &&
        e.target !== videoRef.current &&
        videoRef.current &&
        !videoRef.current.paused
      ) {
        videoRef.current.pause();
      }
    };

    window.addEventListener("play", handleGlobalPlay, true);

    return () => {
      window.removeEventListener("play", handleGlobalPlay, true);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`relative flex justify-center group ${isSingle ? "w-fit max-w-full h-auto" : "w-auto h-full"}`}
    >
      <video
        ref={videoRef}
        loop
        playsInline
        className={`${isSingle ? "w-auto max-w-full h-auto max-h-[45vh] sm:max-h-[55vh] object-contain" : "w-auto h-full object-contain min-w-[140px]"} cursor-pointer rounded-[16px]`}
        muted={isMuted}
        preload="metadata"
        src={src}
        onClick={(e) => {
          e.stopPropagation();
          if (videoRef.current) {
            videoRef.current.paused
              ? videoRef.current.play()
              : videoRef.current.pause();
          }
        }}
      />
      <button
        className="absolute bottom-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-opacity sm:opacity-0 group-hover:opacity-100 z-10"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
          if (videoRef.current && videoRef.current.paused)
            videoRef.current.play();
        }}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

const PostMediaSlider: React.FC<MediaSliderProps> = ({
  media,
  className = "",
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

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

  if (!media?.length) return null;
  const hasMultiple = media.length > 1;

  const handleReveal = (index: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);

      next.add(index);

      return next;
    });
  };

  const renderSpoiler = (item: PostMedia, index: number, isSingle: boolean) => (
    <button
      className={`${isSingle ? "w-fit max-w-full min-w-[200px] h-auto max-h-[55vh]" : "w-full h-full"} relative flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 overflow-hidden cursor-pointer group active:scale-[0.98] active:opacity-90 transition-all duration-200`}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleReveal(index);
      }}
    >
      {item.type === "image" ? (
        <img
          alt=""
          className={`${isSingle ? "w-auto max-w-full h-auto max-h-[55vh]" : "w-full h-full"} object-contain blur-[30px] opacity-80 group-hover:opacity-100 transition-opacity`}
          src={item.url}
        />
      ) : (
        <video
          muted
          className={`${isSingle ? "w-auto max-w-full h-auto max-h-[55vh]" : "w-full h-full"} object-contain blur-[30px] opacity-80 group-hover:opacity-100 transition-opacity`}
          src={item.url}
        />
      )}
      <div className="absolute z-10 px-4 py-2.5 bg-black/60 backdrop-blur-md rounded-xl text-sm font-medium text-white shadow-lg transition-transform group-hover:scale-105">
        Нажмите чтобы показать
      </div>
    </button>
  );

  const renderMedia = (item: PostMedia, index: number) => {
    const isSingle = !hasMultiple;
    const containerClasses = `relative flex items-center justify-center overflow-hidden rounded-[16px] border border-neutral-200 dark:border-neutral-800/80 bg-neutral-100 dark:bg-neutral-900/50 ${isSingle ? "w-fit max-w-full h-auto line-height-0 max-h-[45vh] sm:max-h-[55vh]" : "w-auto h-full"}`;

    if (item.spoiler && !revealed.has(index)) {
      return (
        <div className={containerClasses}>
          {renderSpoiler(item, index, isSingle)}
        </div>
      );
    }

    if (item.type === "image") {
      return (
        <button
          className={`${containerClasses} cursor-zoom-in block active:scale-[0.98] active:opacity-90 transition-all duration-200`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFullscreenIndex(index);
          }}
        >
          <img
            alt={`Media ${index + 1}`}
            className={`${isSingle ? "w-auto max-w-full h-auto max-h-[45vh] sm:max-h-[55vh] object-contain block" : "w-auto h-full object-contain min-w-[140px]"} rounded-[16px]`}
            loading={index <= 1 ? "eager" : "lazy"}
            src={item.url}
          />
        </button>
      );
    }

    return (
      <div
        className={`${containerClasses} active:scale-[0.98] active:opacity-90 transition-all duration-200`}
      >
        <VideoPlayerItem isSingle={isSingle} src={item.url} />
      </div>
    );
  };

  return (
    <>
      <div
        className={`relative w-full pt-1.5 pb-1 ${className}`}
        data-no-redirect="true"
        onClick={(e) => e.stopPropagation()}
      >
        {!hasMultiple ? (
          // Одиночное медиа (без карусели, естественный размер)
          <div className="w-full">{renderMedia(media[0], 0)}</div>
        ) : (
          // Слайдер для нескольких медиа
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
                    {renderMedia(item, index)}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Компактные индикаторы внизу */}
            {api?.scrollSnapList().length && api.scrollSnapList().length > 1 ? (
              <div className="flex justify-center mt-3 gap-1.5 z-20 pointer-events-none">
                {api.scrollSnapList().map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-neutral-800 dark:bg-neutral-200" : "bg-neutral-300 dark:bg-neutral-700"}`}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Оптимизированный Fullscreen */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={() => setFullscreenIndex(null)}
        >
          <button
            className="absolute top-4 right-4 z-50 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIndex(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>

          <Carousel
            className="w-full h-full"
            opts={{
              startIndex: fullscreenIndex,
              align: "center",
              dragFree: true,
            }}
          >
            <CarouselContent className="h-[100dvh] ml-0">
              {media.map((item, index) => (
                <CarouselItem
                  key={`fs-${index}`}
                  className="flex items-center justify-center w-full h-full pl-0 basis-full"
                >
                  {item.type === "image" ? (
                    <img
                      alt="Fullscreen"
                      className="max-w-full max-h-[100dvh] object-contain cursor-default"
                      src={item.url}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <video
                      controls
                      autoPlay={index === fullscreenIndex}
                      className="w-full max-h-[100dvh] object-contain"
                      src={item.url}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </>
  );
};

export default PostMediaSlider;
export type { PostMedia } from "./types";

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { X, Volume2, VolumeX } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { MediaSliderProps, PostMedia } from "./types";

const VideoPlayerItem = ({ src, isSingle }: { src: string; isSingle: boolean }) => {
  const [isMuted, setIsMuted] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.6, rootMargin: "-20% 0px" });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (inView && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [inView]);

  return (
    <div className={`relative flex justify-center group ${isSingle ? "w-fit max-w-full h-auto" : "w-auto h-full"}`} ref={ref}>
      <video
        ref={videoRef}
        src={src}
        muted={isMuted}
        playsInline
        loop
        onClick={(e) => {
          e.stopPropagation();
          if (videoRef.current) {
            videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
          }
        }}
        className={`${isSingle ? "w-auto max-w-full h-auto max-h-[45vh] sm:max-h-[55vh] object-contain" : "w-auto h-full object-contain min-w-[140px]"} cursor-pointer rounded-[16px]`}
        preload="metadata"
      />
      <button 
        type="button"
        className="absolute bottom-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-opacity sm:opacity-0 group-hover:opacity-100 z-10"
        onClick={(e) => {
           e.stopPropagation();
           setIsMuted(!isMuted);
           if (videoRef.current && videoRef.current.paused) videoRef.current.play();
        }}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

const PostMediaSlider: React.FC<MediaSliderProps> = ({ media, className = "" }) => {
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
      type="button"
      className={`${isSingle ? "w-fit max-w-full min-w-[200px] h-auto max-h-[55vh]" : "w-full h-full"} relative flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 overflow-hidden cursor-pointer group active:scale-[0.98] active:opacity-90 transition-all duration-200`}
      onClick={(e) => {
         e.stopPropagation();
         handleReveal(index);
      }}
    >
      {item.type === "image" ? (
         <img src={item.url} alt="" className={`${isSingle ? "w-auto max-w-full h-auto max-h-[55vh]" : "w-full h-full"} object-contain blur-[30px] opacity-80 group-hover:opacity-100 transition-opacity`} />
      ) : (
         <video src={item.url} muted className={`${isSingle ? "w-auto max-w-full h-auto max-h-[55vh]" : "w-full h-full"} object-contain blur-[30px] opacity-80 group-hover:opacity-100 transition-opacity`} />
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
          type="button"
          className={`${containerClasses} cursor-zoom-in block active:scale-[0.98] active:opacity-90 transition-all duration-200`}
          onClick={(e) => {
            e.stopPropagation();
            setFullscreenIndex(index);
          }}
        >
          <img 
            src={item.url} 
            alt={`Media ${index + 1}`} 
            className={`${isSingle ? "w-auto max-w-full h-auto max-h-[45vh] sm:max-h-[55vh] object-contain block" : "w-auto h-full object-contain min-w-[140px]"} rounded-[16px]`}
            loading={index <= 1 ? "eager" : "lazy"} 
          />
        </button>
      );
    }
    
    return (
      <div className={`${containerClasses} active:scale-[0.98] active:opacity-90 transition-all duration-200`}>
        <VideoPlayerItem src={item.url} isSingle={isSingle} />
      </div>
    );
  };

  return (
    <>
      <div className={`relative w-full pt-1.5 pb-1 ${className}`} data-no-redirect="true" onClick={(e) => e.stopPropagation()}>
        {!hasMultiple ? (
          // Одиночное медиа (без карусели, естественный размер)
          <div className="w-full">
            {renderMedia(media[0], 0)}
          </div>
        ) : (
          // Слайдер для нескольких медиа
          <>
            <Carousel
              setApi={setApi}
              opts={{ 
                dragFree: true,
                align: "start",
                containScroll: "trimSnaps"
              }}
              className="w-full"
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
             type="button"
             className="absolute top-4 right-4 z-50 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
             onClick={(e) => { e.stopPropagation(); setFullscreenIndex(null); }}
           >
             <X className="w-6 h-6" />
           </button>
           
           <Carousel
              opts={{ startIndex: fullscreenIndex, align: "center", dragFree: true }}
              className="w-full h-full"
            >
              <CarouselContent className="h-[100dvh] ml-0">
                {media.map((item, index) => (
                   <CarouselItem key={`fs-${index}`} className="flex items-center justify-center w-full h-full pl-0 basis-full">
                      {item.type === "image" ? (
                         <img 
                           src={item.url} 
                           alt="Fullscreen" 
                           className="max-w-full max-h-[100dvh] object-contain cursor-default" 
                           onClick={(e) => e.stopPropagation()} 
                         />
                      ) : (
                         <video 
                           src={item.url} 
                           controls 
                           autoPlay={index === fullscreenIndex}
                           className="w-full max-h-[100dvh] object-contain" 
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

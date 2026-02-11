"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { BlurredBackground } from './BlurredBackground';
import type { PostMedia } from '../types';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
  media: PostMedia[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onSlideClick: (index: number) => void;
};

export const FullscreenViewer: React.FC<Props> = ({
  media,
  currentIndex,
  onClose,
  onNavigate,
  onSlideClick,
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [videoMuted, setVideoMuted] = useState<Map<string, boolean>>(new Map());
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Синхронизация с внешним индексом
  useEffect(() => {
    if (swiperInstance && currentIndex !== activeIndex) {
      swiperInstance.slideTo(currentIndex);
    }
  }, [currentIndex, swiperInstance, activeIndex]);

  const currentMedia = media[activeIndex];

  const toggleMute = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current.get(url);
    if (video) {
      const newMuted = !video.muted;
      video.muted = newMuted;
      setVideoMuted(prev => new Map(prev).set(url, newMuted));
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
    onSlideClick(newIndex);
  };

  const renderMedia = (item: PostMedia, index: number) => {
    if (item.type === 'image') {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={item.url}
            alt={`Image ${index + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      );
    }

    // Видео
    const isMuted = videoMuted.get(item.url) ?? true;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={(el) => {
            if (el) videoRefs.current.set(item.url, el);
          }}
          src={item.url}
          className="max-w-full max-h-full object-contain"
          controls
          muted={isMuted}
          loop
          playsInline
          autoPlay={index === activeIndex}
          onClick={(e) => e.stopPropagation()}
        />
        
        {/* Кнопка звука для видео */}
        <button
          onClick={(e) => toggleMute(item.url, e)}
          className="absolute top-4 left-4 z-30 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
          aria-label={isMuted ? "Включить звук" : "Выключить звук"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Размытый фон */}
      <BlurredBackground 
        src={currentMedia.url} 
        type={currentMedia.type} 
      />

      {/* Swiper для свайпов */}
      <div 
        className="relative w-full h-full z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Swiper
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
          initialSlide={currentIndex}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: '.fullscreen-prev',
            nextEl: '.fullscreen-next',
          }}
          pagination={{
            clickable: true,
            el: '.fullscreen-pagination',
          }}
          modules={[Navigation, Pagination]}
          className="w-full h-full"
        >
          {media.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full">
                {renderMedia(item, index)}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Навигационные стрелки */}
      {media.length > 1 && (
        <>
          {activeIndex > 0 && (
            <button
              className="fullscreen-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {activeIndex < media.length - 1 && (
            <button
              className="fullscreen-next absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Индикаторы (точки) */}
          <div className="fullscreen-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
            {/* Swiper автоматически заполнит */}
          </div>
        </>
      )}
    </div>
  );
};

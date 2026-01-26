"use client";
import React, { useState } from "react";
import { Image } from "@heroui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import MediaViewer from '@/shared/components/MediaViewer';
import { Spoiler } from "spoiled";

// Импорт стилей Swiper
import 'swiper/css';
import 'swiper/css/free-mode';

export type PostMedia = {
  url: string;
  type: "image" | "video";
  spoiler?: boolean;
};

type Props = {
  media: PostMedia[];
  className?: string;
};


/**
 * PostMediaSlider - минималистичный слайдер с свободной прокруткой
 * Высота 230px, можно видеть несколько фото одновременно
 * Поддержка прокрутки двумя пальцами по тачпаду
 * Клик по спойлеру сначала раскрывает его, потом можно открыть полноэкранный просмотр
 */
const PostMediaSlider: React.FC<Props> = ({ media, className = "" }) => {
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(new Set());

  if (!media || media.length === 0) return null;

  const handleMediaClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие события к родительской карточке
    
    // Если это спойлер и он еще не раскрыт
    if (media[index].spoiler && !revealedSpoilers.has(index)) {
      setRevealedSpoilers(prev => new Set(prev).add(index));
      return;
    }
    
    // Иначе открываем полноэкранный просмотр
    setSelectedIndex(index);
    setShowMediaViewer(true);
  };

  return (
    <>
      <div className={`w-full ${className}`} data-no-redirect="true">
        
        <Swiper
          spaceBetween={8}
          slidesPerView="auto"
          freeMode={true}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: false,
          }}
          modules={[FreeMode, Mousewheel]}
          className="!pb-0"
        >
          {media.map((item, index) => {
            const isSpoilerHidden = item.spoiler && !revealedSpoilers.has(index);
            
            return (
              <SwiperSlide key={index}  className="!w-auto active:scale-[0.97] ease-soft-spring active:shadow-inner duration-initial">
                <div 
                  className="relative h-[230px] rounded-2xl overflow-hidden bg-default-100 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => handleMediaClick(index, e)}
                >
                  {isSpoilerHidden ? (

                      item.type === "image" ? (
                        <Image
                          src={item.url}
                          alt={`Image ${index + 1}`}
                          className="h-full w-auto blur-md "
                          classNames={{
                            wrapper: "h-full",
                            img: "h-full w-auto object-cover"
                          }}
                        />
                      ) : (
                        <div className="relative h-full">
                          <video
                            src={item.url}
                            className="h-full w-auto object-cover pointer-events-none"
                            

                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )

                  ) : (
                    <>
                      {item.type === "image" ? (
                        <Image
                          src={item.url}
                          alt={`Image ${index + 1}`}
                          className="h-full w-auto"
                          classNames={{
                            wrapper: "h-full",
                            img: "h-full w-auto object-cover"
                          }}
                        />
                      ) : (
                        <div className="relative h-full">
                          <video
                            src={item.url}
                            className="h-full w-auto object-cover pointer-events-none"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* MediaViewer для полноэкранного просмотра с навигацией */}
      {showMediaViewer && (
        <MediaViewerWithNavigation
          isOpen={showMediaViewer}
          onClose={() => {
            setShowMediaViewer(false);
          }}
          media={media}
          initialIndex={selectedIndex}
        />
      )}
    </>
  );
};

// Обёртка для MediaViewer с поддержкой навигации между медиа
const MediaViewerWithNavigation: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  media: PostMedia[];
  initialIndex: number;
}> = ({ isOpen, onClose, media, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < media.length - 1) {
        e.preventDefault();
        setCurrentIndex(prev => prev + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, media.length]);

  const currentMedia = media[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex < media.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <MediaViewer
        isOpen={isOpen}
        onClose={onClose}
        media={{
          url: currentMedia.url,
          type: currentMedia.type,
        }}
      />
      
      {/* Навигационные кнопки поверх всего */}
      {media.length > 1 && (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
          <div className="relative w-full h-full">
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev(e);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-colors pointer-events-auto"
                aria-label="Previous"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {currentIndex < media.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext(e);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-colors pointer-events-auto"
                aria-label="Next"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            {/* Счётчик */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
              {currentIndex + 1} / {media.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostMediaSlider;

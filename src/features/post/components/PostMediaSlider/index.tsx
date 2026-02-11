"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import { MediaSlide } from './components/MediaSlide';
import { NavigationButtons } from './components/NavigationButtons';
import { PaginationDots } from './components/PaginationDots';
import { FullscreenViewer } from './components/FullscreenViewer';
import { useMediaSlider } from './hooks/useMediaSlider';
import { useFullscreenImage } from './hooks/useFullscreenImage';
import type { MediaSliderProps } from './types';

import './styles.css';

const PostMediaSlider: React.FC<MediaSliderProps> = ({ media, className = "" }) => {
  const {
    revealedSpoilers,
    aspectRatios,
    currentSlide,
    setCurrentSlide,
    setSwiperInstance,
    getVideoRef,
    handleVideoLoadedMetadata,
    handleImageLoadedMetadata,
    revealSpoiler,
    goToSlide,
  } = useMediaSlider();

  const {
    fullscreenIndex,
    openFullscreen,
    closeFullscreen,
    navigateFullscreen,
  } = useFullscreenImage(media.length);

  if (!media || media.length === 0) return null;

  const handleMediaClick = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Если это спойлер и он еще не раскрыт - раскрываем
    if (media[index].spoiler && !revealedSpoilers.has(index)) {
      revealSpoiler(index);
      return;
    }

    // Если это изображение и спойлер раскрыт - открываем fullscreen
    if (media[index].type === 'image') {
      openFullscreen(index);
    }
  };

  const handleImageFullscreen = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    openFullscreen(index);
  };

  return (
    <>
      <div className={`w-full ${className} relative post-media-swiper`} data-no-redirect="true">
        <Swiper
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          modules={[Navigation]}
          className="!pb-0 rounded-2xl overflow-hidden"
        >
          {media.map((item, index) => (
            <SwiperSlide key={index}>
              <MediaSlide
                item={item}
                index={index}
                isSpoilerHidden={!!(item.spoiler && !revealedSpoilers.has(index))}
                aspectRatio={aspectRatios.get(item.url)}
                onMediaClick={handleMediaClick}
                onImageFullscreen={handleImageFullscreen}
                getVideoRef={getVideoRef}
                onVideoLoadedMetadata={handleVideoLoadedMetadata}
                onImageLoadedMetadata={handleImageLoadedMetadata}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Кнопки навигации */}
        <NavigationButtons
          currentSlide={currentSlide}
          totalSlides={media.length}
          onPrev={() => goToSlide(currentSlide - 1)}
          onNext={() => goToSlide(currentSlide + 1)}
        />

        {/* Точки пагинации */}
        <PaginationDots
          totalSlides={media.length}
          currentSlide={currentSlide}
          onSlideClick={goToSlide}
        />
      </div>

      {/* Fullscreen просмотр изображения */}
      {fullscreenIndex !== null && (
        <FullscreenViewer
          media={media}
          currentIndex={fullscreenIndex}
          onClose={closeFullscreen}
          onNavigate={navigateFullscreen}
          onSlideClick={openFullscreen}
        />
      )}
    </>
  );
};

export default PostMediaSlider;
export type { PostMedia } from './types';

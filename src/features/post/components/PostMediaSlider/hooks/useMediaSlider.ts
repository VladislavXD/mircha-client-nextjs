import React, { useState, useRef, useCallback } from 'react';
import type { Swiper as SwiperType } from 'swiper';

export const useMediaSlider = () => {
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(new Set());
  const [aspectRatios, setAspectRatios] = useState<Map<string, number>>(new Map());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const videoRefs = useRef(new Map<string, React.RefObject<HTMLVideoElement>>()).current;

  const getVideoRef = useCallback((url: string) => {
    if (!videoRefs.has(url)) {
      videoRefs.set(url, React.createRef<HTMLVideoElement>());
    }
    return videoRefs.get(url)!;
  }, [videoRefs]);

  const handleVideoLoadedMetadata = useCallback((url: string, ratio: number) => {
    setAspectRatios(prev => new Map(prev).set(url, ratio));
  }, []);

  const handleImageLoadedMetadata = useCallback((url: string, ratio: number) => {
    setAspectRatios(prev => new Map(prev).set(url, ratio));
  }, []);

  const revealSpoiler = useCallback((index: number) => {
    setRevealedSpoilers(prev => new Set(prev).add(index));
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  }, [swiperInstance]);

  return {
    revealedSpoilers,
    aspectRatios,
    currentSlide,
    swiperInstance,
    videoRefs,
    setCurrentSlide,
    setSwiperInstance,
    getVideoRef,
    handleVideoLoadedMetadata,
    handleImageLoadedMetadata,
    revealSpoiler,
    goToSlide,
  };
};

import { useState, useEffect, useCallback } from 'react';

export const useFullscreenImage = (mediaLength: number) => {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const openFullscreen = useCallback((index: number) => {
    setFullscreenIndex(index);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenIndex(null);
  }, []);

  const navigateFullscreen = useCallback((direction: 'prev' | 'next') => {
    setFullscreenIndex(current => {
      if (current === null) return null;
      
      return direction === 'prev' 
        ? Math.max(0, current - 1)
        : Math.min(mediaLength - 1, current + 1);
    });
  }, [mediaLength]);

  // Обработка клавиатуры
  useEffect(() => {
    if (fullscreenIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFullscreen();
      if (e.key === 'ArrowLeft') navigateFullscreen('prev');
      if (e.key === 'ArrowRight') navigateFullscreen('next');
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenIndex, closeFullscreen, navigateFullscreen]);

  return {
    fullscreenIndex,
    openFullscreen,
    closeFullscreen,
    navigateFullscreen,
  };
};

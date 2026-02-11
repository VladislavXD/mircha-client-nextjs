"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Volume2, VolumeX } from 'lucide-react';
import { BlurredBackground } from './BlurredBackground';
import { useVideoState } from '../hooks/useVideoState';

type Props = {
  src: string;
  isSpoilerRevealed: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
  aspectRatio?: number;
  onLoadedMetadata?: (ratio: number) => void;
};

export const VideoPlayer: React.FC<Props> = ({ 
  src, 
  isSpoilerRevealed, 
  videoRef: externalRef, 
  aspectRatio, 
  onLoadedMetadata 
}) => {
  const internalRef = useRef<HTMLVideoElement>(null);
  const activeRef = externalRef || internalRef;
  const containerRef = useRef<HTMLDivElement>(null);
  const { getVideoState, setVideoMuted } = useVideoState();
  
  const [isMuted, setIsMuted] = useState(() => getVideoState(src).isMuted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });

  const setRefs = useCallback((element: HTMLVideoElement | null) => {
    if (activeRef.current !== element) {
      (activeRef as React.MutableRefObject<HTMLVideoElement | null>).current = element;
    }
    inViewRef(element);
  }, [activeRef, inViewRef]);

  // Автоплей при появлении в viewport
  useEffect(() => {
    if (activeRef.current && !isFullscreen) {
      if (inView) {
        activeRef.current.play().catch(() => {});
      } else {
        activeRef.current.pause();
      }
    }
  }, [inView, activeRef, isFullscreen]);

  // Отслеживание fullscreen состояния
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isNowFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Обновление состояния воспроизведения
  useEffect(() => {
    const video = activeRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (onLoadedMetadata && video.videoWidth && video.videoHeight) {
        const ratio = video.videoWidth / video.videoHeight;
        onLoadedMetadata(ratio);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [activeRef, onLoadedMetadata]);

  // Автоскрытие контролов в fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const resetTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    resetTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isFullscreen, isPlaying]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeRef.current) {
      const newMuted = !isMuted;
      activeRef.current.muted = newMuted;
      setIsMuted(newMuted);
      setVideoMuted(src, newMuted);
    }
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeRef.current) {
      if (activeRef.current.paused) {
        activeRef.current.play();
      } else {
        activeRef.current.pause();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeRef.current) {
      const time = parseFloat(e.target.value);
      activeRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVideoClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSpoilerRevealed) return;

    if (!isFullscreen && containerRef.current) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          await (containerRef.current as any).mozRequestFullScreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }
      } catch (err) {
        console.error('Ошибка входа в полноэкранный режим:', err);
      }
    } else {
      togglePlayPause(e);
    }
  };

  const handleMouseMove = () => {
    if (isFullscreen && controlsTimeoutRef.current) {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${isFullscreen ? 'w-full h-full bg-black' : 'w-full h-full'} flex items-center justify-center`}
      onClick={handleVideoClick}
      onMouseMove={handleMouseMove}
    >
      <BlurredBackground src={src} type="video" />

      {/* Основное видео */}
      <video
        ref={setRefs}
        src={src}
        className="relative z-10 max-w-full max-h-full object-contain cursor-pointer"
        preload="metadata"
        muted={isMuted}
        loop
        playsInline
      />
      
      {/* Кнопка звука в preview */}
      {isSpoilerRevealed && !isFullscreen && (
        <button
          onClick={toggleMute}
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
          aria-label={isMuted ? "Включить звук" : "Выключить звук"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {/* Кастомные контролы в fullscreen */}
      {isFullscreen && (
        <div 
          className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Прогресс бар */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 mb-4 appearance-none bg-white/30 rounded-full cursor-pointer 
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                     [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full 
                     [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label={isMuted ? "Включить звук" : "Выключить звук"}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Image } from "@heroui/react";
import { VideoPlayer } from './VideoPlayer';
import { BlurredBackground } from './BlurredBackground';
import type { PostMedia } from '../types';

type Props = {
  item: PostMedia;
  index: number;
  isSpoilerHidden: boolean;
  aspectRatio?: number;
  onMediaClick: (index: number, e?: React.MouseEvent) => void;
  onImageFullscreen: (index: number, e: React.MouseEvent) => void;
  getVideoRef: (url: string) => React.RefObject<HTMLVideoElement>;
  onVideoLoadedMetadata: (url: string, ratio: number) => void;
  onImageLoadedMetadata?: (url: string, ratio: number) => void;
};

// Определяем стиль отображения на основе aspect ratio
const getImageFit = (aspectRatio?: number) => {
  if (!aspectRatio) return "object-contain";
  
  // На мобильных (< 768px) всегда используем cover для заполнения
  // На десктопе используем адаптивный подход
  return "object-cover md:object-contain";
};

const getImageClasses = (aspectRatio?: number) => {
  const baseFit = getImageFit(aspectRatio);
  
  // На мобильных изображение занимает всю высоту слайдера
  return `relative z-10 w-full h-full ${baseFit} transition-transform duration-300`;
};

export const MediaSlide: React.FC<Props> = ({ 
  item, 
  index, 
  isSpoilerHidden, 
  aspectRatio,
  onMediaClick, 
  onImageFullscreen,
  getVideoRef,
  onVideoLoadedMetadata,
  onImageLoadedMetadata
}) => {
  const [isRevealing, setIsRevealing] = useState(false);

  // Обработчик загрузки изображения для вычисления aspect ratio
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (onImageLoadedMetadata) {
      const img = e.currentTarget;
      const ratio = img.naturalWidth / img.naturalHeight;
      onImageLoadedMetadata(item.url, ratio);
    }
  };

  const handleSpoilerClick = (e: React.MouseEvent) => {
    setIsRevealing(true);
    // Даем время для анимации перед раскрытием
    setTimeout(() => {
      onMediaClick(index, e);
    }, 300);
  };
  
  const renderSpoiler = () => (
    <div 
      className={`relative w-full h-full cursor-pointer transition-all duration-300 ${
        isRevealing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 hover:opacity-90'
      }`}
      onClick={handleSpoilerClick}
    >
      <BlurredBackground src={item.url} type={item.type} opacity="opacity-40" />
      
      {item.type === "image" ? (
        <img
          src={item.url}
          alt={`Spoiler ${index + 1}`}
          className="relative z-10 w-full h-full object-cover blur-2xl"
          style={{ pointerEvents: 'none' }}
        />
      ) : (
        <video
          src={item.url}
          className="relative z-10 w-full h-full object-cover pointer-events-none blur-2xl"
          muted
          preload="metadata"
        />
      )}
      
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className={`bg-black/60 backdrop-blur-sm px-6 py-3 rounded-2xl transition-all duration-300 ${
          isRevealing ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        }`}>
          <p className="text-white font-medium">Нажмите чтобы показать</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (item.type === "image") {
      return (
        <div 
          className={`relative w-full h-full cursor-pointer group transition-all duration-300 ${
            isSpoilerHidden ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          onClick={(e) => onImageFullscreen(index, e)}
        >
          <BlurredBackground src={item.url} type="image" />
          
          {/* Градиенты только на десктопе для contain изображений */}
          {aspectRatio && aspectRatio < 1.2 && (
            <>
              <div className="hidden md:block absolute inset-0 z-[5] bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
              <div className="hidden md:block absolute inset-0 z-[5] shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] pointer-events-none" />
            </>
          )}
          
          <img
            src={item.url}
            alt={`Image ${index + 1}`}
            className={getImageClasses(aspectRatio)}
            onLoad={handleImageLoad}
          />
        </div>
      );
    }

    return (
      <VideoPlayer
        src={item.url}
        isSpoilerRevealed={!isSpoilerHidden}
        videoRef={getVideoRef(item.url)}
        aspectRatio={aspectRatio}
        onLoadedMetadata={(ratio) => onVideoLoadedMetadata(item.url, ratio)}
      />
    );
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[400px] md:h-[450px] bg-black flex items-center justify-center">
      {isSpoilerHidden ? renderSpoiler() : renderContent()}
    </div>
  );
};

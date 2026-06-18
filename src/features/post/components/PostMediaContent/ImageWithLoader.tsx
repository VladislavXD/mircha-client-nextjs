"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ImageWithLoaderProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className: string;
  loading: "eager" | "lazy";
  sizes?: string;
  priority?: boolean;
};

/**
 * Картинка с серым скелетоном-заглушкой поверх, пока она не загрузилась.
 *
 * Скелетон занимает absolute inset-0 внутри уже зафиксированного по
 * aspectRatio родителя — поэтому не влияет на размер карточки и не
 * вызывает reflow ни до, ни после загрузки изображения.
 *
 * Проверяем img.complete сразу при маунте — если картинка уже в браузерном
 * кеше (например, повторное открытие в лайтбоксе), onLoad может не сработать
 * вовсе или сработать с задержкой, и скелетон на секунду "моргнёт" зря.
 */
export const ImageWithLoader = ({
  src,
  alt,
  width,
  height,
  className,
  loading,
  sizes,
  priority,
}: ImageWithLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <>
      {!isLoaded && !hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-[16px]"
        />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 rounded-[16px] text-neutral-400 dark:text-neutral-600 text-xs">
          Не удалось загрузить изображение
        </div>
      ) : (
        <Image
          ref={imgRef}
          alt={alt}
          className={`${className} transition-opacity duration-200 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          height={height}
          loading={priority ? undefined : loading}
          priority={priority}
          sizes={sizes}
          src={src}
          width={width}
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </>
  );
};
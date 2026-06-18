"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

type CustomVideoSlideProps = {
  src: string;
};

/**
 * Минималистичный плеер для полноэкранного просмотра видео.
 *
 * Контролы появляются по тапу/клику на видео и автоматически скрываются
 * через 3 секунды бездействия — классический кинематографический UX.
 *
 * Свайп вниз/вверх для закрытия и навигация между слайдами полностью
 * обрабатываются yet-another-react-lightbox — здесь мы только останавливаем
 * всплытие событий по горизонтали (чтобы не мешать навигации между слайдами),
 * но пропускаем вертикальные жесты библиотеке.
 *
 * Структура:
 *   - <video>            — сам элемент, pointer-events: none (клик ловит обёртка)
 *   - overlay            — прозрачная зона для toggle контролов, ловит tap/click
 *   - controls bar       — появляется снизу при активности:
 *       play/pause · прогресс-бар · время · mute
 */
export const CustomVideoSlide = ({ src }: CustomVideoSlideProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);       // 0–1
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);

  // ─── автозапуск ──────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    // Если метаданные уже есть (повторный рендер) — сразу играем
    if (video.readyState >= 1) {
      tryPlay();
    } else {
      video.addEventListener("loadedmetadata", tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
      video.pause();
    };
  }, [src]);

  // ─── синхронизация состояния плеера ─────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onDurationChange = () => setDuration(video.duration || 0);
    const onTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(video.currentTime);
        setProgress(video.duration ? video.currentTime / video.duration : 0);
      }
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [isSeeking]);

  // ─── автоскрытие контролов ───────────────────────────────────────────────
  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    scheduleHide();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHide]);

  // ─── действия ────────────────────────────────────────────────────────────
  const togglePlay = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play().catch(() => {}) : video.pause();
    showControls();
  }, [showControls]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    showControls();
  }, [showControls]);

  // ─── прогресс-бар ────────────────────────────────────────────────────────
  const seekTo = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

    video.currentTime = ratio * video.duration;
    setProgress(ratio);
    setCurrentTime(video.currentTime);
    showControls();
  }, [showControls]);

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative flex items-center justify-center w-full h-full select-none"
      // Показываем контролы при любом движении/тапе внутри слайда
      onMouseMove={showControls}
      onTouchStart={showControls}
    >
      {/* ── видео ────────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        className="max-w-full max-h-full object-contain pointer-events-none"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        src={src}
      />

      {/* ── overlay для toggle по тапу (пропускает вертикальные свайпы) ── */}
      <div
        aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        className="absolute inset-0 cursor-pointer z-10"
        role="button"
        tabIndex={0}
        onClick={togglePlay}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") togglePlay(e as unknown as React.MouseEvent);
        }}
      />

      {/* ── контролы ─────────────────────────────────────────────────────── */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-20
          px-4 pb-safe-bottom pt-3
          bg-gradient-to-t from-black/70 via-black/30 to-transparent
          transition-opacity duration-300
          ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        // Не даём кликам по контролам всплыть к overlay
        onClick={(e) => e.stopPropagation()}
      >
        {/* прогресс-бар */}
        <div
          className="relative w-full h-[3px] rounded-full bg-white/25 cursor-pointer mb-3 group/bar"
          role="slider"
          aria-label="Прогресс видео"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onClick={seekTo}
          onMouseDown={() => setIsSeeking(true)}
          onMouseUp={() => setIsSeeking(false)}
          onTouchStart={() => setIsSeeking(true)}
          onTouchEnd={(e) => { seekTo(e); setIsSeeking(false); }}
          onKeyDown={(e) => {
            const video = videoRef.current;
            if (!video) return;
            if (e.key === "ArrowRight") video.currentTime = Math.min(video.currentTime + 5, video.duration);
            if (e.key === "ArrowLeft") video.currentTime = Math.max(video.currentTime - 5, 0);
          }}
        >
          {/* буфер-трек */}
          <div className="absolute inset-0 rounded-full bg-white/15" />
          {/* прогресс */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-white transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
          {/* thumb — появляется при hover/фокусе */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `calc(${progress * 100}% - 6px)` }}
          />
        </div>

        {/* кнопки + время */}
        <div className="flex items-center gap-3 pb-3">
          {/* play/pause */}
          <button
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
            className="flex items-center justify-center text-white/90 hover:text-white transition-colors"
            type="button"
            onClick={(e) => { e.stopPropagation(); togglePlay(e); }}
          >
            {isPlaying
              ? <Pause className="w-5 h-5 fill-current" />
              : <Play  className="w-5 h-5 fill-current" />
            }
          </button>

          {/* время */}
          <span className="text-white/70 text-xs tabular-nums">
            {formatTime(currentTime)}
            <span className="text-white/40 mx-0.5">/</span>
            {formatTime(duration)}
          </span>

          {/* spacer */}
          <div className="flex-1" />

          {/* mute */}
          <button
            aria-label={isMuted ? "Включить звук" : "Выключить звук"}
            className="flex items-center justify-center text-white/90 hover:text-white transition-colors"
            type="button"
            onClick={toggleMute}
          >
            {isMuted
              ? <VolumeX className="w-5 h-5" />
              : <Volume2 className="w-5 h-5" />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

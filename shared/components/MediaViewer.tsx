"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Modal, ModalContent, ModalBody, Button, Chip } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  MdClose,
  MdZoomIn,
  MdZoomOut,
  MdDownload,
  MdVolumeUp,
  MdVolumeOff,
  MdPlayArrow,
  MdPause,
  MdRefresh,
} from "react-icons/md";

interface MediaItem {
  url: string;
  thumbnailUrl?: string;
  type: "image" | "video";
  name?: string;
  size?: number;
}

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  isOpen,
  onClose,
  media,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Определяем тип медиа по URL
  const getMediaType = (url: string): "image" | "video" => {
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    const extension = url.toLowerCase().split(".").pop();

    if (extension && videoExtensions.some((ext) => url.includes(ext))) {
      return "video";
    }

    return "image";
  };

  const mediaType = media.type || getMediaType(media.url);

  // Сброс состояния при открытии/закрытии
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      setIsPlaying(mediaType === "video");
      setIsLoading(true);
    }
  }, [isOpen, mediaType]);

  // Zoom функции
  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.5, 0.1));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Drag функции
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (mediaType === "image" && scale > 1) {
        setIsDragging(true);
        dragStartRef.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        };
        e.preventDefault();
      }
    },
    [mediaType, scale, position],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && mediaType === "image") {
        setPosition({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y,
        });
      }
    },
    [isDragging, mediaType],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel zoom для изображений
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (mediaType === "image") {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;

        setScale((prev) => Math.max(0.1, Math.min(5, prev * delta)));
      }
    },
    [mediaType],
  );

  // Download
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");

    link.href = media.url;
    link.download = media.name || "media";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [media]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          if (mediaType === "image") handleZoomIn();
          break;
        case "-":
          if (mediaType === "image") handleZoomOut();
          break;
        case "0":
          if (mediaType === "image") resetZoom();
          break;
        case " ":
          if (mediaType === "video" && playerRef.current) {
            e.preventDefault();
            if (playerRef.current.paused) {
              playerRef.current.play();
              setIsPlaying(true);
            } else {
              playerRef.current.pause();
              setIsPlaying(false);
            }
          }
          break;
        case "m":
          if (mediaType === "video" && playerRef.current) {
            playerRef.current.muted = !playerRef.current.muted;
            setIsMuted(playerRef.current.muted);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);

      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, mediaType, handleZoomIn, handleZoomOut, resetZoom, onClose]);

  const renderControls = () => (
    <div className="absolute top-4 right-4 flex gap-2 z-50">
      {mediaType === "image" && (
        <>
          <Button
            isIconOnly
            className="bg-black/50 text-white"
            color="default"
            size="sm"
            variant="flat"
            onPress={handleZoomOut}
          >
            <MdZoomOut />
          </Button>
          <Button
            isIconOnly
            className="bg-black/50 text-white"
            color="default"
            size="sm"
            variant="flat"
            onPress={resetZoom}
          >
            <MdRefresh />
          </Button>
          <Button
            isIconOnly
            className="bg-black/50 text-white"
            color="default"
            size="sm"
            variant="flat"
            onPress={handleZoomIn}
          >
            <MdZoomIn />
          </Button>
        </>
      )}

      {mediaType === "video" && (
        <>
          <Button
            isIconOnly
            className="bg-black/50 text-white"
            color="default"
            size="sm"
            variant="flat"
            onPress={() => {
              if (playerRef.current) {
                if (playerRef.current.paused) {
                  playerRef.current.play();
                  setIsPlaying(true);
                } else {
                  playerRef.current.pause();
                  setIsPlaying(false);
                }
              }
            }}
          >
            {isPlaying ? <MdPause /> : <MdPlayArrow />}
          </Button>
          <Button
            isIconOnly
            className="bg-black/50 text-white"
            color="default"
            size="sm"
            variant="flat"
            onPress={() => {
              if (playerRef.current) {
                playerRef.current.muted = !playerRef.current.muted;
                setIsMuted(playerRef.current.muted);
              }
            }}
          >
            {isMuted ? <MdVolumeOff /> : <MdVolumeUp />}
          </Button>
        </>
      )}

      <Button
        isIconOnly
        className="bg-black/50 text-white"
        color="default"
        size="sm"
        variant="flat"
        onPress={handleDownload}
      >
        <MdDownload />
      </Button>

      <Button
        isIconOnly
        className="bg-black/50"
        color="danger"
        size="sm"
        variant="flat"
        onPress={onClose}
      >
        <MdClose />
      </Button>
    </div>
  );

  const renderMediaInfo = () => (
    <div className="absolute bottom-4 left-4 flex gap-2 z-50">
      <Chip className="bg-black/50 text-white" color="default" variant="flat">
        {mediaType === "image" ? "Изображение" : "Видео"}
      </Chip>
      {media.name && (
        <Chip className="bg-black/50 text-white" color="default" variant="flat">
          {media.name}
        </Chip>
      )}
      {media.size && (
        <Chip className="bg-black/50 text-white" color="default" variant="flat">
          {(media.size / 1024 / 1024).toFixed(1)} MB
        </Chip>
      )}
      {mediaType === "image" && scale !== 1 && (
        <Chip className="bg-black/50" color="primary" variant="flat">
          {Math.round(scale * 100)}%
        </Chip>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          hideCloseButton
          classNames={{
            base: "bg-black/95",
            backdrop: "bg-black/80",
            wrapper: "items-center justify-center",
          }}
          isOpen={isOpen}
          size="full"
          onClose={onClose}
        >
          <ModalContent>
            <ModalBody className="p-0 relative w-full h-full flex items-center justify-center overflow-hidden">
              <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center"
                style={{
                  cursor: isDragging
                    ? "grabbing"
                    : mediaType === "image" && scale > 1
                      ? "grab"
                      : "default",
                }}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
              >
                {mediaType === "image" ? (
                  <motion.div
                    animate={{
                      scale,
                      x: position.x,
                      y: position.y,
                    }}
                    className="relative max-w-full max-h-full"
                    transition={{
                      type: "tween",
                      duration: isDragging ? 0 : 0.2,
                    }}
                  >
                    <Image
                      priority
                      unoptimized
                      alt={media.name || "Media"}
                      className="max-w-full max-h-[90vh] object-contain"
                      height={800}
                      src={media.url}
                      width={1200}
                      onError={() => setIsLoading(false)}
                      onLoad={() => setIsLoading(false)}
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                    <video
                      ref={playerRef}
                      controls
                      autoPlay={isPlaying}
                      className="max-w-full max-h-full"
                      muted={isMuted}
                      src={media.url}
                      style={{ maxWidth: "90vw", maxHeight: "90vh" }}
                      onError={() => setIsLoading(false)}
                      onLoadedData={() => setIsLoading(false)}
                    />
                  </div>
                )}

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
                  </div>
                )}
              </div>

              {renderControls()}
              {renderMediaInfo()}

              {/* Инструкции */}
              <div className="absolute bottom-4 right-4 text-white/70 text-sm max-w-xs text-right">
                {mediaType === "image" ? (
                  <div>
                    <p>Колесо мыши: зум</p>
                    <p>Drag: перемещение</p>
                    <p>+/- : зум, 0: сброс</p>
                    <p>ESC: закрыть</p>
                  </div>
                ) : (
                  <div>
                    <p>Пробел: пауза/воспроизведение</p>
                    <p>M: звук вкл/выкл</p>
                    <p>ESC: закрыть</p>
                  </div>
                )}
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default MediaViewer;

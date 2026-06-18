"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Volume2, VolumeX } from "lucide-react";

type VideoPlayerItemProps = {
  src: string;
  isSingle: boolean;
};

export const VideoPlayerItem = ({ src, isSingle }: VideoPlayerItemProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.6, rootMargin: "-20% 0px" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();
  const mountedPathname = useRef(pathname);
  const isActiveRoute = pathname === mountedPathname.current;

  useEffect(() => {
    const video = videoRef.current;
    if (inView && isActiveRoute && video) {
      video.play().catch(() => {});
    } else if (video) {
      video.pause();
    }
    return () => { video?.pause(); };
  }, [inView, isActiveRoute]);

  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      if (
        e.target instanceof HTMLVideoElement &&
        e.target !== videoRef.current &&
        videoRef.current &&
        !videoRef.current.paused
      ) {
        videoRef.current.pause();
      }
    };
    window.addEventListener("play", handleGlobalPlay, true);
    return () => { window.removeEventListener("play", handleGlobalPlay, true); };
  }, []);

  return (
    <div ref={ref} className="relative flex justify-center group w-full h-full">
      <video
        ref={videoRef}
        className={`${
          isSingle ? "w-full h-full object-contain" : "w-auto h-full object-contain min-w-[140px]"
        } cursor-pointer rounded-[16px]`}
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        src={src}
        onClick={(e) => {
          e.stopPropagation();
          videoRef.current?.paused ? videoRef.current.play() : videoRef.current?.pause();
        }}
      />
      <button
        className="absolute bottom-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-opacity sm:opacity-0 group-hover:opacity-100 z-10"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
          if (videoRef.current?.paused) videoRef.current.play();
        }}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
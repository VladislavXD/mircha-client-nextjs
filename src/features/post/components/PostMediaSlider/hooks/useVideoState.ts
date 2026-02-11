import { useCallback } from 'react';
import type { VideoState } from '../types';

// Глобальное хранилище состояний видео
const videoStates = new Map<string, VideoState>();

export const useVideoState = () => {
  const getVideoState = useCallback((videoUrl: string): VideoState => {
    if (!videoStates.has(videoUrl)) {
      videoStates.set(videoUrl, { isMuted: true, currentTime: 0 });
    }
    return videoStates.get(videoUrl)!;
  }, []);

  const setVideoMuted = useCallback((videoUrl: string, isMuted: boolean) => {
    const state = getVideoState(videoUrl);
    state.isMuted = isMuted;
  }, [getVideoState]);

  const setVideoTime = useCallback((videoUrl: string, currentTime: number) => {
    const state = getVideoState(videoUrl);
    state.currentTime = currentTime;
  }, [getVideoState]);

  return {
    getVideoState,
    setVideoMuted,
    setVideoTime,
  };
};

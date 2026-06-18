export type PostMedia = {
  url: string;
  type: "image" | "video";
  spoiler?: boolean;
  width?: number;
  height?: number;
  size?: number;
};

export type VideoState = {
  isMuted: boolean;
  currentTime: number;
};

export type MediaSliderProps = {
  media: PostMedia[];
  className?: string;
  width?: number;
  height?: number;
  size?: number;
};

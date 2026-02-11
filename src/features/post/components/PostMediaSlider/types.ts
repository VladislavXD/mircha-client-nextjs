export type PostMedia = {
  url: string;
  type: "image" | "video";
  spoiler?: boolean;
};

export type VideoState = {
  isMuted: boolean;
  currentTime: number;
};

export type MediaSliderProps = {
  media: PostMedia[];
  className?: string;
};

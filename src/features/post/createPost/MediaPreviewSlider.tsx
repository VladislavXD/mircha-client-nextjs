"use client";

import React from "react";
import { X, MoreHorizontal, EyeOff, Eye } from "lucide-react";
import { Spoiler } from "spoiled";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type MediaFile = {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
  spoiler?: boolean;
};

type Props = {
  media: MediaFile[];
  onRemove: (id: string) => void;
  onToggleSpoiler?: (id: string) => void;
  disabled?: boolean;
};

const MediaPreviewSlider: React.FC<Props> = ({
  media,
  onRemove,
  onToggleSpoiler,
  disabled,
}) => {
  if (!media || media.length === 0) return null;

  return (
    <div className="mt-3 mb-3">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        {media.map((m) => (
          <div
            key={m.id}
            className="relative shrink-0 w-40 h-40 rounded-[1.25rem] overflow-hidden border border-neutral-200 dark:border-neutral-800/70 bg-neutral-100 dark:bg-[#161616] group"
          >
            {m.spoiler ? (
              <Spoiler revealOn="click">
                {m.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt="media"
                    className="w-full h-full object-cover"
                    src={m.preview}
                  />
                ) : (
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={m.preview}
                  />
                )}
              </Spoiler>
            ) : (
              <>
                {m.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt="media"
                    className="w-full h-full object-cover"
                    src={m.preview}
                  />
                ) : (
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={m.preview}
                  />
                )}
              </>
            )}

            {/* Menu Button (Three dots) */}
            {onToggleSpoiler && (
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="Media options"
                      className="h-8 w-8 rounded-full shadow-lg bg-black/60 hover:bg-black/80 text-white border-0"
                      disabled={disabled}
                      size="icon"
                      variant="secondary"
                    >
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="rounded-[1rem]">
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onClick={() => onToggleSpoiler(m.id)}
                    >
                      {m.spoiler ? <Eye size={16} /> : <EyeOff size={16} />}
                      {m.spoiler ? "Убрать спойлер" : "Отметить как спойлер"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Delete button */}
            <Button
              aria-label="Remove media"
              className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={disabled}
              size="icon"
              variant="destructive"
              onClick={() => onRemove(m.id)}
            >
              <X size={16} />
            </Button>

            {/* Type indicator */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-medium backdrop-blur-md">
              {m.type === "image" ? "Фото" : "Видео"}
            </div>
          </div>
        ))}
      </div>
      <div className="text-[12px] text-neutral-500 mt-1 font-medium px-1">
        {media.length} / 30 файлов
      </div>
    </div>
  );
};

export default MediaPreviewSlider;

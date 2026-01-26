"use client";

import React, { useState } from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { IoMdClose } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { Spoiler } from "spoiled";

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

const MediaPreviewSlider: React.FC<Props> = ({ media, onRemove, onToggleSpoiler, disabled }) => {
  if (!media || media.length === 0) return null;

  return (
    <div className="mt-3 mb-3">
      <div className="flex gap-3 overflow-auto  pb-2 scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-default-100">
        {media.map((m) => (
          <div
            key={m.id}
            className="relative shrink-0 w-40 h-40 rounded-xl overflow-hidden border-2 border-default-200 bg-default-50 hover:border-primary transition-colors"
          >
            {m.spoiler ? (
              <Spoiler revealOn="click">
                {m.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={m.preview} 
                    alt="media" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <video 
                    src={m.preview} 
                    className="w-full h-full object-cover" 
                    controls
                  />
                )}
              </Spoiler>
            ) : (
              <>
                {m.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={m.preview} 
                    alt="media" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <video 
                    src={m.preview} 
                    className="w-full h-full object-cover" 
                    controls
                  />
                )}
              </>
            )}

            {/* Кнопка меню (три точки) */}
            {onToggleSpoiler && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="solid"
                    className="absolute top-2 left-2 shadow-lg bg-default-900/80 text-white"
                    isDisabled={disabled}
                    aria-label="Media options"
                  >
                    <BsThreeDots size={18} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Media actions">
                  <DropdownItem
                    key="spoiler"
                    startContent={m.spoiler ? <MdOutlineVisibility size={18} /> : <MdOutlineVisibilityOff size={18} />}
                    onClick={() => onToggleSpoiler(m.id)}
                  >
                    {m.spoiler ? "Убрать спойлер" : "Отметить как спойлер"}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Кнопка удаления */}
            <Button
              isIconOnly
              size="sm"
              variant="solid"
              color="danger"
              className="absolute top-2 right-2 shadow-lg"
              onClick={() => onRemove(m.id)}
              isDisabled={disabled}
              aria-label="Remove media"
            >
              <IoMdClose size={18} />
            </Button>

            {/* Индикатор типа */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-medium">
              {m.type === "image" ? "Фото" : "Видео"}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-default-500 mt-1">
        {media.length} / 30 файлов
      </div>
    </div>
  );
};

export default MediaPreviewSlider;

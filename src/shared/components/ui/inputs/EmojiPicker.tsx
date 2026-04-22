"use client";

import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface EmojiPickerProps {
  onEmojiSelect: (emojiUrl: string) => void;
  disabled?: boolean;
}

// Мини-набор emoji (url картинки). Можно расширить позже.
const EMOJI_LIST = [
  {
    url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f604.png",
    name: "smile",
  },
  {
    url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f602.png",
    name: "joy",
  },
  {
    url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png",
    name: "heart",
  },
  {
    url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f525.png",
    name: "fire",
  },
  {
    url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png",
    name: "thumbs-up",
  },
  {
    url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png",
    name: "cool",
  },
  {
    url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f622.png",
    name: "cry",
  },
  {
    url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f914.png",
    name: "thinking",
  },
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiUrl: string) => {
    onEmojiSelect(emojiUrl);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Emoji"
          className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 h-8 w-8 rounded-full"
          disabled={disabled}
          size="icon"
          type="button"
          variant="ghost"
        >
          <BsEmojiSmile
            className="text-neutral-600 dark:text-neutral-400"
            size={16}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[280px] p-3 z-[100]"
        sideOffset={4}
      >
        <div>
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 px-1">
            Выберите emoji
          </div>
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji.url}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                disabled={disabled}
                title={emoji.name}
                type="button"
                onClick={() => handleEmojiClick(emoji.url)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={emoji.name} className="w-6 h-6" src={emoji.url} />
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;

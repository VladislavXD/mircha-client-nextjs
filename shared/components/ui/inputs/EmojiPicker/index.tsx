import React, { useState } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useTranslations } from "next-intl";
import { IoMdHappy } from "react-icons/io";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { emojiDataList } from "@/src/constants/emoji";

interface EmojiPickerProps {
  onEmojiSelect: (emojiUrl: string) => void;
  disabled?: boolean;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("HomePage.CreatePost");

  const handleEmojiClick = (emojiSrc: string) => {
    onEmojiSelect(emojiSrc);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground text-sm transition"
          disabled={disabled}
          type="button"
        >
          <IoMdHappy size={18} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[420px] p-0"
        side="top"
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b">
            <MdOutlineEmojiEmotions className="text-primary" size={16} />
            <span className="text-sm font-medium text-muted-foreground">
              {t("EmojiPicker")}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-3 max-h-80 overflow-y-auto">
            {emojiDataList.map((emoji) => (
              <button
                key={emoji.id}
                className="w-12 h-12 rounded-xl overflow-hidden hover:scale-110 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-muted/50 hover:bg-muted"
                title={emoji.name}
                type="button"
                onClick={() => handleEmojiClick(emoji.src)}
              >
                <img
                  alt={emoji.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  src={emoji.src}
                />
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
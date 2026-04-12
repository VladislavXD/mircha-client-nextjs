import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useTranslations } from "next-intl";
import { IoMdHappy } from "react-icons/io";

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

  const handleEmojiClick = (emojiSrc: string) => {
    onEmojiSelect(emojiSrc);
    setIsOpen(false);
  };

  const t = useTranslations("HomePage.CreatePost");

  return (
    <Dropdown isOpen={isOpen} placement="top-start" onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-default-100 hover:bg-default-200 text-default-700 text-sm transition`}
          disabled={disabled}
          type="button"
        >
          <IoMdHappy size={18} />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Выбор эмодзи"
        className="max-w-[420px]"
        closeOnSelect={false}
        variant="flat"
      >
        <DropdownItem key="emoji-grid" className="p-0" textValue="Emoji Grid">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-default-200">
              <MdOutlineEmojiEmotions className="text-primary" size={16} />
              <span className="text-sm font-medium text-default-600">
                {t("EmojiPicker")}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
              {emojiDataList.map((emoji) => (
                <button
                  key={emoji.id}
                  className="w-12 h-12 rounded-xl overflow-hidden hover:scale-110 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-default-50 hover:bg-default-100"
                  title={emoji.name}
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
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default EmojiPicker;

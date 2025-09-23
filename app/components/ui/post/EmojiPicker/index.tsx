import React, { useState, useRef } from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { emojiDataList } from '@/src/constants/emoji';
import { useTranslations } from 'next-intl';


interface EmojiPickerProps {
  onEmojiSelect: (emojiUrl: string) => void;
  disabled?: boolean;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiSrc: string) => {
    onEmojiSelect(emojiSrc);
    setIsOpen(false);
  };

  const t = useTranslations('HomePage.CreatePost');
  return (
    <Dropdown 
      isOpen={isOpen} 
      onOpenChange={setIsOpen}
      placement="top-start"
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="flat"
          disabled={disabled}
          className="min-w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 hover:border-primary/30 transition-all duration-200"
          aria-label="Выбрать эмодзи"
        >
          <MdOutlineEmojiEmotions size={20} className="text-primary" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Выбор эмодзи"
        className="max-w-[420px]"
        variant="flat"
        closeOnSelect={false}
      >
        <DropdownItem key="emoji-grid" className="p-0" textValue="Emoji Grid">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-default-200">
              <MdOutlineEmojiEmotions className="text-primary" size={16} />
              <span className="text-sm font-medium text-default-600">{t('EmojiPicker')}</span>
            </div>
            <div className="grid grid-cols-6 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
              {emojiDataList.map((emoji) => (
                <button
                  key={emoji.id}
                  onClick={() => handleEmojiClick(emoji.src)}
                  className="w-12 h-12 rounded-xl overflow-hidden hover:scale-110 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-default-50 hover:bg-default-100"
                  title={emoji.name}
                >
                  <img
                    src={emoji.src}
                    alt={emoji.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
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

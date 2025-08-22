import React from 'react';
import { Button } from '@heroui/react';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import EmojiPicker from '../EmojiPicker';

interface EmojiUploadProps {
  onEmojiSelect: (emojiUrl: string) => void;
  disabled?: boolean;
}

const EmojiUpload: React.FC<EmojiUploadProps> = ({ 
  onEmojiSelect, 
  disabled = false 
}) => {
  return (
    <EmojiPicker 
      onEmojiSelect={onEmojiSelect}
      disabled={disabled}
    />
  );
};

export default EmojiUpload;
import React from 'react';
import { parseEmojiText, EmojiTextSegment } from '../../../utils/parseEmojiText';

/**
 * Компонент для рендеринга текста с emoji
 */
export interface EmojiTextProps {
  text: string;
  emojiUrls?: string[];
  className?: string;
}

export const EmojiText: React.FC<EmojiTextProps> = ({ text, emojiUrls = [], className = '' }) => {
  const segments = parseEmojiText(text, emojiUrls);

  return (
    <div className={className}>
      {segments.map((segment: EmojiTextSegment, index: number) => {
        if (segment.type === 'emoji' && segment.emojiUrl) {
          return (
            <img
              key={index}
              src={segment.emojiUrl}
              alt="emoji"
              className="inline-block w-5 h-5 mx-0.5 align-text-bottom hover:scale-110 transition-transform duration-200"
              style={{ verticalAlign: 'text-bottom' }}
            />
          );
        }
        return <span key={index}>{segment.content}</span>;
      })}
    </div>
  );
};

export interface EmojiTextSegment {
  type: 'text' | 'emoji';
  content: string;
  emojiUrl?: string;
}

/**
 * Парсит текст с маркерами emoji и возвращает массив сегментов
 * @param text - Текст с маркерами [emoji:0], [emoji:1] и т.д.
 * @param emojiUrls - Массив URL emoji
 * @returns Массив сегментов для рендеринга
 */
export const parseEmojiText = (text: string, emojiUrls: string[] = []): EmojiTextSegment[] => {
  if (!text) return [];
  
  const segments: EmojiTextSegment[] = [];
  const emojiRegex = /\[emoji:(\d+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = emojiRegex.exec(text)) !== null) {
    const beforeMatch = text.slice(lastIndex, match.index);
    const emojiIndex = parseInt(match[1], 10);
    const emojiUrl = emojiUrls[emojiIndex];

    // Добавляем текст перед emoji (если есть)
    if (beforeMatch) {
      segments.push({
        type: 'text',
        content: beforeMatch
      });
    }

    // Добавляем emoji (если URL существует)
    if (emojiUrl) {
      segments.push({
        type: 'emoji',
        content: match[0], // оригинальный маркер для fallback
        emojiUrl
      });
    } else {
      // Если URL не найден, оставляем как текст
      segments.push({
        type: 'text',
        content: match[0]
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Добавляем оставшийся текст после последнего emoji
  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    segments.push({
      type: 'text',
      content: remainingText
    });
  }

  return segments;
};

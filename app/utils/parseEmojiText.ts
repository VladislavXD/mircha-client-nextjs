export interface EmojiTextSegment {
  type: 'text' | 'emoji' | 'mention';
  content: string;
  emojiUrl?: string;
  mentionId?: string;
  mentionName?: string;
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
  
  // Объединённый regex для всех токенов: emoji и mentions
  const tokenRegex = /\[emoji:(\d+)\]|\[mention:([^|\]]+)\|([^\]]+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    // Добавляем текст перед токеном
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      });
    }

    // Определяем тип токена по группам захвата
    if (match[1] !== undefined) {
      // Это [emoji:N]
      const emojiIndex = parseInt(match[1], 10);
      const emojiUrl = emojiUrls[emojiIndex];
      
      if (emojiUrl) {
        segments.push({
          type: 'emoji',
          content: match[0],
          emojiUrl
        });
      } else {
        // URL не найден - оставляем как текст
        segments.push({
          type: 'text',
          content: match[0]
        });
      }
    } else if (match[2] !== undefined && match[3] !== undefined) {
      // Это [mention:id|name]
      segments.push({
        type: 'mention',
        content: match[0],
        mentionId: match[2],
        mentionName: match[3]
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Добавляем оставшийся текст после последнего токена
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }

  return segments;
};

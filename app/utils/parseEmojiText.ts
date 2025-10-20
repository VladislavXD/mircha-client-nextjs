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
  const emojiRegex = /\[emoji:(\d+)\]/g;
  const mentionRegex = /\[mention:([^|\]]+)\|([^\]]+)\]/g; // [mention:<id>|<name>]
  let lastIndex = 0;
  let match: RegExpExecArray | null;

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

  // Теперь обрабатываем упоминания внутри уже получившихся сегментов текста
  // Для простоты пройдёмся по копии и разобьём текстовые сегменты по mentionRegex
  const finalSegments: EmojiTextSegment[] = [];
  for (const seg of segments.length ? segments : [{ type: 'text', content: text } as EmojiTextSegment]) {
    if (seg.type !== 'text') {
      finalSegments.push(seg);
      continue;
    }
    const s = seg.content;
    let idx = 0;
    let m: RegExpExecArray | null;
    while ((m = mentionRegex.exec(s)) !== null) {
      const before = s.slice(idx, m.index);
      if (before) finalSegments.push({ type: 'text', content: before });
      finalSegments.push({
        type: 'mention',
        content: m[0],
        mentionId: m[1],
        mentionName: m[2]
      });
      idx = m.index + m[0].length;
    }
    const rest = s.slice(idx);
    if (rest) finalSegments.push({ type: 'text', content: rest });
  }

  return finalSegments;
};

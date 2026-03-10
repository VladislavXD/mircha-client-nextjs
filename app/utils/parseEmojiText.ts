export interface EmojiTextSegment {
  type: 'text' | 'emoji' | 'mention' | 'spoiler' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'highlight';
  content: string;
  emojiUrl?: string;
  mentionId?: string;
  mentionName?: string;
  children?: EmojiTextSegment[]; // для spoiler и форматирования
}

/**
 * Парсит текст с маркерами emoji, mention, spoiler и HTML форматированием
 * @param text - Текст с маркерами [emoji:0], [mention:id|name], [spoiler]...[/spoiler], <b>, <i>, <u>, <s>, <mark>
 * @param emojiUrls - Массив URL emoji
 * @returns Массив сегментов для рендеринга
 */
export const parseEmojiText = (text: string, emojiUrls: string[] = []): EmojiTextSegment[] => {
  if (!text) return [];
  
  const segments: EmojiTextSegment[] = [];
  let i = 0;

  while (i < text.length) {
    // mention
    if (text.slice(i, i + 9) === "[mention:") {
      const end = text.indexOf("]", i);
      if (end !== -1) {
        const content = text.slice(i + 9, end);
        const [id, name] = content.split("|");
        if (id && name) {
          segments.push({
            type: 'mention',
            content: text.slice(i, end + 1),
            mentionId: id,
            mentionName: name,
          });
          i = end + 1;
          continue;
        }
      }
    }

    // emoji
    if (text.slice(i, i + 7) === "[emoji:") {
      const end = text.indexOf("]", i);
      if (end !== -1) {
        const indexStr = text.slice(i + 7, end);
        const index = parseInt(indexStr, 10);
        const url = emojiUrls[index];
        if (Number.isFinite(index)) {
          segments.push({
            type: 'emoji',
            content: text.slice(i, end + 1),
            emojiUrl: url,
          });
          i = end + 1;
          continue;
        }
      }
    }

    // spoiler
    if (text.slice(i, i + 9) === "[spoiler]") {
      const close = "[/spoiler]";
      const closeIndex = text.indexOf(close, i + 9);
      if (closeIndex !== -1) {
        const inner = text.slice(i + 9, closeIndex);
        // Рекурсивно парсим содержимое спойлера
        const children = parseEmojiText(inner, emojiUrls);
        segments.push({
          type: 'spoiler',
          content: inner,
          children,
        });
        i = closeIndex + close.length;
        continue;
      }
    }

    // HTML форматирование: <b>, <i>, <u>, <s>, <mark>
    if (text[i] === '<') {
      const closeTag = text.indexOf('>', i);
      if (closeTag !== -1) {
        const tagContent = text.slice(i, closeTag + 1);
        
        // Bold
        if (tagContent === '<b>' || tagContent === '<strong>') {
          const closeIndex = text.indexOf('</b>', i);
          const closeIndex2 = text.indexOf('</strong>', i);
          const actualClose = closeIndex !== -1 && (closeIndex2 === -1 || closeIndex < closeIndex2) 
            ? closeIndex 
            : closeIndex2;
          
          if (actualClose !== -1) {
            const inner = text.slice(closeTag + 1, actualClose);
            const children = parseEmojiText(inner, emojiUrls);
            segments.push({
              type: 'bold',
              content: inner,
              children,
            });
            i = actualClose + (text[actualClose + 2] === 'b' ? 4 : 9); // </b> or </strong>
            continue;
          }
        }
        
        // Italic
        if (tagContent === '<i>' || tagContent === '<em>') {
          const closeIndex = text.indexOf('</i>', i);
          const closeIndex2 = text.indexOf('</em>', i);
          const actualClose = closeIndex !== -1 && (closeIndex2 === -1 || closeIndex < closeIndex2) 
            ? closeIndex 
            : closeIndex2;
          
          if (actualClose !== -1) {
            const inner = text.slice(closeTag + 1, actualClose);
            const children = parseEmojiText(inner, emojiUrls);
            segments.push({
              type: 'italic',
              content: inner,
              children,
            });
            i = actualClose + (text[actualClose + 2] === 'i' ? 4 : 5); // </i> or </em>
            continue;
          }
        }
        
        // Underline
        if (tagContent === '<u>') {
          const closeIndex = text.indexOf('</u>', i);
          if (closeIndex !== -1) {
            const inner = text.slice(closeTag + 1, closeIndex);
            const children = parseEmojiText(inner, emojiUrls);
            segments.push({
              type: 'underline',
              content: inner,
              children,
            });
            i = closeIndex + 4; // </u>
            continue;
          }
        }
        
        // Strikethrough
        if (tagContent === '<s>' || tagContent === '<strike>' || tagContent === '<del>') {
          const closeIndex = text.indexOf('</s>', i);
          const closeIndex2 = text.indexOf('</strike>', i);
          const closeIndex3 = text.indexOf('</del>', i);
          const actualClose = [closeIndex, closeIndex2, closeIndex3]
            .filter(idx => idx !== -1)
            .sort((a, b) => a - b)[0];
          
          if (actualClose !== undefined && actualClose !== -1) {
            const inner = text.slice(closeTag + 1, actualClose);
            const children = parseEmojiText(inner, emojiUrls);
            segments.push({
              type: 'strikethrough',
              content: inner,
              children,
            });
            // Определяем длину закрывающего тега
            let closeLength = 4; // </s>
            if (text.slice(actualClose, actualClose + 9) === '</strike>') closeLength = 9;
            if (text.slice(actualClose, actualClose + 6) === '</del>') closeLength = 6;
            i = actualClose + closeLength;
            continue;
          }
        }
        
        // Highlight
        if (tagContent === '<mark>') {
          const closeIndex = text.indexOf('</mark>', i);
          if (closeIndex !== -1) {
            const inner = text.slice(closeTag + 1, closeIndex);
            const children = parseEmojiText(inner, emojiUrls);
            segments.push({
              type: 'highlight',
              content: inner,
              children,
            });
            i = closeIndex + 7; // </mark>
            continue;
          }
        }
      }
    }

    // plain text chunk
    // NOTE: if the "special token" at position i failed to parse (e.g. unclosed tag),
    // nextTokenPos will equal i → chunk would be "", i wouldn't advance → infinite loop.
    // Guard: always advance by at least 1 character.
    const nextTokenPos = (() => {
      const a = text.indexOf("[mention:", i);
      const b = text.indexOf("[emoji:", i);
      const c = text.indexOf("[spoiler]", i);
      const d = text.indexOf("<b>", i);
      const e = text.indexOf("<i>", i);
      const f = text.indexOf("<u>", i);
      const g = text.indexOf("<s>", i);
      const h = text.indexOf("<mark>", i);
      const candidates = [a, b, c, d, e, f, g, h].filter((x) => x !== -1 && x > i);
      return candidates.length ? Math.min(...candidates) : -1;
    })();

    const chunk = nextTokenPos === -1 ? text.slice(i) : text.slice(i, nextTokenPos);
    if (chunk) {
      segments.push({
        type: 'text',
        content: chunk,
      });
    } else {
      // Failsafe: token at position i failed to parse but nextTokenPos === i.
      // Push the current character as plain text to guarantee progress.
      segments.push({ type: 'text', content: text[i] });
    }
    i = nextTokenPos === -1 ? text.length : nextTokenPos > i ? nextTokenPos : i + 1;
  }

  return segments;
};



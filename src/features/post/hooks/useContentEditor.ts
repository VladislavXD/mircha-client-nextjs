import { useRef, useState, useCallback, useEffect } from "react";

/**
 * Hook для управления contentEditable редактором
 * Включает сериализацию/десериализацию DOM и управление контентом
 */
export const useContentEditor = (selectedEmojis: string[]) => {
  const [postContent, setPostContent] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  /**
   * serializeDOM: Конвертирует DOM childNodes редактора в строку с токенами
   * [mention:id|name], [emoji:index], [spoiler]...[/spoiler]
   * Также сохраняет HTML форматирование (bold, italic, underline, strike, mark)
   */
  const serializeDOM = useCallback((nodeList: NodeListOf<ChildNode>): string => {
    let acc = "";
    nodeList.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        acc += node.textContent || "";
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const el = node as HTMLElement;

      if (el.tagName === "BR") {
        acc += "\n";
        return;
      }

      const mentionId = el.getAttribute("data-mention-id");
      if (mentionId) {
        const mentionName = el.textContent?.replace(/^@/, "") || "user";
        acc += `[mention:${mentionId}|${mentionName}]`;
        return;
      }

      const emojiIndex = el.getAttribute("data-emoji-index");
      if (emojiIndex) {
        acc += `[emoji:${emojiIndex}]`;
        return;
      }

      const isSpoiler = el.getAttribute("data-spoiler") === "true";
      if (isSpoiler) {
        acc += "[spoiler]";
        acc += serializeDOM(el.childNodes as unknown as NodeListOf<ChildNode>);
        acc += "[/spoiler]";
        return;
      }

      // Обрабатываем HTML форматирование
      const tagName = el.tagName.toLowerCase();
      switch (tagName) {
        case 'b':
        case 'strong':
          acc += "<b>";
          acc += serializeDOM(el.childNodes as unknown as NodeListOf<ChildNode>);
          acc += "</b>";
          return;
        case 'i':
        case 'em':
          acc += "<i>";
          acc += serializeDOM(el.childNodes as unknown as NodeListOf<ChildNode>);
          acc += "</i>";
          return;
        case 'u':
          acc += "<u>";
          acc += serializeDOM(el.childNodes as unknown as NodeListOf<ChildNode>);
          acc += "</u>";
          return;
        case 'strike':
        case 's':
        case 'del':
          acc += "<s>";
          acc += serializeDOM(el.childNodes as unknown as NodeListOf<ChildNode>);
          acc += "</s>";
          return;
        case 'mark':
        case 'span':
          // Проверяем, есть ли background-color (highlight)
          const style = el.style.backgroundColor || el.style.background;
          if (style && style !== 'transparent' && style !== 'rgba(0, 0, 0, 0)') {
            acc += "<mark>";
            acc += serializeDOM(el.childNodes as unknown as NodeListOf<ChildNode>);
            acc += "</mark>";
            return;
          }
          break;
      }

      acc += serializeDOM(el.childNodes as unknown as NodeListOf<ChildNode>);
    });
    return acc;
  }, []);

  /**
   * renderToDOM: Конвертирует строку с токенами в DOM elements внутри редактора
   */
  const renderToDOM = useCallback(
    (text: string) => {
      const editor = editorRef.current;
      if (!editor || isUpdatingRef.current) return;

      isUpdatingRef.current = true;
      editor.innerHTML = "";

      if (!text) {
        isUpdatingRef.current = false;
        return;
      }

      const fragment = document.createDocumentFragment();
      let i = 0;

      const pushTextWithNewlines = (plain: string) => {
        const lines = plain.split("\n");
        lines.forEach((line, idx) => {
          if (line) fragment.appendChild(document.createTextNode(line));
          if (idx < lines.length - 1) fragment.appendChild(document.createElement("br"));
        });
      };

      while (i < text.length) {
        // mention
        if (text.slice(i, i + 9) === "[mention:") {
          const end = text.indexOf("]", i);
          if (end !== -1) {
            const content = text.slice(i + 9, end);
            const [id, name] = content.split("|");
            if (id && name) {
              const span = document.createElement("span");
              span.className =
                "inline-block px-2 py-0.5 mx-0.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors cursor-pointer";
              span.contentEditable = "false";
              span.setAttribute("data-mention-id", id);
              span.textContent = `@${name}`;
              fragment.appendChild(span);
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
            const url = selectedEmojis[index];
            if (Number.isFinite(index) && url) {
              const span = document.createElement("span");
              span.className = "inline-block align-middle mx-0.5";
              span.contentEditable = "false";
              span.setAttribute("data-emoji-index", String(index));
              const img = document.createElement("img");
              img.src = url;
              img.alt = "emoji";
              img.className = "w-6 h-6 object-contain";
              img.width = 24;
              img.height = 24;
              span.appendChild(img);
              fragment.appendChild(span);
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
            const span = document.createElement("span");
            span.setAttribute("data-spoiler", "true");
            span.className = "mc-spoiler";
            span.textContent = inner;
            fragment.appendChild(span);
            i = closeIndex + close.length;
            continue;
          }
        }

        // HTML форматирование
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
                const bold = document.createElement('strong');
                bold.textContent = inner;
                fragment.appendChild(bold);
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
                const italic = document.createElement('em');
                italic.textContent = inner;
                fragment.appendChild(italic);
                i = actualClose + (text[actualClose + 2] === 'i' ? 4 : 5); // </i> or </em>
                continue;
              }
            }
            
            // Underline
            if (tagContent === '<u>') {
              const closeIndex = text.indexOf('</u>', i);
              if (closeIndex !== -1) {
                const inner = text.slice(closeTag + 1, closeIndex);
                const underline = document.createElement('u');
                underline.textContent = inner;
                fragment.appendChild(underline);
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
                const strike = document.createElement('strike');
                strike.textContent = inner;
                fragment.appendChild(strike);
                i = actualClose + (text[actualClose + 2] === 's' ? 4 : 9); // </s> or </strike>
                continue;
              }
            }
            
            // Highlight
            if (tagContent === '<mark>') {
              const closeIndex = text.indexOf('</mark>', i);
              if (closeIndex !== -1) {
                const inner = text.slice(closeTag + 1, closeIndex);
                const mark = document.createElement('mark');
                mark.style.backgroundColor = 'rgba(255, 235, 59, 0.3)'; // Желтый 30% прозрачности
                mark.style.color = 'inherit'; // Наследуем цвет текста
                mark.textContent = inner;
                fragment.appendChild(mark);
                i = closeIndex + 7; // </mark>
                continue;
              }
            }
          }
        }

        // plain text chunk
        const nextTokenPos = (() => {
          const a = text.indexOf("[mention:", i);
          const b = text.indexOf("[emoji:", i);
          const c = text.indexOf("[spoiler]", i);
          const d = text.indexOf("<b>", i);
          const e = text.indexOf("<i>", i);
          const f = text.indexOf("<u>", i);
          const g = text.indexOf("<s>", i);
          const h = text.indexOf("<mark>", i);
          const candidates = [a, b, c, d, e, f, g, h].filter((x) => x !== -1);
          return candidates.length ? Math.min(...candidates) : -1;
        })();

        const chunk = nextTokenPos === -1 ? text.slice(i) : text.slice(i, nextTokenPos);
        pushTextWithNewlines(chunk);
        i = nextTokenPos === -1 ? text.length : nextTokenPos;
      }

      editor.appendChild(fragment);
      isUpdatingRef.current = false;
    },
    [selectedEmojis]
  );

  // Sync DOM when postContent changes externally
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (document.activeElement === editor) return;
    renderToDOM(postContent);
  }, [postContent, renderToDOM]);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      if (isUpdatingRef.current) return;
      const next = serializeDOM(e.currentTarget.childNodes as unknown as NodeListOf<ChildNode>);
      setPostContent(next);
    },
    [serializeDOM]
  );

  const clearContent = useCallback(() => {
    setPostContent("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  }, []);

  return {
    postContent,
    setPostContent,
    editorRef,
    serializeDOM,
    renderToDOM,
    handleInput,
    clearContent,
  };
};

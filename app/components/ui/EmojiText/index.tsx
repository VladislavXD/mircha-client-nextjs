import React, { useMemo } from "react";
import {
  parseEmojiText,
  EmojiTextSegment,
} from "../../../utils/parseEmojiText";

/**
 * Компонент для рендеринга текста с emoji
 */
export interface EmojiTextProps {
  text: string;
  emojiUrls?: string[];
  className?: string;
}

export const EmojiText: React.FC<EmojiTextProps> = ({
  text,
  emojiUrls = [],
  className = "",
}) => {
  const segments = useMemo(
    () => parseEmojiText(text, emojiUrls),
    [text, Array.isArray(emojiUrls) ? emojiUrls.join("|") : ""]
  );

  function extractUrls(text: string): string[] {
    const urlRegex = /((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?)/gi;
    return text.match(urlRegex) || [];
  }

  return (
    <div className={className}>
      {segments.map((segment: EmojiTextSegment, index: number) => {
        const urls = extractUrls(segment.content);

        if (urls.length > 0) {
          return (
            <span key={`seg-${index}`}>
              {segment.content.split(urls[0]).map((part, i) => (
                <React.Fragment key={`seg-${index}-part-${i}`}>
                  {part}
                  {urls[i] && (
                    <a
                      href={urls[i]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {urls[i]}
                    </a>
                  )}
                </React.Fragment>
              ))}
            </span>
          );
        }
        

        if (segment.type === "emoji" && segment.emojiUrl) {
          return (
            <img
              key={`seg-${index}`}
              src={segment.emojiUrl}
              alt="emoji"
              className="inline-block w-5 h-5 mx-0.5 align-text-bottom hover:scale-110 transition-transform duration-200"
              style={{ verticalAlign: "text-bottom" }}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          );
        }
        return <span key={`seg-${index}`}>{segment.content}</span>;
      })}
    </div>
  );
};

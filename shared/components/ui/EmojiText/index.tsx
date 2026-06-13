import React, { useMemo } from "react";
import Link from "next/link";
import { Spoiler } from "spoiled";

import {
  parseEmojiText,
  EmojiTextSegment,
} from "../../../../app/utils/parseEmojiText";


import { useUserProfile } from "@/src/features/profile";
import UserComponent from "@/shared/components/ui/User";

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
    [text, Array.isArray(emojiUrls) ? emojiUrls.join("|") : ""],
  );

  function extractUrls(text: string): string[] {
    const urlRegex = /((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?)/gi;

    return text.match(urlRegex) || [];
  }

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + "...";
  };

  // Функция для форматирования даты
  const formatDate = (date: Date | undefined | string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  
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
                      className="text-blue-500 hover:underline break-all"
                      href={urls[i]}
                      rel="noopener noreferrer"
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
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
              alt="emoji"
              className="inline-block w-5 h-5 mx-0.5 align-text-bottom hover:scale-110 transition-transform duration-200"
              decoding="async"
              draggable={false}
              loading="lazy"
              src={segment.emojiUrl}
              style={{ verticalAlign: "text-bottom" }}
            />
          );
        }

        if (segment.type === "spoiler") {
          return <SpoilerSegment key={`seg-${index}`} segment={segment} />;
        }

        // HTML форматирование
        if (segment.type === "bold") {
          return (
            <strong key={`seg-${index}`}>
              {segment.children?.map((child, idx) => (
                <SegmentRenderer key={`bold-${idx}`} segment={child} />
              ))}
            </strong>
          );
        }

        if (segment.type === "italic") {
          return (
            <em key={`seg-${index}`}>
              {segment.children?.map((child, idx) => (
                <SegmentRenderer key={`italic-${idx}`} segment={child} />
              ))}
            </em>
          );
        }

        if (segment.type === "underline") {
          return (
            <u key={`seg-${index}`}>
              {segment.children?.map((child, idx) => (
                <SegmentRenderer key={`underline-${idx}`} segment={child} />
              ))}
            </u>
          );
        }

        if (segment.type === "strikethrough") {
          return (
            <s key={`seg-${index}`}>
              {segment.children?.map((child, idx) => (
                <SegmentRenderer key={`strike-${idx}`} segment={child} />
              ))}
            </s>
          );
        }

        if (segment.type === "highlight") {
          return (
            <mark
              key={`seg-${index}`}
              style={{
                backgroundColor: "rgba(255, 235, 59, 0.3)",
                color: "inherit",
              }}
            >
              {segment.children?.map((child, idx) => (
                <SegmentRenderer key={`highlight-${idx}`} segment={child} />
              ))}
            </mark>
          );
        }

        if (segment.type === "mention" && segment.mentionId) {
          const { data: User } = useUserProfile(segment.mentionId);
          console.log(User?._count?.followers + " User from mention");
          return (
            <UserComponent
              key={`seg-${index}`}
              userId={segment.mentionId}
              name={`${segment.mentionName}` }
              variant="mention"  
              avatarUrl={User?.avatarUrl ? User.avatarUrl : "/default-avatar.png"}
              bio={User?.bio}
              backgroundUrl={User?.backgroundUrl}
              avatarFrameUrl={User?.avatarFrameUrl}
              usernameFrameUrl={User?.usernameFrameUrl}
              followersCount={User?._count?.followers}
              followingCount={User?._count?.following}
              createdAt={User?.createdAt} 
              showFollowBadge={true}


            />
            
          );
        }

        return <span key={`seg-${index}`}>{segment.content}</span>;
      })}
    </div>
  );
};

/**
 * SegmentRenderer: рекурсивный рендерер для вложенных сегментов
 */
const SegmentRenderer: React.FC<{ segment: EmojiTextSegment }> = ({
  segment,
}) => {
  if (segment.type === "text") {
    return <>{segment.content}</>;
  }

  if (segment.type === "emoji" && segment.emojiUrl) {
    return (
      <img
        alt="emoji"
        className="inline-block w-5 h-5 mx-0.5 align-text-bottom"
        src={segment.emojiUrl}
        style={{ verticalAlign: "text-bottom" }}
      />
    );
  }

  if (segment.type === "mention") {
    return (
      <Link
        className="text-primary hover:underline"
        href={`/user/${segment.mentionId}`}
      >
        @{segment.mentionName || "user"}
      </Link>
    );
  }

  if (segment.type === "spoiler") {
    return <SpoilerSegment segment={segment} />;
  }

  if (segment.type === "bold") {
    return (
      <strong>
        {segment.children?.map((child, idx) => (
          <SegmentRenderer key={`bold-${idx}`} segment={child} />
        ))}
      </strong>
    );
  }

  if (segment.type === "italic") {
    return (
      <em>
        {segment.children?.map((child, idx) => (
          <SegmentRenderer key={`italic-${idx}`} segment={child} />
        ))}
      </em>
    );
  }

  if (segment.type === "underline") {
    return (
      <u>
        {segment.children?.map((child, idx) => (
          <SegmentRenderer key={`underline-${idx}`} segment={child} />
        ))}
      </u>
    );
  }

  if (segment.type === "strikethrough") {
    return (
      <s>
        {segment.children?.map((child, idx) => (
          <SegmentRenderer key={`strike-${idx}`} segment={child} />
        ))}
      </s>
    );
  }

  if (segment.type === "highlight") {
    return (
      <mark
        style={{
          backgroundColor: "rgba(255, 235, 59, 0.3)",
          color: "inherit",
        }}
      >
        {segment.children?.map((child, idx) => (
          <SegmentRenderer key={`highlight-${idx}`} segment={child} />
        ))}
      </mark>
    );
  }

  return null;
};

/**
 * SpoilerSegment: рендерит спойлер используя библиотеку spoiled
 * Раскрывается по клику
 */
const SpoilerSegment: React.FC<{ segment: EmojiTextSegment }> = ({
  segment,
}) => {
  return (
    <span onClick={(e) => e.stopPropagation()}>
      <Spoiler className="cursor-pointer" revealOn="click">
        {segment.children?.map((child, idx) => (
          <SegmentRenderer key={`spoiler-child-${idx}`} segment={child} />
        ))}
      </Spoiler>
    </span>
  );
};

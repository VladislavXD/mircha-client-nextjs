import React, { useMemo } from "react";
import Link from "next/link";
import { Spoiler } from "spoiled";

import {
  parseEmojiText,
  EmojiTextSegment,
} from "../../../../app/utils/parseEmojiText";
import SmartTooltip from "../SmartTooltip";

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
            // <SmartTooltip
            //   key={`tooltip-${index}`}
            //   // Используем bio для tooltip, а description для основного отображения
            //   content={
            //     <div className="relative rounded-lg min-w-[280px] max-w-[320px] shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            //       {/* Background видео на весь tooltip */}
            //       <div className="relative h-32">
            //         {User?.backgroundUrl ? (
            //           <video
            //             autoPlay
            //             loop
            //             muted
            //             playsInline
            //             className="absolute inset-0 w-full h-full object-cover z-0"
            //           >
            //             <source src={User?.backgroundUrl} type="video/mp4" />
            //           </video>
            //         ) : (
            //           <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 z-0" />
            //         )}
            //         {/* Затемняющий слой */}
            //         <div className="absolute inset-0 bg-black/50 z-10" />

            //         {/* Контент поверх видео */}
            //         <div className="relative z-20 p-4">
            //           <div className="flex items-start gap-3">
            //             {/* Аватарка слева */}
            //             <div className="flex-shrink-0">
            //               <div className="relative">
            //                 {/* Рамка для аватара если есть */}
            //                 {User?.avatarFrameUrl &&
            //                   User?.avatarFrameUrl.trim() !== "" && (
            //                     <div
            //                       className="absolute inset-0 w-full h-full pointer-events-none select-none z-100"
            //                       style={{
            //                         backgroundImage: `url(${User?.avatarFrameUrl})`,
            //                         backgroundSize: "auto 250%",
            //                         backgroundPosition: "center",
            //                         backgroundRepeat: "no-repeat",
            //                       }}
            //                     />
            //                   )}
            //                 <img
            //                   alt={User?.name || "User"}
            //                   className="w-16 h-16 rounded-lg object-cover border-2 border-white/80 relative z-0"
            //                   src={User?.avatarUrl || "/default-avatar.png"}
            //                   onError={(e) => {
            //                     const target = e.target as HTMLImageElement;

            //                     target.src = "/default-avatar.png";
            //                   }}
            //                 />
            //               </div>
            //             </div>

            //             {/* Информация справа */}
            //             <div className="flex-1 min-w-0">
            //               {/* Имя желтым цветом */}
            //               <div className="mb-2">
            //                 {User?.usernameFrameUrl &&
            //                 User?.usernameFrameUrl.trim() !== "" ? (
            //                   <div className="relative inline-block">
            //                     <div
            //                       className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
            //                       style={{
            //                         backgroundImage: `url(${User?.usernameFrameUrl})`,
            //                         backgroundRepeat: "repeat-x",
            //                         backgroundSize: "auto 100%",
            //                         backgroundPosition: "left center",
            //                       }}
            //                     />
            //                     <span className="relative z-0 px-1 text-yellow-400 font-bold text-base drop-shadow-lg">
            //                       {User?.name}
            //                     </span>
            //                   </div>
            //                 ) : (
            //                   <span className="text-yellow-400 font-bold text-base drop-shadow-lg">
            //                     {User?.name}
            //                   </span>
            //                 )}
            //               </div>

            //               {/* Описание (обрезанное) */}
            //               <div className="mb-1">
            //                 <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">
            //                   {truncateText(User?.bio || "Нет описания", 80)}
            //                 </p>
            //               </div>

            //               {/* Дата создания */}
            //               {User?.createdAt && (
            //                 <div className="text-white/70 text-xs drop-shadow-md">
            //                   Создан: {formatDate(User?.createdAt)}
            //                 </div>
            //               )}
            //             </div>
            //           </div>
            //         </div>
            //       </div>

            //       {/* Тонкая разделительная полоса */}
            //       <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

            //       {/* Нижняя секция с подписчиками и кнопкой */}
            //       <div className="p-4 bg-white dark:bg-gray-800" />
            //     </div>
            //   }
            // >
            //   <Link
            //     key={`seg-${index}`}
            //     className="text-primary hover:underline inline"
            //     href={`/user/${segment.mentionId}`}
            //     onClick={(e) => e.stopPropagation()}
            //   >
            //     @{segment.mentionName || "user"}
            //   </Link>
            // </SmartTooltip>
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

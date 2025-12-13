import React, { useMemo } from "react";
import Link from "next/link";
import {
  parseEmojiText,
  EmojiTextSegment,
} from "../../../../app/utils/parseEmojiText";
import { useUserProfile } from "@/src/features/profile";
import SmartTooltip from "../SmartTooltip";
import { formatDate } from "date-fns";

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


  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Функция для форматирования даты
  const formatDate = (date: Date | undefined | string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

        if (segment.type === "mention" && segment.mentionId) {
          const { data: User } = useUserProfile(segment.mentionId);
          
          return (
            <SmartTooltip
              key={`tooltip-${index}`}
              // Используем bio для tooltip, а description для основного отображения
              content={
                <div className="relative rounded-lg min-w-[280px] max-w-[320px] shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            {/* Background видео на весь tooltip */}
            <div className="relative h-32">
              {User?.backgroundUrl ? (
                <video 
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={User?.backgroundUrl} type="video/mp4" />
                </video>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 z-0" />
              )}
              {/* Затемняющий слой */}
              <div className="absolute inset-0 bg-black/50 z-10" />
              
              {/* Контент поверх видео */}
              <div className="relative z-20 p-4">
                <div className="flex items-start gap-3">
                  {/* Аватарка слева */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {/* Рамка для аватара если есть */}
                      {User?.avatarFrameUrl && User?.avatarFrameUrl.trim() !== "" && (
                        <div 
                          className="absolute inset-0 w-full h-full pointer-events-none select-none z-100"
                          style={{
                            backgroundImage: `url(${User?.avatarFrameUrl})`,
                            backgroundSize: 'auto 250%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                      )}
                      <img
                        src={User?.avatarUrl || "/default-avatar.png"}
                        alt={User?.name || "User"}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-white/80 relative z-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Информация справа */}
                  <div className="flex-1 min-w-0">
                    {/* Имя желтым цветом */}
                    <div className="mb-2">
                      {User?.usernameFrameUrl && User?.usernameFrameUrl.trim() !== "" ? (
                        <div className="relative inline-block">
                          <div
                            className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                            style={{
                              backgroundImage: `url(${User?.usernameFrameUrl})`,
                              backgroundRepeat: "repeat-x",
                              backgroundSize: "auto 100%",
                              backgroundPosition: "left center",
                            }}
                          />
                          <span className="relative z-0 px-1 text-yellow-400 font-bold text-base drop-shadow-lg">
                            {User?.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-yellow-400 font-bold text-base drop-shadow-lg">
                          {User?.name}
                        </span>
                      )}
                    </div>
                    
                    {/* Описание (обрезанное) */}
                    <div className="mb-1">
                      <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">
                        {truncateText(User?.bio || "Нет описания", 80)}
                      </p>
                    </div>
                    
                    {/* Дата создания */}
                    {User?.createdAt && (
                      <div className="text-white/70 text-xs drop-shadow-md">
                        Создан: {formatDate(User?.createdAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Тонкая разделительная полоса */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            
            {/* Нижняя секция с подписчиками и кнопкой */}
            <div className="p-4 bg-white dark:bg-gray-800">

            </div>
          </div>
              }
            >
              <Link
                key={`seg-${index}`}
                href={`/user/${segment.mentionId}`}
                className="text-primary hover:underline inline"
              >
                @{segment.mentionName || "user"}
              </Link>
            </SmartTooltip>
          );
        }
        return <span key={`seg-${index}`}>{segment.content}</span>;
      })}
    </div>
  );
};

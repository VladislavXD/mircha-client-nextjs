import { Badge, User as NextUser } from "@heroui/react";
import React from "react";
import SmartTooltip from "../SmartTooltip";
import Image from "next/image";
import { useOnlineStatus } from "@/src/features/chat";




type Props = {
  userId?: string
  name?: string;
  avatarUrl: string;
  description?: string;
  className?: string;
  usernameFrameUrl?: string;
  avatarFrameUrl?: string; 
  backgroundUrl?: string; 
  dateOfBirth?: Date;
  bio?: string; // Добавляем биографию пользователя
  createdAt?: Date; // Добавляем дату создания
  followersCount?: number; // Количество подписчиков
  followingCount?: number; // Количество подписок
  isFollowing?: boolean; // Подписан ли текущий пользователь
  onFollowToggle?: () => void; // Функция для подписки/отписки
};

const User = ({
  userId,
  name = "",
  avatarUrl = "",
  description = "",
  className = "",
  usernameFrameUrl = "",
  avatarFrameUrl = "",
  backgroundUrl = "",
  dateOfBirth,
  bio = "",
  createdAt,
  followersCount = 0,
  followingCount = 0,
  isFollowing = false,
  onFollowToggle,
}: Props) => {
  // Функция для обрезки текста описания
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Функция для форматирования даты
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Используем bio для tooltip, а description для основного отображения
  const tooltipDescription = bio || description || "Нет описания";


  const { isOnline } = useOnlineStatus(userId);
  
  return (
    <>
      <SmartTooltip
        content={
          <div className="relative rounded-lg min-w-[280px] max-w-[320px] shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            {/* Background видео на весь tooltip */}
            <div className="relative h-32">
              {backgroundUrl ? (
                <video 
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={backgroundUrl} type="video/mp4" />
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
                      {avatarFrameUrl && avatarFrameUrl.trim() !== "" && (
                        <div 
                          className="absolute inset-0 w-full h-full pointer-events-none select-none z-100"
                          style={{
                            backgroundImage: `url(${avatarFrameUrl})`,
                            backgroundSize: 'auto 250%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                      )}
                      <Image
                        width={64}
                        height={64}
                        unoptimized={false}
                        quality={75}
                        loading="eager"
                        src={avatarUrl || "/default-avatar.png"}
                        alt={name || "User"}
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
                      {usernameFrameUrl && usernameFrameUrl.trim() !== "" ? (
                        <div className="relative inline-block">
                          <div
                            className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                            style={{
                              backgroundImage: `url(${usernameFrameUrl})`,
                              backgroundRepeat: "repeat-x",
                              backgroundSize: "auto 100%",
                              backgroundPosition: "left center",
                            }}
                          />
                          <span className="relative z-0 px-1 text-yellow-400 font-bold text-base drop-shadow-lg">
                            {name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-yellow-400 font-bold text-base drop-shadow-lg">
                          {name}
                        </span>
                      )}
                    </div>
                    
                    {/* Описание (обрезанное) */}
                    <div className="mb-1">
                      <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">
                        {truncateText(tooltipDescription)}
                      </p>
                    </div>
                    
                    {/* Дата создания */}
                    {createdAt && (
                      <div className="text-white/70 text-xs drop-shadow-md">
                        Создан: {formatDate(createdAt)}
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
              <div className="flex items-center justify-between">
                {/* Статистика подписчиков - всегда отображается */}
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-gray-800 dark:text-gray-200">
                      {followersCount || 0}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Подписчики</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-800 dark:text-gray-200">
                      {followingCount || 0}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Подписки</div>
                  </div>
                </div>
                
                {/* Кнопка подписки */}
                {onFollowToggle ? (
                  <button
                    onClick={onFollowToggle}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isFollowing ? 'Отписаться' : 'Подписаться'}
                  </button>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        }
        className="z-50"
        placement="top"
        showArrow
      >
        <div className="relative inline-block">
          {/* Шапка Санты над аватаром */}
          <Image
            src="/winterIcons/santahat.png" 
            alt="Santa hat decoration"
            width={60}
            height={60}
            className="absolute -top-6 -left-3 z-50 pointer-events-none select-none"
            priority={false}
            unoptimized
          />
          
          <Badge color={isOnline ? "success" : "default"} placement="bottom-right" shape="circle" content="" className="mb-1 ">
<></>
          </Badge>
          <NextUser
            name={name}
            className={className}
            description={
              description ? (
                usernameFrameUrl && usernameFrameUrl.trim() !== "" ? (
                  <div className="relative inline-block">
                    <div
                    className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                    style={{
                      backgroundImage: `url(${usernameFrameUrl})`,
                      backgroundRepeat: "repeat-x",
                      backgroundSize: "auto 200%",
                      backgroundPosition: "left center",
                    }}
                    />
                    <span className="relative z-0 px-1">{description}</span>
                  </div>
                ) : (
                  description
                )
              ) : undefined
            }
            avatarProps={{
              isBordered: true,
              src: avatarUrl || "/default-avatar.png", // Убеждаемся, что src не пустой
            }}
          />
          

        </div>
  </SmartTooltip>
    </>
  );
};

export default User;

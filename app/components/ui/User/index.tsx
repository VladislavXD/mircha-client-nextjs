import { User as NextUser, Tooltip, Button } from "@heroui/react";
import React, { useState, useEffect } from "react";

type Props = {
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

  // Отладка данных подписчиков
  console.log('User component props:', {
    name,
    followersCount,
    followingCount,
    isFollowing,
    bio
  });

  // Определяем, является ли устройство мобильным
  const [isMobile, setIsMobile] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Закрытие tooltip при клике вне области на мобильных устройствах
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isTooltipOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-tooltip-content]') && !target.closest('[data-tooltip-trigger]')) {
          setIsTooltipOpen(false);
        }
      }
    };

    if (isMobile) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobile, isTooltipOpen]);

  // Обработчик клика для мобильных устройств
  const handleMobileClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsTooltipOpen(!isTooltipOpen);
    }
  };

  return (
    <>
      <Tooltip
        isOpen={isMobile ? isTooltipOpen : undefined}
        content={
          <div className="relative rounded-lg min-w-[280px] max-w-[320px] shadow-lg overflow-hidden bg-white dark:bg-gray-800" data-tooltip-content>
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
                          className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
                          style={{
                            backgroundImage: `url(${avatarFrameUrl})`,
                            backgroundSize: 'auto 250%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                      )}
                      <img
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Данные: {followersCount}/{followingCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
        className="z-50"
        placement="top"
        showArrow
        delay={isMobile ? 0 : 300}
        closeDelay={0}
        shouldCloseOnBlur={!isMobile}
        onOpenChange={(isOpen) => {
          if (isMobile) {
            setIsTooltipOpen(isOpen);
          }
        }}
      >
        <div onClick={handleMobileClick}>
          <NextUser
            name={
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
                  <span className="relative z-0 px-1">{name}</span>
                </div>
              ) : (
                name
              )
            }
            className={className}
            description={description}
            avatarProps={{
              isBordered: true,
              src: avatarUrl || "/default-avatar.png", // Убеждаемся, что src не пустой
            }}
          />
        </div>
      </Tooltip>
    </>
  );
};

export default User;

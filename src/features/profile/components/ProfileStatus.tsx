"use client";

import React from "react";

interface ProfileStatusProps {
  status?: string;
  onOpen?: () => void;
  isOwner?: boolean;
}

/**
 * Компонент отображения статуса пользователя.
 * Для владельца профиля - кнопка редактирования статуса.
 * Для других - только отображение.
 */
export function ProfileStatus({
  status,
  onOpen,
  isOwner = false,
}: ProfileStatusProps) {
  return (
    <div className="relative inline-flex justify-center md:max-w-[150px] max-w-[130px] md:mt-0 mt-2">
      <div
        className={`
          relative
          bg-neutral-900 dark:bg-white text-white dark:text-black
          text-sm ${status ? "px-3 py-1" : ""}
          rounded-[1rem]
          min-w-[44px] min-h-[24px]
          break-words whitespace-normal text-center shadow-lg
          after:content-['']
          after:absolute
          after:left-1/2 after:-translate-x-1/2
          after:-top-2
          after:w-0 after:h-0
          after:border-l-[6px] after:border-l-transparent
          after:border-r-[6px] after:border-r-transparent
          after:border-b-[6px] after:border-b-neutral-900 dark:after:border-b-white
        `}
      >
        {isOwner ? (
          <button
            className="p-0 h-auto min-w-0 text-xs w-full px-2 py-1 whitespace-normal break-words leading-tight bg-transparent border-none text-current hover:opacity-80 transition-opacity"
            onClick={onOpen}
          >
            {status ? status : "Добавить статус"}
          </button>
        ) : (
          <div className="px-2 py-1 text-xs">{status}</div>
        )}
      </div>
    </div>
  );
}

export default ProfileStatus;

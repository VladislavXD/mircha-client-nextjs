"use client";

import React from "react";

interface ProfileStatusProps {
  status?: string;
  onOpen?: () => void;
  isOwner?: boolean;
}

export function ProfileStatus({
  status,
  onOpen,
  isOwner = false,
}: ProfileStatusProps) {
  const content = status || (isOwner ? "Добавить статус" : null);
  if (!content) return null;

  const bubble = (
    <div className="relative inline-flex max-w-[100px]">
      {/* Tail */}
      <span
        aria-hidden
        className="
          absolute -top-[7px] left-1/2 -translate-x-1/2
          w-0 h-0
          
          border-l-[5px] border-l-transparent
          border-r-[5px] border-r-transparent
          border-b-[7px] border-b-neutral-900 dark:border-b-white
        "
      />
      {/* Bubble */}
      <span
        className="
          block px-2.5 py-1 rounded-[10px]
          bg-neutral-900 dark:bg-white
          text-white dark:text-black
          text-[11px] leading-snug text-center
          break-words whitespace-normal shadow-sm
          max-w-[100px]
        "
      >
        {content}
      </span>
    </div>
  );

  if (isOwner) {
    return (
      <button
        className="mt-2 flex justify-center w-full hover:opacity-75 transition-opacity focus-visible:outline-none l"
        onClick={onOpen}
      >
        {bubble}
      </button>
    );
  }

  return <div className="mt-2 flex justify-center">{bubble}</div>;
}

export default ProfileStatus;
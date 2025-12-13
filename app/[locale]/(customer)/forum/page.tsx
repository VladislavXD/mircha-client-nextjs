"use client";

import React from "react";
import { Spinner } from "@heroui/react";
import { useTheme } from "next-themes";
import ForumHome from "@/shared/components/forum/ForumHome";
import MobileForumExtras from "@/shared/components/forum/MobileForumExtras";

const ForumPage = () => {
  // Фоновая загрузка перенесена внутрь ForumHome
  const { theme } = useTheme();

  // Спиннер на случай SSR-гидратации темы
  // Отдельные загрузчики реализованы внутри секций

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">
      <div className="flex justify-center sm:justify-start mb-4 sm:mb-6">
        <span
          className="font-bold text-inherit flex items-center gap-2"
        >
          <img
            src={theme === "dark" ? "/darkLogo.svg" : "/lightLogo.svg"}
            className="w-8 sm:w-10"
            alt=""
          />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Mirchan - Forum</h1>
        </span>
      </div>

      <ForumHome />

      {/* Мобильные виджеты: внизу страницы */}
      <MobileForumExtras />
    </div>
  );
};

export default ForumPage;

"use client";
import { Badge, Skeleton, Avatar } from "@heroui/react";
import React, { useEffect, useState, useMemo } from "react";
import { useGetUserChats, useOnlineStatus } from "@/src/features/chat";
import { useCurrentUser } from "@/src/features/user";

import Link from "next/link";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

import { Home, MessageCircle, Search, UserCircle, Theater } from "lucide-react";

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setScrollDirection(window.scrollY > lastScrollY ? "down" : "up");
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollDirection;
};


const BottomNav = () => {
  const scrollDirection = useScrollDirection();
  const navClass = scrollDirection === "up" ? "" : "opacity-25 duration-500";

  const pathname = usePathname();
  const { theme } = useTheme();
  
  // Используем новые React Query хуки
  const { user: current, isLoading } = useCurrentUser();
  const { data: chats, refetch } = useGetUserChats();

  // Вычисляем общее количество непрочитанных сообщений
  const totalUnreadCount = useMemo(() => {
    if (!chats) return 0;
    return chats.reduce((sum: number, chat: any) => sum + (chat.unreadCount || 0), 0);
  }, [chats]);


  const avatarUrl = current?.avatarUrl;
  const id = current?.id;

  // Проверяем активность страницы с учетом локализации /ru или /en
  const isActivePage = (path: string) => {
    const cleanPathname = pathname.replace(/^\/(ru|en)/, '') || '/';
    
    if (path === '/') {
      return cleanPathname === '/';
    }
    return cleanPathname === path || cleanPathname.startsWith(`${path}/`);
  };

  // ✅ ИСПРАВЛЕНО: Активная страница = белый/черный, неактивная = серый
  const getIconColor = (isActive: boolean) => {
    const isDark = theme === "dark";
    
    if (isActive) {
      // На активной странице - яркий цвет
      return isDark ? "#ffffff" : "#000000";
    } else {
      // На неактивной странице - серый
      return isDark ? "#6b7280" : "#9ca3af";
    }
  };

   const { isOnline } = useOnlineStatus(id);

  return (
    <>
      {/* Island-style floating navbar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-10 px-4 pb-4 sm:hidden ${navClass}`}
      >
        <div className="mx-auto max-w-md backdrop-blur-lg bg-zinc-100/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex justify-around items-center py-3 px-2">
            {/* Home */}
            <Link 
              href="/" 
              className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 active:scale-90 ${
                isActivePage("/") 
                  ? "bg-zinc-900 dark:bg-zinc-100" 
                  : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <Home
                size={24}
                stroke={isActivePage("/") ? (theme === "dark" ? "#000000" : "#ffffff") : getIconColor(false)}
                strokeWidth={1.5}
                fill="none"
                className="transition-colors ease-out"
              />
            </Link>

            {/* Search */}
            <Link 
              href="/search" 
              className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 active:scale-90 ${
                isActivePage("/search") 
                  ? "bg-zinc-900 dark:bg-zinc-100" 
                  : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <Search
                size={24}
                stroke={isActivePage("/search") ? (theme === "dark" ? "#000000" : "#ffffff") : getIconColor(false)}
                strokeWidth={1.5}
                fill="none"
                className="transition-colors ease-out"
              />
            </Link>

            {/* Forum */}
            <Link 
              href="/forum" 
              className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 active:scale-90 ${
                isActivePage("/forum") 
                  ? "bg-zinc-900 dark:bg-zinc-100" 
                  : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <Theater
                size={24}
                stroke={isActivePage("/forum") ? (theme === "dark" ? "#000000" : "#ffffff") : getIconColor(false)}
                strokeWidth={1.5}
                fill="none"
                className="transition-colors ease-out"
              />
            </Link>

            {/* Chat */}
            <Link
              href="/chat"
              className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 active:scale-90 relative ${
                isActivePage("/chat") 
                  ? "bg-zinc-900 dark:bg-zinc-100" 
                  : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <Badge
                content={totalUnreadCount}
                color="danger"
                size="sm"
                isInvisible={totalUnreadCount === 0}
                placement="top-right"
              >
                <MessageCircle
                  size={24}
                  stroke={isActivePage("/chat") ? (theme === "dark" ? "#000000" : "#ffffff") : getIconColor(false)}
                  strokeWidth={1.5}
                  fill="none"
                  className="transition-colors ease-out"
                />
              </Badge>
            </Link>

            {/* Profile */}
            { isLoading 
            ? (
              <div className="flex items-center justify-center w-12 h-12">
                <Skeleton className="rounded-full w-9 h-9" />
              </div>
            ) 
            : 
            current && (
              <Link 
                href={`/user/${id}`} 
                className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 active:scale-90 ${
                  isActivePage(`/user/${id}`) 
                    ? "bg-zinc-900 dark:bg-zinc-100" 
                    : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <Avatar
                  src={avatarUrl}
                  size="sm"
                  isBordered={isActivePage(`/user/${id}`)}
                  className="w-9 h-9"
                  classNames={{
                    base: isActivePage(`/user/${id}`) ? "ring-2 ring-white dark:ring-black" : ""
                  }}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;

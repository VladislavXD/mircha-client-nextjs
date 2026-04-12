"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Search, Theater } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useCurrentUser } from "@/src/features/user";
import { useGetUserChats } from "@/src/features/chat";

const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const scrollContainer = document.querySelector(
        ".overflow-y-auto.scrollbar-hide",
      );

      if (!scrollContainer) return;

      const currentScrollY = scrollContainer.scrollTop;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      lastScrollY = currentScrollY;
    };

    const scrollContainer = document.querySelector(
      ".overflow-y-auto.scrollbar-hide",
    );

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return scrollDirection;
};

const BottomNav = () => {
  const scrollDirection = useScrollDirection();
  const navClass = scrollDirection === "up" ? "translate-y-0" : "translate-y-[150%]";

  const pathname = usePathname();
  const { theme } = useTheme();

  const { user: current, isLoading } = useCurrentUser();
  const { data: chats } = useGetUserChats();

  const totalUnreadCount = useMemo(() => {
    if (!chats) return 0;
    return chats.reduce(
      (sum: number, chat: any) => sum + (chat.unreadCount || 0),
      0,
    );
  }, [chats]);

  const avatarUrl = current?.avatarUrl;
  const id = current?.id;

  const isActivePage = (path: string) => {
    const cleanPathname = pathname.replace(/^\/(ru|en)/, "") || "/";
    if (path === "/") {
      return cleanPathname === "/";
    }
    return cleanPathname === path || cleanPathname.startsWith(`${path}/`);
  };

  const getIconColor = (isActive: boolean) => {
    const isDark = theme === "dark";
    if (isActive) {
      return isDark ? "#ffffff" : "#000000";
    } else {
      return isDark ? "#6b7280" : "#9ca3af";
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:hidden transition-transform duration-500 ease-in-out ${navClass}`}
      >
        <div className="mx-auto max-w-[280px] backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-[20px] shadow-lg border border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex justify-around items-center py-1.5 px-1">
            {/* Home */}
            <Link
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 ${
                isActivePage("/")
                  ? "bg-neutral-900 dark:bg-white"
                  : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              }`}
              href="/"
            >
              <Home
                className="transition-colors ease-out"
                fill="none"
                size={20}
                stroke={
                  isActivePage("/")
                    ? theme === "dark"
                      ? "#000000"
                      : "#ffffff"
                    : getIconColor(false)
                }
                strokeWidth={2.2}
              />
            </Link>

            {/* Search */}
            <Link
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 ${
                isActivePage("/search")
                  ? "bg-neutral-900 dark:bg-white"
                  : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              }`}
              href="/search"
            >
              <Search
                className="transition-colors ease-out"
                fill="none"
                size={20}
                stroke={
                  isActivePage("/search")
                    ? theme === "dark"
                      ? "#000000"
                      : "#ffffff"
                    : getIconColor(false)
                }
                strokeWidth={2.2}
              />
            </Link>

            {/* Forum */}
            <Link
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 ${
                isActivePage("/forum")
                  ? "bg-neutral-900 dark:bg-white"
                  : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              }`}
              href="/forum"
            >
              <Theater
                className="transition-colors ease-out"
                fill="none"
                size={20}
                stroke={
                  isActivePage("/forum")
                    ? theme === "dark"
                      ? "#000000"
                      : "#ffffff"
                    : getIconColor(false)
                }
                strokeWidth={2.2}
              />
            </Link>

            {/* Chat */}
            <Link
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 relative ${
                isActivePage("/chat")
                  ? "bg-neutral-900 dark:bg-white"
                  : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              }`}
              href="/chat"
            >
              <div className="relative">
                <MessageCircle
                  className="transition-colors ease-out"
                  fill="none"
                  size={20}
                  stroke={
                    isActivePage("/chat")
                      ? theme === "dark"
                        ? "#000000"
                        : "#ffffff"
                      : getIconColor(false)
                  }
                  strokeWidth={2.2}
                />
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-red-500 px-[3px] text-[9px] font-bold text-white border-[1.5px] border-white dark:border-black backdrop-content">
                    {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Profile */}
            {isLoading ? (
              <div className="flex items-center justify-center w-10 h-10">
                <Skeleton className="rounded-full w-[24px] h-[24px]" />
              </div>
            ) : (
              current && (
                <Link
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 ${
                    isActivePage(`/user/${id}`)
                      ? "bg-neutral-900 dark:bg-white"
                      : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                  }`}
                  href={`/user/${id}`}
                >
                  <Avatar
                    className={`w-[24px] h-[24px] ${
                      isActivePage(`/user/${id}`)
                        ? "ring-2 ring-offset-2 ring-black dark:ring-white dark:ring-offset-black"
                        : "opacity-80 hover:opacity-100 transition-opacity"
                    }`}
                  >
                    <AvatarImage src={avatarUrl || ""} alt="Avatar" className="object-cover" />
                    <AvatarFallback className="bg-neutral-200 dark:bg-neutral-800" />
                  </Avatar>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;

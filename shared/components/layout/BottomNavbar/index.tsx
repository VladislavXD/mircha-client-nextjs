"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "@wrksz/themes/client";
import { usePathname } from "next/navigation";
import {
  Bell,
  FolderKanban,
  Home,
  MessageCircle,
  Search,
  Theater,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/src/features/user";
import { useGetUserChats } from "@/src/features/chat";
import NavButton from "../../ui/navButton";
import ProjectIcon from "../../icons/projectIcon";
import { Badge } from "@/components/ui/badge";
import { useUnreadNotificationCount } from "@/src/features/notification";

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
  const navClass =
    scrollDirection === "up" ? "translate-y-0" : "translate-y-[150%]";

  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const { user: current, isLoading } = useCurrentUser();
  const { data: chats } = useGetUserChats();
  const { data: unreadCount } = useUnreadNotificationCount();

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
    const isDark = resolvedTheme === "dark";

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
                    ? resolvedTheme === "dark"
                      ? "#000000"
                      : "#ffffff"
                    : getIconColor(false)
                }
                strokeWidth={2.2}
              />
            </Link>

            {/* Search */}
            <Link
              className={`flex items-center relative justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 ${
                isActivePage("/activity")
                  ? "bg-neutral-900 dark:bg-white"
                  : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              }`}
              href="/activity"
            >
              <Bell
                fill="none"
                size={20}
                stroke={
                  isActivePage("/activity")
                    ? resolvedTheme === "dark"
                      ? "#000000"
                      : "#ffffff"
                    : getIconColor(false)
                }
              />
              {(unreadCount ?? 0) > 0 && (
                <Badge
                  variant="destructive"
                  className=" bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full  text-[9px] font-semibold flex items-center justify-center leading-none"
                >
                  {(unreadCount ?? 0) > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Link>

            {/* Forum */}
            <Link
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 relative ${
                isActivePage("/workspace")
                  ? "bg-neutral-900 dark:bg-white"
                  : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
              }`}
              href="/workspace"
            >
              <div className="relative inline-flex items-center justify-center">
                {/* Свечение вынесено через translate чтобы выходило за границы контейнера */}
                <span
                  className="absolute rounded-full animate-pulse pointer-events-none"
                  style={{
                    width: "50px",
                    height: "50px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(186,230,255,0.2) 35%, rgba(147,197,253,0.08) 65%, transparent 80%)",
                    filter: "blur(8px)",
                    zIndex: -1,
                  }}
                />
                <FolderKanban
                  className="relative z-10 transition-colors ease-out"
                  fill="none"
                  size={22}
                  stroke={
                    isActivePage("/workspace")
                      ? resolvedTheme === "dark"
                        ? "#000000"
                        : "#ffffff"
                      : getIconColor(false)
                  }
                />
              </div>
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
              <div>
                <MessageCircle
                  className="transition-colors ease-out"
                  fill="none"
                  size={20}
                  stroke={
                    isActivePage("/chat")
                      ? resolvedTheme === "dark"
                        ? "#000000"
                        : "#ffffff"
                      : getIconColor(false)
                  }
                  strokeWidth={2.2}
                />
                {totalUnreadCount > 0 && (
                   <Badge
                  variant="destructive"
                  className=" bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full  text-[9px] font-semibold flex items-center justify-center leading-none"
                >
                  {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                </Badge>
                )}
              </div>
            </Link>

            {/* Profile */}

            {current && (
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
                  <AvatarImage
                    alt="Avatar"
                    className="object-cover"
                    src={avatarUrl || ""}
                  />
                  <AvatarFallback className="bg-neutral-200 dark:bg-neutral-800" />
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;

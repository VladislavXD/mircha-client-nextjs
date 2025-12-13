"use client";
import { Badge, Skeleton, User } from "@heroui/react";
import React, { useEffect, useState, useMemo } from "react";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import { useGetUserChats } from "@/src/features/chat";
import { useCurrentUser } from "@/src/features/user";

import Link from "next/link";
import { IoHomeSharp, IoSearchOutline } from "react-icons/io5";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { socketService } from "@/src/services/socketService";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

import { MdForum, MdOutlineForum } from "react-icons/md";
import { House, MessageCircleDashed, MessagesSquare, Search } from "lucide-react";
import { FaUserSecret } from "react-icons/fa";

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

  useEffect(() => {
    if (current?.id) {
      if (!socketService.connected) {
        socketService.connect().catch(console.error);
      }
      const handleNewMessage = () => {
        refetch();
      };
      socketService.onNewMessage(handleNewMessage);
      return () => {
        socketService.off("new_message", handleNewMessage);
      };
    }
  }, [current?.id, refetch]);

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

  return (
    <>
      <div
        className={`fixed bottom-0 w-full py-3 z-10 bg-zinc-100 dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg sm:hidden ${navClass}`}
      >
        <div className="flex flex-row justify-around items-center bg-transparent w-full">
          {/* Home */}
          <Link href="/" className="flex items-center relative">
            <House
              size={28}
              stroke={getIconColor(isActivePage("/"))}
              strokeWidth={2}
              fill="none"
              className="transition-colors ease-out"
            />
          </Link>

          {/* Search */}
          <Link href="/search" className="flex items-center">
            <Search
              size={28}
              stroke={getIconColor(isActivePage("/search"))}
              strokeWidth={2}
              fill="none"
              className="transition-colors ease-out"
            />
          </Link>

          {/* Forum */}
          <Link href="/forum" className="flex items-center">
            <FaUserSecret
              className="size-7 transition-colors ease-out"
              style={{
                color: getIconColor(isActivePage("/forum"))
              }}
            />
          </Link>

          {/* Chat */}
          <Link
            href="/chat"
            className="flex items-center transition-all ease-out relative"
          >
            <Badge
              content={totalUnreadCount}
              color="danger"
              size="sm"
              isInvisible={totalUnreadCount === 0}
              placement="top-right"
            >
              <MessageCircleDashed
                size={28}
                stroke={getIconColor(isActivePage("/chat"))}
                strokeWidth={2}
                fill="none"
                className="transition-colors ease-out"
              />
            </Badge>
          </Link>

          {/* Profile */}
          { isLoading 
          ? (<Skeleton className="flex rounded-full w-10 h-10" />) 
          : 
          current && (
            <Link href={`/user/${id}`} className="flex items-center">
              <User
                avatarProps={{
                  src: `${avatarUrl}`,
                  isBordered: true,
                  size: "sm",
                }}
                className="transition-transform md:text-xs"
                name=""
              />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default BottomNav;

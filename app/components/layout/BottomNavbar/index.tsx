"use client";
import { Badge, User } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { selectCurrent } from "@/src/store/user/user.slice";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/src/hooks/reduxHooks";

import Link from "next/link";
import { IoHomeSharp, IoSearchOutline } from "react-icons/io5";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { useGetUserChatsQuery } from "@/src/services/caht.service";
import { socketService } from "@/app/utils/socketService";
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
  // Все хуки вызываются безусловно и в одном порядке на каждом рендере
  const scrollDirection = useScrollDirection();
  const navClass = scrollDirection === "up" ? "" : "opacity-25 duration-500";

  const current = useSelector(selectCurrent);
  const token = useAppSelector((state) => state.user.token);
  const pathname = usePathname();
  const { theme } = useTheme(); // перенесено выше условного return

  // Запрос чатов всегда вызываем, но с skip чтобы не ломать порядок хуков
  const { data: chats, refetch } = useGetUserChatsQuery(undefined, {
    skip: !token || !current?.id,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    if (chats) {
      const total = chats.reduce(
        (sum, chat) => sum + (chat.unreadCount || 0),
        0
      );
      setTotalUnreadCount(total);
    }
  }, [chats]);

  useEffect(() => {
    if (current?.id && token) {
      if (!socketService.connected) {
        socketService.connect(token).catch(console.error);
      }
      const handleNewMessage = () => {
        refetch();
      };
      socketService.onNewMessage(handleNewMessage);
      return () => {
        socketService.off("new_message", handleNewMessage);
      };
    }
  }, [current?.id, token, refetch]);


  const avatarUrl = current?.avatarUrl;
  const id = current?.id

  // Проверяем активность страницы с учетом локализации /ru или /en
  const isActivePage = (path: string) => {
    // Убираем префикс локализации из pathname
    const cleanPathname = pathname.replace(/^\/(ru|en)/, '') || '/';
    
    if (path === '/') {
      return cleanPathname === '/';
    }
    return cleanPathname === path || cleanPathname.startsWith(`${path}/`);
  };

  // Определяем цвет в зависимости от темы (с fallback)
  const getIconColor = (isActive: boolean) => {
    const isDark = theme === "dark";
    if (isActive) {
      return isDark ? "#ffffff" : "#000000";
    }
    return isDark ? "#6b7280" : "#9ca3af";
  };

  return (
    <>
      <div
        className={`fixed bottom-0 w-full py-3 z-10 bg-zinc-100 dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg sm:hidden ${navClass}`}
      >
        <div className="flex flex-row justify-around items-center bg-transparent w-full">
          <Link href="/" className="flex items-center relative">
            <House
              size={28}
              stroke={getIconColor(isActivePage("/"))}
              strokeWidth={2}
              fill="none"
              className="transition-colors ease-out"
            />
          </Link>
          <Link href="/search" className="flex items-center">
            <Search
              size={28}
              stroke={getIconColor(isActivePage("/search"))}
              strokeWidth={2}
              fill="none"
              className="transition-colors ease-out"
            />
          </Link>
          <Link href="/forum" className="flex items-center">
            <FaUserSecret
              className="size-7 transition-colors ease-out"
              style={{
                color: getIconColor(isActivePage("/forum"))
              }}
            />
          </Link>
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
          {current && (
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

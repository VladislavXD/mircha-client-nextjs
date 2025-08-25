
"use client"

import React, { useEffect, useState } from "react"

import { BsPostcard } from "react-icons/bs"
import { FiUsers } from "react-icons/fi"
import { FaUsers } from "react-icons/fa"
import { AiOutlineMessage } from "react-icons/ai"
import { Badge } from "@heroui/react"
import { useSelector } from "react-redux"
import { selectCurrent } from "@/src/store/user/user.slice"
import { useAppSelector } from "@/src/hooks/reduxHooks"
import { useGetUserChatsQuery } from "@/src/services/caht.service"
import { socketService } from "@/app/utils/socketService"
import NavButton from "../../ui/navButton"
import { MdOutlineForum } from "react-icons/md"
import { CiSearch } from "react-icons/ci"
import { IoMdNotificationsOutline } from "react-icons/io"

const Navbar = () => {
  const currentUser = useSelector(selectCurrent);
  const token = useAppSelector(state => state.user.token);
  
  // Получаем данные о чатах для подсчета непрочитанных сообщений
  const { data: chats, refetch } = useGetUserChatsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  
  
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // Подсчитываем общее количество непрочитанных сообщений
  useEffect(() => {
    if (chats) {
      const total = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
      setTotalUnreadCount(total);
    }
  }, [chats]);

  // Подключение к сокетам для обновления счетчика в реальном времени
  useEffect(() => {
    if (currentUser?.id && token) {
      // Подключаемся к сокетам если еще не подключены
      if (!socketService.connected) {
        socketService.connect(token).catch(console.error);
      }

      const handleNewMessage = () => {
        refetch();
      };

      socketService.onNewMessage(handleNewMessage);

      return () => {
        socketService.off('new_message', handleNewMessage);
      };
    }
  }, [currentUser?.id, token, refetch]);

 
  return (
    <nav className="h-full">
      <ul className="flex flex-col gap-5">
        <li>
          <NavButton href="/" icon={<BsPostcard />}>
            Посты
          </NavButton>
        </li>
        <li>
          <NavButton href="/search" icon={<CiSearch />}>
            Найти
          </NavButton>
        </li>
        <li>
          <NavButton href="/search" icon={<IoMdNotificationsOutline  />}>
            Уведомления
          </NavButton>
        </li>
        <li>
          <div className="relative">
            <Badge
              content={totalUnreadCount}
              color="danger"
              size="sm"
              isInvisible={totalUnreadCount === 0}
              placement="top-right"
            >
              <NavButton href="/chat" icon={<AiOutlineMessage />}>
                Сообщения
              </NavButton>
            </Badge>
          </div>
        </li>
        <li>
          <NavButton href="/forum" icon={<MdOutlineForum />}>
            Форум
          </NavButton>
        </li>
        <li>
          <NavButton href={`/following/${currentUser?.id}`} icon={<FiUsers />}>
            Подписки
          </NavButton>
        </li>
        <li>
          <NavButton href={`/followers/${currentUser?.id}`} icon={<FaUsers />}>
            Подписчики
          </NavButton>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar

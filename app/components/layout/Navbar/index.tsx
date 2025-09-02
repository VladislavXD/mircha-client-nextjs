
"use client"

import React, { useMemo } from "react"
import { BsPostcard } from "react-icons/bs"
import { FiUsers } from "react-icons/fi"
import { FaUsers } from "react-icons/fa"
import { AiOutlineMessage } from "react-icons/ai"
import { Badge } from "@heroui/react"
import { useSelector } from "react-redux"
import { selectCurrent } from "@/src/store/user/user.slice"
import { useGetUserChatsQuery } from "@/src/services/caht.service"
import NavButton from "../../ui/navButton"
import { MdOutlineForum } from "react-icons/md"
import { CiSearch } from "react-icons/ci"
import { IoMdNotificationsOutline } from "react-icons/io"

const Navbar = () => {
  const currentUser = useSelector(selectCurrent);
  
  // Загружаем чаты только если есть пользователь и они нужны для badge
  const { data: chats } = useGetUserChatsQuery(undefined, {
    skip: !currentUser?.id,
    refetchOnFocus: false, // Убираем лишний рефетч
    refetchOnReconnect: false, // Убираем лишний рефетч
  });
  
  // Мемоизируем подсчет непрочитанных сообщений
  const totalUnreadCount = useMemo(() => {
    return chats?.reduce((sum, chat) => sum + chat.unreadCount, 0) || 0
  }, [chats])

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
          <NavButton href="/search" icon={<IoMdNotificationsOutline />}>
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





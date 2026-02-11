
"use client"

import React, { useMemo } from "react"
import { BsPostcard } from "react-icons/bs"
import { FiUsers } from "react-icons/fi"
import { FaUsers } from "react-icons/fa"
import { AiOutlineMessage } from "react-icons/ai"
import { Badge } from "@heroui/react"
import { useCurrentUser } from '@/src/features/user'

import NavButton from "../../ui/navButton"
import { MdOutlineForum } from "react-icons/md"
import { CiSearch } from "react-icons/ci"
import { IoMdNotificationsOutline } from "react-icons/io"
import { LocaleSwitcherSelect } from "../../ui/selects/localeSwitcherSelect"
import { useTranslations } from "next-intl"

const Navbar = () => {
  const t = useTranslations('HomePage.sidebar')
  
  // React Query для получения данных (автоматически проверяет isAuthenticated)
  const { user: currentUser } = useCurrentUser()
  
  return (
    <nav className="h-full">
      <ul className="flex flex-col gap-5">
        <li>
          <NavButton href="/" icon={<BsPostcard />}>
            {t('posts')}
          </NavButton>
        </li>
        <li>
          <NavButton href="/search" icon={<CiSearch />}>
            {t('search')}
          </NavButton>
        </li>
        <li>
          <NavButton href="/search" icon={<IoMdNotificationsOutline />}>
            {t('nottifications')}
          </NavButton>
        </li>
        <li>
          <div className="relative">
            <Badge
              content={''}
              color="danger"
              size="sm"
              isInvisible={true}
              placement="top-right"
            >
              <NavButton href="/chat" icon={<AiOutlineMessage />}>
                {t('messages')}
              </NavButton>
            </Badge>
          </div>
        </li>
        <li>
          <NavButton href="/forum" icon={<MdOutlineForum />}>
            {t('forum')}
          </NavButton>
        </li>
        <li>
          <NavButton href={`/following/${currentUser?.id}`} icon={<FiUsers />}>
            {t('follows')}
          </NavButton>
        </li>
        <li>
          <NavButton href={`/followers/${currentUser?.id}`} icon={<FaUsers />}>
            {t('followers')}
          </NavButton>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar





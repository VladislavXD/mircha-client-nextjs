"use client"
import React, { useState } from "react"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
  Button,
  useDisclosure,
} from "@heroui/react"
import { useDispatch, useSelector } from "react-redux"
import { signOut } from "next-auth/react"


import Link from "next/link"
import { useRouter } from "next/navigation"
import { CiSettings } from "react-icons/ci"
import { logout, selectCurrent, selectIsAuthenticated } from "@/src/store/user/user.slice"
import { useTheme } from "next-themes"
import { LocaleSwitcherSelect } from "../selects/localeSwitcherSelect"
import { useTranslations } from "next-intl"
import FeedBackModal from "../Modals/FeedBack.modal"

const MenuDropdown = () => {
  const current = useSelector(selectCurrent)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  const router = useRouter()
  const {theme} = useTheme()
  const t = useTranslations("HomePage.navbar.dropdownMenu")
  const {onOpen, isOpen, onOpenChange, onClose} = useDisclosure()

  // Все хуки вызваны, теперь можно делать раннее возвращение
  if (!current) {
    return null
  }

  const { avatarUrl, name, email, id } = current

  const handleLogout = async () => {
    // Очищаем Redux store и localStorage
    dispatch(logout())
    // Очищаем NextAuth сессию
    await signOut({ redirect: false })
    
    // Перенаправляем на страницу авторизации
    router.push("/auth")
  }
  return (
    <>
    <Dropdown
      placement="bottom-start"
      className={`bottom-start  ${theme === "dark" ? "text-white" : "text-black"}  ${theme}`}
    >
      
      <DropdownTrigger>
        <div className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${theme === "dark" ? "bg-black" : "bg-white"}`}>
          <CiSettings className={`flex sm:hidden size-8 ${theme}`} />
          <User
            avatarProps={{ isBordered: true, src: avatarUrl }}
            className="transition-transform md:text-xs hidden sm:flex"
            description={`@${email}`}
            name={`${name}`}
          />
        </div>
        
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key={id} className="h-14 gap-2">
          <p className="font-bold">{t("registered")}</p>
          <p className="font-bold">@{email}</p>
        </DropdownItem>
        <DropdownItem key="settings" className="hidden sm:block">
          <Link href={`/user/${id}`}>{t("profile")}</Link>
        </DropdownItem>
        <DropdownItem key="analytics">{t("settings")}</DropdownItem>
        <DropdownItem onClick={onOpen} key="help_and_feedback">{t("feedback")}</DropdownItem>
        <DropdownItem key="language"
        isReadOnly

        >
          <LocaleSwitcherSelect />
        </DropdownItem>
        <DropdownItem key="about">
          <Link href={`/about`}>{t("about")}</Link>
        </DropdownItem>
        <DropdownItem
          key="logout "
          onClick={handleLogout}
          className="text-danger-400 flex"
          color="danger"
        >
          { <p>{t("logout")}</p>}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <FeedBackModal isOpen={isOpen} onClosse={onClose} onOpenChange={onOpenChange} />
    </>
  )
}

export default MenuDropdown

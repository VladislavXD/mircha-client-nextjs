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
} from "@heroui/react"
import { useDispatch, useSelector } from "react-redux"


import Link from "next/link"
import { useRouter } from "next/navigation"
import { CiSettings } from "react-icons/ci"
import { logout, selectCurrent, selectIsAuthenticated } from "@/src/store/user/user.slice"
import { useTheme } from "next-themes"

const MenuDropdown = () => {
  const [settings, setSettings] = useState()
  const current = useSelector(selectCurrent)

  if (!current) {
    return null
  }

  const { avatarUrl, name, email, id } = current

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    router.push("/auth")
  }
  const {theme} = useTheme()
  
  return (
    <Dropdown
      placement="bottom-start"
      className={`bottom-start ${theme === "dark" ? "text-white" : "text-black"}  ${theme}`}
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
          <p className="font-bold">Зарегестрирован</p>
          <p className="font-bold">@{email}</p>
        </DropdownItem>
        <DropdownItem key="settings" className="hidden sm:block">
          <Link href={`/user/${id}`}>Профиль</Link>
        </DropdownItem>
        <DropdownItem key="analytics">Настройки</DropdownItem>
        <DropdownItem key="help_and_feedback">Обратная связь</DropdownItem>
        <DropdownItem
          key="logout "
          onClick={handleLogout}
          className="text-danger-400 flex"
          color="danger"
        >
          {isAuthenticated ? <p>Выйти из аккаунта</p> : <p>Войти</p>}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default MenuDropdown

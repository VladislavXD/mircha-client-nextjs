'use client'
import React, { useContext } from "react"

import {
  NavbarBrand,
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
} from "@heroui/react"
import { FaRegMoon } from "react-icons/fa"
import { LuSunMedium } from "react-icons/lu"
import { useDispatch, useSelector } from "react-redux"
import MenuDropdown from "../../ui/DropdownMenu"
import { selectCurrent, selectIsAuthenticated } from "@/src/store/user/user.slice"
import { ThemeSwitch } from "@/src/Providers/theme-switch"
import MirchanIcon from '@/public/favicon.ico'
import { useTheme } from "next-themes"
import Link from "next/link"

import { useAppSelector } from "@/src/hooks/reduxHooks"

const   Header = () => {

  const { theme } = useTheme()
  const current = useSelector(selectCurrent)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)


  
  return (
    <Navbar className="max-w-screen-xl mx-auto w-full ">
      <NavbarBrand className="">
        <Link href='/' className="font-bold text-inherit flex items-center gap-2">
          <img  src={theme === 'dark' ? 'darkLogo.svg' : 'lightLogo.svg'} className="w-10" width={40} height={40} alt="Logo" />
          Mirchan
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">

        <NavbarItem
          className="lg:flex text-3xl cursor-pointer"
          // onClick={() => toggleTheme()}
        >
          {/* {theme === "light" ? <FaRegMoon /> : <LuSunMedium />} */}
        <ThemeSwitch/>
        </NavbarItem>
        
  
        <NavbarItem>
          {isAuthenticated ? <MenuDropdown /> : <Button as={Link} href="/auth" variant="shadow" color="success">Login</Button>}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default Header

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
import { selectCurrent } from "@/src/store/user/user.slice"
import { ThemeSwitch } from "@/src/Providers/theme-switch"



const   Header = () => {

  const current = useSelector(selectCurrent)
  if (!current) {
    return null
  }



  return (
    <Navbar className="max-w-screen-xl mx-auto w-full ">
      <NavbarBrand className="">
        <p className="font-bold text-inherit">Mirchan</p>
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
          <MenuDropdown/>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default Header

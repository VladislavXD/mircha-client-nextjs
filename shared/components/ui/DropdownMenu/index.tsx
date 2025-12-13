"use client";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "next-auth/react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiSettings } from "react-icons/ci";
import { useTheme } from "next-themes";
import { LocaleSwitcherSelect } from "../selects/localeSwitcherSelect";
import { useTranslations } from "next-intl";
import FeedBackModal from "../Modals/FeedBack.modal";
import { useProfile } from "@/src/features/profile/hooks";
import { useLogoutMutation } from "@/src/features/user/hooks";
import { Snowflake, Moon, Sun } from "lucide-react";

const MenuDropdown = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const t = useTranslations("HomePage.navbar.dropdownMenu");
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const [snowEnabled, setSnowEnabled] = useState(true);

  const { user, isLoading, isAuthenticated } = useProfile();
  const { logout, isLoadingLogout } = useLogoutMutation();
  
  const handleSnowToggle = () => {
    const newValue = !snowEnabled;
    setSnowEnabled(newValue);
    localStorage.setItem("snowfall-enabled", String(newValue));
    window.dispatchEvent(new CustomEvent('snowfall-toggle', { detail: newValue }));
  };
  
  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  // Все хуки вызваны, теперь можно делать раннее возвращение
  if (!user) {
    return null;
  }

  const { avatarUrl, name, email, id } = user;

  return (
    <>
      <Dropdown
        placement="bottom-start"
        className={`bottom-start  ${theme === "dark" ? "text-white" : "text-black"}  ${theme}`}
        
      >
        <DropdownTrigger>
          <div
            className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${theme === "dark" ? "bg-black" : "bg-white"}`}
          >
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
          
          {/* Мобильные настройки - только на маленьких экранах */}
          <DropdownItem 
            key="snow_toggle" 
            className="md:hidden"
            onClick={handleSnowToggle}
            startContent={<Snowflake size={18} className={snowEnabled ? "text-blue-400" : "text-gray-400"} />}
          >
            <span className="flex items-center justify-between w-full">
              <span>snow</span>
              <span className="text-xs opacity-70">{snowEnabled ? "On" : "Off"}</span>
            </span>
          </DropdownItem>
          
          <DropdownItem 
            key="theme_toggle" 
            className="md:hidden"
            onClick={handleThemeToggle}
            startContent={theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          >
            <span className="flex items-center justify-between w-full">
              <span>{theme === "dark" ? "Light Theme" : "Dark Theme"}</span>
            </span>
          </DropdownItem>
          
          <DropdownItem key="profile" className="hidden sm:block">
            <Link href={`/user/${id}`}>{t("profile")}</Link>
          </DropdownItem>
          <DropdownItem key="settings">
            <Link href={`/dashboard/settings`}>{t("settings")}</Link>
          </DropdownItem>
          <DropdownItem onClick={onOpen} key="help_and_feedback">
            {t("feedback")}
          </DropdownItem>
          <DropdownItem key="language" isReadOnly>
            <LocaleSwitcherSelect />
          </DropdownItem>
          <DropdownItem key="about">
            <Link href={`/about`}>{t("about")}</Link>
          </DropdownItem>
          <DropdownItem
            key="logout "
            onClick={() => logout()}
            aria-disabled={isLoadingLogout}
            className="text-danger-400 flex"
            color="danger"
          >
            {<p>{t("logout")}</p>}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <FeedBackModal
        isOpen={isOpen}
        onClosse={onClose}
        onOpenChange={onOpenChange}
      />
    </>
  );
};

export default MenuDropdown;

"use client";
import React, { useContext, useEffect, useState } from "react";

import {
  NavbarBrand,
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  useDisclosure,
} from "@heroui/react";
import MenuDropdown from "../../ui/DropdownMenu";
import { ThemeSwitch } from "@/src/Providers/theme-switch";
import { useTheme } from "next-themes";
import Link from "next/link";

import Image from "next/image";

import { ProfileHeaderSkeleton, useProfile } from "@/src/features/profile";
import UpdatesModal from "@/app/updates/updates.modal";

const Header = () => {
  const { theme } = useTheme();
  // React Query для получения данных текущего пользователя
  const { isLoading, isAuthenticated } = useProfile();

  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <Navbar className="max-w-screen-xl mx-auto w-full">
      <NavbarBrand className="flex items-center gap-2">
        <Link
          href="/"
          className="font-bold text-inherit flex items-center gap-1 sm:gap-2"
        >
          {/* Зимние иконки - адаптивные размеры */}
          {/* <Image
            src='/winterIcons/mirchanTree.png'
            alt="Mirchan Tree"
            width={30}
            height={30}

          /> */}
          <Image
            src={
              theme === "dark"
                ? "/mirchan-logo-light.svg"
                : "/mirchan-logo-dark.svg"
            }
            width={100}
            height={100}
            alt="Mirchan Logo"
            priority
          />
          {/* <Image
            src='/winterIcons/santa.png'
            alt="Santa"
            width={45}
            height={45}

          /> */}
        </Link>
        {/* Whats new update btn */}
        <Button size="sm" variant="ghost" onClick={onOpen} className=" text-white text-xs font-bold w-10  border-none">
          dev 1.0.0
        </Button>
        <UpdatesModal isOpen={isOpen} onClose={() => onClose()} />
      </NavbarBrand>

      <NavbarContent justify="end" className="gap-2">
        {/* Кнопки только на десктопе (md и выше) */}
        {/* <NavbarItem className="hidden md:flex">
          <SnowToggle onToggle={handleSnowToggle} />
        </NavbarItem> */}

        <NavbarItem className="hidden md:flex">
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem>
          {isLoading ? (
            // ✅ Скелетон только на ПК (≥1024px), на мобильном ничего не показываем
            <div className="hidden lg:block">
              <ProfileHeaderSkeleton />
            </div>
          ) : isAuthenticated ? (
            <MenuDropdown />
          ) : (
            <Button as={Link} href="/auth" variant="shadow" color="success">
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;

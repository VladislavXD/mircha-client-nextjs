"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";

import MenuDropdown from "../../ui/DropdownMenu";

import { ThemeSwitch } from "@/src/Providers/theme-switch";
import { Button } from "@/components/ui/button";
import { ProfileHeaderSkeleton, useProfile } from "@/src/features/profile";
import UpdatesModal from "@/app/updates/updates.modal";

const Header = () => {
  const { theme } = useTheme();
  const { isLoading, isAuthenticated } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-e bg-background">
      <div className="max-w-screen-xl mx-auto w-full px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <Link
            className="font-bold text-inherit flex items-center gap-1 sm:gap-2"
            href="/"
          >
            <Image
              priority
              alt="Mirchan Logo"
              height={70}
              src={
                theme === "dark" ? "/mrchLogo_light.svg" : "/mrchLogo_dark.svg"
              }
              width={70}
            />
          </Link>
          {/* Whats new update btn */}
          <Button
            className="text-xs font-bold h-8 px-2"
            variant="ghost"
            onClick={() => setIsOpen(true)}
          >
            v1.0.2
          </Button>
          <UpdatesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>

        {/* Right side - Theme and Auth */}
        <div className="flex items-center gap-3">
          {/* Theme Switch - desktop only */}
          <div className="hidden md:flex">
            <ThemeSwitch />
          </div>

          {/* Auth or Profile */}
          <div>
            {isLoading ? (
              <div className="hidden lg:block">
                <ProfileHeaderSkeleton />
              </div>
            ) : isAuthenticated ? (
              <MenuDropdown />
            ) : (
              <Button asChild>
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

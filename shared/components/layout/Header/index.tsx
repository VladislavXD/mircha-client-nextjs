"use client";
import React, { useState } from "react";
import { useTheme } from "@wrksz/themes/client";
import Link from "next/link";
import Image from "next/image";

import MenuDropdown from "../../ui/DropdownMenu";
import { ProfileHeaderSkeleton, useProfile } from "@/src/features/profile";
import UpdatesModal from "@/app/updates/updates.modal";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

const Header = () => {
  const { resolvedTheme } = useTheme();
  const { isLoading, isAuthenticated } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const getIconColor = (isActive: boolean) => {
    const isDark = resolvedTheme === "dark";
    if (isActive) return isDark ? "#ffffff" : "#000000";
    return isDark ? "#6b7280" : "#9ca3af";
  };

  const isActivePage = (path: string) => {
    const cleanPathname = pathname.replace(/^\/(ru|en)/, "") || "/";
    if (path === "/") return cleanPathname === "/";
    return cleanPathname === path || cleanPathname.startsWith(`${path}/`);
  };

  return (
    <nav className="border-e bg-background">
      <div className="max-w-screen-xl mx-auto w-full px-4 py-3 flex items-center justify-between">

        {/* Search icon — mobile only */}
        <Link
          className={`items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 flex sm:hidden ${
            isActivePage("/search")
              ? "bg-neutral-900 dark:bg-white"
              : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
          }`}
          href="/search"
        >
          <Search
            className="transition-colors ease-out"
            fill="none"
            size={20}
            stroke={
              isActivePage("/search")
                ? resolvedTheme === "dark" ? "#000000" : "#ffffff"
                : getIconColor(false)
            }
            strokeWidth={2.2}
          />
        </Link>

        {/* Logo + version badge */}
        <div className="flex items-center gap-2">
          <Link className="font-bold text-inherit flex items-center" href="/">
            <Image
              priority
              alt="Mirchan Logo"
              height={70}
              width={70}
              src={resolvedTheme === "dark" ? "/mrchLogo_light.svg" : "/mrchLogo_dark.svg"}
            />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center h-5 px-1.5 rounded-md text-[10px] font-semibold tracking-wide
              bg-neutral-100 dark:bg-neutral-800
              text-neutral-400 dark:text-neutral-500
              hover:bg-neutral-200 dark:hover:bg-neutral-700
              hover:text-neutral-600 dark:hover:text-neutral-300
              transition-all duration-150 select-none"
          >
            v3.1
          </button>

          <UpdatesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <MenuDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Header;
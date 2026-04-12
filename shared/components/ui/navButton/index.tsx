"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { RootState } from "@/src/store/store";

type Props = {
  children: React.ReactNode;
  icon: JSX.Element;
  href: string;
};

const NavButton = ({ children, icon, href }: Props) => {
  const pathname = usePathname();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const cleanPathname = pathname?.replace(/^\/(ru|en)/, "") || "/";
  const isActive =
    href === "/"
      ? cleanPathname === "/"
      : cleanPathname === href || cleanPathname.startsWith(`${href}/`);

  return (
    <Link
      className={`flex items-center py-2 px-3 rounded-2xl transition-colors duration-200 ${
        isActive
          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold"
          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#151515] hover:text-neutral-900 dark:hover:text-white font-medium"
      } ${isOpen ? "w-full justify-start gap-3" : "w-[44px] h-[44px] justify-center mx-auto"}`}
      href={href}
      title={!isOpen ? String(children) : undefined}
    >
      <span
        className={`flex items-center justify-center shrink-0 ${isOpen ? "text-xl" : "text-2xl"}`}
      >
        {icon}
      </span>
      {isOpen && (
        <span className="text-sm truncate leading-none pt-0.5">{children}</span>
      )}
    </Link>
  );
};

export default NavButton;

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  MessagesSquare,
  UserCheck,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import NavButton from "../../ui/navButton";

import { useCurrentUser } from "@/src/features/user";
import { RootState } from "@/src/store/store";
import { toggleSidebar } from "@/src/store/sidebar/sidebar.slice";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const t = useTranslations("HomePage.sidebar");
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const toggle = () => dispatch(toggleSidebar());

  // React Query для получения данных (автоматически проверяет isAuthenticated)
  const { user: currentUser } = useCurrentUser();

  return (
    <nav className="h-full relative flex flex-col pt-4 overflow-hidden ">
      {/* Кнопка сворачивания сайдбара (только для desktop/tablet, на мобилках скрываем) */}

      <ul className="flex flex-col gap-4">
        <li className="flex flex-col items-center gap-2">
          <Button
            aria-label={isOpen ? "Свернуть" : "Развернуть"}
            className="hidden md:flex w-6 h-6 bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800 rounded-full items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shadow-sm  "
            size="icon"
            variant="ghost"
            onClick={toggle}
          >
            {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </Button>

          <NavButton href="/" icon={<Home size="1em" />}>
            {t("posts")}
          </NavButton>
        </li>
        <li>
          <NavButton href="/search" icon={<Search size="1em" />}>
            {t("search")}
          </NavButton>
        </li>
        <li>
          <NavButton href="/search" icon={<Bell size="1em" />}>
            {t("nottifications")}
          </NavButton>
        </li>
        <li>
          <div className="relative">
            <span className="relative ">
              <NavButton href="/chat" icon={<MessageCircle size="1em" />}>
                {t("messages")}
              </NavButton>
            </span>
          </div>
        </li>
        <li>
          <NavButton href="/forum" icon={<MessagesSquare size="1em" />}>
            {t("forum")}
          </NavButton>
        </li>
        <li>
          <NavButton
            href={`/following/${currentUser?.id}`}
            icon={<UserCheck size="1em" />}
          >
            {t("follows")}
          </NavButton>
        </li>
        <li>
          <NavButton
            href={`/followers/${currentUser?.id}`}
            icon={<Users size="1em" />}
          >
            {t("followers")}
          </NavButton>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

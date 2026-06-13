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
  FolderKanban,
  Menu,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import NavButton from "../../ui/navButton";

import { useCurrentUser } from "@/src/features/user";
import { RootState } from "@/src/store/store";
import { toggleSidebar } from "@/src/store/sidebar/sidebar.slice";
import { Button } from "@/components/ui/button";
import ProjectIcon from "../../icons/projectIcon";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useModals } from "@/src/hooks/useModals";
import MenuDropdown from "../../ui/DropdownMenu";
import { ProfileHeaderSkeleton, useProfile } from "@/src/features/profile";
import { Badge } from "@/components/ui/badge";
import { useUnreadNotificationCount } from "@/src/features/notification";

const Navbar = () => {
  const t = useTranslations("HomePage.sidebar");
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const toggle = () => dispatch(toggleSidebar());
  const { isLoading, isAuthenticated } = useProfile();
  const { data: unreadCount } = useUnreadNotificationCount();

  console.log(unreadCount);
  const { SettingsDropdown } = useModals();
  // React Query для получения данных (автоматически проверяет isAuthenticated)
  const { user: currentUser } = useCurrentUser();

  const { avatarUrl, name, username } = currentUser || {};
  const getInitials = () => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() ||
      username?.[0]?.toUpperCase() ||
      "?"
    );
  };

  return (
    <nav className="h-full relative flex flex-col pt-4 overflow-visible">
      <ul className="flex flex-col gap-4">
        <li className="flex flex-col items-center gap-2">
          <Button
            aria-label={isOpen ? "Свернуть" : "Развернуть"}
            className="hidden md:flex w-6 h-6 bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800 rounded-full items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shadow-sm"
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
          <NavButton
            href="/activity"
            icon={
              <>
                <div className="relative">
                  <Bell size="1em" />

                  {(unreadCount ?? 0) > 0 && (
                    <Badge className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full  text-[9px] font-semibold flex items-center justify-center leading-none">
                      {(unreadCount ?? 0) > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </div>
              </>
            }
          >
            {t("nottifications")}
          </NavButton>
        </li>
        <li>
          <NavButton href="/chat" icon={<MessageCircle size="1em" />}>
            {t("messages")}
          </NavButton>
        </li>
        <li>
          <NavButton
            href="/workspace"
            icon={
              <div className="relative inline-flex items-center justify-center">
                <span
                  className="absolute rounded-full animate-pulse pointer-events-none"
                  style={{
                    width: "60px",
                    height: "60px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(186,230,255,0.2) 35%, rgba(147,197,253,0.08) 65%, transparent 80%)",
                    filter: "blur(8px)",
                    zIndex: -1,
                  }}
                />
                <FolderKanban />
              </div>
            }
          >
            Рабочая область
          </NavButton>
        </li>
        <li>
          {isAuthenticated &&
            (isLoading ? (
              <ProfileHeaderSkeleton />
            ) : (
              <NavButton
                href={`/user/${currentUser?.id}`}
                icon={
                  <Avatar className="size-1em w-6 h-6">
                    <AvatarImage alt={name} src={avatarUrl} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                }
              >
                <div className="flex flex-col justify-center text-left">
                  {t("profile")}
                </div>
              </NavButton>
            ))}
        </li>
      </ul>

      {/* Прижато к низу */}
      <div className="mt-auto flex flex-col gap-4 pb-4">
        <MenuDropdown
          isOpenDropdown={SettingsDropdown.isOpen}
          onClose={SettingsDropdown.onClose}
          trigger={<NavButton icon={<Menu size="1em" />}>Menu</NavButton>}
        />
      </div>
    </nav>
  );
};

export default Navbar;

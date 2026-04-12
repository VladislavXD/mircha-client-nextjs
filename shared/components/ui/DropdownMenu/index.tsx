"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiSettings } from "react-icons/ci";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import {
  Moon,
  Sun,
  LogOut,
  Settings,
  MessageSquare,
  Globe,
  Info,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { LocaleSwitcherSelect } from "../selects/localeSwitcherSelect";
import FeedBackModal from "../Modals/FeedBack.modal";

import { useProfile } from "@/src/features/profile/hooks";
import { useLogoutMutation } from "@/src/features/user/hooks";
import { useOnlineStatus } from "@/src/features/chat";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const MenuDropdown = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("HomePage.navbar.dropdownMenu");
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const { user, isLoading, isAuthenticated } = useProfile();
  const { logoutAsync, isLoadingLogout } = useLogoutMutation();

  const userId = user?.id;
  const { isOnline } = useOnlineStatus(userId || "");

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!user) {
    return null;
  }

  const { avatarUrl, name, username, email, id } = user;
  const pathname = usePathname();
  const localeMatch = pathname?.match(/^\/(ru|en)(?=\/|$)/);
  const locale = localeMatch?.[1];

  const prefix = locale ? `/${locale}` : "";

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
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {/* Mobile: Only settings icon */}
          <Button
            className="h-10 w-10 rounded-full p-0 sm:hidden"
            variant="ghost"
          >
            <CiSettings className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuTrigger asChild>
          {/* Desktop: Avatar + Name + Email */}
          <Button
            className="hidden sm:flex w-full max-w-60 h-auto gap-3 px-2 py-1 justify-start"
            variant="ghost"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage alt={name} src={avatarUrl} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center text-left">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs text-muted-foreground leading-none">
                @{username}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* User Info Header */}
          <div className="px-2 py-2 text-sm">
            <p className="font-bold">{t("registered")}</p>
            <p className="text-xs text-muted-foreground">@{email}</p>
          </div>
          <DropdownMenuSeparator />

          {/* Mobile Theme Toggle */}
          <DropdownMenuItem className="md:hidden" onClick={handleThemeToggle}>
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>{theme === "dark" ? "Light Theme" : "Dark Theme"}</span>
          </DropdownMenuItem>

          {/* Profile */}
          <DropdownMenuItem asChild className="hidden sm:flex">
            <Link href={`/user/${id}`}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>{t("profile")}</span>
            </Link>
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem asChild>
            <Link href={`${prefix}/dashboard/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("settings")}</span>
            </Link>
          </DropdownMenuItem>

          {/* Feedback */}
          <DropdownMenuItem onClick={() => setIsFeedbackOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>{t("feedback")}</span>
          </DropdownMenuItem>

          {/* Language */}
          <DropdownMenuItem asChild>
            <div className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              <LocaleSwitcherSelect />
            </div>
          </DropdownMenuItem>

          {/* About */}
          <DropdownMenuItem asChild>
            <Link href="/about">
              <Info className="mr-2 h-4 w-4" />
              <span>{t("about")}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            disabled={isLoadingLogout}
            onClick={() => {
              setIsOpen(false);
              toast.promise(logoutAsync(), {
                loading: t("logoutLoading"),
                success: { message: t("logoutSuccess") },
                error: t("logoutError"),
              });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <FeedBackModal
        isOpen={isFeedbackOpen}
        onClosse={() => setIsFeedbackOpen(false)}
        onOpenChange={setIsFeedbackOpen}
      />
    </>
  );
};

export default MenuDropdown;

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  LogOut,
  Settings,
  MessageSquare,
  Globe,
  User as UserIcon,
  Sun,
  SunIcon,
  MoonIcon,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import { LocaleSwitcherSelect } from "../selects/localeSwitcherSelect";
import FeedBackModal from "../Modals/FeedBack.modal";
import { MobileUserDrawer } from "./MobileUserDrawer";
import { ThemeSwitch } from "@/src/Providers/theme-switch";

import { useProfile } from "@/src/features/profile/hooks";
import { useLogoutMutation } from "@/src/features/user/hooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { openSettingsModal } from "@/src/store/settingsModal/settingsModal.slice";
import ThemeTab from "./themeTab";
import { useTheme } from "@wrksz/themes/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SettingsDropdownProps {
  isOpenDropdown?: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

const MenuDropdown = ({
  isOpenDropdown,
  onClose,
  trigger,
}: SettingsDropdownProps) => {
  const t = useTranslations("HomePage.navbar.dropdownMenu");
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const router = useRouter();

  const { resolvedTheme, setTheme } = useTheme();

  const { user, isAuthenticated } = useProfile();
  const { logoutAsync, isLoadingLogout } = useLogoutMutation();

  const { avatarUrl, name, username, id } = user ?? {};

  const getInitials = () =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    username?.[0]?.toUpperCase() ||
    "?";

  return (
    <>
      {isDesktop ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={8}
            className="w-56 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#111] p-1.5 shadow-xl shadow-black/5 dark:shadow-black/30"
          >
            {isAuthenticated && (
              <>
                {/* User header */}
                <div className="flex items-center gap-3 px-2.5 py-2.5 mb-1">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[13px] font-semibold text-neutral-900 dark:text-white truncate leading-tight">
                      {name || username}
                    </p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate leading-tight">
                      @{username}
                    </p>
                  </div>
                </div>
              </>
            )}

            <DropdownMenuSeparator className="-mx-1.5 mb-1.5 bg-neutral-100 dark:bg-neutral-800" />

            {/* Nav items */}
            <DropdownMenuItem
              asChild
              isAuth={isAuthenticated}
              className="h-9 cursor-pointer rounded-xl px-2.5 text-[13px] text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800/80 focus:text-neutral-900 dark:focus:text-white"
            >
              <Link href={`/user/${id}`}>
                <UserIcon className="mr-2.5 h-3.5 w-3.5 opacity-60" />
                {t("profile")}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              isAuth={isAuthenticated}
              className="h-9 cursor-pointer rounded-xl px-2.5 text-[13px] text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800/80 focus:text-neutral-900 dark:focus:text-white"
              onClick={() => dispatch(openSettingsModal("profile"))}
            >
              <Settings className="mr-2.5 h-3.5 w-3.5 opacity-60" />
              {t("settings")}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="h-9 cursor-pointer rounded-xl px-2.5 text-[13px] text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800/80 focus:text-neutral-900 dark:focus:text-white"
              onClick={() => setIsFeedbackOpen(true)}
            >
              <MessageSquare className="mr-2.5 h-3.5 w-3.5 opacity-60" />
              {t("feedback")}
            </DropdownMenuItem>

            <DropdownMenuSeparator className="-mx-1.5 my-1.5 bg-neutral-100 dark:bg-neutral-800" />

            {/* Language */}
            <DropdownMenuItem
              asChild
              className="h-9 cursor-pointer rounded-xl px-2.5 text-[13px] text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800/80"
            >
              <div className="flex items-center w-full">
                <Globe className=" h-3.5 w-3.5 opacity-60 shrink-0" />
                <LocaleSwitcherSelect />
              </div>
            </DropdownMenuItem>

            {/* Theme */}
            <DropdownMenuItem
              asChild
              className="rounded-xl px-2.5 py-1.5 focus:bg-transparent dark:focus:bg-transparent"
              onSelect={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[13px] text-neutral-700 dark:text-neutral-300">
                  Theme
                </span>
                <div
                  className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ThemeTab
                    theme="light"
                    resolvedTheme={resolvedTheme}
                    setTheme={setTheme}
                    icon={<SunIcon />}
                  />
                  <ThemeTab
                    theme="dark"
                    resolvedTheme={resolvedTheme}
                    setTheme={setTheme}
                    icon={<MoonIcon />}
                  />
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="-mx-1.5 my-1.5 bg-neutral-100 dark:bg-neutral-800" />

            {/* Logout */}
            <DropdownMenuItem
              className={cn(
                "h-9 cursor-pointer rounded-xl px-2.5 text-[13px]",
                isAuthenticated
                  ? "text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30 dark:focus:text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  : "text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800/80 focus:text-neutral-900 dark:focus:text-white",
              )}
              disabled={isLoadingLogout}
              onClick={() => {
                if (isAuthenticated)
                  toast.promise(logoutAsync(), {
                    loading: t("logoutLoading"),
                    success: { message: t("logoutSuccess") },
                    error: t("logoutError"),
                  });
                else router.push("/auth");
              }}
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="mr-2.5 h-3.5 w-3.5" />
                  {t("logout")}
                </>
              ) : (
                <>
                  <LogIn className="mr-2.5 h-3.5 w-3.5" />
                  {t("login")}
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : isAuthenticated ? (
        <MobileUserDrawer
          getInitials={getInitials}
          isLoadingLogout={isLoadingLogout}
          isOpen={isOpen}
          isAuth={isAuthenticated}
          setIsOpen={setIsOpen}
          user={{ id: id ?? "", name, username, avatarUrl }}
          onLogout={logoutAsync}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
        />
      ) : (
        <Button asChild>
          <Link href="/auth">Login</Link>
        </Button>
      )}

      <FeedBackModal
        isOpen={isFeedbackOpen}
        onClosse={() => setIsFeedbackOpen(false)}
        onOpenChange={setIsFeedbackOpen}
      />
    </>
  );
};

export default MenuDropdown;

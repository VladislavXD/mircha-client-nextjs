"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  LogOut,
  Settings,
  MessageSquare,
  Globe,
  Info,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import { LocaleSwitcherSelect } from "../selects/localeSwitcherSelect";
import FeedBackModal from "../Modals/FeedBack.modal";

import { MobileUserDrawer } from "./MobileUserDrawer";

import { useProfile } from "@/src/features/profile/hooks";
import { useLogoutMutation } from "@/src/features/user/hooks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { openSettingsModal } from "@/src/store/settingsModal/settingsModal.slice";

const MenuDropdown = () => {
  const t = useTranslations("HomePage.navbar.dropdownMenu");
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { user } = useProfile();
  const { logoutAsync, isLoadingLogout } = useLogoutMutation();

  if (!user) {
    return null;
  }

  const { avatarUrl, name, username, email, id } = user;
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
      {isDesktop ? (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-full max-w-60 h-auto gap-3 px-2 py-1 justify-start border-none"
              variant="ghost"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage alt={name} src={avatarUrl} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center text-left">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-none mt-1">
                  @{username}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60 rounded-xl border border-neutral-200 p-2 shadow-lg dark:border-neutral-800/70"
          >
            <div className="mb-1 px-2 py-2.5 text-sm">
              <p className="text-[15px] font-bold">{t("registered")}</p>
              <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
                @{email}
              </p>
            </div>
            <DropdownMenuSeparator className="-mx-2 mb-2 bg-neutral-100 dark:bg-neutral-800/60" />

            <DropdownMenuItem
              asChild
              className="mb-1 h-9 cursor-pointer rounded-lg"
            >
              <Link href={`/user/${id}`}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>{t("profile")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="mb-1 h-9 cursor-pointer rounded-lg"
              onClick={() => dispatch(openSettingsModal("profile"))}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("settings")}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="mb-1 h-9 cursor-pointer rounded-lg"
              onClick={() => setIsFeedbackOpen(true)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>{t("feedback")}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="mb-1 h-9 cursor-pointer rounded-lg"
            >
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                <LocaleSwitcherSelect />
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="mb-1 h-9 cursor-pointer rounded-lg"
            >
              <Link href="/about">
                <Info className="mr-2 h-4 w-4" />
                <span>{t("about")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="-mx-2 mt-2 mb-2 bg-neutral-100 dark:bg-neutral-800/60" />

            <DropdownMenuItem
              className="h-9 cursor-pointer rounded-lg text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30"
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
      ) : (
        <MobileUserDrawer
          getInitials={getInitials}
          isLoadingLogout={isLoadingLogout}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={{
            id,
            name,
            username,
            avatarUrl,
          }}
          onLogout={logoutAsync}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
        />
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

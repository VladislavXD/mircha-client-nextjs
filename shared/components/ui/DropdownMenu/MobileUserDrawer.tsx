import React from "react";
import Link from "next/link";
import { useTheme } from "@wrksz/themes/client";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Moon,
  Sun,
  LogOut,
  Settings,
  MessageSquare,
  Globe,
  Info,
  User as UserIcon,
  Menu,
} from "lucide-react";

import { LocaleSwitcherSelect } from "../selects/localeSwitcherSelect";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { openSettingsModal } from "@/src/store/settingsModal/settingsModal.slice";

interface MobileUserDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAuth?: boolean;
  user: {
    id: string | number;
    name?: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
  };
  getInitials: () => string;
  isLoadingLogout: boolean;
  onLogout: () => Promise<any>;
  onOpenFeedback: () => void;
}

export const MobileUserDrawer: React.FC<MobileUserDrawerProps> = ({
  isOpen,
  setIsOpen,
  isAuth,
  user,
  getInitials,
  isLoadingLogout,
  onLogout,
  onOpenFeedback,
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("HomePage.navbar.dropdownMenu");
  const dispatch = useDispatch();

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    setIsOpen(false);
    toast.promise(onLogout(), {
      loading: t("logoutLoading"),
      success: { message: t("logoutSuccess") },
      error: t("logoutError"),
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          className="h-10 w-10 rounded-full p-0 sm:hidden"
          variant="ghost"
        >
          <Menu size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-[#101010] outline-none border-t border-neutral-200 dark:border-neutral-800">
        {isAuth && (
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800/60 pb-6 text-left">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage alt={user.name} src={user.avatarUrl} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-base font-semibold leading-none">
                  {user.name}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 pb-1">
                  @{user.username}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="overflow-y-auto py-2 px-3 flex flex-col gap-1 max-h-[55vh]">
          <Button
            className="w-full justify-start font-normal h-12"
            variant="ghost"
            onClick={handleThemeToggle}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="mr-3 h-5 w-5 text-neutral-500" />
            ) : (
              <Moon className="mr-3 h-5 w-5 text-neutral-500" />
            )}
            <span>
              {resolvedTheme === "dark" ? "Light Theme" : "Dark Theme"}
            </span>
          </Button>

          {isAuth && (
            <>
              <Button
                asChild
                className="w-full justify-start font-normal h-12"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                <Link href={`/user/${user.id}`}>
                  <UserIcon className="mr-3 h-5 w-5 text-neutral-500" />
                  <span>{t("profile")}</span>
                </Link>
              </Button>

              <Button
                className="w-full justify-start font-normal h-12"
                variant="ghost"
                onClick={() => {
                  setIsOpen(false);
                  dispatch(openSettingsModal("profile"));
                }}
              >
                <Settings className="mr-3 h-5 w-5 text-neutral-500" />
                <span>{t("settings")}</span>
              </Button>
            </>
          )}
          <Button
            className="w-full justify-start font-normal h-12"
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
              onOpenFeedback();
            }}
          >
            <MessageSquare className="mr-3 h-5 w-5 text-neutral-500" />
            <span>{t("feedback")}</span>
          </Button>

          <Button
            asChild
            className="w-full justify-start font-normal h-12"
            variant="ghost"
          >
            <div className="flex items-center">
              <Globe className="mr-3 h-5 w-5 text-neutral-500" />
              <LocaleSwitcherSelect />
            </div>
          </Button>

          <Button
            asChild
            className="w-full justify-start font-normal h-12"
            variant="ghost"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/about">
              <Info className="mr-3 h-5 w-5 text-neutral-500" />
              <span>{t("about")}</span>
            </Link>
          </Button>
        </div>

       {
        isAuth&& (
           <div className="p-4 border-t border-neutral-100 dark:border-neutral-800/60 mt-auto mb-4">
          <Button
            className="w-full justify-start font-normal text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-12"
            disabled={isLoadingLogout}
            variant="ghost"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>{t("logout")}</span>
          </Button>
        </div>
        )
       }
      </DrawerContent>
    </Drawer>
  );
};

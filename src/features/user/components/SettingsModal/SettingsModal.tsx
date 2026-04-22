"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { Bell, Languages, Lock, Palette, Shield, User } from "lucide-react";

import { ProfileSettings } from "../ProfileSettings";
import { AppearanceSettings } from "../AppearanceSettings";
import { PrivacySettings } from "../PrivacySettings";
import { SecuritySettings } from "../SecuritySettings";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  closeSettingsModal,
  selectIsSettingsModalOpen,
  selectSettingsActiveTab,
  setSettingsTab,
} from "@/src/store/settingsModal/settingsModal.slice";

// We will build ProfileSettings to use shadcn next

export function SettingsModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsSettingsModalOpen);
  const activeTab = useSelector(selectSettingsActiveTab);
  const t = useTranslations("Settings");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && dispatch(closeSettingsModal())}
    >
      <DialogContent className="w-[calc(100%-1rem)] max-w-[420px] h-[78dvh] sm:max-w-4xl sm:h-[50vh] p-0 gap-0 overflow-hidden flex flex-col ">
        <DialogHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b-[0.5px] sm:border-b ">
          <DialogTitle>{t("title") || "Settings"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <Tabs
            className="flex flex-col sm:flex-row w-full"
            orientation="vertical"
            value={activeTab}
            onValueChange={(val) => dispatch(setSettingsTab(val as any))}
          >
            {/* Sidebar Navigation */}
            <div className="border-b-[0.5px] sm:border-b-0 sm:border-r  sm:bg-muted/20 overflow-x-auto sm:overflow-visible">
              <TabsList className="!flex-row sm:!flex-col !w-full sm:!w-auto h-auto sm:h-full bg-transparent p-1.5 sm:p-2 !items-center sm:!items-stretch !justify-center sm:justify-start gap-1 sm:gap-2 min-w-0 ">
                <TabsTrigger
                  className="!w-9 !h-9 sm:!w-full sm:!h-auto !justify-center sm:!justify-start !px-0 sm:!px-4 !py-0 sm:!py-2 data-[state=active]:bg-muted whitespace-nowrap text-xs sm:text-sm"
                  title={t("sidebar.profile") || "Profile"}
                  value="profile"
                >
                  <User className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">
                    {t("sidebar.profile") || "Profile"}
                  </span>
                  <span className="sr-only sm:hidden">
                    {t("sidebar.profile") || "Profile"}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className="!w-9 !h-9 sm:!w-full sm:!h-auto !justify-center sm:!justify-start !px-0 sm:!px-4 !py-0 sm:!py-2 data-[state=active]:bg-muted whitespace-nowrap text-xs sm:text-sm"
                  title={t("sidebar.appearance") || "Appearance"}
                  value="appearance"
                >
                  <Palette className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">
                    {t("sidebar.appearance") || "Appearance"}
                  </span>
                  <span className="sr-only sm:hidden">
                    {t("sidebar.appearance") || "Appearance"}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className="!w-9 !h-9 sm:!w-full sm:!h-auto !justify-center sm:!justify-start !px-0 sm:!px-4 !py-0 sm:!py-2 data-[state=active]:bg-muted whitespace-nowrap text-xs sm:text-sm"
                  title={t("sidebar.privacy") || "Privacy"}
                  value="privacy"
                >
                  <Shield className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">
                    {t("sidebar.privacy") || "Privacy"}
                  </span>
                  <span className="sr-only sm:hidden">
                    {t("sidebar.privacy") || "Privacy"}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className="!w-9 !h-9 sm:!w-full sm:!h-auto !justify-center sm:!justify-start !px-0 sm:!px-4 !py-0 sm:!py-2 data-[state=active]:bg-muted whitespace-nowrap text-xs sm:text-sm"
                  title={t("sidebar.security") || "Security"}
                  value="security"
                >
                  <Lock className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">
                    {t("sidebar.security") || "Security"}
                  </span>
                  <span className="sr-only sm:hidden">
                    {t("sidebar.security") || "Security"}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className="!w-9 !h-9 sm:!w-full sm:!h-auto !justify-center sm:!justify-start !px-0 sm:!px-4 !py-0 sm:!py-2 data-[state=active]:bg-muted whitespace-nowrap text-xs sm:text-sm"
                  title={t("sidebar.notifications") || "Notifications"}
                  value="notifications"
                >
                  <Bell className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">
                    {t("sidebar.notifications") || "Notifications"}
                  </span>
                  <span className="sr-only sm:hidden">
                    {t("sidebar.notifications") || "Notifications"}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  className="!w-9 !h-9 sm:!w-full sm:!h-auto !justify-center sm:!justify-start !px-0 sm:!px-4 !py-0 sm:!py-2 data-[state=active]:bg-muted whitespace-nowrap text-xs sm:text-sm"
                  title={t("sidebar.language") || "Language"}
                  value="language"
                >
                  <Languages className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">
                    {t("sidebar.language") || "Language"}
                  </span>
                  <span className="sr-only sm:hidden">
                    {t("sidebar.language") || "Language"}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
              <TabsContent className="mt-0 outline-none" value="profile">
                <ProfileSettings />
              </TabsContent>
              <TabsContent className="mt-0 outline-none" value="appearance">
                <AppearanceSettings />
              </TabsContent>
              <TabsContent className="mt-0 outline-none" value="privacy">
                <PrivacySettings />
              </TabsContent>
              <TabsContent className="mt-0 outline-none" value="security">
                <SecuritySettings />
              </TabsContent>
              <TabsContent className="mt-0 outline-none" value="notifications">
                <div>Notifications settings coming soon</div>
              </TabsContent>
              <TabsContent className="mt-0 outline-none" value="language">
                <div>Language settings coming soon</div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

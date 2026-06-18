"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { Bell, Languages, Lock, Palette, Shield, User } from "lucide-react";

import { useMediaQuery } from "@/src/hooks/useMediaQuery";

import { ProfileSettings } from "../ProfileSettings";
import { AppearanceSettings } from "../AppearanceSettings";
import { PrivacySettings } from "../PrivacySettings";
import { SecuritySettings } from "../SecuritySettings";
import type { TabValue } from "../../types/settings.type";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  closeSettingsModal,
  selectIsSettingsModalOpen,
  selectSettingsActiveTab,
  setSettingsTab,
} from "@/src/store/settingsModal/settingsModal.slice";
import { selectIsDirty } from "@/src/store/unsavedChange/unsavedChanges.selector";
import { setChangesDirty, setPendingTab } from "@/src/store/unsavedChange/unsavedChanges";
import { UnsavedChangesModal } from "./unsaved-changes-modal";
import { useTabGuard } from "./useTabGuard";

// ─────────────────────────────────────────────────────────
// Tabs config
// ─────────────────────────────────────────────────────────
const TABS = [
  {
    value: "profile",
    Icon: User,
    labelKey: "sidebar.profile",
    fallback: "Profile",
  },
  {
    value: "appearance",
    Icon: Palette,
    labelKey: "sidebar.appearance",
    fallback: "Appearance",
  },
  {
    value: "privacy",
    Icon: Shield,
    labelKey: "sidebar.privacy",
    fallback: "Privacy",
  },
  {
    value: "security",
    Icon: Lock,
    labelKey: "sidebar.security",
    fallback: "Security",
  },
  {
    value: "notifications",
    Icon: Bell,
    labelKey: "sidebar.notifications",
    fallback: "Notifications",
  },
  {
    value: "language",
    Icon: Languages,
    labelKey: "sidebar.language",
    fallback: "Language",
  },
] as const;



// ─────────────────────────────────────────────────────────
// Tab content map — rendered manually, not via Radix Tabs
// ─────────────────────────────────────────────────────────
function TabPanel({ activeTab }: { activeTab: TabValue }) {
  switch (activeTab) {
    case "profile":
      return <ProfileSettings />;
    case "appearance":
      return <AppearanceSettings />;
    case "privacy":
      return <PrivacySettings />;
    case "security":
      return <SecuritySettings />;
    case "notifications":
      return (
        <div className="rounded-[14px] bg-[#1c1c1c] p-4 text-[13px] text-[#888]">
          Notifications settings coming soon
        </div>
      );
    case "language":
      return (
        <div className="rounded-[14px] bg-[#1c1c1c] p-4 text-[13px] text-[#888]">
          Language settings coming soon
        </div>
      );
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────
// Desktop layout: real sidebar + scrollable content pane
// ─────────────────────────────────────────────────────────
function DesktopSettings() {
  const dispatch = useDispatch();
  const t = useTranslations("Settings");
  const isDirty = useSelector(selectIsDirty);

  const activeTab = useSelector(selectSettingsActiveTab) as TabValue;
  

  const handleTabClick = (value: TabValue) => {
      if (isDirty && value !== activeTab) {
        dispatch(setPendingTab(value)); // ← диспатч вместо setState
      } else {
        dispatch(setSettingsTab(value));
      }
    };

  return (
    // This div IS the flex row — no Radix wrapper involved
    <div className="flex w-full flex-1 overflow-hidden">
      {/* <UnsavedChangesModal
        open={!!pendingTab}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onCancel={handleCancel}
      /> */}
      {/* ── Sidebar ── */}
      <nav className="flex w-[210px] shrink-0 flex-col gap-[2px] border-r border-[#1e1e1e] bg-[#141414] p-2">
        {TABS.map(({ value, Icon, labelKey, fallback }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleTabClick(value)}
            className={cn(
              "flex w-full items-center gap-[9px] rounded-[9px] px-3 py-[9px]",
              "text-[13px] transition-colors focus-visible:outline-none",
              activeTab === value
                ? "bg-[#1f1f1f] font-medium text-[#f0f0f0]"
                : "text-[#606060] hover:text-[#aaa]",
            )}
          >
            <Icon className="h-[15px] w-[15px] shrink-0" />
            {t(labelKey) || fallback}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto bg-[#141414] p-3">
        <TabPanel activeTab={activeTab} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Mobile layout: icon row on top + scrollable content below
// ─────────────────────────────────────────────────────────
function MobileSettings() {
  const dispatch = useDispatch();
  const t = useTranslations("Settings");
  const isDirty = useSelector(selectIsDirty);
  const [pendingTab, setPendingTab] = useState<TabValue | null>(null);
  const activeTab = useSelector(selectSettingsActiveTab) as TabValue;
  

   const handleTabClick = (value: TabValue) => {
    if (isDirty && value !== activeTab) {
      setPendingTab(value);
    } else {
      dispatch(setSettingsTab(value));
    }
  };
  
  return (
    <div className="flex w-full flex-1 flex-col overflow-hidden">
      {/* ── Icon nav ── */}
      {/* <UnsavedChangesModal
        open={!!pendingTab}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onCancel={handleCancel}
      /> */}
      <div className="grid shrink-0 grid-cols-6 gap-1 px-3 pt-2 pb-1">
        {TABS.map(({ value, Icon, labelKey, fallback }) => (
          <button
            key={value}
            type="button"
            title={t(labelKey) || fallback}
            onClick={() => handleTabClick(value)}
            className={cn(
              "flex h-10 w-full items-center justify-center rounded-[9px]",
              "transition-colors focus-visible:outline-none",
              activeTab === value
                ? "bg-[#252525] text-[#f0f0f0]"
                : "bg-transparent text-[#555]",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="sr-only">{t(labelKey) || fallback}</span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
        <TabPanel activeTab={activeTab} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main modal
// ─────────────────────────────────────────────────────────
export function SettingsModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsSettingsModalOpen);
  const t = useTranslations("Settings");
  const activeTab = useSelector(selectSettingsActiveTab) as TabValue;

  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const onClose = () => dispatch(closeSettingsModal());
  const title = t("title") || "Settings";

  // ── Desktop: Dialog ──
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          style={{ width: "min(820px, 95vw)", maxWidth: "none" }}
          className={cn(
            "flex h-[580px] flex-col",
            "gap-0 overflow-hidden p-0",
            "rounded-[18px] border border-[#1e1e1e] bg-[#141414] shadow-2xl",
          )}
        >
          <DialogHeader className="shrink-0 border-b border-[#1e1e1e] bg-[#141414] px-5 py-3.5">
            <DialogTitle className="text-[14px] font-semibold tracking-tight text-[#f0f0f0]">
              {title}
            </DialogTitle>
          </DialogHeader>

          {/* flex-1 + overflow-hidden — DesktopSettings owns the row split */}
          <div className="flex flex-1 overflow-hidden">
            <DesktopSettings />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Mobile: Drawer ──
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent
        className={cn(
          "flex !h-[95dvh] !max-h-[100dvh] flex-col p-0",
          "rounded-t-[22px] border-none bg-[#141414]",
        )}
      >
        <DrawerHeader className="shrink-0 bg-[#141414] px-4 pb-0 pt-3">
          <DrawerTitle className="text-left text-[14px] font-semibold tracking-tight text-[#f0f0f0]">
            {title}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <MobileSettings />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

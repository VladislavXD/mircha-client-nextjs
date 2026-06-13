"use client";

import { Eye, Globe, MessageSquare, UserX } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const card = "rounded-[14px] bg-[#1c1c1c] overflow-hidden";
const saveBtn =
  "flex-1 rounded-[11px] bg-[#f0f0f0] py-[10px] text-[13px] font-semibold text-[#111] transition-opacity hover:opacity-90 active:opacity-75";

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onToggle,
  last = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  last?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3 px-4 py-3", !last && "border-b border-[#242424]")}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Icon className="w-4 h-4 text-[#555] shrink-0" />
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#e0e0e0] leading-none">{title}</p>
          <p className="text-[11px] text-[#555] mt-1 leading-snug">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} className="shrink-0" />
    </div>
  );
}

export function PrivacySettings() {
  const t = useTranslations("Settings.privacy");

  const [settings, setSettings] = useState({
    profileVisibility: true,
    showEmail: false,
    showActivity: true,
    allowMessages: true,
    showOnlineStatus: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col gap-2.5">

      <div className={card}>
        <ToggleRow
          icon={Eye}
          title={t("publicProfile") || "Публичный профиль"}
          description={t("publicProfileDesc") || "Разрешить другим просматривать ваш профиль"}
          checked={settings.profileVisibility}
          onToggle={() => toggle("profileVisibility")}
        />
        <ToggleRow
          icon={Globe}
          title={t("showEmail") || "Показывать email"}
          description={t("showEmailDesc") || "Показывать email адрес в профиле"}
          checked={settings.showEmail}
          onToggle={() => toggle("showEmail")}
        />
        <ToggleRow
          icon={Eye}
          title="Активность"
          description="Показывать лайки и комментарии другим пользователям"
          checked={settings.showActivity}
          onToggle={() => toggle("showActivity")}
        />
        <ToggleRow
          icon={MessageSquare}
          title="Личные сообщения"
          description="Разрешить другим пользователям писать вам"
          checked={settings.allowMessages}
          onToggle={() => toggle("allowMessages")}
        />
        <ToggleRow
          icon={Globe}
          title="Онлайн статус"
          description="Показывать, когда вы онлайн"
          checked={settings.showOnlineStatus}
          onToggle={() => toggle("showOnlineStatus")}
          last
        />
      </div>

      <div className="flex gap-2 mt-0.5">
        <button className={saveBtn}>{t("saveChanges") || "Сохранить изменения"}</button>
      </div>
    </div>
  );
}
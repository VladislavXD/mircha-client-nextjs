"use client";

import { Lock, Eye, UserX, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function PrivacySettings() {
  const t = useTranslations("Settings.privacy");

  const [settings, setSettings] = useState({
    profileVisibility: true,
    showEmail: false,
    showActivity: true,
    allowMessages: true,
    showOnlineStatus: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Шапка настроек */}
      <div className="flex flex-col gap-3 pb-2 border-b">
        <div className="flex items-center gap-3 w-full">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-2">
        {/* Видимость профиля */}
        <div className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-card">
          <div className="flex items-start gap-3 flex-1">
            <Eye className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">
                {t("publicProfile") || "Открытый профиль"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("publicProfileDesc") || "Сделать профиль видимым для всех"}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.profileVisibility}
            onCheckedChange={() => handleToggle("profileVisibility")}
          />
        </div>

        {/* Показывать email */}
        <div className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-card">
          <div className="flex items-start gap-3 flex-1">
            <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">
                {t("showEmail") || "Показывать email"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("showEmailDesc") || "Сделать email видимым в профиле"}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.showEmail}
            onCheckedChange={() => handleToggle("showEmail")}
          />
        </div>

        {/* Показывать активность */}
        <div className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-card">
          <div className="flex items-start gap-3 flex-1">
            <Eye className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">Активность</h3>
              <p className="text-xs text-muted-foreground">
                Показывать вашу активность (лайки, комментарии) другим
                пользователям
              </p>
            </div>
          </div>
          <Switch
            checked={settings.showActivity}
            onCheckedChange={() => handleToggle("showActivity")}
          />
        </div>

        {/* Сообщения */}
        <div className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-card">
          <div className="flex items-start gap-3 flex-1">
            <UserX className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">
                Личные сообщения
              </h3>
              <p className="text-xs text-muted-foreground">
                Разрешить другим пользователям отправлять вам сообщения
              </p>
            </div>
          </div>
          <Switch
            checked={settings.allowMessages}
            onCheckedChange={() => handleToggle("allowMessages")}
          />
        </div>

        {/* Онлайн статус */}
        <div className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-card">
          <div className="flex items-start gap-3 flex-1">
            <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">
                Онлайн статус
              </h3>
              <p className="text-xs text-muted-foreground">
                Показывать, когда вы онлайн
              </p>
            </div>
          </div>
          <Switch
            checked={settings.showOnlineStatus}
            onCheckedChange={() => handleToggle("showOnlineStatus")}
          />
        </div>

        <div className="flex justify-end pt-4 pb-2 border-t mt-4">
          <Button size="sm">{t("saveChanges") || "Сохранить изменения"}</Button>
        </div>
      </div>
    </div>
  );
}

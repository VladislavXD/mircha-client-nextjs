"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Shield, Key, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useUpdateProfileMutation } from "../hooks";

import { ChangePasswordModal } from "./ChangePasswordModal";

import { useProfile } from "@/src/features/profile/hooks";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const securitySchema = z.object({
  isTwoFactorEnabled: z.boolean(),
});

type SecurityFormData = z.infer<typeof securitySchema>;

export function SecuritySettings() {
  const { user, isLoading } = useProfile();
  const { updateAsync, isLoadingUpdate } = useUpdateProfileMutation();
  const t = useTranslations("Settings.security");
  const tToasts = useTranslations("Toasts");
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    values: {
      isTwoFactorEnabled: (user as any)?.isTwoFactorEnabled ?? false,
    },
  });

  const onSubmit = (values: SecurityFormData) => {
    toast.promise(updateAsync({ values }), {
      loading: tToasts("sending"),
      success: {
        message: tToasts("securityUpdateSuccess"),
        description: tToasts("securityUpdateDesc"),
      } as any,
      error: tToasts("securityUpdateError"),
    });
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{t("title")}</h2>
          <p className="text-xs text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Смена пароля */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 border rounded-lg bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Key className="hidden sm:block w-4 h-4 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium">{t("password")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("passwordDesc")}
              </p>
            </div>
          </div>
          <Button
            className="h-8 text-xs shrink-0"
            size="sm"
            type="button"
            variant="outline"
            onClick={() => setIsOpen(true)}
          >
            {t("changePassword")}
          </Button>
        </div>

        {/* Двухфакторная аутентификация */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 border rounded-lg bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <Smartphone className="hidden sm:block w-4 h-4 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium">{t("twoFactor")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("twoFactorDesc")}
              </p>
            </div>
          </div>
          <Controller
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <Switch
                checked={field.value}
                disabled={isLoadingUpdate}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Активные сессии */}
        <div className="p-3 border rounded-lg bg-card">
          <div className="mb-3">
            <h3 className="text-sm font-medium">Активные сессии</h3>
            <p className="text-xs text-muted-foreground">
              Здесь будут отображаться ваши активные сеансы на разных
              устройствах
            </p>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md border">
            <div className="overflow-hidden pr-4">
              <p className="text-xs font-medium">Текущее устройство</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {typeof window !== "undefined"
                  ? navigator.userAgent
                  : "Browser"}
              </p>
            </div>
            <span className="text-[10px] uppercase font-semibold text-green-500 tracking-wider shrink-0">
              Активна
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            className="h-8 px-4 text-xs"
            disabled={isLoadingUpdate}
            type="submit"
          >
            {isLoadingUpdate ? "..." : t("saveChanges")}
          </Button>
        </div>
      </form>

      {/* Модалка смены пароля */}
      <ChangePasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

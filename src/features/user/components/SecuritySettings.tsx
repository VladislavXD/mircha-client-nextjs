"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Key, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useUpdateProfileMutation } from "../hooks";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { useProfile } from "@/src/features/profile/hooks";
import { Switch } from "@/components/ui/switch";

// ── shared design tokens ───────────────────────────────────
const card = "rounded-[14px] bg-[#1c1c1c] overflow-hidden";
const lbl = "text-[11px] text-[#555]";
const saveBtn =
  "flex-1 rounded-[11px] bg-[#f0f0f0] py-[10px] text-[13px] font-semibold text-[#111] transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-40";
const cancelBtn =
  "rounded-[11px] px-5 py-[10px] text-[13px] text-[#555] hover:text-[#aaa] transition-colors";

// ─────────────────────────────────────────────────────────
const securitySchema = z.object({
  isTwoFactorEnabled: z.boolean(),
});
type SecurityFormData = z.infer<typeof securitySchema>;

// ── Row inside a card ─────────────────────────────────────
function SettingsRow({
  icon: Icon,
  title,
  description,
  last = false,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  last?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        !last && "border-b border-[#242424]"
      )}
    >
      <Icon className="w-[15px] h-[15px] text-[#555] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#e0e0e0] leading-none">
          {title}
        </p>
        <p className="text-[11px] text-[#555] mt-1 leading-snug">
          {description}
        </p>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
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
      <div className="py-8 text-center text-[13px] text-[#555]">
        {t("loading")}
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-2.5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* Password + 2FA */}
      <div className={card}>
        <SettingsRow
          icon={Key}
          title={t("password") || "Пароль"}
          description={t("passwordDesc") || "Изменить пароль аккаунта"}
        >
          <button
            type="button"
            disabled={isLoadingUpdate}
            onClick={() => setIsOpen(true)}
            className="rounded-[9px] bg-[#252525] px-3 py-1.5 text-[12px] text-[#e0e0e0] hover:bg-[#2a2a2a] transition-colors disabled:opacity-40"
          >
            {t("changePassword") || "Изменить"}
          </button>
        </SettingsRow>

        <Controller
          control={form.control}
          name="isTwoFactorEnabled"
          render={({ field }) => (
            <SettingsRow
              icon={Smartphone}
              title={t("twoFactor") || "Двухфакторная аутентификация"}
              description={
                t("twoFactorDesc") ||
                "Дополнительная защита при входе в аккаунт"
              }
              last
            >
              <Switch
                checked={field.value}
                disabled={isLoadingUpdate}
                onCheckedChange={field.onChange}
              />
            </SettingsRow>
          )}
        />
      </div>

      {/* Active sessions */}
      <div className={card}>
        <div className="px-4 pt-3 pb-2">
          <p className="text-[11px] font-medium tracking-[.04em] text-[#aaa]">
            Активные сессии
          </p>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between rounded-[9px] bg-[#252525] px-3 py-2.5">
            <div className="min-w-0 pr-4">
              <p className="text-[12px] font-medium text-[#e0e0e0]">
                Текущее устройство
              </p>
              <p className={cn(lbl, "mt-0.5 truncate")}>
                {typeof window !== "undefined"
                  ? navigator.userAgent
                  : "Browser"}
              </p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-green-500 shrink-0">
              Активна
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-0.5">
        <button
          type="button"
          className={cancelBtn}
          disabled={isLoadingUpdate}
          onClick={() => form.reset()}
        >
          {t("cancel") || "Отмена"}
        </button>
        <button type="submit" className={saveBtn} disabled={isLoadingUpdate}>
          {isLoadingUpdate
            ? "Сохранение..."
            : t("saveChanges") || "Сохранить изменения"}
        </button>
      </div>

      <ChangePasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </form>
  );
}
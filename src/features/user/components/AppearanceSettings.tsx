"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Palette, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useUpdateProfileMutation } from "../hooks";

import { useProfile } from "@/src/features/profile/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const appearanceSchema = z.object({
  backgroundUrl: z
    .string()
    .url("Некорректный URL")
    .or(z.literal(""))
    .optional(),
  usernameFrameUrl: z
    .string()
    .url("Некорректный URL")
    .or(z.literal(""))
    .optional(),
  avatarFrameUrl: z
    .string()
    .url("Некорректный URL")
    .or(z.literal(""))
    .optional(),
});

type AppearanceFormData = z.infer<typeof appearanceSchema>;

export function AppearanceSettings() {
  const { user, isLoading } = useProfile();
  const { updateAsync, isLoadingUpdate } = useUpdateProfileMutation();
  const t = useTranslations("Settings.appearance");
  const tToasts = useTranslations("Toasts");

  const form = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceSchema),
    values: {
      backgroundUrl: (user as any)?.backgroundUrl ?? "",
      usernameFrameUrl: (user as any)?.usernameFrameUrl ?? "",
      avatarFrameUrl: (user as any)?.avatarFrameUrl ?? "",
    },
  });

  const onSubmit = (values: AppearanceFormData) => {
    const fd = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) fd.append(key, value);
    });
    toast.promise(updateAsync({ values: fd as any }), {
      loading: tToasts("sending"),
      success: {
        message: tToasts("appearanceUpdateSuccess"),
        description: tToasts("appearanceUpdateDesc"),
      },
      error: tToasts("appearanceUpdateError"),
    });
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  const bgUrl = form.watch("backgroundUrl");

  return (
    <div className="w-full space-y-6">
      {/* Шапка настроек */}
      <div className="flex flex-col gap-3 pb-2 border-b">
        <div className="flex items-center gap-3 w-full">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
        </div>
      </div>

      <form
        className="flex flex-col gap-6 pt-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Превью профиля (Компактное) */}
        <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden border bg-muted/30">
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"
            style={{
              backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {!bgUrl && (
            <div className="absolute inset-0 flex flex-col gap-1 items-center justify-center text-muted-foreground">
              <ImageIcon className="w-8 h-8 opacity-50" />
              <p className="text-xs">Предпросмотр фона</p>
            </div>
          )}
        </div>

        {/* Сетка инпутов (Компактная) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Controller
            control={form.control}
            name="backgroundUrl"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <Label
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  htmlFor="backgroundUrl"
                >
                  Фон профиля
                </Label>
                <div className="flex gap-2">
                  <Input
                    className="h-9 text-sm"
                    disabled={isLoadingUpdate}
                    id="backgroundUrl"
                    placeholder="https://example.com/background.jpg"
                    {...field}
                  />
                </div>
                {fieldState.error && (
                  <span className="text-[10px] text-destructive">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="usernameFrameUrl"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  htmlFor="usernameFrameUrl"
                >
                  Рамка никнейма
                </Label>
                <Input
                  className="h-9 text-sm"
                  disabled={isLoadingUpdate}
                  id="usernameFrameUrl"
                  placeholder="https://..."
                  {...field}
                />
                {fieldState.error && (
                  <span className="text-[10px] text-destructive">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="avatarFrameUrl"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  htmlFor="avatarFrameUrl"
                >
                  Рамка аватара
                </Label>
                <Input
                  className="h-9 text-sm"
                  disabled={isLoadingUpdate}
                  id="avatarFrameUrl"
                  placeholder="https://..."
                  {...field}
                />
                {fieldState.error && (
                  <span className="text-[10px] text-destructive">
                    {fieldState.error.message}
                  </span>
                )}
              </div>
            )}
          />
        </div>

        {/* Подсказка */}
        <div className="bg-muted/50 p-3 rounded-md border border-border/50 flex flex-col gap-1 mt-2">
          <h3 className="text-xs font-semibold">💡 Подсказка</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Используйте прозрачные PNG изображения для рамок. Рекомендуемый
            размер фона: 1920x400px, рамки: 512x512px.
          </p>
        </div>

        {/* Кнопки сохранения */}
        <div className="flex justify-end gap-3 pt-4 pb-2 border-t">
          <Button
            disabled={isLoadingUpdate}
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
          >
            Сбросить
          </Button>
          <Button disabled={isLoadingUpdate} size="sm" type="submit">
            {isLoadingUpdate ? "Сохранение..." : t("saveChanges")}
          </Button>
        </div>
      </form>
    </div>
  );
}

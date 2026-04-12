"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { z } from "zod";
import { Palette, Image } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useUpdateProfileMutation } from "../hooks";

import { useProfile } from "@/src/features/profile/hooks";

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
      <Card className="rounded-none shadow-none md:rounded-xl md:shadow-medium">
        <CardBody className="p-4 sm:p-6">
          <div className="py-8 text-center text-default-500">
            {t("loading")}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-none shadow-none md:rounded-xl md:shadow-medium">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Palette className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">{t("title")}</h2>
            <p className="text-small text-default-500">{t("description")}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Предпросмотр профиля */}
          <div className="relative h-48 rounded-lg overflow-hidden border border-default-200">
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"
              style={{
                backgroundImage: form.watch("backgroundUrl")
                  ? `url(${form.watch("backgroundUrl")})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Image className="w-12 h-12 mx-auto text-default-400 mb-2" />
                <p className="text-small text-default-500">
                  Предпросмотр фона профиля
                </p>
              </div>
            </div>
          </div>

          {/* Фон профиля */}
          <Controller
            control={form.control}
            name="backgroundUrl"
            render={({ field, fieldState }) => (
              <Input
                description="URL изображения для фона вашего профиля"
                errorMessage={fieldState.error?.message}
                isDisabled={isLoadingUpdate}
                isInvalid={!!fieldState.error}
                label="Фон профиля"
                placeholder="https://example.com/background.jpg"
                {...field}
              />
            )}
          />

          {/* Рамка никнейма */}
          <Controller
            control={form.control}
            name="usernameFrameUrl"
            render={({ field, fieldState }) => (
              <Input
                description="URL изображения рамки вокруг вашего никнейма"
                errorMessage={fieldState.error?.message}
                isDisabled={isLoadingUpdate}
                isInvalid={!!fieldState.error}
                label="Рамка никнейма"
                placeholder="https://example.com/username-frame.png"
                {...field}
              />
            )}
          />

          {/* Рамка аватара */}
          <Controller
            control={form.control}
            name="avatarFrameUrl"
            render={({ field, fieldState }) => (
              <Input
                description="URL изображения рамки вокруг вашего аватара"
                errorMessage={fieldState.error?.message}
                isDisabled={isLoadingUpdate}
                isInvalid={!!fieldState.error}
                label="Рамка аватара"
                placeholder="https://example.com/avatar-frame.png"
                {...field}
              />
            )}
          />

          <div className="bg-default-100 p-4 rounded-lg">
            <h3 className="text-small font-semibold mb-2">💡 Подсказка</h3>
            <p className="text-tiny text-default-600">
              Используйте прозрачные PNG изображения для рамок. Рекомендуемый
              размер фона: 1920x400px, рамки: 512x512px.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              isDisabled={isLoadingUpdate}
              type="button"
              variant="flat"
              onPress={() => form.reset()}
            >
              Сбросить
            </Button>
            <Button
              color="primary"
              isDisabled={isLoadingUpdate}
              isLoading={isLoadingUpdate}
              type="submit"
            >
              {t("saveChanges")}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@heroui/react";
import { z } from "zod";
import { useRef } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useUpdateProfileMutation } from "../hooks";

import { useProfile } from "@/src/features/profile/hooks";

const profileSchema = z
  .object({
    name: z
      .string()
      .min(2, "Имя должно содержать минимум 2 символа")
      .optional(),
    email: z.string().email("Некорректный email").optional(),
    username: z
      .string()
      .min(3, "Никнейм должен содержать минимум 3 символа")
      .optional(),
    dateOfBirth: z.string().optional(),
    bio: z.string().max(500, "Максимум 500 символов").optional(),
    status: z.string().max(100, "Максимум 100 символов").optional(),
    location: z.string().max(100, "Максимум 100 символов").optional(),
  })
  .partial();

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user, isLoading } = useProfile();
  const { updateAsync, isLoadingUpdate } = useUpdateProfileMutation();
  const avatarFileRef = useRef<File | null>(null);
  const t = useTranslations("Settings.profile");
  const tToasts = useTranslations("Toasts");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      username: (user as any)?.username ?? "",
      dateOfBirth: (() => {
        const dob = (user as any)?.dateOfBirth;

        if (!dob) return "";
        try {
          const d = typeof dob === "string" ? new Date(dob) : (dob as Date);

          return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
        } catch {
          return "";
        }
      })(),
      bio: (user as any)?.bio ?? "",
      status: (user as any)?.status ?? "",
      location: (user as any)?.location ?? "",
    },
  });

  const onSubmit = (values: ProfileFormData) => {
    const fd = new FormData();

    // Обязательные поля - всегда отправляем (из формы или из профиля)
    fd.append("name", values.name || user?.name || "");
    fd.append("email", values.email || user?.email || "");
    fd.append("username", values.username || (user as any)?.username || "");

    // Опциональные поля - отправляем только если заполнены
    if (values.dateOfBirth) fd.append("dateOfBirth", values.dateOfBirth);
    if (values.bio) fd.append("bio", values.bio);
    if (values.status) fd.append("status", values.status);
    if (values.location) fd.append("location", values.location);

    if (avatarFileRef.current) {
      fd.append("avatar", avatarFileRef.current);
    }
    toast.promise(updateAsync({ values: fd as any }), {
      loading: tToasts("sending"),
      success: {
        message: tToasts("profileUpdateSuccess"),
        description: tToasts("profileUpdateDesc"),
      },
      error: tToasts("profileUpdateError"),
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

  if (!user) {
    return (
      <Card className="rounded-none shadow-none md:rounded-xl md:shadow-medium">
        <CardBody className="p-4 sm:p-6">
          <div className="py-8 text-center text-default-500">
            {t("notFound")}
          </div>
        </CardBody>
      </Card>
    );
  }

  console.log("user in ProfileSettings:", user.backgroundUrl);

  return (
    <Card className="w-full rounded-none shadow-none md:rounded-xl md:shadow-medium">
      <CardHeader className="flex flex-col gap-3 pb-4 p-4 sm:p-6">
        <div className="flex items-center gap-4 w-full">
          <Avatar
            className="w-20 h-20"
            name={user?.name}
            src={(user as any)?.avatarUrl || undefined}
          />
          <div className="flex-1">
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
          {/* Превью профиля */}
          <div className="relative h-48 rounded-lg overflow-hidden border border-default-200">
            <video
              autoPlay
              loop
              muted
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"
              controls={false}
              src={(user as any)?.backgroundUrl || undefined}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: (user as any)?.backgroundUrl
                  ? `url(${(user as any)?.backgroundUrl})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {(user as any)?.avatarFrameUrl && (
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      backgroundImage: `url(${(user as any)?.avatarFrameUrl})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      width: "120px",
                      height: "120px",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                  <img
                    alt={user?.name || "Avatar"}
                    className="w-full h-full object-cover"
                    src={
                      (user as any)?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&size=96`
                    }
                  />
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
              Предпросмотр профиля
            </div>
          </div>

          {/* Аватар */}
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium">Аватар</label>
            <input
              accept="image/*"
              className="border-small border-default-200 rounded-medium p-2 hover:border-default-400 transition"
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;

                avatarFileRef.current = f;
                if (f)
                  toast.info(tToasts("fileSelected"), { description: f.name });
              }}
            />
            <p className="text-tiny text-default-400">
              JPG, PNG или GIF. Максимум 5MB.
            </p>
          </div>

          {/* Основные поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  errorMessage={fieldState.error?.message}
                  isDisabled={isLoadingUpdate}
                  isInvalid={!!fieldState.error}
                  label="Имя"
                  placeholder="Иван Иванов"
                  {...field}
                />
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  errorMessage={fieldState.error?.message}
                  isDisabled={isLoadingUpdate}
                  isInvalid={!!fieldState.error}
                  label="Email"
                  placeholder="ivan@example.com"
                  type="email"
                  {...field}
                />
              )}
            />
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <Input
                  errorMessage={fieldState.error?.message}
                  isDisabled={isLoadingUpdate}
                  isInvalid={!!fieldState.error}
                  label="имя пользователя"
                  placeholder="ivan123"
                  {...field}
                />
              )}
            />
            <Controller
              control={form.control}
              name="dateOfBirth"
              render={({ field, fieldState }) => (
                <Input
                  errorMessage={fieldState.error?.message}
                  isDisabled={isLoadingUpdate}
                  isInvalid={!!fieldState.error}
                  label="Дата рождения"
                  type="date"
                  {...field}
                />
              )}
            />
          </div>

          {/* О себе */}
          <Controller
            control={form.control}
            name="bio"
            render={({ field, fieldState }) => (
              <Textarea
                errorMessage={fieldState.error?.message}
                isDisabled={isLoadingUpdate}
                isInvalid={!!fieldState.error}
                label="О себе"
                placeholder="Расскажите немного о себе..."
                {...field}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <Input
                  errorMessage={fieldState.error?.message}
                  isDisabled={isLoadingUpdate}
                  isInvalid={!!fieldState.error}
                  label="Статус"
                  placeholder="На связи"
                  {...field}
                />
              )}
            />
            <Controller
              control={form.control}
              name="location"
              render={({ field, fieldState }) => (
                <Input
                  errorMessage={fieldState.error?.message}
                  isDisabled={isLoadingUpdate}
                  isInvalid={!!fieldState.error}
                  label="Местоположение"
                  placeholder="Москва, Россия"
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              isDisabled={isLoadingUpdate}
              type="button"
              variant="flat"
              onPress={() => form.reset()}
            >
              {t("cancel")}
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

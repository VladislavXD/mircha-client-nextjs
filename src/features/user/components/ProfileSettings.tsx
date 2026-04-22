"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";

import { useUpdateProfileMutation } from "../hooks";

import { useProfile } from "@/src/features/profile/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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

    fd.append("name", values.name || user?.name || "");
    fd.append("email", values.email || user?.email || "");
    fd.append("username", values.username || (user as any)?.username || "");

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
      <div className="py-8 text-center text-sm text-muted-foreground">
        {t("loading") || "Загрузка..."}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        {t("notFound") || "Пользователь не найден"}
      </div>
    );
  }

  const currentAvatarUrl =
    avatarPreview ||
    (user as any)?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&size=96`;

  return (
    <form
      className="w-full flex flex-col h-full overflow-hidden"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col sm:flex-row gap-5 pb-2">
        {/* Left Col: Avatar */}
        <div className="flex flex-col items-center gap-2 sm:w-1/4 shrink-0 mt-2">
          <div className="relative group w-24 h-24 rounded-full overflow-hidden border border-muted shadow-sm">
            <Avatar className="w-full h-full">
              <AvatarImage
                alt={user?.name || "Avatar"}
                className="object-cover"
                src={currentAvatarUrl}
              />
              <AvatarFallback className="text-xl">
                {user?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-200"
              htmlFor="avatar-upload"
            >
              <Camera className="w-6 h-6 text-white" />
            </label>
          </div>
          <div className="text-center">
            <label
              className="cursor-pointer text-xs font-medium text-primary hover:underline"
              htmlFor="avatar-upload"
            >
              {t("changeAvatar") || "Изменить аватар"}
            </label>
            <Input
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;

                avatarFileRef.current = f;
                if (f) setAvatarPreview(URL.createObjectURL(f));
              }}
            />
          </div>
        </div>

        {/* Right Col: Fields */}
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Label
                    className="text-[11px] uppercase tracking-wider text-muted-foreground"
                    htmlFor="nameInput"
                  >
                    {t("name") || "Имя"}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    disabled={isLoadingUpdate}
                    id="nameInput"
                    {...field}
                  />
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Label
                    className="text-[11px] uppercase tracking-wider text-muted-foreground"
                    htmlFor="usernameInput"
                  >
                    {t("username") || "Имя пользователя"}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    disabled={isLoadingUpdate}
                    id="usernameInput"
                    {...field}
                  />
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Label
                    className="text-[11px] uppercase tracking-wider text-muted-foreground"
                    htmlFor="emailInput"
                  >
                    {t("email") || "Email"}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    disabled={isLoadingUpdate}
                    id="emailInput"
                    type="email"
                    {...field}
                  />
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="dateOfBirth"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Label
                    className="text-[11px] uppercase tracking-wider text-muted-foreground"
                    htmlFor="dobInput"
                  >
                    {t("dateOfBirth") || "Дата рождения"}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    disabled={isLoadingUpdate}
                    id="dobInput"
                    type="date"
                    {...field}
                  />
                </div>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="bio"
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <Label
                  className="text-[11px] uppercase tracking-wider text-muted-foreground"
                  htmlFor="bioInput"
                >
                  {t("bio") || "О себе"}
                </Label>
                <Textarea
                  className="resize-none text-xs min-h-[56px] p-2"
                  disabled={isLoadingUpdate}
                  id="bioInput"
                  {...field}
                />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <Label
                    className="text-[11px] uppercase tracking-wider text-muted-foreground"
                    htmlFor="statusInput"
                  >
                    {t("status") || "Статус"}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    disabled={isLoadingUpdate}
                    id="statusInput"
                    {...field}
                  />
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="location"
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <Label
                    className="text-[11px] uppercase tracking-wider text-muted-foreground"
                    htmlFor="locationInput"
                  >
                    {t("location") || "Местоположение"}
                  </Label>
                  <Input
                    className="h-8 text-xs"
                    disabled={isLoadingUpdate}
                    id="locationInput"
                    {...field}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t mt-3">
        <Button
          className="h-8 text-xs"
          disabled={isLoadingUpdate}
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => {
            form.reset();
            setAvatarPreview(null);
            avatarFileRef.current = null;
          }}
        >
          {t("cancel") || "Отмена"}
        </Button>
        <Button
          className="h-8 text-xs"
          disabled={isLoadingUpdate}
          size="sm"
          type="submit"
        >
          {isLoadingUpdate
            ? t("loading") || "Загрузка..."
            : t("saveChanges") || "Сохранить"}
        </Button>
      </div>
    </form>
  );
}

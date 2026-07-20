"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";

import { useUpdateProfileMutation } from "../hooks";
import { useProfile } from "@/src/features/profile/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setChangesDirty } from "@/src/store/unsavedChange/unsavedChanges";
import { UnsavedChangesModal } from "./SettingsModal/unsaved-changes-modal";
import { useTabGuard } from "./SettingsModal/useTabGuard";

const profileSchema = z
  .object({
    name: z.string().min(2, "Минимум 2 символа").optional(),
    email: z.string().email("Некорректный email").optional(),
    username: z.string().min(3, "Минимум 3 символа").optional(),
    dateOfBirth: z.string().optional(),
    bio: z.string().max(500).optional(),
    status: z.string().max(100).optional(),
    location: z.string().max(100).optional(),
  })
  .partial();

type ProfileFormData = z.infer<typeof profileSchema>;

const card = "rounded-[14px] bg-[#1c1c1c] p-[14px_16px]";
const lbl = "block mb-[5px] text-[11px] text-[#555]";
const inp =
  "w-full rounded-[9px] border-none bg-[#252525] px-[11px] py-2 text-[13px] text-[#e0e0e0] outline-none placeholder:text-[#404040] focus:bg-[#2a2a2a] transition-colors disabled:opacity-40";

const saveBtn =
  "flex-1 rounded-[11px] bg-[#f0f0f0] py-[10px] text-[13px] font-semibold text-[#111] transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-40";
const cancelBtn =
  "rounded-[11px] px-5 py-[10px] text-[13px] text-[#555] hover:text-[#aaa] transition-colors disabled:opacity-40";

export function ProfileSettings() {
  const { user, isLoading } = useProfile();
  const { updateAsync, isLoadingUpdate } = useUpdateProfileMutation();
  const avatarFileRef = useRef<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const t = useTranslations("Settings.profile");
  const tToasts = useTranslations("Toasts");

  const dispatch = useDispatch();

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
    if (avatarFileRef.current) fd.append("avatar", avatarFileRef.current);
    toast.promise(updateAsync({ values: fd as any }), {
      loading: tToasts("sending"),
      success: {
        message: tToasts("profileUpdateSuccess"),
        description: tToasts("profileUpdateDesc"),
      },
      error: tToasts("profileUpdateError"),
    });
  };
  const { isDirty } = form.formState;

  useEffect(() => {
    dispatch(setChangesDirty(isDirty));
    return () => {
      dispatch(setChangesDirty(false));
    };
  }, [isDirty, dispatch]);

  if (isLoading)
    return (
      <div className="py-8 text-center text-sm text-[#555]">
        {t("loading") || "Загрузка..."}
      </div>
    );
  if (!user)
    return (
      <div className="py-8 text-center text-sm text-[#555]">
        {t("notFound") || "Не найден"}
      </div>
    );

  const currentAvatarUrl =
    avatarPreview ||
    (user as any)?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&size=96`;


    // хук для управления табами и модалкой несохранённых изменений
    const {handleCancel, handleDiscard, handleSave, pendingTab} = useTabGuard()

  return (
    <form
      className="flex flex-col gap-2.5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* Модальное окно несохранённых изменений */}
      <UnsavedChangesModal
        open={!!pendingTab}
        onSave={form.handleSubmit(onSubmit)}
      onDiscard={handleDiscard}
        onCancel={handleCancel}
      />


      {isDirty && (
        <div className="flex items-center gap-2 rounded-[11px] bg-amber-500/10 border border-amber-500/20 px-4 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
          <p className="text-[12px] text-amber-300">
            Есть несохранённые изменения
          </p>
        </div>
      )}

      {/* Аватар */}
      <div className={card}>
        <div className="flex items-center gap-4">
          <div className="relative group w-14 h-14 rounded-full overflow-hidden shrink-0">
            <Avatar className="w-full h-full">
              <AvatarImage
                alt={user?.name || "Avatar"}
                className="object-cover"
                src={currentAvatarUrl}
              />
              <AvatarFallback className="bg-[#252525] text-[#e0e0e0] text-lg">
                {user?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
              htmlFor="avatar-upload"
            >
              <Camera className="w-5 h-5 text-white" />
            </label>
          </div>
          <div>
            <label
              className="cursor-pointer text-[13px] font-medium text-[#e0e0e0] hover:text-white transition-colors"
              htmlFor="avatar-upload"
            >
              {t("changeAvatar") || "Изменить аватар"}
            </label>
            <p className="text-[11px] text-[#555] mt-0.5">JPG, PNG до 5 МБ</p>
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
      </div>

      {/* Имя и никнейм */}
      <div className={card}>
        <p className={cn(lbl, "mb-3 text-[#888]")}>Имя и никнейм</p>
        <div className="grid grid-cols-2 gap-2.5">
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <div>
                <label className={lbl} htmlFor="nameInput">
                  {t("name") || "Имя"}
                </label>
                <input
                  className={inp}
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
            render={({ field }) => (
              <div>
                <label className={lbl} htmlFor="usernameInput">
                  {t("username") || "Никнейм"}
                </label>
                <input
                  className={inp}
                  disabled={isLoadingUpdate}
                  id="usernameInput"
                  {...field}
                />
              </div>
            )}
          />
        </div>
      </div>

      {/* Email и дата */}
      <div className={card}>
        <p className={cn(lbl, "mb-3 text-[#888]")}>Контакты</p>
        <div className="grid grid-cols-2 gap-2.5">
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <div>
                <label className={lbl} htmlFor="emailInput">
                  {t("email") || "Email"}
                </label>
                <input
                  className={inp}
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
            render={({ field }) => (
              <div>
                <label className={lbl} htmlFor="dobInput">
                  {t("dateOfBirth") || "Дата рождения"}
                </label>
                <input
                  className={cn(inp, "[color-scheme:dark]")}
                  disabled={isLoadingUpdate}
                  id="dobInput"
                  type="date"
                  {...field}
                />
              </div>
            )}
          />
        </div>
      </div>

      {/* О себе */}
      <div className={card}>
        <Controller
          control={form.control}
          name="bio"
          render={({ field }) => (
            <>
              <label className={cn(lbl, "mb-2")} htmlFor="bioInput">
                {t("bio") || "О себе"}
              </label>
              <textarea
                className={cn(inp, "resize-none h-[64px] leading-relaxed")}
                disabled={isLoadingUpdate}
                id="bioInput"
                placeholder="Расскажи немного о себе..."
                {...field}
              />
            </>
          )}
        />
      </div>

      {/* Статус и локация */}
      <div className={card}>
        <p className={cn(lbl, "mb-3 text-[#888]")}>Дополнительно</p>
        <div className="grid grid-cols-2 gap-2.5">
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <div>
                <label className={lbl} htmlFor="statusInput">
                  {t("status") || "Статус"}
                </label>
                <input
                  className={inp}
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
              <div>
                <label className={lbl} htmlFor="locationInput">
                  {t("location") || "Местоположение"}
                </label>
                <input
                  className={inp}
                  disabled={isLoadingUpdate}
                  id="locationInput"
                  {...field}
                />
              </div>
            )}
          />
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex gap-2 mt-0.5">
        <button
          className={cancelBtn}
          disabled={isLoadingUpdate}
          type="button"
          onClick={() => {
            form.reset();
            setAvatarPreview(null);
            avatarFileRef.current = null;
          }}
        >
          {t("cancel")}
        </button>
        <button className={saveBtn} disabled={isLoadingUpdate} type="submit">
          {isLoadingUpdate
            ? t("loading") || "Сохранение..."
            : t("saveChanges") || "Сохранить изменения"}
        </button>
      </div>
    </form>
  );
}

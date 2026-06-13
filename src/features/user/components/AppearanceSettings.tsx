"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { useUpdateProfileMutation } from "../hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { useProfile } from "@/src/features/profile/hooks";
import { useAppearance } from "@/src/features/profile/hooks/useAppearance";
import {
  ProfileFrames,
  ProfileBackground,
} from "@/app/[locale]/(customer)/user/[id]/ProfileData";
import { useDispatch } from "react-redux";
import { setChangesDirty } from "@/src/store/unsavedChange/unsavedChanges";
import { UnsavedChangesModal } from "./SettingsModal/unsaved-changes-modal";
import { useTabGuard } from "./SettingsModal/useTabGuard";

const card = "rounded-[14px] bg-[#1c1c1c] overflow-hidden";
const sectionTitle =
  "px-4 pt-3 pb-2 text-[11px] font-medium tracking-[.04em] text-[#aaa]";
const saveBtn =
  "flex-1 rounded-[11px] bg-[#f0f0f0] py-[10px] text-[13px] font-semibold text-[#111] transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-40";

function VideoThumb({ url }: { url: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) ref.current?.play().catch(() => {});
        else ref.current?.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={containerRef} className="absolute inset-0">
      <video
        ref={ref}
        loop
        muted
        playsInline
        src={url}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

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

function PickerItem({
  label,
  active,
  onClick,
  children,
  wide = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex-shrink-0 rounded-[10px] overflow-hidden border-2 transition-all focus-visible:outline-none",
        wide ? "w-[120px]" : "w-[72px]",
        active
          ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]"
          : "border-transparent hover:border-[#333]",
      )}
    >
      <div
        className={cn(
          "relative bg-[#252525]",
          wide ? "aspect-video" : "aspect-square",
        )}
      >
        {children}
      </div>
      <div className="px-1.5 py-1 bg-[#252525] text-center">
        <p className="text-[10px] text-[#888] truncate leading-none">{label}</p>
      </div>
      {active && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 scrollbar-none">
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={card}>
      <p className={sectionTitle}>{title}</p>
      {children}
    </div>
  );
}

function UrlField({
  id,
  label,
  placeholder,
  disabled,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className="px-4 pb-3 flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-[11px] font-medium tracking-[.04em] text-[#777]"
      >
        {label}
      </Label>
      <Input
        id={id}
        className="h-9 text-sm bg-[#252525] border-[#333] text-[#ddd] placeholder:text-[#555] rounded-[10px]"
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      {error && <span className="text-[10px] text-destructive">{error}</span>}
    </div>
  );
}

export function AppearanceSettings() {
  const { user } = useProfile();
  const {
    handleConfirmAppearance,
    setAppearanceType,
    setSelectedItem,
    isUpdating,
  } = useAppearance(user?.id);
  const { updateAsync, isLoadingUpdate } = useUpdateProfileMutation();
  const tToasts = useTranslations("Toasts");
  const isBusy = isUpdating || isLoadingUpdate;

  const dispatch = useDispatch();

  const serverValues: AppearanceFormData = {
    backgroundUrl: (user as any)?.backgroundUrl ?? "",
    usernameFrameUrl: (user as any)?.usernameFrameUrl ?? "",
    avatarFrameUrl: (user as any)?.avatarFrameUrl ?? "",
  };

  const form = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceSchema),
    values: serverValues,
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    dispatch(setChangesDirty(isDirty));

    return () => {
      dispatch(setChangesDirty(false));
    };
  }, [isDirty, dispatch]);
  // Guard: beforeunload + next router patch

  const bgUrl = form.watch("backgroundUrl") ?? "";
  const avatarFrameUrl = form.watch("avatarFrameUrl") ?? "";

  const handlePickFrame = (url: string) =>
    form.setValue("avatarFrameUrl", url === "none" ? "" : url, {
      shouldDirty: true,
      shouldValidate: true,
    });

  const handlePickBg = (url: string) =>
    form.setValue("backgroundUrl", url === "none" ? "" : url, {
      shouldDirty: true,
      shouldValidate: true,
    });

  const onSubmit = async (values: AppearanceFormData) => {
    const frameChanged = values.avatarFrameUrl !== serverValues.avatarFrameUrl;
    const bgChanged = values.backgroundUrl !== serverValues.backgroundUrl;
    const hasCustomFrameUrl =
      values.avatarFrameUrl &&
      !ProfileFrames.some((f) => f.url === values.avatarFrameUrl);
    const hasCustomBgUrl =
      values.backgroundUrl &&
      !ProfileBackground.some((b) => b.url === values.backgroundUrl);
    const hasCustomFields =
      hasCustomFrameUrl ||
      hasCustomBgUrl ||
      values.usernameFrameUrl !== serverValues.usernameFrameUrl;

    try {
      if (frameChanged && !hasCustomFrameUrl) {
        setAppearanceType("frame");
        setSelectedItem({
          id: values.avatarFrameUrl ?? "0",
          url: values.avatarFrameUrl || "none",
          type: "frame",
        });
        await handleConfirmAppearance();
      }
      if (bgChanged && !hasCustomBgUrl) {
        setAppearanceType("background");
        setSelectedItem({
          id: values.backgroundUrl ?? "0",
          url: values.backgroundUrl || "none",
          type: "background",
        });
        await handleConfirmAppearance();
      }
      if (hasCustomFields) {
        const fd = new FormData();
        if (values.backgroundUrl)
          fd.append("backgroundUrl", values.backgroundUrl);
        if (values.usernameFrameUrl)
          fd.append("usernameFrameUrl", values.usernameFrameUrl);
        if (values.avatarFrameUrl)
          fd.append("avatarFrameUrl", values.avatarFrameUrl);
        await updateAsync({ values: fd as any });
      }
      // Сбрасываем dirty после успешного сохранения
      form.reset(values);
      toast.success(tToasts("appearanceUpdateSuccess"), {
        description: tToasts("appearanceUpdateDesc"),
      });
    } catch {
      toast.error(tToasts("appearanceUpdateError"));
    }
  };

  const {handleCancel, handleDiscard, handleSave, pendingTab} = useTabGuard()
  return (
    <form
      className="flex flex-col gap-2.5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <UnsavedChangesModal
        open={!!pendingTab}
        onSave={form.handleSubmit(onSubmit)}
        onDiscard={handleDiscard}
        onCancel={handleCancel}
      />

      {/* Плашка несохранённых изменений */}
      {isDirty && (
        <div className="flex items-center gap-2 rounded-[11px] bg-amber-500/10 border border-amber-500/20 px-4 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
          <p className="text-[12px] text-amber-300">
            Есть несохранённые изменения
          </p>
        </div>
      )}

      {/* Avatar frame */}
      <Section title="Рамка аватара">
        <ScrollRow>
          {ProfileFrames.map((f) => (
            <PickerItem
              key={f.id}
              label={f.name}
              active={
                (avatarFrameUrl === "" && f.url === "none") ||
                avatarFrameUrl === f.url
              }
              onClick={() => handlePickFrame(f.url)}
            >
              {f.url === "none" ? (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#555]">
                  Нет
                </div>
              ) : (
                <img
                  src={f.url}
                  alt={f.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain p-1"
                />
              )}
            </PickerItem>
          ))}
        </ScrollRow>
        <Controller
          control={form.control}
          name="avatarFrameUrl"
          render={({ field, fieldState }) => (
            <UrlField
              id="avatarFrameUrl"
              label="Или введите свой URL рамки"
              placeholder="https://example.com/frame.png"
              disabled={isBusy}
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
      </Section>

      {/* Profile background */}
      <Section title="Фон профиля">
        <div className="mx-4 mb-3 relative h-24 rounded-[10px] overflow-hidden bg-[#252525]">
          {bgUrl ? (
            <img
              src={bgUrl}
              alt="Предпросмотр"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] text-[#444]">Предпросмотр фона</span>
            </div>
          )}
        </div>
        <ScrollRow>
          {ProfileBackground.map((b) => (
            <PickerItem
              key={b.id}
              label={b.name}
              wide
              active={(bgUrl === "" && b.url === "none") || bgUrl === b.url}
              onClick={() => handlePickBg(b.url)}
            >
              {b.url === "none" ? (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#555]">
                  Нет
                </div>
              ) : b.type === "video" ? (
                <VideoThumb url={b.url} />
              ) : (
                <img
                  src={b.url}
                  alt={b.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </PickerItem>
          ))}
        </ScrollRow>
        <Controller
          control={form.control}
          name="backgroundUrl"
          render={({ field, fieldState }) => (
            <UrlField
              id="backgroundUrl"
              label="Или введите свой URL фона"
              placeholder="https://example.com/background.jpg"
              disabled={isBusy}
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
      </Section>

      {/* Username frame */}
      <Section title="Рамка никнейма">
        <Controller
          control={form.control}
          name="usernameFrameUrl"
          render={({ field, fieldState }) => (
            <UrlField
              id="usernameFrameUrl"
              label="URL рамки никнейма"
              placeholder="https://example.com/username-frame.png"
              disabled={isBusy}
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
      </Section>

      {/* Save */}
      <div className="flex gap-2 mt-0.5">
        <button type="submit" className={saveBtn} disabled={isBusy || !isDirty}>
          {isBusy ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </div>
    </form>
  );
}

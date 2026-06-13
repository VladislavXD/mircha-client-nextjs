"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@wrksz/themes/client";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useNewPasswordMutation } from "../hooks";
import { NewPasswordSchema, type TypeNewPasswordSchema } from "../schemes";

import { AuthWrapper } from "./AuthWrapper";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Форма для установки нового пароля.
 */

export function NewPasswordForm() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const t = useTranslations("Auth.newPassword");
  const tToasts = useTranslations("Toasts");

  const form = useForm<TypeNewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { newPasswordAsync, isLoadingNew } = useNewPasswordMutation();

  const onSubmit = async (values: TypeNewPasswordSchema) => {
    if (!recaptchaValue) {
      toast.error(tToasts("reCaptchaError"));

      return;
    }
    const promise = newPasswordAsync({ values, recaptcha: recaptchaValue });

    toast.promise(promise, {
      loading: tToasts("sending"),
      success: {
        message: tToasts("newPasswordSuccess"),
        description: tToasts("newPasswordDesc"),
      },
      error: tToasts("newPasswordError"),
    });
    promise.then(() => {
      router.push("/auth");
    });
  };

  return (
    <AuthWrapper
      backButtonHref="/auth"
      backButtonLabel={t("../resetPassword.backToLogin")}
      description={t("description")}
      heading={t("title")}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Password */}
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                autoComplete="new-password"
                disabled={isLoadingNew}
                id="password"
                placeholder="******"
                type="password"
                {...field}
              />
              {fieldState.error && (
                <span className="text-sm text-red-500">
                  {fieldState.error.message}
                </span>
              )}
            </div>
          )}
        />

        {/* reCAPTCHA */}
        <div
          aria-disabled={isLoadingNew}
          className={`flex justify-center ${isLoadingNew ? "pointer-events-none opacity-60" : ""}`}
        >
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
            theme={resolvedTheme === "light" ? "light" : "dark"}
            onChange={setRecaptchaValue}
            onExpired={() => setRecaptchaValue(null)}
          />
        </div>

        {/* Submit */}
        <Button className="w-full" disabled={isLoadingNew} type="submit">
          {isLoadingNew ? t("updating") : t("submit")}
        </Button>

        {/* Helper text */}
        <p className="text-xs text-gray-500 text-center">{t("hint")}</p>
      </form>
    </AuthWrapper>
  );
}

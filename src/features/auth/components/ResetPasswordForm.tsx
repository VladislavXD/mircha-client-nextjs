"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@wrksz/themes/client";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useResetPasswordMutation } from "../hooks";
import { ResetPasswordSchema, type TypeResetPasswordSchema } from "../schemes";

import { AuthWrapper } from "./AuthWrapper";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Форма для сброса пароля.
 */
export function ResetPasswordForm() {
  const { resolvedTheme } = useTheme();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const t = useTranslations("Auth.resetPassword");

  const form = useForm<TypeResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { resetAsync, isLoadingReset } = useResetPasswordMutation();
  const tToasts = useTranslations("Toasts");

  const onSubmit = (values: TypeResetPasswordSchema) => {
    if (recaptchaValue) {
      toast.promise(resetAsync({ values, recaptcha: recaptchaValue }), {
        loading: t("sending"),
        success: {
          message: t("success"),
          description: t("sent"),
        },
        error: {
          message: t("error"),
        },
      });
    } else {
      toast.error(tToasts("reCaptchaError"));
    }
  };

  return (
    <AuthWrapper
      backButtonHref="/auth"
      backButtonLabel={t("backToLogin")}
      description={t("description")}
      heading={t("title")}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Email */}
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                aria-label={t("email")}
                autoComplete="email"
                disabled={isLoadingReset}
                id="email"
                placeholder="ivan@example.com"
                type="email"
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
          aria-disabled={isLoadingReset}
          className={`flex justify-center ${
            isLoadingReset ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
            theme={resolvedTheme === "light" ? "light" : "dark"}
            onChange={setRecaptchaValue}
            onExpired={() => setRecaptchaValue(null)}
          />
        </div>
        {/* Submit */}
        <Button className="w-full" disabled={isLoadingReset} type="submit">
          {isLoadingReset ? t("sending") : t("submit")}
        </Button>

        {/* Helper text */}
        <p className="text-xs text-muted-foreground text-center">
          {t("../common.checkSpam", {
            defaultValue:
              "Если письма нет, проверьте папку «Спам» или попробуйте другой адрес.",
          })}
        </p>
      </form>
    </AuthWrapper>
  );
}

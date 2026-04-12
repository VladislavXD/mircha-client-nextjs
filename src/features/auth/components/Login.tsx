import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

import { useLoginMutation } from "../hooks";
// import { AuthSocial } from "./AuthSocial";
import { LoginSchema, TypeLoginSchema } from "../schemes";

import ErrorMessage from "@/shared/components/ui/ErrorMessage";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Input from "@/shared/components/ui/Input/Input";

type Login = {
  email: string;
  password: string;
  code?: string;
};

type Props = {
  setSelected: (value: string) => void;
  setIsShowFactor: React.Dispatch<React.SetStateAction<boolean>>;
  isShowTwoFactor: boolean;
};

const Login = ({ setSelected, setIsShowFactor, isShowTwoFactor }: Props) => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const t = useTranslations("Auth.login");
  const { theme } = useTheme();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Login>({
    resolver: isShowTwoFactor ? undefined : zodResolver(LoginSchema), // Отключаем валидацию на экране 2FA
    mode: "onSubmit",
    shouldUnregister: false, // Сохраняем значения полей при размонтировании
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const [error, setError] = useState("");

  // React Query mutation для логина

  const { loginAsync, isLoadingLogin } = useLoginMutation(setIsShowFactor);
  const onSubmit = async (values: TypeLoginSchema) => {
    // Для 2FA проверяем код
    if (isShowTwoFactor) {
      if (!values.code || values.code.length !== 6) {
        toast.error(t("enterCode"));

        return;
      }

      // Отправляем email, password и code

      toast.promise(loginAsync({ values, recaptcha: recaptchaValue || "" }), {
        loading: t("verifying"),
        success: t("success"),
        error: (err) => err.message || t("error"),
      });

      return;
    }

    // Для обычного логина проверяем recaptcha
    if (recaptchaValue) {
      toast.promise(loginAsync({ values, recaptcha: recaptchaValue }), {
        loading: t("verifying"),
        success: t("success"),
        error: (err) => err.message || t("error"),
      });
    } else {
      toast.error("Пожалуйста, завершите проверку reCAPTCHA");
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div
        className={`flex flex-col items-center gap-2 ${!isShowTwoFactor ? "hidden" : ""}`}
      >
        <p className="text-sm text-gray-500">{t("twoFactorDesc")}</p>
        <Controller
          control={control}
          name="code"
          render={({ field }) => {
            return (
              <div className="flex flex-col gap-2">
                <InputOTP
                  disabled={isLoadingLogin}
                  maxLength={6}
                  value={field.value || ""}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {errors.code && (
                  <span className="text-sm text-red-500">
                    {errors.code.message}
                  </span>
                )}
              </div>
            );
          }}
        />
      </div>
      <div className={`flex flex-col gap-4 ${isShowTwoFactor ? "hidden" : ""}`}>
        <Input
          control={control}
          label={t("email")}
          name="email"
          required="Обязательное поле"
          type="email"
        />
        <Input
          control={control}
          label={t("password")}
          name="password"
          required="Обязательное поле"
          type="password"
        />
        <div className="flex items-center justify-between">
          <Link
            className="ml-auto inline-block text-sm text-blue-600 hover:text-blue-800 underline"
            href="/auth/reset-password"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
          theme={theme === "dark" ? "dark" : "light"}
          onChange={setRecaptchaValue}
        />
        <ErrorMessage error={error} />
        <p className="text-center text-sm">
          {t("noAccount")}{" "}
          <button
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
            type="button"
            onClick={() => setSelected("register")}
          >
            {t("register")}
          </button>
        </p>
      </div>

      <div className="flex gap-2 justify-end">
        <Button className="w-full " disabled={isLoadingLogin} type="submit">
          {isLoadingLogin ? "Загрузка..." : t("submit")}
        </Button>
      </div>
    </form>
  );
};

export default Login;
